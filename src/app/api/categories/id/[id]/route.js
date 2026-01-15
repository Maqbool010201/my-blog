import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import slugify from "slugify";

export async function GET(request, { params }) {
  try {
    const { id } = await params; // Add await here
    
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({ 
      where: { id: categoryId },
      include: {
        posts: {
          where: { published: true },
          include: {
            author: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: { posts: true }
        }
      }
    });
    
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params; // Add await here
    const data = await request.json();

    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Handle slug generation
    let newSlug = existingCategory.slug;
    if (data.slug && data.slug !== existingCategory.slug) {
      newSlug = slugify(data.slug, { 
        lower: true, 
        strict: true,
        trim: true
      });
    } else if (data.name && data.name !== existingCategory.name) {
      newSlug = slugify(data.name, { 
        lower: true, 
        strict: true,
        trim: true
      });
    }

    // Check if new slug conflicts with other categories
    if (newSlug !== existingCategory.slug) {
      const slugExists = await prisma.category.findFirst({
        where: {
          slug: newSlug,
          id: { not: categoryId }
        }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A category with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update data matching your schema field names
    const updateData = {
      name: data.name?.trim() || existingCategory.name,
      slug: newSlug,
      metaTitle: data.metaTitle?.trim() || null,
      metaDescription: data.metaDescription?.trim() || null,
    };

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });

    return NextResponse.json({
      ...updatedCategory,
      message: "Category updated successfully"
    });
  } catch (error) {
    console.error('Error updating category:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A category with this name or slug already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update category', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params; // Add await here

    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has posts
    if (existingCategory._count.posts > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing posts. Please reassign or delete posts first.' },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: categoryId }
    });

    return NextResponse.json({ 
      message: 'Category deleted successfully',
      deletedCategory: { 
        id: existingCategory.id, 
        name: existingCategory.name 
      }
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete category', details: error.message },
      { status: 500 }
    );
  }
}