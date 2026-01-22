import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/* ----------------------------- GET SUBSCRIBERS (Admin) ----------------------------- */
// ایڈمن پینل کے لیے تاکہ کلائنٹ اپنی لسٹ دیکھ سکے
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { siteId: session.user.siteId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(subscribers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

/* ----------------------------- POST (Public Subscription) ----------------------------- */
export async function POST(req) {
  try {
    const { email, siteId } = await req.json();

    // بنیادی ویلیڈیشن
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    
    // SaaS کے لیے siteId کا ہونا لازمی ہے
    if (!siteId) {
      return NextResponse.json({ error: 'siteId is required' }, { status: 400 });
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { 
        email: email.trim().toLowerCase(),
        siteId: siteId 
      },
    });

    return NextResponse.json({ success: true, subscriber });
  } catch (e) {
    // Prisma کا یونیک کانسٹینٹ ایرر (P2002)
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'This email is already subscribed to this site' }, { status: 409 });
    }
    console.error("Newsletter Error:", e);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}