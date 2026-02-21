import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { resolveSiteId } from "@/lib/site";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const siteId = resolveSiteId(session.user?.siteId);
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { siteId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { success: true, count: subscribers.length, subscribers },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin newsletter GET error:", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}
