import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/Pagination/Pagination";
import prisma from "@/lib/prisma";

export const revalidate = 3600; 
const POSTS_PER_PAGE = 6;

// Skeleton Card: ڈیٹا لوڈ ہونے سے پہلے یہ نظر آئے گا
const SkeletonCard = () => (
  <div className="bg-gray-200 animate-pulse rounded-xl h-[350px] w-full mb-4"></div>
);

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
    <section className="py-12 bg-gray-50 min-h-[1000px]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Latest Articles</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <article key={post.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
                <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                  <div className="relative w-full aspect-[16/9] bg-gray-200 shrink-0">
                    <Image
                      src={`${post.mainImage || "/images/placeholder.svg"}?tr=w-600,q-70`}
                      alt={post.title}
                      fill
                      priority={index < 2} // موبائل LCP کے لیے بہترین
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5 flex flex-col grow">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{post.shortDesc}</p>
                  </div>
                </Link>
              </article>
            ))
          ) : (
            // اگر پوسٹس ابھی فیچ ہو رہی ہیں یا نہیں ہیں تو 6 ڈبے دکھاؤ
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          )}
        </div>
        
        {/* Pagination */}
        <div className="mt-16 min-h-[100px]">
          {totalPosts > POSTS_PER_PAGE && (
            <Pagination totalPosts={totalPosts} postsPerPage={POSTS_PER_PAGE} basePath={categorySlug ? `/category/${categorySlug}` : "/"} currentPage={page} />
          )}
        </div>
      </div>
    </section>
  );
}