import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import slugify from 'slugify';

export async function GET(request, { params }) {
  try {
    const { slug } = params; // Remove await
    
    const category = await prisma.category.findUnique({ 
      where: { slug },
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
    const { slug } = params; // Remove await
    const data = await request.json();

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Handle slug update
    let newSlug = slug;
    if (data.name && data.name !== existingCategory.name) {
      newSlug = slugify(data.name, { 
        lower: true, 
        strict: true,
        trim: true
      });

      // Check if new slug already exists (excluding current category)
      const slugExists = await prisma.category.findUnique({
        where: { slug: newSlug },
        select: { id: true }
      });

      if (slugExists && slugExists.id !== existingCategory.id) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
    }

    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
    if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;
    if (newSlug !== slug) updateData.slug = newSlug;

    const updatedCategory = await prisma.category.update({
      where: { slug },
      data: updateData
    });

    return NextResponse.json({
      ...updatedCategory,
      message: 'Category updated successfully'
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
        { error: 'A category with this slug already exists' },
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
    const { slug } = params; // Remove await

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has posts
    const postsCount = await prisma.post.count({
      where: { categoryId: existingCategory.id }
    });

    if (postsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing posts. Please reassign or delete posts first.' },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { slug }
    });

    return NextResponse.json({ 
      message: 'Category deleted successfully',
      deletedCategory: { id: existingCategory.id, name: existingCategory.name }
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