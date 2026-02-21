import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { resolveSiteId } from "@/lib/site";
import { ASSIGNABLE_ROLES, normalizeAdminRole } from "@/lib/adminPermissions";

const prisma = new PrismaClient();

async function requireSuperAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") return null;
  return session;
}

export async function GET() {
  try {
    const session = await requireSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        siteId: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await requireSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password, role } = await req.json();
    const normalizedRole = normalizeAdminRole(role);
    if (!ASSIGNABLE_ROLES.includes(normalizedRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        siteId: resolveSiteId(),
        role: normalizedRole,
      },
    });

    return NextResponse.json({ message: "Admin created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await requireSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, role, name } = await req.json();
    const userId = Number(id);
    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const existing = await prisma.admin.findUnique({
      where: { id: userId },
      select: { id: true, role: true, email: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = {};
    if (role !== undefined) {
      const normalizedRole = normalizeAdminRole(role);
      if (!ASSIGNABLE_ROLES.includes(normalizedRole)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }

      if (userId === Number(session.user.id) && normalizedRole !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "You cannot demote your own Super Admin account" }, { status: 400 });
      }

      // Prevent removing the final super admin.
      if (existing.role === "SUPER_ADMIN" && normalizedRole !== "SUPER_ADMIN") {
        const superAdminCount = await prisma.admin.count({ where: { role: "SUPER_ADMIN" } });
        if (superAdminCount <= 1) {
          return NextResponse.json({ error: "Cannot demote the last Super Admin" }, { status: 400 });
        }
      }
      data.role = normalizedRole;
    }

    if (name !== undefined) {
      const trimmed = String(name || "").trim();
      if (!trimmed) return NextResponse.json({ error: "Name is required" }, { status: 400 });
      data.name = trimmed;
    }

    if (!Object.keys(data).length) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    const updated = await prisma.admin.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true, role: true, siteId: true, createdAt: true },
    });

    return NextResponse.json({ message: "User updated", user: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await requireSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get("id"));
    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    if (userId === Number(session.user.id)) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
    }

    const existing = await prisma.admin.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (existing.role === "SUPER_ADMIN") {
      const superAdminCount = await prisma.admin.count({ where: { role: "SUPER_ADMIN" } });
      if (superAdminCount <= 1) {
        return NextResponse.json({ error: "Cannot delete the last Super Admin" }, { status: 400 });
      }
    }

    await prisma.admin.delete({ where: { id: userId } });
    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
