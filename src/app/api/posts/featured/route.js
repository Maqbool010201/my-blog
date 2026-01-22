import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    
    // 1. یہاں سے ہم siteId حاصل کریں گے (جو کہ فرنٹ اینڈ پیرامیٹر سے بھیجے گا)
    const siteId = url.searchParams.get("siteId");
    
    if (!siteId) {
      return NextResponse.json({ error: "siteId is required" }, { status: 400 });
    }

    const excludeIds = (url.searchParams.get("excludeIds") || "")
      .split(",")
      .map(Number)
      .filter(Boolean);

    const featuredPosts = await prisma.post.findMany({
      where: {
        siteId: siteId, // صرف اس مخصوص ویب سائٹ کی پوسٹس
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
    return NextResponse.json({ error: "Failed to fetch featured posts" }, { status: 500 });
  }
}