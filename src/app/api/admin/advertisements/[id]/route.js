import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function isAuthenticated(request) {
  if (process.env.NODE_ENV === 'development') return true;
  const authHeader = request.headers.get('authorization');
  return authHeader && authHeader.startsWith('Bearer ');
}

export async function GET(request, { params }) {
  const { id } = await params;
  if (!isAuthenticated(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const ad = await prisma.advertisement.findUnique({ where: { id } });
  if (!ad) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(ad);
}

export async function PUT(request, { params }) {
  const { id } = await params;
  if (!isAuthenticated(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const data = await request.json();

  // Validate required fields
  if (!data.title || !data.position || !data.pageType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const ad = await prisma.advertisement.update({
    where: { id },
    data: {
      title: data.title,
      adType: data.adType || 'CUSTOM',
      html: data.html || null,
      linkUrl: data.linkUrl || null,
      image: data.image || null,
      script: data.script || null,
      pageType: data.pageType,
      pageSlug: data.pageSlug || null,
      position: data.position,
      isActive: Boolean(data.isActive),
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
  });

  return NextResponse.json(ad);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  if (!isAuthenticated(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  await prisma.advertisement.delete({ where: { id } });
  return NextResponse.json({ message: 'Deleted successfully' });
}
