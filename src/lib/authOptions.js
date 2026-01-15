// src/lib/authOptions.js
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });

        if (!admin) return null;

        const isValid = await bcrypt.compare(credentials.password, admin.password);
        if (!isValid) return null;

        return { id: admin.id, name: admin.name, email: admin.email, role: admin.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET,
};
