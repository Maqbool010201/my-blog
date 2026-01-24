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
    /* CLS FIX: min-h-225 اور py-20 تاکہ فوٹر اوپر نہ آئے */
    <section className="py-20 bg-white min-h-225">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-4xl font-black text-gray-900 border-l-8 border-blue-600 pl-6">
            Latest Stories
          </h2>
        </div>

        {/* کنٹینر کو فکسڈ ہائٹ دیں تاکہ ڈیٹا آنے سے پہلے جگہ خالی نہ لگے */}
        <div className="min-h-150">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post, index) => (
                <article key={post.id} className="group flex flex-col h-full bg-white">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-gray-100">
                      <Image
                        src={`${post.mainImage || "/placeholder.png"}?tr=w-500,q-70`}
                        alt={post.title}
                        fill
                        priority={index < 2} 
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="pt-6">
                      <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">{post.category?.name}</span>
                      <h3 className="text-2xl font-bold text-gray-900 mt-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-125 border-4 border-dashed border-gray-100 rounded-3xl">
              <p className="text-gray-800 font-black text-2xl">Working on new content!</p>
              <p className="text-gray-500 mt-2">Check back in a few hours for fresh stories.</p>
            </div>
          )}
        </div>

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