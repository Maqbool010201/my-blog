import Link from "next/link";
import Pagination from "@/components/Pagination/Pagination";
import prisma from "@/lib/prisma";
import IKImage from "@/components/IKImage"; // امیج کٹ کلائنٹ کمپوننٹ

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

  if (!posts.length) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Latest Articles
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            No articles available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Latest Articles
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover more recent stories and insights from our blog
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative w-full h-48 shrink-0 bg-gray-100">
                  {/* یہاں ہم IKImage استعمال کر رہے ہیں */}
                  <IKImage
                    src={post.mainImage || "/images/blog/placeholder.jpg"}
                    alt={`Cover for ${post.title}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                    loading="lazy"
                  />
                </div>

                <div className="p-4 flex flex-col grow">
                  <time
                    className="text-xs text-gray-500 mb-2"
                    dateTime={new Date(post.createdAt).toISOString()}
                  >
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>

                  <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors grow">
                    {post.title}
                  </h3>

                  {post.shortDesc && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {post.shortDesc}
                    </p>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>

        {totalPosts > POSTS_PER_PAGE && (
          <Pagination
            totalPosts={totalPosts}
            postsPerPage={POSTS_PER_PAGE}
            basePath={categorySlug ? `/category/${categorySlug}` : "/"}
            currentPage={page}
          />
        )}
      </div>
    </section>
  );
}