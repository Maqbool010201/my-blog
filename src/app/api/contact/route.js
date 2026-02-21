import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { resolveSiteId } from "@/lib/site";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const whereClause = { siteId: resolveSiteId(session.user?.siteId) };
    if (status !== "all") whereClause.status = status;

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.contactMessage.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      messages,
      pagination: {
        current: page,
        totalPages: Math.ceil(total / limit),
        limit,
        totalItems: total,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const saved = await prisma.contactMessage.create({
      data: {
        siteId: resolveSiteId(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        status: "unread",
      },
    });

    return NextResponse.json({ message: "Submitted!", saved }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
