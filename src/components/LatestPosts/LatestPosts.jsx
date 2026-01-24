import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/Pagination/Pagination";
import prisma from "@/lib/prisma";

export const revalidate = 3600; 
const POSTS_PER_PAGE = 6;

export default async function LatestPosts({ page = 1, categorySlug = null }) {
  const skip = (page - 1) * POSTS_PER_PAGE;

  // Fetching posts and total count
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
    /* CLS Fix: Added min-h-[600px] to ensure the page doesn't jump during load */
    <section className="py-12 bg-white min-h-[700px]">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-gray-900 border-l-4 border-blue-600 pl-4">
            Latest Stories
          </h2>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article 
                key={post.id} 
                className="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative aspect-[16/9] w-full bg-gray-100">
                    <Image
                      src={`${post.mainImage || "/placeholder.png"}?tr=w-600,q-80,f-auto`}
                      alt={post.title}
                      fill
                      /* LCP Optimization: Load the first 2 images immediately */
                      priority={index < 2} 
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-blue-700 text-xs font-bold uppercase tracking-wider">
                      {post.category?.name}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-700 text-sm mt-3 line-clamp-3 leading-relaxed">
                      {post.shortDesc}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          /* CLS & Accessibility Fix: 
             1. Fixed height (min-h-[400px]) stops the layout jump.
             2. text-gray-700 ensures contrast ratio passes the accessibility test.
          */
          <div className="flex flex-col items-center justify-center min-h-[450px] border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 px-4 text-center">
            <div className="bg-white p-6 rounded-full shadow-sm mb-4">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-gray-800 font-bold text-xl mb-2">Working on new content!</p>
            <p className="text-gray-600 max-w-xs">New stories are being cooked and will be served very soon. Stay tuned!</p>
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