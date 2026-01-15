import prisma from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wisemixmedia.com';

function escapeXml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function cleanIsoDate(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toISOString().replace(/\.\d{3}Z$/, 'Z');
  } catch (e) {
    return null;
  }
}

export async function GET() {
  try {
    const [posts, categories, legalPages] = await Promise.all([
      prisma.post.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true }
      }),
      prisma.category.findMany({
        select: { slug: true }
      }),
      prisma.legalPage.findMany({
        select: { slug: true, updatedAt: true }
      })
    ]);

    const urls = [];

    // --- Static Base Pages ---
    urls.push({ loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' });
    urls.push({ loc: `${SITE_URL}/contact`, priority: '0.5', changefreq: 'monthly' });

    // --- Tools Section (New) ---
    urls.push({ loc: `${SITE_URL}/tools`, priority: '0.9', changefreq: 'weekly' });
    urls.push({ loc: `${SITE_URL}/tools/image-resizer`, priority: '0.8', changefreq: 'monthly' });
    urls.push({ loc: `${SITE_URL}/tools/image-compressor`, priority: '0.8', changefreq: 'monthly' });
    urls.push({ loc: `${SITE_URL}/tools/pdf-generator`, priority: '0.8', changefreq: 'monthly' });
    urls.push({ loc: `${SITE_URL}/tools/dpi-pdf`, priority: '0.8', changefreq: 'monthly' });

    // --- Dynamic Categories ---
    categories.forEach(cat => {
      if (cat?.slug) {
        urls.push({ loc: `${SITE_URL}/category/${cat.slug}`, priority: '0.65', changefreq: 'weekly' });
      }
    });

    // --- Dynamic Legal Pages ---
    legalPages.forEach(page => {
      if (page?.slug) {
        urls.push({
          loc: `${SITE_URL}/legal/${page.slug}`,
          lastmod: cleanIsoDate(page.updatedAt),
          priority: '0.3',
          changefreq: 'yearly'
        });
      }
    });

    // --- Dynamic Blog Posts ---
    // نوٹ: ہم انفرادی بلاگ پوسٹس رکھ رہے ہیں کیونکہ آپ نے کہا کہ [slug] والا پیج کام کر رہا ہے
    posts.forEach(post => {
      if (post?.slug) {
        urls.push({
          loc: `${SITE_URL}/blog/${post.slug}`,
          lastmod: cleanIsoDate(post.updatedAt),
          priority: '0.75',
          changefreq: 'weekly'
        });
      }
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    urls.forEach(u => {
      xml += `  <url>\n    <loc>${escapeXml(u.loc)}</loc>\n`;
      if (u.lastmod) xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
      if (u.changefreq) xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
      if (u.priority) xml += `    <priority>${u.priority}</priority>\n  </url>\n`;
    });
    xml += `</urlset>`;

    return new Response(xml, {
      headers: { 
        'Content-Type': 'application/xml', 
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' 
      }
    });
  } catch (error) {
    console.error("Sitemap Error:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}