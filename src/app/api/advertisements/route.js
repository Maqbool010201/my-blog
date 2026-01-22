import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // آپ کا سینٹرل پریزما کلائنٹ
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = await getServerSession(authOptions);

    // پبلک فرنٹ اینڈ کے لیے پیرامیٹر سے siteId لیں، ایڈمن کے لیے سیشن سے
    const siteId = session?.user?.siteId || searchParams.get("siteId");

    if (!siteId) {
      return NextResponse.json({ error: "siteId is required" }, { status: 400 });
    }

    const pageType = searchParams.get('pageType');
    const position = searchParams.get('position');
    const isActive = searchParams.get('isActive') !== 'false'; // Default to true

    const rawSlug = searchParams.get('pageSlug');
    const pageSlug = rawSlug === 'null' || rawSlug === '' || !rawSlug ? null : rawSlug;

    const now = new Date();

    // ملٹی ٹیننٹ اور ٹائم بیسڈ فلٹر
    const where = {
      siteId: siteId, // صرف اسی ویب سائٹ کے اشتہار
      isActive,
      pageType: pageType || undefined,
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
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// اشتہار بنانے کے لیے POST میتھڈ
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();

    const ad = await prisma.advertisement.create({
      data: {
        ...data,
        siteId: session.user.siteId, // سیشن سے خود بخود آئی ڈی لگ جائے گی
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      }
    });

    return NextResponse.json(ad, { status: 201 });
  } catch (error) {
    console.error("Ad Creation Error:", error);
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 });
  }
}