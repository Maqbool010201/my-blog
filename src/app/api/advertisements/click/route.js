import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Advertisement ID is required' }, { status: 400 });
    }

    await prisma.advertisement.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 });
  }
}
