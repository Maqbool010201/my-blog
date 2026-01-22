import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  try {
    // 1. سیشن چیک کریں تاکہ پتہ چلے کون سا کلائنٹ لاگ ان ہے
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.siteId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 2. صرف اس مخصوص سائٹ کے سبسکرائبرز حاصل کریں
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: {
        siteId: session.user.siteId // فلٹر لگانا لازمی ہے
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ 
      success: true,
      count: subscribers.length,
      subscribers 
    }, { status: 200 });

  } catch (error) {
    console.error("Admin Newsletter GET error:", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}