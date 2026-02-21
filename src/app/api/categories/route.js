import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import slugify from "slugify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { revalidateTag } from "next/cache";
import { DEFAULT_SITE_ID, resolveSiteId } from "@/lib/site";
import { can } from "@/lib/adminPermissions";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const includePosts = searchParams.get("includePosts") === "true";
    const siteId = resolveSiteId(session?.user?.siteId, searchParams.get("siteId") || DEFAULT_SITE_ID);

    if (slug) {
      const category = await prisma.category.findFirst({
        where: { slug, siteId },
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

    const categories = await prisma.category.findMany({
      where: { siteId },
      include: { _count: { select: { posts: true } } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!can(session.user?.role, "canAccessAllAdminSections")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();
    const siteId = resolveSiteId(session.user?.siteId);

    if (!data.name?.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = data.slug
      ? slugify(data.slug, { lower: true, strict: true })
      : slugify(data.name, { lower: true, strict: true });

    const existingCategory = await prisma.category.findFirst({
      where: { siteId, OR: [{ name: data.name.trim() }, { slug }] },
    });

    if (existingCategory) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name: data.name.trim(),
        slug,
        siteId,
        metaTitle: data.metaTitle?.trim() || data.name.trim(),
        metaDescription: data.metaDescription?.trim() || null,
      },
    });

    revalidateTag(`menu-categories-${siteId}`);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Create Category Error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
