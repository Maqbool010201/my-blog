import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    
    // 1. فرنٹ اینڈ سے siteId لینا لازمی ہے
    const siteId = searchParams.get("siteId");
    
    if (!siteId) {
      return NextResponse.json({ error: "siteId is required" }, { status: 400 });
    }

    // 2. کیٹیگری ڈھونڈیں (سلگ اور سائٹ آئی ڈی دونوں کے ساتھ)
    const category = await prisma.category.findFirst({
      where: { 
        slug: slug,
        siteId: siteId 
      }
    });
    
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    
    // 3. اس کیٹیگری کی پوسٹس نکالیں (صرف اسی سائٹ کی)
    const posts = await prisma.post.findMany({
      where: {
        categoryId: category.id,
        siteId: siteId, // اضافی سیکیورٹی
        published: true
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({
      success: true,
      category,
      posts,
      count: posts.length
    });
    
  } catch (error) {
    console.error("Error fetching category posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}