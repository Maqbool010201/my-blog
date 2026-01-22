import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import slugify from "slugify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/* ----------------------------- GET CATEGORIES ----------------------------- */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const includePosts = searchParams.get("includePosts") === "true";

    // لاجک: اگر لاگ ان ہے تو اپنی سائٹ کی، ورنہ ریکوسٹ میں دی گئی سائٹ آئی ڈی کی
    const siteId = session?.user?.siteId || searchParams.get("siteId");

    if (!siteId && !slug) {
       return NextResponse.json({ error: "siteId is required" }, { status: 400 });
    }

    if (slug) {
      const category = await prisma.category.findFirst({
        where: { slug, siteId: siteId }, // صرف اپنی سائٹ کا سلگ ڈھونڈیں
        include: includePosts
          ? {
              posts: {
                where: { published: true },
                include: {
                  author: { select: { id: true, name: true } },
                },
                orderBy: { createdAt: "desc" },
              },
            }
          : undefined,
      });

      if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }
      return NextResponse.json(category);
    }

    // تمام کیٹیگریز صرف اپنی سائٹ کی نکالیں
    const categories = await prisma.category.findMany({
      where: { siteId: siteId },
      include: { _count: { select: { posts: true } } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

/* ----------------------------- CREATE CATEGORY ----------------------------- */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // سیکیورٹی چیک
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    if (!data.name?.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = data.slug
      ? slugify(data.slug, { lower: true, strict: true })
      : slugify(data.name, { lower: true, strict: true });

    // چیک کریں کہ اس مخصوص سائٹ پر یہ نام یا سلگ پہلے سے تو نہیں ہے
    const existingCategory = await prisma.category.findFirst({
      where: { 
        siteId: session.user.siteId,
        OR: [{ name: data.name.trim() }, { slug }] 
      },
    });

    if (existingCategory) {
      return NextResponse.json({ error: "Category already exists on your site" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name: data.name.trim(),
        slug,
        siteId: session.user.siteId, // سیشن سے سائٹ آئی ڈی خود بخود لگ جائے گی
        metaTitle: data.metaTitle?.trim() || data.name.trim(),
        metaDescription: data.metaDescription?.trim() || null,
      },
      include: { _count: { select: { posts: true } } },
    });

    return NextResponse.json({ ...category, message: "Category created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}