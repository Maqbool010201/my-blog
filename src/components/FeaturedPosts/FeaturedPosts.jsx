import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function FeaturedPosts({ excludeIds = [] }) {
  const posts = await prisma.post.findMany({
    where: {
      featured: true,
      published: true,
      // If your DB uses siteId, make sure it's included here:
      // siteId: process.env.SITE_ID, 
      ...(excludeIds.length > 0 && {
        id: { notIn: excludeIds },
      }),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  // If no posts are found, the component won't render
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 text-center">
        <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
          More Featured
        </span>
        <h2 className="text-3xl font-bold mt-2 mb-4 text-gray-800">
          Additional Featured Stories
        </h2>
      </div>

      <div className="container mx-auto px-4 mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {posts.map((post, index) => {
          const imageSrc = post.mainImage || "/images/blog/placeholder.svg";

          return (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="relative h-[340px] rounded-xl overflow-hidden shadow-lg bg-gray-50 group flex flex-col">
                <div className="relative w-full h-[210px] bg-gray-200">
                  <Image
                    src={imageSrc}
                    alt={post.title}
                    fill
                    priority={index < 2}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full w-fit">
                    {post.category?.name || "Uncategorized"}
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-gray-900 line-clamp-2">
                    {post.title}
                  </h3>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}