import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET all contact messages (Admin Panel کے لیے)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // ملٹی ٹیننٹ فلٹر: صرف اس یوزر کی سائٹ کے میسجز دکھائیں
    let whereClause = { siteId: session.user.siteId };
    if (status !== 'all') {
      whereClause.status = status;
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contactMessage.count({ where: whereClause })
    ]);

    return NextResponse.json({
      messages,
      pagination: {
        current: page,
        totalPages: Math.ceil(total / limit),
        limit,
        totalItems: total
      }
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST (User Contact Form - فرنٹ اینڈ کے لیے)
export async function POST(request) {
  try {
    const body = await request.json();
    // اب باڈی میں siteId کا ہونا لازمی ہے
    const { name, email, subject, message, siteId } = body;

    if (!name || !email || !subject || !message || !siteId) {
      return NextResponse.json({ error: 'All fields including siteId are required' }, { status: 400 });
    }

    // ... (آپ کی وہ تمام ای میل ویلیڈیشن یہاں برقرار رہیں گی) ...
    // میں یہاں صرف سیونگ والا حصہ لکھ رہا ہوں:

    const saved = await prisma.contactMessage.create({
      data: {
        siteId: siteId, // یہ لازمی ہے تاکہ پتہ چلے کس کلائنٹ کا میسج ہے
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        status: 'unread'
      }
    });

    return NextResponse.json({ message: 'Submitted!', saved }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}