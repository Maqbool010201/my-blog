import prisma from '@/lib/prisma';
import Link from 'next/link';
import IKImage from '@/components/IKImage'; 
import Advertisement from '@/components/Advertisement/Advertisement';
import SidebarClient from './SidebarClient';

export default async function Sidebar() {
  const [latestPosts, categories, ads] = await Promise.all([
    prisma.post.findMany({
      where: { siteId: "wisemix", published: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    prisma.category.findMany({
      where: { siteId: "wisemix" },
      orderBy: { name: 'asc' }
    }),
    prisma.advertisement.findMany({
      where: { siteId: "wisemix", isActive: true, pageType: 'home' }
    })
  ]);

  const sidebarTopAd = ads.find(ad => ad.position === 'sidebar-top');

  return (
    <aside className="w-full flex flex-col space-y-8" style={{ minWidth: '300px' }}>
      
      {/* Ad Section with Fixed Placeholder Height to prevent CLS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4" style={{ minHeight: '280px' }}>
        {sidebarTopAd ? (
          <Advertisement adData={sidebarTopAd} page="home" position="sidebar-top" />
        ) : (
          <div className="h-[250px] flex items-center justify-center text-gray-300 text-xs italic">
            Advertisement Space
          </div>
        )}
      </div>

      {/* Latest Stories */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-bold mb-5 text-gray-900 pb-2 border-b-2 border-blue-50">Latest Stories</h3>
        <div className="space-y-5">
          {latestPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-50">
                  <IKImage 
                    src={post.mainImage || "/placeholder.jpg"} 
                    alt={post.title} 
                    fill 
                    sizes="60px" 
                    className="object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                </div>
                <p className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                  {post.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <SidebarClient siteId="wisemix" />

      {/* Topics */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-bold mb-4 text-gray-900 pb-2 border-b-2 border-blue-50">Explore Topics</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/category/${cat.slug}`} 
              className="text-[11px] font-bold text-gray-600 bg-gray-50 px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all border border-gray-100 uppercase tracking-tight"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}