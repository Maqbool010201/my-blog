import prisma from "@/lib/prisma";
import { DEFAULT_SITE_ID } from "@/lib/site";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function escapeXml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cleanIsoDate(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toISOString().replace(/\.\d{3}Z$/, "Z");
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const [posts, categories, legalPages] = await Promise.all([
      prisma.post.findMany({
        where: { published: true, siteId: DEFAULT_SITE_ID },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.category.findMany({
        where: { siteId: DEFAULT_SITE_ID },
        select: { slug: true },
      }),
      prisma.legalPage.findMany({
        where: { siteId: DEFAULT_SITE_ID },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const urls = [
      { loc: `${SITE_URL}/`, priority: "1.0", changefreq: "daily" },
      { loc: `${SITE_URL}/contact`, priority: "0.5", changefreq: "monthly" },
    ];

    categories.forEach((cat) => {
      if (cat?.slug) urls.push({ loc: `${SITE_URL}/category/${cat.slug}`, priority: "0.65", changefreq: "weekly" });
    });
    legalPages.forEach((page) => {
      if (page?.slug) {
        urls.push({
          loc: `${SITE_URL}/legal/${page.slug}`,
          lastmod: cleanIsoDate(page.updatedAt),
          priority: "0.3",
          changefreq: "yearly",
        });
      }
    });
    posts.forEach((post) => {
      if (post?.slug) {
        urls.push({
          loc: `${SITE_URL}/blog/${post.slug}`,
          lastmod: cleanIsoDate(post.updatedAt),
          priority: "0.75",
          changefreq: "weekly",
        });
      }
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    urls.forEach((u) => {
      xml += `  <url>\n    <loc>${escapeXml(u.loc)}</loc>\n`;
      if (u.lastmod) xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
      if (u.changefreq) xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
      if (u.priority) xml += `    <priority>${u.priority}</priority>\n`;
      xml += "  </url>\n";
    });
    xml += "</urlset>";

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
