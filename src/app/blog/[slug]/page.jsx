import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Advertisement from "@/components/Advertisement/Advertisement";
import SocialShare from "@/components/SocialShare/SocialShare";
import CopyButtonScript from "@/components/CopyButtonScript";
import IKImage from "@/components/IKImage"; 
import "highlight.js/styles/atom-one-dark.css";

export const revalidate = 60; 

/**
 * SEO Metadata Generator
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug_siteId: { slug: slug, siteId: "wisemix" } },
    include: { category: true },
  });

  if (!post) return { title: "Post Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wisemixmedia.com";
  const imageUrl = post.mainImage 
    ? (post.mainImage.startsWith('http') ? post.mainImage : `https://ik.imagekit.io/ag0dicbdub/${post.mainImage.replace(/^\/+/, '')}`) 
    : `${siteUrl}/images/default-og.jpg`;

  return {
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.shortDesc || "Read more about this post.",
    alternates: { canonical: `${siteUrl}/blog/${post.slug}` },
    openGraph: {
      title: post.ogTitle || post.title,
      description: post.ogDesc || post.shortDesc,
      url: `${siteUrl}/blog/${post.slug}`,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: "article",
    },
  };
}

/**
 * Helper to Clean Image Path
 */
const getImageUrl = (imgData) => {
  if (!imgData) return ""; 
  let path = typeof imgData === "object" ? imgData.mainImage : imgData;
  if (path.startsWith("http")) {
    const parts = path.split(".io/ag0dicbdub/");
    path = parts.length > 1 ? parts[1] : path;
  }
  return path.replace(/^\/+/, ''); 
};

const getContentParts = (content) => {
  if (!content) return { firstHalf: "", secondHalf: "" };
  const paragraphs = content.split("</p>");
  if (paragraphs.length <= 4) return { firstHalf: content, secondHalf: "" };
  const middleIndex = Math.floor(paragraphs.length / 2);
  return {
    firstHalf: paragraphs.slice(0, middleIndex).join("</p>") + "</p>",
    secondHalf: paragraphs.slice(middleIndex).join("</p>"),
  };
};

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug_siteId: { slug: slug, siteId: "wisemix" } },
    include: { category: true, author: true },
  });

  if (!post || !post.published) notFound();

  const { firstHalf, secondHalf } = getContentParts(post.content);
  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const mainImagePath = getImageUrl(post.mainImage);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wisemixmedia.com";

  // --- JSON-LD Schema Logic ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.mainImage?.startsWith('http') ? post.mainImage : `https://ik.imagekit.io/ag0dicbdub/${post.mainImage?.replace(/^\/+/, '')}`,
    "datePublished": post.createdAt.toISOString(),
    "dateModified": post.updatedAt.toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author?.name || "Maqbool",
      "url": `${siteUrl}/legal/about-us`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Wisemix Media",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "description": post.metaDesc || post.shortDesc,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Google Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <CopyButtonScript />
      
      <style dangerouslySetInnerHTML={{ __html: `
        .prose pre { background-color: #1e1e1e !important; margin: 1.5rem 0; position: relative; border-radius: 10px; border: 1px solid #333; overflow: hidden; }
        .prose pre code { display: block; padding: 1.25rem; overflow: auto; max-height: 400px; color: #d4d4d4; font-size: 0.9rem; line-height: 1.6; }
        .prose img { border-radius: 12px; width: 100%; height: auto !important; margin: 2rem auto; }
        
        .prose a { 
          color: #2563eb !important; 
          text-decoration: underline; 
          font-weight: 500;
        }
        .prose a:hover { 
          color: #1d4ed8 !important; 
          text-decoration: none;
        }

        .ad-container { display: block; width: 100%; height: auto; transition: all 0.2s ease; }
        .ad-container:not(:has(img, iframe, ins, a)) {
          display: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      `}} />

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        <div className="ad-container text-center mb-6">
          <Advertisement page="post" position="content-top" />
        </div>

        <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-6 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href={`/category/${post.category?.slug}`} className="hover:text-blue-600">{post.category?.name}</Link>
          <span>/</span>
          <h1 className="text-gray-900 font-medium truncate max-w-[150px] md:max-w-none">{post.title}</h1>
        </nav>

        <article className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          {mainImagePath && (
            <div className="relative w-full aspect-video bg-gray-100">
              <IKImage
                src={mainImagePath}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}

          <div className="p-5 md:p-10">
            <header className="mb-6">
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-4">
                <span className="text-blue-600 font-bold uppercase">{post.category?.name}</span>
                <span>•</span>
                <time>{formatDate(post.createdAt)}</time>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">{post.title}</h1>
            </header>

            <div className="prose prose-slate md:prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: firstHalf }} />

            {secondHalf && (
              <>
                <div className="ad-container my-8 py-4 border-y border-gray-100 text-center">
                  <Advertisement page="post" position="content-middle" />
                </div>
                <div className="prose prose-slate md:prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: secondHalf }} />
              </>
            )}

            <div className="ad-container mt-12 text-center">
              <Advertisement page="post" position="content-bottom" />
            </div>

            <div className="mt-10 pt-8 border-t">
              <SocialShare title={post.title} url={`${siteUrl}/blog/${post.slug}`} />
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}