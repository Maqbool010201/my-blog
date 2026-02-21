import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import slugify from "slugify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { DEFAULT_SITE_ID, resolveSiteId } from "@/lib/site";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get("siteId") || DEFAULT_SITE_ID;

    const posts = await prisma.post.findMany({
      where: { siteId, published: true },
      select: {
        id: true,
        siteId: true,
        title: true,
        slug: true,
        shortDesc: true,
        content: true,
        metaTitle: true,
        metaDesc: true,
        ogTitle: true,
        ogDesc: true,
        ogImage: true,
        canonical: true,
        mainImage: true,
        categoryId: true,
        authorId: true,
        published: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: { id: true, name: true, slug: true, metaTitle: true, metaDescription: true },
        },
        author: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    if (!data.title || !data.categoryId) {
      return NextResponse.json({ error: "Title and Category are required" }, { status: 400 });
    }

    const siteId = resolveSiteId(session.user?.siteId);
    let baseSlug = data.slug || slugify(data.title, { lower: true, strict: true });
    let finalSlug = baseSlug;
    let counter = 1;

    while (true) {
      const existingPost = await prisma.post.findFirst({
        where: { slug: finalSlug, siteId },
        select: { id: true },
      });
      if (!existingPost) break;
      finalSlug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    const canonicalUrl =
      data.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog/${finalSlug}`;

    const post = await prisma.post.create({
      data: {
        siteId,
        authorId: session.user.id,
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
      select: {
        id: true,
        siteId: true,
        title: true,
        slug: true,
        shortDesc: true,
        content: true,
        metaTitle: true,
        metaDesc: true,
        ogTitle: true,
        ogDesc: true,
        ogImage: true,
        canonical: true,
        mainImage: true,
        categoryId: true,
        authorId: true,
        published: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: { id: true, name: true, slug: true, metaTitle: true, metaDescription: true },
        },
        author: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ ...post, message: "Post created successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
