import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Advertisement from "@/components/Advertisement/Advertisement";
import SocialShare from "@/components/SocialShare/SocialShare";
import CopyButtonScript from "@/components/CopyButtonScript";
import IKImage from "@/components/IKImage"; 
import "highlight.js/styles/atom-one-dark.css";

export const revalidate = 3600; 

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
  
  // 1. Fetch the main post
  const post = await prisma.post.findUnique({
    where: { slug_siteId: { slug: slug, siteId: "wisemix" } },
    include: { category: true, author: true },
  });

  if (!post || !post.published) notFound();

  // 2. Fetch the 6 LATEST posts globally (Latest Updates)
  const latestPosts = await prisma.post.findMany({
    where: {
      siteId: "wisemix",
      published: true,
      NOT: { id: post.id }, // Exclude current post
    },
    take: 6, 
    orderBy: { createdAt: 'desc' },
    select: {
      title: true,
      slug: true,
      mainImage: true,
      createdAt: true,
      category: { select: { name: true } }
    }
  });

  const { firstHalf, secondHalf } = getContentParts(post.content);
  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const mainImagePath = getImageUrl(post.mainImage);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wisemixmedia.com";

  return (
    <div className="min-h-screen bg-gray-50">
      <CopyButtonScript />
      
      <style dangerouslySetInnerHTML={{ __html: `
        .prose pre { background-color: #1e1e1e !important; margin: 1.5rem 0; position: relative; border-radius: 10px; border: 1px solid #333; overflow: hidden; }
        .prose pre code { display: block; padding: 1.25rem; overflow: auto; max-height: 400px; color: #d4d4d4; font-size: 0.9rem; line-height: 1.6; }
        .prose img { border-radius: 12px; width: 100%; height: auto !important; margin: 2rem auto; }
        .prose a { color: #2563eb !important; text-decoration: underline; font-weight: 500; }
        .prose a:hover { color: #1d4ed8 !important; text-decoration: none; }
        .ad-container { display: block; width: 100%; height: auto; transition: all 0.2s ease; }
        .ad-container:not(:has(img, iframe, ins, a)) { display: none !important; }
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

            {/* LATEST POSTS GRID */}
            {latestPosts.length > 0 && (
              <div className="mt-16 pt-10 border-t border-gray-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                    Latest from Wisemix Media
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {latestPosts.map((rel) => (
                    <Link key={rel.slug} href={`/blog/${rel.slug}`} className="group flex flex-col">
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-4 shadow-sm border border-gray-50">
                        <IKImage
                          src={getImageUrl(rel.mainImage)}
                          alt={rel.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 300px"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded text-blue-600 uppercase">
                            {rel.category?.name}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-bold text-gray-800 group-hover:text-blue-600 line-clamp-2 leading-snug mb-1 text-sm md:text-base">
                        {rel.title}
                      </h4>
                      <span className="text-[11px] text-gray-400 font-medium">{formatDate(rel.createdAt)}</span>
                    </Link>
                  ))}
                </div>
              </div>
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