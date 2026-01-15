import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email },
    });

    return NextResponse.json({ success: true, subscriber });
  } catch (e) {
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
