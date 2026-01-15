import prisma from "@/lib/prisma";
import { nanoid } from "nanoid"; // generate unique token
import { sendResetEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });

    const admin = await prisma.admin.findUnique({ where: { email } });

    // Do not reveal if email exists or not
    if (!admin) return new Response(JSON.stringify({ message: "If the email exists, a reset link will be sent" }), { status: 200 });

    // Generate token & expiry
    const token = nanoid(64); 
    const expiry = new Date(Date.now() + 3600 * 1000); // 1 hour

    // Store token in DB automatically
    await prisma.admin.update({
      where: { id: admin.id },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/reset-password?token=${token}`;
    await sendResetEmail({ to: email, resetUrl });

    return new Response(JSON.stringify({ message: "If the email exists, a reset link will be sent" }), { status: 200 });
  } catch (err) {
    console.error("Request reset error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
