import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/Pagination/Pagination";
import prisma from "@/lib/prisma";

// --- ISR SETTING ---
// یہ پیج ہر 3600 سیکنڈز (1 گھنٹہ) بعد بیک گراؤنڈ میں ری جنریٹ ہوگا
export const revalidate = 3600; 

const POSTS_PER_PAGE = 6;

export default async function LatestPosts({ page = 1, categorySlug = null, query = "" }) {
  const skip = (page - 1) * POSTS_PER_PAGE;
  const q = String(query || "").trim();
  const where = {
    published: true,
    featured: false,
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { shortDesc: { contains: q, mode: "insensitive" } },
            { content: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  // Prisma query remains the same but now it's statically cached
  const [posts, totalPosts] = await Promise.all([
    prisma.post.findMany({
      where,
      select: {
        id: true,
        slug: true,
        title: true,
        shortDesc: true,
        mainImage: true,
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({ where }),
  ]);

  if (!posts.length) {
    return (
      <section className="py-12 bg-gray-50 min-h-[400px] flex items-center">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Latest Articles</h2>
          <p className="text-gray-600 mt-2">{q ? `No results for "${q}".` : "No articles available."}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            {q ? `Search Results for "${q}"` : "Latest Articles"}
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
            {q ? "Showing matched posts from your blog." : "Static Content for maximum speed, updated hourly."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
            >
              <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                {/* CLS Control: Aspect Ratio is key */}
                <div className="relative w-full aspect-[16/9] bg-gray-200 shrink-0">
                  <Image
                    src={post.mainImage || "/images/blog/placeholder.svg"}
                    alt={post.title}
                    fill
                    // ISR کے ساتھ پہلی امیج کو priority دیں تاکہ LCP کم ہو
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

        {/* Pagination handles its own state but links are statically generated */}
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
