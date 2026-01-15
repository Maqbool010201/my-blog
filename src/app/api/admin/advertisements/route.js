// app/api/admin/advertisements/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple auth for admin routes
function isAuthenticated(request) {
  if (process.env.NODE_ENV === 'development') return true;
  const authHeader = request.headers.get('authorization');
  return authHeader && authHeader.startsWith('Bearer ');
}

export async function GET(request) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page'));       // optional
    const limit = Number(searchParams.get('limit'));     // optional
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');
    const pageType = searchParams.get('pageType');
    const position = searchParams.get('position');

    const where = {};

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { pageType: { contains: search, mode: 'insensitive' } },
        { pageSlug: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Active filter
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    // Page type filter
    if (pageType) {
      where.pageType = pageType;
    }

    // Position filter
    if (position) {
      where.position = position;
    }

    let ads;
    let total = 0;
    let pagination = null;

    // If page & limit are provided, use pagination
    if (page && limit) {
      const skip = (page - 1) * limit;
      [ads, total] = await Promise.all([
        prisma.advertisement.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.advertisement.count({ where }),
      ]);

      pagination = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };
    } else {
      // Return all ads without limit
      ads = await prisma.advertisement.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
      total = ads.length;
    }

    return NextResponse.json({ ads, pagination });
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ads', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Data Cleaning
    const ad = await prisma.advertisement.create({
      data: {
        title: data.title,
        adType: data.adType || 'CUSTOM',
        html: data.html || null,
        linkUrl: data.linkUrl || null,
        image: data.image || null,
        script: data.script || null,
        pageType: data.pageType || 'home',
        // If pageType is home, slug must be null. Otherwise trim it.
        pageSlug: data.pageType === 'home' ? null : (data.pageSlug?.trim() || null),
        position: data.position,
        isActive: Boolean(data.isActive),
        // Fix for Invalid Date error
        startDate: data.startDate && data.startDate !== "" ? new Date(data.startDate) : null,
        endDate: data.endDate && data.endDate !== "" ? new Date(data.endDate) : null,
      },
    });

    return NextResponse.json(ad, { status: 201 });
  } catch (error) {
    console.error('Create Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
