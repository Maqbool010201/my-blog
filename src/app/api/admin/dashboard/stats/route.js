import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // اگر کلائنٹ ایڈمن ہے تو صرف اس کی سائٹ کا ڈیٹا دکھائیں
    // اگر سپر ایڈمن ہے تو تمام سائٹس کا مجموعی ڈیٹا
    const siteId = session.user.role === "SUPER_ADMIN" ? undefined : session.user.siteId;
    const whereClause = siteId ? { where: { siteId } } : {};

    // ایک ہی بار میں تمام ڈیٹا حاصل کریں (Transaction)
    const [
      totalPosts,
      publishedPosts,
      totalCategories,
      totalAds,
      totalSubscribers,
      totalLegalPages,
      totalSocialLinks,
      unreadMessages,
      totalAdmins
    ] = await prisma.$transaction([
      prisma.post.count(whereClause),
      prisma.post.count({ where: { ...(siteId ? { siteId } : {}), published: true } }),
      prisma.category.count(whereClause),
      prisma.advertisement.count(whereClause),
      prisma.newsletterSubscriber.count(whereClause),
      prisma.legalPage.count(whereClause), // Prisma میں نام legalPage ہے (@map("legal_pages"))
      prisma.socialLink.count(whereClause),
      prisma.contactMessage.count({ where: { ...(siteId ? { siteId } : {}), status: "unread" } }),
      prisma.admin.count() // یہ صرف سپر ایڈمن کے لیے اہم ہے
    ]);

    return NextResponse.json({
      stats: {
        totalPosts,
        publishedPosts,
        draftPosts: totalPosts - publishedPosts,
        totalCategories,
        totalAds,
        totalSubscribers,
        totalLegalPages,
        totalSocialLinks,
        unreadContactMessages: unreadMessages,
        totalUsers: totalAdmins
      }
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}