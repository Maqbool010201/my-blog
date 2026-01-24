import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/Pagination/Pagination";
import prisma from "@/lib/prisma";

export const revalidate = 3600; 
const POSTS_PER_PAGE = 6;

export default async function LatestPosts({ page = 1, categorySlug = null }) {
  const skip = (page - 1) * POSTS_PER_PAGE;

  const [posts, totalPosts] = await Promise.all([
    prisma.post.findMany({
      where: {
        published: true,
        featured: false,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      },
      include: { category: true, author: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({
      where: {
        published: true,
        featured: false,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      },
    }),
  ]);

  // CLS Fix for Mobile: پورے سیکشن کو ایک مخصوص ہائٹ دے دی گئی ہے تاکہ "جھٹکا" نہ لگے
  return (
    <section className="py-12 bg-gray-50 min-h-[900px] md:min-h-fit">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Latest Articles
          </h2>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
              >
                <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                  {/* Aspect Ratio keeps the image space reserved even before loading */}
                  <div className="relative w-full aspect-[16/9] bg-gray-200 shrink-0">
                    <Image
                      src={`${post.mainImage || "/images/placeholder.svg"}?tr=w-600,q-70`}
                      alt={post.title}
                      fill
                      // Mobile LCP Improvement: First 2 images load instantly
                      priority={index < 2}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  <div className="p-5 flex flex-col grow">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {post.category?.name || "General"}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-850 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                      {post.shortDesc}
                    </p>
                    
                    <div className="mt-auto pt-2">
                      <span className="text-blue-600 text-sm font-bold inline-flex items-center group-hover:translate-x-1 transition-transform">
                        Read More →
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">No posts found.</p>
          </div>
        )}

        <div className="mt-16 border-t border-gray-200 pt-10">
          {totalPosts > POSTS_PER_PAGE && (
            <Pagination
              totalPosts={totalPosts}
              postsPerPage={POSTS_PER_PAGE}
              basePath={categorySlug ? `/category/${categorySlug}` : "/"}
              currentPage={page}
            />
          )}
        </div>
      </div>
    </section>
  );
}