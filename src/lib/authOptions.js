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

        // یہاں "role" اور "siteId" لازمی شامل کریں
        return { 
          id: admin.id, 
          name: admin.name, 
          email: admin.email, 
          role: admin.role,
          siteId: admin.siteId // یہ لائن ایڈ کریں
        };
      },
    }),
  ],
  // یہاں کال بیکس (Callbacks) کا اضافہ کریں، ورنہ ڈیٹا سیشن میں نہیں جائے گا
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.siteId = user.siteId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.siteId = token.siteId;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET,
};