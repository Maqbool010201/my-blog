import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { DEFAULT_SITE_ID, resolveSiteId } from "@/lib/site";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const session = await getServerSession(authOptions);
    const siteId = resolveSiteId(session?.user?.siteId, searchParams.get("siteId") || DEFAULT_SITE_ID);

    if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });

    const legalPage = await prisma.legalPage.findFirst({
      where: { slug, siteId, isActive: true },
    });
    if (!legalPage) return NextResponse.json({ error: "Legal page not found" }, { status: 404 });

    return NextResponse.json(legalPage);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug } = await params;
    const { title, content, description, order, isActive } = await request.json();
    const siteId = resolveSiteId(session.user?.siteId);

    const existingPage = await prisma.legalPage.findFirst({ where: { slug, siteId } });
    if (!existingPage) return NextResponse.json({ error: "Legal page not found" }, { status: 404 });

    const legalPage = await prisma.legalPage.update({
      where: { id: existingPage.id },
      data: {
        title: title?.trim(),
        content,
        description: description?.trim(),
        order: parseInt(order) || 0,
        isActive: isActive !== undefined ? isActive : existingPage.isActive,
      },
    });

    return NextResponse.json(legalPage);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug } = await params;
    const siteId = resolveSiteId(session.user?.siteId);
    const existingPage = await prisma.legalPage.findFirst({ where: { slug, siteId } });
    if (!existingPage) return NextResponse.json({ error: "Legal page not found" }, { status: 404 });

    await prisma.legalPage.update({ where: { id: existingPage.id }, data: { isActive: false } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
