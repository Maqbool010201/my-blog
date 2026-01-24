import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/Pagination/Pagination";
import prisma from "@/lib/prisma";

// --- ISR SETTING ---
export const revalidate = 3600; 

const POSTS_PER_PAGE = 6;

export default async function LatestPosts({ page = 1, categorySlug = null }) {
  const skip = (page - 1) * POSTS_PER_PAGE;

  // Prisma query
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

  // CLS Fix: اگر پوسٹس نہ ہوں تو بھی ایک مخصوص ہائٹ برقرار رکھیں
  if (!posts.length) {
    return (
      <section className="py-12 bg-gray-50 min-h-[600px] flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Latest Articles</h2>
          <p className="text-gray-600 mt-2">Stay tuned! New stories are coming soon.</p>
        </div>
      </section>
    );
  }

  return (
    // min-h-[800px] موبائل پر لے آؤٹ شفٹ (CLS) کو روکتا ہے
    <section className="py-12 bg-gray-50 min-h-[800px]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Latest Articles
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
            Static Content for maximum speed, updated hourly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
            >
              <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                {/* CLS Control: Aspect Ratio is key to prevent shifting */}
                <div className="relative w-full aspect-[16/9] bg-gray-200 overflow-hidden shrink-0">
                  <Image
                    // ImageKit optimization: q-75 and f-auto for speed
                    src={`${post.mainImage || "/images/blog/placeholder.svg"}?tr=q-75,f-auto`}
                    alt={post.title}
                    fill
                    // LCP Fix: پہلی دو تصاویر کو priority دیں تاکہ موبائل پر جلدی لوڈ ہوں
                    priority={index < 2}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    // Responsive sizes: موبائل پر 100% چوڑائی، ڈیسک ٹاپ پر 33%
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

        {/* Pagination container with fixed padding to avoid shift */}
        <div className="mt-16 border-t border-gray-200 pt-10 min-h-[100px]">
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