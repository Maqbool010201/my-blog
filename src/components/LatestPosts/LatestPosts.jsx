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
        siteId: "wisemix", // سائیڈ آئی ڈی لازمی شامل کریں
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
    /* CLS FIX: پورے سیکشن کو 1000px کی منیمم ہائٹ دیں */
    <section className="py-12 bg-gray-50 min-h-[1000px] w-full">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 border-l-8 border-blue-600 pl-4">
            Latest Stories
          </h2>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article key={post.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
                <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                  {/* Aspect Ratio Box to stop layout shift */}
                  <div className="relative w-full aspect-[16/9] bg-gray-200">
                    <Image
                      src={post.mainImage || "/placeholder.jpg"}
                      alt={post.title}
                      fill
                      priority={index === 0} // صرف پہلی پوسٹ کو پریورٹی دیں
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5 flex flex-col grow">
                    <span className="text-[10px] font-bold uppercase text-blue-600 mb-2">{post.category?.name}</span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.shortDesc}</p>
                    <div className="mt-auto">
                      <span className="text-blue-600 text-sm font-bold">Read More →</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          /* Empty State: اس کی ہائٹ بھی فکس رکھیں */
          <div className="flex flex-col items-center justify-center h-[400px]">
            <p className="text-gray-500 font-bold">No articles found in this category.</p>
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