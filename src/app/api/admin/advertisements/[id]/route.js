import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/* ----------------------------- GET SINGLE AD ----------------------------- */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // صرف وہ اشتہار ڈھونڈیں جو اس مخصوص سائٹ (siteId) کا ہو
    const ad = await prisma.advertisement.findFirst({
      where: { 
        id: id,
        siteId: session.user.siteId 
      }
    });

    if (!ad) return NextResponse.json({ error: 'Advertisement not found' }, { status: 404 });

    return NextResponse.json(ad);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ad' }, { status: 500 });
  }
}

/* ----------------------------- UPDATE AD (PUT) ----------------------------- */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();

    // پہلے چیک کریں کہ کیا یہ اشتہار واقعی اس کلائنٹ کا ہے
    const existingAd = await prisma.advertisement.findFirst({
      where: { id: id, siteId: session.user.siteId }
    });

    if (!existingAd) return NextResponse.json({ error: 'Unauthorized access' }, { status: 404 });

    // اشتہار اپ ڈیٹ کریں
    const updatedAd = await prisma.advertisement.update({
      where: { id: id },
      data: {
        title: data.title,
        adType: data.adType || 'CUSTOM',
        html: data.html || null,
        linkUrl: data.linkUrl || null,
        image: data.image || null,
        script: data.script || null,
        pageType: data.pageType,
        pageSlug: data.pageSlug || null,
        position: data.position,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : existingAd.isActive,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });

    return NextResponse.json(updatedAd);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

/* ----------------------------- DELETE AD ----------------------------- */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // سیکیورٹی چیک: صرف اپنی سائٹ کا اشتہار ڈیلیٹ ہو سکے
    const ad = await prisma.advertisement.findFirst({
      where: { id: id, siteId: session.user.siteId }
    });

    if (!ad) return NextResponse.json({ error: 'Unauthorized' }, { status: 404 });

    await prisma.advertisement.delete({ where: { id: id } });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}