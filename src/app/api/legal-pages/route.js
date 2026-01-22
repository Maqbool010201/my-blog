import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET all legal pages
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);

    // اگر سیشن ہے تو سیشن کی siteId، ورنہ پبلک فرنٹ اینڈ کے لیے پیرامیٹر سے siteId
    const siteId = session?.user?.siteId || searchParams.get("siteId");

    if (!siteId) {
      return NextResponse.json({ error: 'siteId is required' }, { status: 400 });
    }

    const legalPages = await prisma.legalPage.findMany({
      where: { 
        siteId: siteId,
        isActive: true 
      },
      orderBy: { order: 'asc' },
    });
    
    return NextResponse.json(legalPages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch legal pages' }, { status: 500 });
  }
}

// CREATE new legal page
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { slug, title, content, description, order } = body;

    if (!slug || !title || !content) {
      return NextResponse.json({ error: 'Slug, title, and content are required' }, { status: 400 });
    }

    const cleanSlug = slug.trim().toLowerCase();

    // چیک کریں کہ کیا اس مخصوص سائٹ کے لیے یہ سلگ پہلے سے موجود ہے
    const existingPage = await prisma.legalPage.findFirst({
      where: { 
        slug: cleanSlug,
        siteId: session.user.siteId
      }
    });

    if (existingPage) {
      return NextResponse.json({ error: 'Slug already exists for your site' }, { status: 409 });
    }

    const legalPage = await prisma.legalPage.create({
      data: {
        siteId: session.user.siteId, // سیشن سے آئی ڈی لینا سب سے محفوظ ہے
        slug: cleanSlug,
        title: title.trim(),
        content: content,
        description: description?.trim() || '',
        order: order || 0,
        isActive: true
      }
    });

    return NextResponse.json(legalPage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create legal page' }, { status: 500 });
  }
}