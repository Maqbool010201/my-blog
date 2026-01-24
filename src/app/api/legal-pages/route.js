import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    // سب سے پہلے URL پیرامیٹر سے چیک کریں، اگر نہیں تو "wisemix" ڈیفالٹ رکھیں
    const siteId = searchParams.get("siteId") || "wisemix";

    const legalPages = await prisma.legalPage.findMany({
      where: { 
        siteId: siteId,
        isActive: true 
      },
      orderBy: { order: 'asc' },
    });
    
    return NextResponse.json(legalPages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { slug, title, content, description, order } = body;

    // یہاں زبردستی "wisemix" سیٹ کریں اگر سیشن میں کچھ اور ہے
    const targetSiteId = "wisemix"; 

    const legalPage = await prisma.legalPage.create({
      data: {
        siteId: targetSiteId,
        slug: slug.trim().toLowerCase(),
        title: title.trim(),
        content: content,
        description: description || '',
        order: order || 0,
        isActive: true
      }
    });

    return NextResponse.json(legalPage, { status: 201 });
  } catch (error) {
    console.error("Creation Error:", error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}