import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    // Next-Auth کی ڈیفالٹ کوکیز کو ختم کرنا
    // یہ پروڈکشن میں "__Secure-next-auth.session-token" ہوتی ہے اور لوکل پر "next-auth.session-token"
    const cookieName = process.env.NODE_ENV === "production" 
      ? "__Secure-next-auth.session-token" 
      : "next-auth.session-token";

    response.cookies.set(cookieName, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, // فوری ختم کرنے کے لیے
    });

    // اگر آپ نے کوئی کسٹم ٹوکن کوکی رکھی ہے تو اسے بھی صاف کریں
    response.cookies.set("token", "", { maxAge: 0, path: "/" });

    return response;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}