// src/app/api/admins/route.js
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const admins = await prisma.admin.findMany({ orderBy: { createdAt: "desc" } });
  return new Response(JSON.stringify(admins), { headers: { "Content-Type": "application/json" } });
}

export async function POST(req) {
  const data = await req.json();
  if (!data.email || !data.password) return new Response(JSON.stringify({ error: "Missing" }), { status: 400 });

  const hashed = await bcrypt.hash(data.password, 10);
  const admin = await prisma.admin.create({ data: { email: data.email, password: hashed, name: data.name || null } });
  return new Response(JSON.stringify({ id: admin.id, email: admin.email, name: admin.name }), { status: 201, headers: { "Content-Type": "application/json" } });
}
