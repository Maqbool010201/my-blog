import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { DEFAULT_SITE_ID, resolveSiteId } from "@/lib/site";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId") || DEFAULT_SITE_ID;

    const legalPages = await prisma.legalPage.findMany({
      where: { siteId, isActive: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(legalPages);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { slug, title, content, description, order } = body;
    const siteId = resolveSiteId(session.user?.siteId);

    const legalPage = await prisma.legalPage.create({
      data: {
        siteId,
        slug: slug.trim().toLowerCase(),
        title: title.trim(),
        content: content || "",
        description: description || "",
        order: order || 0,
        isActive: true,
      },
    });

    return NextResponse.json(legalPage, { status: 201 });
  } catch (error) {
    console.error("Legal page creation error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
