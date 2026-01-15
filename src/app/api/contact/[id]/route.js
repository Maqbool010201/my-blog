// src/app/api/contact/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single message
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const message = await prisma.contactMessage.findUnique({
      where: { id }
    });

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json(
      { error: 'Failed to fetch message' },
      { status: 500 }
    );
  }
}

// UPDATE message status (mark as read/replied/archived)
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ['unread', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

// DELETE message
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await prisma.contactMessage.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}