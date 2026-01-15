import Link from "next/link";
import prisma from "@/lib/prisma";
import IKImage from "@/components/IKImage"; // ہمارا نیا کلائنٹ امیج کمپوننٹ

export default async function FeaturedPosts({ excludeIds = [] }) {
  const posts = await prisma.post.findMany({
    where: {
      featured: true,
      published: true,
      id: excludeIds.length ? { notIn: excludeIds } : undefined,
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  if (!posts.length) return null;

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
          // امیج پاتھ کو درست کرنا
          const imageSrc =
            post.mainImage && post.mainImage.trim() !== ""
              ? post.mainImage.startsWith('/') ? post.mainImage : `/${post.mainImage}`
              : "/images/blog/placeholder.jpg";

          return (
            <Link key={post.id} href={`/blog/${post.slug}`} prefetch={false}>
              <article className="relative h-[340px] rounded-xl overflow-hidden shadow-lg bg-gray-50 group flex flex-col border border-gray-100">

                {/* IMAGE SLOT - Using IKImage for Performance */}
                <div className="relative w-full h-[210px] bg-gray-200">
                  <IKImage
                    src={imageSrc}
                    alt={post.title}
                    fill
                    // پہلے 4 امیجز کو ترجیح دیں تاکہ LCP سکور اچھا رہے
                    priority={index < 4} 
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* TEXT CONTENT - Server Rendered for SEO */}
                <div className="flex flex-col justify-between p-4 flex-grow">
                  <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full w-fit">
                    {post.category?.name || "Uncategorized"}
                  </span>

                  <h3 className="mt-3 text-sm font-bold text-gray-900 line-clamp-2">
                    {post.title}
                  </h3>
                </div>

                {/* FEATURED BADGE */}
                <span className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm">
                  Featured
                </span>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}