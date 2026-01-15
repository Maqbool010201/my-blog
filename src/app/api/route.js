import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import slugify from 'slugify';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        category: true,
        author: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();

    // 1. بنیادی ڈیٹا کی تصدیق
    if (!data.title || !data.categoryId) {
      return NextResponse.json({ error: "Title and Category are required" }, { status: 400 });
    }

    // 2. ایڈمن یوزر حاصل کریں
    let admin = await prisma.admin.findFirst();
    if (!admin) {
      admin = await prisma.admin.create({
        data: { name: 'Admin User', email: 'admin@local.com', password: 'password123' }
      });
    }

    // 3. یونیک سلگ (Unique Slug) بنانا
    let baseSlug = data.slug || slugify(data.title, { lower: true, strict: true });
    let finalSlug = baseSlug;
    let counter = 1;
    while (true) {
      const existingPost = await prisma.post.findUnique({ where: { slug: finalSlug } });
      if (!existingPost) break;
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 4. کینونیکل یو آر ایل (Canonical URL)
    const canonicalUrl = data.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${finalSlug}`;

    // 5. ڈیٹا بیس میں پوسٹ بنانا
    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: finalSlug,
        shortDesc: data.shortDescription || data.shortDesc || null,
        content: data.body || data.content || "",
        metaTitle: data.metaTitle || data.title,
        metaDesc: data.metaDescription || data.metaDesc || data.shortDesc,
        ogTitle: data.ogTitle || data.title,
        ogDesc: data.ogDescription || data.ogDesc || data.shortDesc,
        ogImage: data.ogImage || data.mainImage || null,
        // *** یہاں امیج کٹ کا پاتھ سیو ہو رہا ہے ***
        mainImage: data.mainImage || null, 
        canonical: canonicalUrl,
        published: data.published !== undefined ? data.published : true,
        featured: data.featured || false,
        categoryId: Number(data.categoryId),
        authorId: admin.id,
      },
      include: {
        category: true,
        author: true
      }
    });

    return NextResponse.json({ ...post, message: "Post created successfully!" }, { status: 201 });

  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post", details: error.message }, { status: 500 });
  }
}