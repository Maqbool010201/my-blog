import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ valid: false, error: "Missing email or token" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return NextResponse.json({ valid: false, error: "Admin not found" });

    if (!admin.resetToken || !admin.resetTokenExpiry) {
      return NextResponse.json({ valid: false, error: "No reset token found" });
    }

    if (new Date(admin.resetTokenExpiry) < new Date()) {
      await prisma.admin.update({
        where: { email },
        data: { resetToken: null, resetTokenExpiry: null },
      });
      return NextResponse.json({ valid: false, error: "Token expired" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const isValid = admin.resetToken === hashedToken;

    return NextResponse.json({ valid: isValid, error: isValid ? null : "Invalid token" });
  } catch (err) {
    console.error("Token verification error:", err);
    return NextResponse.json({ valid: false, error: "Server error" }, { status: 500 });
  }
}
