import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page'));
    const limit = Number(searchParams.get('limit'));
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');

    // سیکیورٹی: صرف اس کلائنٹ کی اپنی سائٹ کا ڈیٹا
    const where = {
      siteId: session.user.siteId, 
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== null && isActive !== undefined && isActive !== "") {
      where.isActive = isActive === 'true';
    }

    let ads;
    let total = 0;
    let pagination = null;

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
      ads = await prisma.advertisement.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
      total = ads.length;
    }

    return NextResponse.json({ ads, pagination });
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // نیا اشتہار بناتے وقت siteId شامل کرنا لازمی ہے
    const ad = await prisma.advertisement.create({
      data: {
        siteId: session.user.siteId, // یہ کلیدی حصہ ہے
        title: data.title,
        adType: data.adType || 'CUSTOM',
        html: data.html || null,
        linkUrl: data.linkUrl || null,
        image: data.image || null,
        script: data.script || null,
        pageType: data.pageType || 'home',
        pageSlug: data.pageType === 'home' ? null : (data.pageSlug?.trim() || null),
        position: data.position,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });

    return NextResponse.json(ad, { status: 201 });
  } catch (error) {
    console.error('Create Error:', error);
    return NextResponse.json({ error: 'Failed to create advertisement' }, { status: 500 });
  }
}