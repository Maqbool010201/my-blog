import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { resolveSiteId } from "@/lib/site";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const siteId = resolveSiteId(session.user?.siteId);
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { siteId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(subscribers);
  } catch {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const siteId = resolveSiteId();
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: email.trim().toLowerCase(),
        siteId,
      },
    });

    return NextResponse.json({ success: true, subscriber });
  } catch (e) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "This email is already subscribed" }, { status: 409 });
    }
    console.error("Newsletter error:", e);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
