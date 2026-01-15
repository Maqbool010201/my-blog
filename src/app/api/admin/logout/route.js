// app/api/admin/logout/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // If using cookies to store session/token
    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    
    // Clear token cookie (adjust name if different)
    response.cookies.set("token", "", { maxAge: 0, path: "/" });

    return response;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
