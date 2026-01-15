import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import slugify from "slugify";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const includePosts = searchParams.get("includePosts") === "true";

    if (slug) {
      const category = await prisma.category.findUnique({
        where: { slug },
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

    // All categories with post counts
    const categories = await prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.name?.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = data.slug
      ? slugify(data.slug, { lower: true, strict: true })
      : slugify(data.name, { lower: true, strict: true });

    const existingCategory = await prisma.category.findFirst({
      where: { OR: [{ name: data.name.trim() }, { slug }] },
    });

    if (existingCategory) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name: data.name.trim(),
        slug,
        metaTitle: data.metaTitle?.trim() || data.name.trim(),
        metaDescription: data.metaDescription?.trim() || null,
      },
      include: { _count: { select: { posts: true } } },
    });

    return NextResponse.json({ ...category, message: "Category created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category", details: error.message },
      { status: 500 }
    );
  }
}
