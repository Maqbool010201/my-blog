import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    // عارضی طور پر سیشن چیک کو ہٹا دیا گیا ہے تاکہ پہلا ایڈمن بن سکے
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return new Response(
        JSON.stringify({ error: "All fields required" }),
        { status: 400 }
      );
    }

    const exists = await prisma.admin.findUnique({ where: { email } });
    if (exists) {
      return new Response(
        JSON.stringify({ error: "Admin with this email already exists" }),
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: { name, email, password: hashedPassword, role: "SUPER_ADMIN" }, // پہلا بندہ خود بخود سپر ایڈمن بنے گا
    });

    return new Response(
      JSON.stringify({
        success: true,
        admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}