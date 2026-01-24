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

  return (
    /* CLS FIX: min-h-[1000px] بہت ضروری ہے */
    <section className="py-12 bg-gray-50 min-h-[1000px]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Latest Articles
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm">
            Static Content for maximum speed, updated hourly.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article key={post.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
                <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                  {/* Image Container with fixed aspect ratio */}
                  <div className="relative w-full aspect-[16/9] bg-gray-200">
                    <Image
                      src={post.mainImage || "/placeholder.png"}
                      alt={post.title}
                      fill
                      priority={index < 2} // پہلی دو پوسٹس کو جلدی لوڈ کریں
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  <div className="p-5 flex flex-col grow">
                    <span className="text-[10px] font-bold uppercase text-blue-600 mb-2">
                      {post.category?.name || "General"}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {post.shortDesc}
                    </p>
                    <div className="mt-auto">
                      <span className="text-blue-600 text-sm font-bold">Read More →</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">No articles found.</p>
          </div>
        )}

        {totalPosts > POSTS_PER_PAGE && (
          <div className="mt-16 flex justify-center">
            <Pagination
              totalPosts={totalPosts}
              postsPerPage={POSTS_PER_PAGE}
              basePath={categorySlug ? `/category/${categorySlug}` : "/"}
              currentPage={page}
            />
          </div>
        )}
      </div>
    </section>
  );
}