// src/app/api/legal-pages/[slug]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single legal page by slug
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    
    console.log('API GET slug:', slug);
    
    if (!slug || slug === '[slug]') {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const legalPage = await prisma.legalPage.findFirst({
      where: { 
        slug: slug,
        isActive: true 
      }
      // Don't use select here - get all fields for edit
    });

    if (!legalPage) {
      return NextResponse.json(
        { error: `Legal page "${slug}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(legalPage);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch legal page' },
      { status: 500 }
    );
  }
}

// UPDATE legal page - IMPROVED VERSION
export async function PUT(request, { params }) {
  try {
    const { slug } = await params;
    
    if (!slug || slug === '[slug]') {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { title, content, description, order, isActive } = body;

    // Check if page exists
    const existingPage = await prisma.legalPage.findFirst({
      where: { slug }
    });

    if (!existingPage) {
      return NextResponse.json(
        { error: 'Legal page not found' },
        { status: 404 }
      );
    }

    // Build update data object
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content;
    if (description !== undefined) updateData.description = description.trim();
    if (order !== undefined) updateData.order = parseInt(order) || 0;
    if (isActive !== undefined) updateData.isActive = isActive;

    const legalPage = await prisma.legalPage.update({
      where: { id: existingPage.id },
      data: updateData
    });

    return NextResponse.json(legalPage);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update legal page: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE legal page (keep as is)
export async function DELETE(request, { params }) {
  try {
    const { slug } = await params;
    
    if (!slug || slug === '[slug]') {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }
    
    // Check if page exists
    const existingPage = await prisma.legalPage.findFirst({
      where: { slug }
    });

    if (!existingPage) {
      return NextResponse.json(
        { error: 'Legal page not found' },
        { status: 404 }
      );
    }

    // Soft delete (set isActive to false)
    const legalPage = await prisma.legalPage.update({
      where: { id: existingPage.id },
      data: { isActive: false }
    });

    return NextResponse.json({ 
      message: 'Legal page deleted successfully',
      data: legalPage 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete legal page' },
      { status: 500 }
    );
  }
}