import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const excludeIds = (url.searchParams.get("excludeIds") || "")
      .split(",")
      .map(Number)
      .filter(Boolean);

    const featuredPosts = await prisma.post.findMany({
      where: {
        featured: true,
        published: true,
        id: excludeIds.length ? { notIn: excludeIds } : undefined,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    return NextResponse.json(featuredPosts);
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return NextResponse.json({ error: "Failed to fetch featured posts", details: error.message }, { status: 500 });
  }
}
