import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import slugify from "slugify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { revalidateTag } from "next/cache";
import { DEFAULT_SITE_ID, resolveSiteId } from "@/lib/site";
import { can } from "@/lib/adminPermissions";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const requestedSiteId = searchParams.get("siteId");
    const session = await getServerSession(authOptions);

    const siteId = resolveSiteId(session?.user?.siteId, requestedSiteId || DEFAULT_SITE_ID);

    const category = await prisma.category.findFirst({
      where: { slug, siteId },
      include: {
        posts: {
          where: { published: true },
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { posts: true } },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!can(session.user?.role, "canAccessAllAdminSections")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { slug } = await params;
    const data = await request.json();
    const siteId = resolveSiteId(session.user?.siteId);

    const existingCategory = await prisma.category.findFirst({
      where: { slug, siteId },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const nextName = data.name?.trim() || existingCategory.name;
    let newSlug = existingCategory.slug;

    if (data.name && data.name.trim() !== existingCategory.name) {
      const baseSlug = slugify(nextName, { lower: true, strict: true, trim: true });
      newSlug = baseSlug;

      const slugExists = await prisma.category.findFirst({
        where: { slug: newSlug, siteId, id: { not: existingCategory.id } },
      });

      if (slugExists) newSlug = `${baseSlug}-${Date.now()}`;
    }

    const updatedCategory = await prisma.category.update({
      where: { id: existingCategory.id },
      data: {
        name: nextName,
        slug: newSlug,
        metaTitle: data.metaTitle ?? existingCategory.metaTitle,
        metaDescription: data.metaDescription ?? existingCategory.metaDescription,
      },
    });

    revalidateTag(`menu-categories-${siteId}`);
    return NextResponse.json({ ...updatedCategory, message: "Updated successfully" });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!can(session.user?.role, "canAccessAllAdminSections")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { slug } = await params;
    const siteId = resolveSiteId(session.user?.siteId);

    const existingCategory = await prisma.category.findFirst({
      where: { slug, siteId },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const postsCount = await prisma.post.count({
      where: { categoryId: existingCategory.id, siteId },
    });

    if (postsCount > 0) {
      return NextResponse.json({ error: "Cannot delete category with existing posts." }, { status: 400 });
    }

    await prisma.category.delete({ where: { id: existingCategory.id } });
    revalidateTag(`menu-categories-${siteId}`);

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
