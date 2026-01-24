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
        siteId: "wisemix",
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
        siteId: "wisemix",
        published: true,
        featured: false,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      },
    }),
  ]);

  return (
    /* CLS FIX: Forced minimum height to prevent layout jumping */
    <section 
      className="py-12 bg-gray-50 w-full" 
      style={{ minHeight: '1100px' }} 
    >
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 border-l-8 border-blue-600 pl-4 uppercase tracking-tighter">
            Latest Stories
          </h2>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article key={post.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
                <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                  {/* Fixed Aspect Ratio for Image Container */}
                  <div className="relative w-full aspect-[16/9] bg-gray-200">
                    <Image
                      src={`${post.mainImage || "/placeholder.jpg"}?tr=w-480,q-60`}
                      alt={post.title}
                      fill
                      priority={index < 2} 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5 flex flex-col grow">
                    <span className="text-[10px] font-bold uppercase text-blue-600 mb-2 tracking-widest">
                      {post.category?.name || "Insight"}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                      {post.shortDesc}
                    </p>
                    <div className="mt-auto pt-2">
                      <span className="text-blue-600 text-sm font-bold inline-flex items-center">
                        Read Story <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 font-medium">Preparing fresh content for you...</p>
          </div>
        )}

        {totalPosts > POSTS_PER_PAGE && (
          <div className="mt-20 flex justify-center">
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