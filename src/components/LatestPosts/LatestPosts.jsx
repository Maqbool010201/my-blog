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

  // Loading Placeholder to prevent CLS
  const containerStyle = { minHeight: '1200px' };

  return (
    <section className="py-12 bg-gray-50" style={containerStyle}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 uppercase">
            Latest Articles
          </h2>
          <p className="text-gray-500 text-sm italic">Updated Hourly</p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article key={post.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden transition-shadow hover:shadow-md">
                <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                  <div className="relative w-full aspect-[16/9] bg-gray-200">
                    <Image
                      src={post.mainImage || "/placeholder.jpg"}
                      alt={post.title}
                      fill
                      priority={index < 3} // پہلے 3 کارڈز کو پریورٹی دیں
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5 flex flex-col grow">
                    <span className="text-[10px] font-bold text-blue-600 uppercase mb-2">{post.category?.name}</span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">{post.shortDesc}</p>
                    <div className="mt-auto pt-2">
                      <span className="text-blue-600 text-sm font-bold">Read More →</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[500px]">
            <p className="text-gray-500 font-bold">No articles found right now.</p>
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