import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import slugify from "slugify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { can } from "@/lib/adminPermissions";
import { DEFAULT_SITE_ID } from "@/lib/site";

/* ----------------------------- GET CATEGORY ----------------------------- */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // سیکیورٹی: صرف اپنی سائٹ کی کیٹیگری ڈھونڈیں
    const category = await prisma.category.findFirst({ 
      where: { 
        id: categoryId,
        siteId: DEFAULT_SITE_ID // single-tenant
      },
      include: {
        posts: {
          where: { published: true },
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' }
        },
        _count: { select: { posts: true } }
      }
    });
    
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

/* ----------------------------- UPDATE CATEGORY ----------------------------- */
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!can(session.user?.role, "canAccessAllAdminSections")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const data = await request.json();
    const categoryId = parseInt(id);

    // صرف اپنی سائٹ کی کیٹیگری چیک کریں
    const existingCategory = await prisma.category.findFirst({
      where: { id: categoryId, siteId: DEFAULT_SITE_ID }
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found or unauthorized" }, { status: 404 });
    }

    let newSlug = existingCategory.slug;
    if (data.slug && data.slug !== existingCategory.slug) {
      newSlug = slugify(data.slug, { lower: true, strict: true });
      
      // چیک کریں کہ اس سائٹ پر یہ سلگ ڈپلیکیٹ تو نہیں
      const slugConflict = await prisma.category.findFirst({
        where: { slug: newSlug, siteId: DEFAULT_SITE_ID, id: { not: categoryId } }
      });
      if (slugConflict) return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: data.name?.trim() || existingCategory.name,
        slug: newSlug,
        metaTitle: data.metaTitle?.trim() || null,
        metaDescription: data.metaDescription?.trim() || null,
      },
      include: { _count: { select: { posts: true } } }
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/* ----------------------------- DELETE CATEGORY ----------------------------- */
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!can(session.user?.role, "canAccessAllAdminSections")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const categoryId = parseInt(id);

    const existingCategory = await prisma.category.findFirst({
      where: { id: categoryId, siteId: DEFAULT_SITE_ID },
      include: { _count: { select: { posts: true } } }
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (existingCategory._count.posts > 0) {
      return NextResponse.json({ error: 'Cannot delete category with posts.' }, { status: 400 });
    }

    await prisma.category.delete({ where: { id: categoryId } });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
