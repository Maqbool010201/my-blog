import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { resolveSiteId } from "@/lib/site";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedSiteId = searchParams.get("siteId");
    const siteId = resolveSiteId(null, requestedSiteId);

    const links = await prisma.socialLink.findMany({
      where: { siteId },
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ links });
  } catch (err) {
    console.error("Social links GET error:", err);
    return NextResponse.json({ error: "Failed to fetch social links" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { platform, url } = await req.json();
    if (!platform || !url) {
      return NextResponse.json({ error: "Platform and URL are required" }, { status: 400 });
    }

    const link = await prisma.socialLink.create({
      data: { platform, url, siteId: resolveSiteId(session.user?.siteId) },
    });
    return NextResponse.json(link, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create social link" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, url } = await req.json();
    const siteId = resolveSiteId(session.user?.siteId);
    const existing = await prisma.socialLink.findFirst({ where: { id: Number(id), siteId } });
    if (!existing) return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });

    const link = await prisma.socialLink.update({
      where: { id: Number(id) },
      data: { url },
    });
    return NextResponse.json(link);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const siteId = resolveSiteId(session.user?.siteId);
    const existing = await prisma.socialLink.findFirst({ where: { id: Number(id), siteId } });
    if (!existing) return NextResponse.json({ error: "Unauthorized" }, { status: 404 });

    await prisma.socialLink.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
