import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { DEFAULT_SITE_ID } from "@/lib/site";

export async function GET() {
  try {
    const adminCount = await prisma.admin.count();
    return NextResponse.json({
      locked: adminCount > 0,
      adminCount,
    });
  } catch (error) {
    console.error("Admin bootstrap status error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const adminCount = await prisma.admin.count();
    if (adminCount > 0) {
      return NextResponse.json(
        { error: "Setup locked: first admin is already created" },
        { status: 403 }
      );
    }

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.admin.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "SUPER_ADMIN",
        siteId: DEFAULT_SITE_ID,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "First admin created successfully. Setup is now locked.",
        admin,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin bootstrap error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
