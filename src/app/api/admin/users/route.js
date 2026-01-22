import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

// 1. تمام یوزرز کی لسٹ حاصل کرنا (GET)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.admin.findMany({
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
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. نیا ایڈمن رجسٹر کرنا (POST)
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password, siteId, role } = await req.json();

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        siteId: siteId || null,
        role: role || "CLIENT",
      },
    });

    return NextResponse.json({ message: "Admin created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}