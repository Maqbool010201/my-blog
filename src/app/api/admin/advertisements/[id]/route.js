import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { resolveSiteId } from "@/lib/site";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const siteId = resolveSiteId(session.user?.siteId);
    const ad = await prisma.advertisement.findFirst({ where: { id, siteId } });
    if (!ad) return NextResponse.json({ error: "Advertisement not found" }, { status: 404 });

    return NextResponse.json(ad);
  } catch {
    return NextResponse.json({ error: "Failed to fetch ad" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const siteId = resolveSiteId(session.user?.siteId);
    const data = await request.json();

    const existingAd = await prisma.advertisement.findFirst({ where: { id, siteId } });
    if (!existingAd) return NextResponse.json({ error: "Unauthorized access" }, { status: 404 });

    const updatedAd = await prisma.advertisement.update({
      where: { id },
      data: {
        title: data.title,
        adType: data.adType || "CUSTOM",
        html: data.html || null,
        linkUrl: data.linkUrl || null,
        image: data.image || null,
        script: data.script || null,
        pageType: data.pageType,
        pageSlug: data.pageSlug || null,
        position: data.position,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : existingAd.isActive,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });

    return NextResponse.json(updatedAd);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const siteId = resolveSiteId(session.user?.siteId);
    const ad = await prisma.advertisement.findFirst({ where: { id, siteId } });
    if (!ad) return NextResponse.json({ error: "Unauthorized" }, { status: 404 });

    await prisma.advertisement.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
