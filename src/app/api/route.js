import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import slugify from 'slugify';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/* ----------------------------- GET ALL POSTS ----------------------------- */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get('siteId'); // فرنٹ اینڈ سے سائٹ آئی ڈی لیں

    const posts = await prisma.post.findMany({
      where: {
        ...(siteId && { siteId: siteId }), // اگر سائٹ آئی ڈی ہو تو صرف اس کی پوسٹس دکھائیں
        published: true // پبلک API میں صرف پبلش شدہ پوسٹس
      },
      include: {
        category: true,
        author: {
          select: { name: true, image: true } // سیکیورٹی کے لیے صرف نام اور تصویر لیں
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json([], { status: 500 });
  }
}

/* ----------------------------- CREATE NEW POST ----------------------------- */
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    // سیکیورٹی: صرف لاگ ان شدہ یوزر ہی پوسٹ بنا سکے
    if (!session || !session.user.siteId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    if (!data.title || !data.categoryId) {
      return NextResponse.json({ error: "Title and Category are required" }, { status: 400 });
    }

    // 1. یونیک سلگ (Unique Slug) بنانا
    let baseSlug = data.slug || slugify(data.title, { lower: true, strict: true });
    let finalSlug = baseSlug;
    let counter = 1;
    while (true) {
      const existingPost = await prisma.post.findFirst({ 
        where: { slug: finalSlug, siteId: session.user.siteId } 
      });
      if (!existingPost) break;
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 2. کینونیکل یو آر ایل
    const canonicalUrl = data.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${finalSlug}`;

    // 3. ڈیٹا بیس میں پوسٹ بنانا
    const post = await prisma.post.create({
      data: {
        siteId: session.user.siteId, // کرنٹ کلائنٹ کی سائٹ آئی ڈی
        authorId: session.user.id,   // لاگ ان شدہ ایڈمن کی آئی ڈی
        title: data.title,
        slug: finalSlug,
        shortDesc: data.shortDescription || data.shortDesc || null,
        content: data.body || data.content || "",
        metaTitle: data.metaTitle || data.title,
        metaDesc: data.metaDescription || data.metaDesc || data.shortDesc,
        mainImage: data.mainImage || null, 
        canonical: canonicalUrl,
        published: data.published !== undefined ? data.published : true,
        featured: data.featured || false,
        categoryId: Number(data.categoryId),
      },
      include: {
        category: true,
        author: true
      }
    });

    return NextResponse.json({ ...post, message: "Post created successfully!" }, { status: 201 });

  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}