// src/app/legal/[slug]/page.js
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';

// Direct database query
async function getLegalPage(slug) {
  try {
    const legalPage = await prisma.legalPage.findFirst({
      where: { 
        slug: slug,
        isActive: true 
      }
    });
    return legalPage;
  } catch (error) {
    console.error('Frontend Error fetching:', error);
    return null;
  }
}

// Metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const legalPage = await getLegalPage(slug);
  
  if (!legalPage) return { title: 'Page Not Found' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    title: `${legalPage.title} - ${process.env.NEXT_PUBLIC_BRAND_NAME || "My Blog"}`,
    description: legalPage.description || legalPage.title,
    alternates: {
      canonical: `${siteUrl}/legal/${slug}`,
    }
  };
}

export default async function LegalPage({ params }) {
  const { slug } = await params;
  if (!slug) notFound();
  
  const legalPage = await getLegalPage(slug);
  if (!legalPage) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // --- BREADCRUMB SCHEMA (JSON-LD) ---
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": legalPage.title,
        "item": `${siteUrl}/legal/${slug}`,
      },
    ],
  };

  return (
    <>
      {/* 1. Google SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* 2. Visual Breadcrumbs (User Navigation) */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{legalPage.title}</span>
          </nav>

          <article className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {legalPage.title}
            </h1>
            
            {legalPage.description && (
              <p className="text-lg text-gray-600 mb-6 italic">
                {legalPage.description}
              </p>
            )}

            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
              dangerouslySetInnerHTML={{ __html: legalPage.content }}
            />

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
              <span>Last updated: {new Date(legalPage.updatedAt).toLocaleDateString()}</span>
              {/* Simple Text link instead of button for professional legal look */}
              <Link href="/" className="text-blue-600 hover:underline">
                Return Home
              </Link>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
