import prisma from "@/lib/prisma";
import Link from "next/link";
import IKImage from "@/components/IKImage";
import Advertisement from "@/components/Advertisement/Advertisement";
import { DEFAULT_SITE_ID } from "@/lib/site";
import SidebarNewsletterSlot from "./SidebarNewsletterSlot";

export default async function Sidebar() {
  const [latestPosts, categories, ads] = await Promise.all([
    prisma.post.findMany({
      where: { siteId: DEFAULT_SITE_ID, published: true },
      select: {
        id: true,
        slug: true,
        title: true,
        mainImage: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.category.findMany({
      where: { siteId: DEFAULT_SITE_ID },
      orderBy: { name: "asc" },
    }),
    prisma.advertisement.findMany({
      where: { siteId: DEFAULT_SITE_ID, isActive: true, pageType: "home" },
    }),
  ]);

  const sidebarTopAd = ads.find((ad) => ad.position === "sidebar-top");

  return (
    <aside className="w-full flex flex-col space-y-6">
      {sidebarTopAd && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <Advertisement adData={sidebarTopAd} page="home" position="sidebar-top" />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-bold mb-4 text-gray-900 pb-2 border-b border-gray-100">Latest Stories</h3>
        <div className="space-y-4">
          {latestPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <IKImage
                    src={post.mainImage || "/placeholder.jpg"}
                    alt={post.title}
                    fill
                    sizes="48px"
                    className="object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <p className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <SidebarNewsletterSlot siteId={DEFAULT_SITE_ID} />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-bold mb-4 text-gray-900 pb-2 border-b border-gray-100">Topics</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="text-xs font-bold text-gray-600 bg-gray-50 px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors border border-gray-100"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
