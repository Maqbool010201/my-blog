import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, token, newPassword } = await req.json();

    // 1. بنیادی ویلیڈیشن
    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // 2. ایڈمن کو تلاش کریں
    const admin = await prisma.admin.findUnique({ 
      where: { email: email.toLowerCase().trim() } 
    });

    if (!admin || !admin.resetToken || !admin.resetTokenExpiry) {
      return NextResponse.json({ error: "Invalid or expired request" }, { status: 400 });
    }

    // 3. ٹوکن کی میعاد (Expiry) چیک کریں
    if (new Date() > new Date(admin.resetTokenExpiry)) {
      // میعاد ختم ہونے پر ٹوکن صاف کر دیں
      await prisma.admin.update({
        where: { id: admin.id },
        data: { resetToken: null, resetTokenExpiry: null },
      });
      return NextResponse.json({ error: "Token has expired. Please request a new one." }, { status: 400 });
    }

    // 4. ٹوکن کی تصدیق (Verification)
    // نوٹ: اگر آپ نے request-reset میں ہیش نہیں کیا تھا، تو یہاں بھی موازنہ سادہ ہوگا۔
    // لیکن سیکیورٹی کے لیے ہیشنگ بہتر ہے۔
    const incomingTokenHash = crypto.createHash("sha256").update(token).digest("hex");
    
    // اگر آپ نے پچھلی فائل میں ہیش نہیں کیا تھا تو: if (admin.resetToken !== token)
    if (admin.resetToken !== incomingTokenHash && admin.resetToken !== token) {
      return NextResponse.json({ error: "Invalid reset token" }, { status: 400 });
    }

    // 5. نیا پاس ورڈ ہیش کریں اور اپ ڈیٹ کریں
    const hashedPassword = await bcrypt.hash(newPassword, 12); // تھوڑا زیادہ سالٹ (12) بہتر ہے
    
    await prisma.admin.update({
      where: { id: admin.id },
      data: { 
        password: hashedPassword, 
        resetToken: null, 
        resetTokenExpiry: null 
      },
    });

    return NextResponse.json({ success: true, message: "Password updated successfully" });

  } catch (err) {
    console.error("Reset Password Error:", err);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}