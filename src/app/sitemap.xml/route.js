import prisma from "@/lib/prisma";
export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wisemixmedia.com';

// XML میں خاص حروف کو محفوظ بنانے کے لیے
function escapeXml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

// تاریخ کو صحیح فارمیٹ میں لانے کے لیے
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
    // تمام ڈیٹا کو ایک ساتھ فیچ کرنا (siteId: "wisemix" کے ساتھ)
    const [posts, categories, legalPages] = await Promise.all([
      prisma.post.findMany({
        where: { published: true, siteId: "wisemix" }, // اہم فکس
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.category.findMany({
        where: { siteId: "wisemix" },
        select: { slug: true }
      }),
      prisma.legalPage.findMany({
        where: { siteId: "wisemix" },
        select: { slug: true, updatedAt: true }
      })
    ]);

    const urls = [];

    // 1. Static Base Pages
    urls.push({ loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' });
    urls.push({ loc: `${SITE_URL}/contact`, priority: '0.5', changefreq: 'monthly' });

    // 2. Tools Section
    urls.push({ loc: `${SITE_URL}/tools`, priority: '0.9', changefreq: 'weekly' });
    urls.push({ loc: `${SITE_URL}/tools/image-resizer`, priority: '0.8', changefreq: 'monthly' });
    urls.push({ loc: `${SITE_URL}/tools/image-compressor`, priority: '0.8', changefreq: 'monthly' });
    urls.push({ loc: `${SITE_URL}/tools/pdf-generator`, priority: '0.8', changefreq: 'monthly' });
    urls.push({ loc: `${SITE_URL}/tools/dpi-pdf`, priority: '0.8', changefreq: 'monthly' });

    // 3. Dynamic Categories
    categories.forEach(cat => {
      if (cat?.slug) {
        urls.push({ loc: `${SITE_URL}/category/${cat.slug}`, priority: '0.65', changefreq: 'weekly' });
      }
    });

    // 4. Dynamic Legal Pages
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

    // 5. Dynamic Blog Posts (ISR Posts)
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

    // XML بنانا
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
        'Cache-Control': 'no-store, max-age=0' // فی الحال کیش بند کیا ہے تاکہ نئے لنکس فوراً نظر آئیں
      }
    });

  } catch (error) {
    console.error("Sitemap Generation Error:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}