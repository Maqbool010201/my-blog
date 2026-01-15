// src/app/api/legal-pages/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all legal pages
export async function GET() {
  try {
    const legalPages = await prisma.legalPage.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        content: true, // ← ADD THIS! Content was missing
        description: true,
        order: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    return NextResponse.json(legalPages);
  } catch (error) {
    console.error('API Error [GET /legal-pages]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch legal pages' },
      { status: 500 }
    );
  }
}

// CREATE new legal page
export async function POST(request) {
  try {
    const body = await request.json();
    const { slug, title, content, description, order } = body;

    // Validation
    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: 'Slug, title, and content are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPage = await prisma.legalPage.findFirst({
      where: { slug }
    });

    if (existingPage) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 409 }
      );
    }

    const legalPage = await prisma.legalPage.create({
      data: {
        slug: slug.trim().toLowerCase(),
        title: title.trim(),
        content: content,
        description: description?.trim() || '',
        order: order || 0,
        isActive: true
      }
    });

    return NextResponse.json(legalPage, { status: 201 });
  } catch (error) {
    console.error('API Error [POST /legal-pages]:', error);
    return NextResponse.json(
      { error: 'Failed to create legal page' },
      { status: 500 }
    );
  }
}