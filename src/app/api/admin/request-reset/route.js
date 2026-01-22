import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";
import { sendResetEmail } from "@/lib/mailer";
import crypto from "crypto"; // ہیشنگ کے لیے شامل کیا گیا

export async function POST(req) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const admin = await prisma.admin.findUnique({ 
      where: { email: normalizedEmail } 
    });

    // سیکیورٹی: ای میل ہارفیسٹنگ سے بچنے کے لیے یکساں جواب
    if (!admin) {
      return NextResponse.json({ 
        message: "If the email exists, a reset link will be sent" 
      }, { status: 200 });
    }

    // 1. کچا ٹوکن بنائیں (جو ای میل میں جائے گا)
    const rawToken = nanoid(64); 
    
    // 2. ٹوکن کا ہیش بنائیں (جو ڈیٹا بیس میں جائے گا)
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiry = new Date(Date.now() + 3600 * 1000); // 1 گھنٹہ

    // 3. ہیش شدہ ٹوکن محفوظ کریں
    await prisma.admin.update({
      where: { id: admin.id },
      data: { 
        resetToken: hashedToken, 
        resetTokenExpiry: expiry 
      },
    });

    // 4. ری سیٹ یو آر ایل (ای میل میں اصل rawToken جائے گا)
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/reset-password?token=${rawToken}&email=${encodeURIComponent(normalizedEmail)}`;

    // 5. ای میل بھیجیں
    await sendResetEmail({ to: normalizedEmail, resetUrl });

    return NextResponse.json({ 
      message: "If the email exists, a reset link will be sent" 
    }, { status: 200 });

  } catch (err) {
    console.error("Request reset error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}