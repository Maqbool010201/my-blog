import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ valid: false, error: "Missing email or token" }, { status: 400 });
    }

    // 1. ایڈمن کو تلاش کریں (ای میل نارملائزیشن کے ساتھ)
    const admin = await prisma.admin.findUnique({ 
      where: { email: email.toLowerCase().trim() } 
    });

    if (!admin) {
      return NextResponse.json({ valid: false, error: "Admin not found" });
    }

    // 2. چیک کریں کہ کیا ری سیٹ کی درخواست موجود ہے
    if (!admin.resetToken || !admin.resetTokenExpiry) {
      return NextResponse.json({ valid: false, error: "No active reset request found" });
    }

    // 3. ٹوکن کی میعاد (Expiry) چیک کریں
    if (new Date() > new Date(admin.resetTokenExpiry)) {
      // ایکسپائرڈ ٹوکن کو صاف کر دیں تاکہ ڈیٹا بیس کلین رہے
      await prisma.admin.update({
        where: { id: admin.id },
        data: { resetToken: null, resetTokenExpiry: null },
      });
      return NextResponse.json({ valid: false, error: "Token has expired" });
    }

    // 4. ہیش بنا کر موازنہ کریں
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const isValid = admin.resetToken === hashedToken;

    if (!isValid) {
      return NextResponse.json({ valid: false, error: "Invalid token" });
    }

    // اگر سب ٹھیک ہے تو
    return NextResponse.json({ 
      valid: true, 
      message: "Token is valid",
      adminName: admin.name // فرنٹ اینڈ پر یوزر کو خوش آمدید کہنے کے لیے
    });

  } catch (err) {
    console.error("Token verification error:", err);
    return NextResponse.json({ valid: false, error: "Server error" }, { status: 500 });
  }
}