import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// 1. GET Single Legal Page
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const session = await getServerSession(authOptions);

    // سیشن سے یا پھر فرنٹ اینڈ ریکوسٹ سے siteId لیں
    const siteId = session?.user?.siteId || searchParams.get("siteId");

    if (!slug || !siteId) {
      return NextResponse.json({ error: 'Slug and siteId are required' }, { status: 400 });
    }

    const legalPage = await prisma.legalPage.findFirst({
      where: { 
        slug: slug,
        siteId: siteId, // صرف اپنی سائٹ کا پیج دیکھیں
        isActive: true 
      }
    });

    if (!legalPage) {
      return NextResponse.json({ error: 'Legal page not found' }, { status: 404 });
    }

    return NextResponse.json(legalPage);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// 2. UPDATE Legal Page (PUT)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug } = await params;
    const body = await request.json();
    const { title, content, description, order, isActive } = body;

    // چیک کریں کہ یہ پیج واقعی اس لاگ ان کلائنٹ کا ہے
    const existingPage = await prisma.legalPage.findFirst({
      where: { 
        slug: slug,
        siteId: session.user.siteId 
      }
    });

    if (!existingPage) {
      return NextResponse.json({ error: 'Legal page not found' }, { status: 404 });
    }

    const legalPage = await prisma.legalPage.update({
      where: { id: existingPage.id }, // ہمیشہ آئی ڈی سے اپ ڈیٹ کریں
      data: {
        title: title?.trim(),
        content,
        description: description?.trim(),
        order: parseInt(order) || 0,
        isActive: isActive !== undefined ? isActive : existingPage.isActive
      }
    });

    return NextResponse.json(legalPage);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// 3. DELETE Legal Page (Soft Delete)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug } = await params;

    const existingPage = await prisma.legalPage.findFirst({
      where: { 
        slug: slug,
        siteId: session.user.siteId 
      }
    });

    if (!existingPage) {
      return NextResponse.json({ error: 'Legal page not found' }, { status: 404 });
    }

    // مکمل ڈیلیٹ کرنے کے بجائے صرف غیر فعال (Deactivate) کر دیں
    const legalPage = await prisma.legalPage.update({
      where: { id: existingPage.id },
      data: { isActive: false }
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}