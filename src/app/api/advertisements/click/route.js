import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { id, siteId } = await request.json();

    // بنیادی ویلیڈیشن
    if (!id) {
      return NextResponse.json({ error: 'Advertisement ID is required' }, { status: 400 });
    }

    // چیک کریں کہ اشتہار موجود ہے اور اسی سائٹ کا ہے
    // یہ غلط ڈیٹا یا کراس سائٹ کلک ٹریکنگ کو روکتا ہے
    const ad = await prisma.advertisement.findFirst({
      where: { 
        id: id,
        ...(siteId && { siteId: siteId }) // اگر سائٹ آئی ڈی بھیجی گئی ہے تو اسے چیک کریں
      }
    });

    if (!ad) {
      return NextResponse.json({ error: 'Advertisement not found' }, { status: 404 });
    }

    // کلک میں ایک کا اضافہ کریں
    await prisma.advertisement.update({
      where: { id: id },
      data: { 
        clicks: { increment: 1 } 
      },
    });

    return NextResponse.json({ success: true, currentClicks: ad.clicks + 1 });
  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 });
  }
}