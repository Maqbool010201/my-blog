import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { DEFAULT_SITE_ID } from "@/lib/site";

// GET single message
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    
    // سیکیورٹی: صرف وہ میسج ڈھونڈیں جو اس یوزر کی اپنی سائٹ کا ہو
    const message = await prisma.contactMessage.findFirst({
      where: { 
        id: id,
        siteId: DEFAULT_SITE_ID 
      }
    });

    if (!message) {
      return NextResponse.json({ error: 'Message not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch message' }, { status: 500 });
  }
}

// UPDATE message status
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ['unread', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // پہلے چیک کریں کہ کیا یہ میسج اسی کلائنٹ کا ہے
    const existingMessage = await prisma.contactMessage.findFirst({
      where: { id: id, siteId: DEFAULT_SITE_ID }
    });

    if (!existingMessage) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 404 });
    }

    const updatedMessage = await prisma.contactMessage.update({
      where: { id: id },
      data: { status }
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

// DELETE message
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    // صرف اپنی سائٹ کا میسج ڈیلیٹ کرنے کی اجازت دیں
    const message = await prisma.contactMessage.findFirst({
      where: { id: id, siteId: DEFAULT_SITE_ID }
    });

    if (!message) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 404 });
    }
    
    await prisma.contactMessage.delete({
      where: { id: id }
    });

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
