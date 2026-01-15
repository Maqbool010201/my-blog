// src/app/api/admin/forgot-password/route.js
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";
import { sendResetEmail } from "@/lib/mailer";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ message: "If the email exists, a reset link will be sent" });
    }

    // Generate token and hash it before storing
    const token = nanoid(64);
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const expiry = new Date(Date.now() + 3600 * 1000); // 1 hour

    await prisma.admin.update({
      where: { email },
      data: { resetToken: hashedToken, resetTokenExpiry: expiry },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    await sendResetEmail({ to: email, resetUrl });

    return NextResponse.json({ message: "If the email exists, a reset link will be sent" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
