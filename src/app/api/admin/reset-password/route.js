// src/app/api/admin/reset-password/route.js
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, token, newPassword } = await req.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: "Email, token and new password required" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !admin.resetToken || !admin.resetTokenExpiry) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Check expiry
    if (new Date(admin.resetTokenExpiry) < new Date()) {
      await prisma.admin.update({
        where: { email },
        data: { resetToken: null, resetTokenExpiry: null },
      });
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    // Verify token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    if (admin.resetToken !== hashedToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { email },
      data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
    });

    return NextResponse.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
