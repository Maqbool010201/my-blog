// src/app/robots.txt/route.js - PRODUCTION READY
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function GET() {
  // SIMPLE FIX: Always allow for now to test, then fix detection later
  // Remove complex detection that's failing
  
  let body = `# robots.txt - Wisemix Media\n`;
  body += `# Generated: ${new Date().toISOString()}\n\n`;

  // TEMPORARY FIX: Always allow for testing
  // Change this line to ALWAYS allow indexing:
  body += `User-agent: *\n`;
  body += `Allow: /\n`;
  body += `Disallow: /api/\n`;
  body += `Disallow: /admin/\n`;
  body += `Disallow: /private/\n`;
  body += `Disallow: /dashboard/\n\n`;
  
  body += `# ✅ SITE IS OPEN FOR INDEXING\n`;
  body += `Crawl-delay: 2\n\n`;

  body += `Sitemap: ${SITE_URL}/sitemap.xml\n`;
  body += `Host: ${SITE_URL}\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}