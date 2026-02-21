import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DEFAULT_SITE_ID } from "@/lib/site";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId") || DEFAULT_SITE_ID;

    const category = await prisma.category.findFirst({
      where: {
        slug,
        siteId,
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const posts = await prisma.post.findMany({
      where: {
        categoryId: category.id,
        siteId,
        published: true,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        shortDesc: true,
        mainImage: true,
        createdAt: true,
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      category,
      posts,
      count: posts.length,
    });
  } catch (error) {
    console.error("Error fetching category posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
