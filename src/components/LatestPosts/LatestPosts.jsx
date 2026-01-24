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
    /* CLS FIX: min-h کو بڑھا کر 800px کریں تاکہ لوڈنگ کے دوران نیچے والا فوٹر اوپر نہ بھاگے */
    <section className="py-12 bg-white min-h-[800px] transition-all duration-300">
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
                className="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
              >
                <Link href={`/blog/${post.slug}`}>
                  {/* Image Container with fixed Aspect Ratio to prevent shift */}
                  <div className="relative aspect-[16/9] w-full bg-gray-200">
                    <Image
                      src={`${post.mainImage || "/placeholder.png"}?tr=w-600,q-70,f-auto`}
                      alt={post.title}
                      fill
                      priority={index < 2} 
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-blue-700 text-xs font-bold uppercase">{post.category?.name}</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2 line-clamp-2">{post.title}</h3>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          /* CLS & LCP FIX: Empty state must have enough height */
          <div className="flex flex-col items-center justify-center min-h-[500px] border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 text-center">
            <p className="text-gray-800 font-bold text-xl">Updates coming soon!</p>
            <p className="text-gray-600 mt-2">We are preparing fresh content for you.</p>
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