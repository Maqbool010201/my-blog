import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Advertisement from "@/components/Advertisement/Advertisement";
import SocialShare from "@/components/SocialShare/SocialShare";
import CopyButtonScript from "@/components/CopyButtonScript";
import IKImage from "@/components/IKImage"; // ہمارا نیا کلائنٹ امیج کمپوننٹ
import "highlight.js/styles/atom-one-dark.css";

export const dynamic = "force-dynamic";

/**
 * Generates SEO Metadata - یہ حصہ گوگل رینکنگ کے لیے بہت اہم ہے
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!post) return { title: "Post Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const imageUrl = post.mainImage || `${siteUrl}/images/default-og.jpg`;

  return {
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.shortDesc || "Read more about this post.",
    openGraph: {
      title: post.ogTitle || post.title,
      description: post.ogDesc || post.shortDesc,
      url: `${siteUrl}/blog/${post.slug}`,
      images: [{ url: imageUrl }],
      type: "article",
    },
  };
}

/**
 * Formats the image path
 */
const getImageUrl = (imgData) => {
  if (!imgData) return "/images/blog/placeholder.jpg";
  const path = typeof imgData === "object" ? imgData.mainImage : imgData;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return path.startsWith("/") ? path : `/${path}`;
};

/**
 * Logic to insert ads in the middle of content
 */
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
    where: { slug },
    include: { category: true, author: true },
  });

  if (!post || !post.published) notFound();

  const relatedPosts = await prisma.post.findMany({
    where: { 
        published: true, 
        categoryId: post.categoryId, 
        id: { not: post.id } 
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const { firstHalf, secondHalf } = getContentParts(post.content);
  
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <CopyButtonScript />

      <style dangerouslySetInnerHTML={{ __html: `
        .prose pre { background-color: #1e1e1e !important; margin: 1.5rem 0; position: relative; border-radius: 10px; border: 1px solid #333; overflow: hidden; }
        .prose pre code { display: block; padding: 1.25rem; overflow: auto; max-height: 400px; color: #d4d4d4; font-size: 0.9rem; line-height: 1.6; }
        .prose img { border-radius: 12px; height: auto !important; margin: 2rem auto; }
        .copy-btn { position: absolute; top: 10px; right: 10px; background: #2563eb; color: white; padding: 4px 10px; border-radius: 5px; font-size: 11px; cursor: pointer; border: none; }
      `}} />

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        <div className="mb-8 text-center">
          <Advertisement page="post" position="content-top" />
        </div>

        <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-6 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href={`/category/${post.category?.slug}`} className="hover:text-blue-600">
            {post.category?.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{post.title}</span>
        </nav>

        <article className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          {post.mainImage && (
            <div className="relative w-full aspect-video">
              {/* Using IKImage for optimized hero image on post page */}
              <IKImage
                src={getImageUrl(post.mainImage)}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}

          <div className="p-5 md:p-10">
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-4">
              <span className="text-blue-600 font-bold uppercase">{post.category?.name}</span>
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
              <span>•</span>
              <span>By {post.author?.name || "Admin"}</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="prose prose-slate md:prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: firstHalf }} />

            {secondHalf && (
              <>
                <div className="my-8 py-4 border-y border-gray-100 text-center">
                  <Advertisement page="post" position="content-middle" />
                </div>
                <div className="prose prose-slate md:prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: secondHalf }} />
              </>
            )}

            <div className="mt-12 text-center">
              <Advertisement page="post" position="content-bottom" />
            </div>

            <div className="mt-10 pt-8 border-t">
              <SocialShare title={post.title} url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`} />
            </div>
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Recommended Reading</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedPosts.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all">
                  <div className="relative w-full h-40">
                    <IKImage 
                      src={getImageUrl(r.mainImage)} 
                      alt={r.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform" 
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-2 group-hover:text-blue-600">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}