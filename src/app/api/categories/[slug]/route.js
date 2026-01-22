import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import slugify from 'slugify';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/* ----------------------------- GET CATEGORY ----------------------------- */
export async function GET(request, { params }) {
  try {
    const { slug } = await params; // Next.js 15 میں await لازمی ہے
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId");

    if (!siteId) {
      return NextResponse.json({ error: "siteId is required" }, { status: 400 });
    }

    // findUnique کی جگہ findFirst استعمال کریں کیونکہ unique constraint دو کالمز پر ہے
    const category = await prisma.category.findFirst({ 
      where: { slug, siteId },
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

    const { slug } = await params;
    const data = await request.json();

    // صرف اپنی سائٹ کی کیٹیگری ڈھونڈیں
    const existingCategory = await prisma.category.findFirst({
      where: { slug, siteId: session.user.siteId }
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    let newSlug = slug;
    if (data.name && data.name !== existingCategory.name) {
      newSlug = slugify(data.name, { lower: true, strict: true, trim: true });

      // چیک کریں کہ اس مخصوص سائٹ پر یہ سلگ پہلے سے تو نہیں؟
      const slugExists = await prisma.category.findFirst({
        where: { slug: newSlug, siteId: session.user.siteId, id: { not: existingCategory.id } }
      });

      if (slugExists) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id: existingCategory.id }, // ID سے اپ ڈیٹ کرنا محفوظ ہے
      data: {
        name: data.name || existingCategory.name,
        description: data.description ?? existingCategory.description,
        metaTitle: data.metaTitle ?? existingCategory.metaTitle,
        metaDescription: data.metaDescription ?? existingCategory.metaDescription,
        slug: newSlug
      }
    });

    return NextResponse.json({ ...updatedCategory, message: 'Updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

/* ----------------------------- DELETE CATEGORY ----------------------------- */
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug } = await params;

    const existingCategory = await prisma.category.findFirst({
      where: { slug, siteId: session.user.siteId }
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const postsCount = await prisma.post.count({
      where: { categoryId: existingCategory.id, siteId: session.user.siteId }
    });

    if (postsCount > 0) {
      return NextResponse.json({ error: 'Cannot delete category with existing posts.' }, { status: 400 });
    }

    await prisma.category.delete({ where: { id: existingCategory.id } });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}