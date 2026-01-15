import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function POST(req) {
  try {
    // Get current logged-in session
    const session = await getServerSession(authOptions);

    // Only SUPER_ADMIN can create new admins
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Only SUPER_ADMIN can create admins" }),
        { status: 403 }
      );
    }

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
      data: { name, email, password: hashedPassword, role },
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
