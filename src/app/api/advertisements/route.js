import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const pageType = searchParams.get('pageType');
    const position = searchParams.get('position');
    const isActive = searchParams.get('isActive') === 'true';

    const rawSlug = searchParams.get('pageSlug');
    const pageSlug =
      rawSlug === 'null' || rawSlug === '' || !rawSlug ? null : rawSlug;

    if (!pageType) {
      return NextResponse.json([], { status: 200 });
    }

    const now = new Date();

    const where = {
      isActive,
      pageType,
      AND: [
        { OR: [{ startDate: null }, { startDate: { lte: now } }] },
        { OR: [{ endDate: null }, { endDate: { gte: now } }] },
      ],
    };

    if (position) where.position = position;
    if (pageSlug !== null) where.pageSlug = pageSlug;

    const ads = await prisma.advertisement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(ads);
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json([], { status: 500 });
  }
}