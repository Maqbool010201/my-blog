import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DEFAULT_SITE_ID } from "@/lib/site";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const siteId = url.searchParams.get("siteId") || DEFAULT_SITE_ID;

    const excludeIds = (url.searchParams.get("excludeIds") || "")
      .split(",")
      .map(Number)
      .filter(Boolean);

    const featuredPosts = await prisma.post.findMany({
      where: {
        siteId,
        featured: true,
        published: true,
        id: excludeIds.length ? { notIn: excludeIds } : undefined,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        shortDesc: true,
        mainImage: true,
        featured: true,
        published: true,
        createdAt: true,
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    return NextResponse.json(featuredPosts);
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return NextResponse.json({ error: "Failed to fetch featured posts" }, { status: 500 });
  }
}
