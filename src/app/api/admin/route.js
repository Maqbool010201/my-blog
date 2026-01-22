import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/* ----------------------------- GET ALL ADMINS ----------------------------- */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // صرف سپر ایڈمن ہی تمام ایڈمنز دیکھ سکتا ہے
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized: Super Admin access required" }, { status: 403 });
    }

    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        siteId: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(admins);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 });
  }
}

/* ----------------------------- CREATE NEW ADMIN ----------------------------- */
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    // سیکیورٹی چیک
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await req.json();
    const { email, password, name, role, siteId } = data;

    if (!email || !password || !siteId) {
      return NextResponse.json({ error: "Email, Password, and SiteId are required" }, { status: 400 });
    }

    // چیک کریں کہ ای میل پہلے سے موجود تو نہیں
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: role || "ADMIN", // ڈیفالٹ رول
        siteId: siteId, // مخصوص سائٹ کے ساتھ لنک کریں
      },
    });

    return NextResponse.json({ 
      id: admin.id, 
      email: admin.email, 
      siteId: admin.siteId 
    }, { status: 201 });

  } catch (error) {
    console.error("Admin creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}