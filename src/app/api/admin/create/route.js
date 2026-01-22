import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    // صرف SUPER_ADMIN ہی نئے ایڈمنز یا کلائنٹس بنا سکتا ہے
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Only SUPER_ADMIN can create admins" },
        { status: 403 }
      );
    }

    const { name, email, password, role, siteId } = await req.json();

    // ویلیڈیشن: SaaS کے لیے siteId اب لازمی ہے
    if (!name || !email || !password || !role || !siteId) {
      return NextResponse.json(
        { error: "All fields including siteId are required" },
        { status: 400 }
      );
    }

    // چیک کریں کہ ای میل پہلے سے تو نہیں
    const exists = await prisma.admin.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // نیا ایڈمن/کلائنٹ بنائیں
    const admin = await prisma.admin.create({
      data: { 
        name, 
        email, 
        password: hashedPassword, 
        role, 
        siteId // یہاں اس ایڈمن کو اس کی مخصوص ویب سائٹ الاٹ ہو رہی ہے
      },
    });

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role, siteId: admin.siteId },
    }, { status: 201 });

  } catch (err) {
    console.error("Admin Creation Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}