// src/app/api/posts/category/[slug]/route.js - CREATE THIS FILE
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    
    // 1. Find category by slug
    const category = await prisma.category.findUnique({
      where: { slug }
    });
    
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    
    // 2. Get posts ONLY for this category
    const posts = await prisma.post.findMany({
      where: {
        categoryId: category.id, // CRITICAL: Filter by category ID
        published: true
      },
      include: {
        category: true,
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
    });
    
    // 3. Return with clear structure
    return NextResponse.json({
      success: true,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug
      },
      posts: posts,
      count: posts.length
    });
    
  } catch (error) {
    console.error("Error fetching category posts:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch category posts",
        posts: []
      },
      { status: 500 }
    );
  }
}