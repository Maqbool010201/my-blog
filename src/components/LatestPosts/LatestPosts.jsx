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
    <section className="py-12 bg-white min-h-[600px]">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-gray-900 border-l-4 border-blue-600 pl-4">
            Latest Stories
          </h2>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article key={post.id} className="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative aspect-[16/9] w-full bg-gray-100">
                    <Image
                      src={`${post.mainImage || "/placeholder.png"}?tr=w-600,f-auto`}
                      alt={post.title}
                      fill
                      priority={index < 2} // Mobile LCP fix
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-blue-600 text-xs font-bold uppercase">{post.category?.name}</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mt-3 line-clamp-3">{post.shortDesc}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          /* CLS Fix: Keeping a minimum height even when empty */
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-100 rounded-2xl">
            <p className="text-gray-400 font-medium">New stories are being cooked! Stay tuned.</p>
          </div>
        )}

        {totalPosts > POSTS_PER_PAGE && (
          <div className="mt-12 flex justify-center">
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