import Advertisement from '@/components/Advertisement/Advertisement';
import Link from 'next/link';
import SidebarClient from './SidebarClient';
import IKImage from '@/components/IKImage'; // امیج کٹ کلائنٹ کمپوننٹ

// --- HELPER FUNCTIONS ---

async function getLatestPosts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/posts/latest?limit=5`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts ?? [];
  } catch (error) {
    console.error("Sidebar: Error fetching latest posts", error);
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/categories`,
      { next: { revalidate: 600 } }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Sidebar: Error fetching categories", error);
    return [];
  }
}

async function getActiveAd(page, position) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/advertisements?pageType=${page}&position=${position}&isActive=true`,
      { cache: 'no-store' } 
    );
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Sidebar: Error fetching ads", error);
    return null;
  }
}

// --- MAIN COMPONENT ---

const SidebarServer = async () => {
  const [latestPosts, categories, sidebarTopAd, sidebarBottomAd] = await Promise.all([
    getLatestPosts(),
    getCategories(),
    getActiveAd('home', 'sidebar-top'),
    getActiveAd('home', 'sidebar-bottom'),
  ]);

  const getImageUrl = (post) =>
    post.mainImage || post.coverImage || post.ogImage || `/images/blog/placeholder.jpg`;

  return (
    <aside className="w-full flex flex-col space-y-6">
      {/* Top Ad */}
      {sidebarTopAd && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 min-h-[120px]">
          <Advertisement adData={sidebarTopAd} page="home" position="sidebar-top" />
        </div>
      )}

      {/* Latest Posts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-bold mb-4 text-gray-900 pb-2 border-b border-gray-100">
          Latest Posts
        </h3>
        <div className="space-y-3">
          {latestPosts.length > 0 ? (
            latestPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <div className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition">
                  <div className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden bg-gray-200 border border-gray-50">
                    {/* IKImage used here to fix loader missing error */}
                    <IKImage
                      src={getImageUrl(post)}
                      alt={`Thumbnail for ${post.title}`}
                      fill
                      sizes="48px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {post.title}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">No posts yet</p>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-bold mb-4 text-gray-900 pb-2 border-b border-gray-100">
          Categories
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="text-xs font-medium text-gray-700 hover:text-white hover:bg-blue-600 px-2 py-2 rounded-lg transition text-center border border-gray-100"
              >
                {cat.name}
              </Link>
            ))
          ) : (
            <p className="text-xs text-gray-500 col-span-2 text-center">No categories</p>
          )}
        </div>
      </div>

      {/* Bottom Ad */}
      {sidebarBottomAd && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 min-h-[120px]">
          <Advertisement adData={sidebarBottomAd} page="home" position="sidebar-bottom" />
        </div>
      )}

      <SidebarClient />
    </aside>
  );
};

export default SidebarServer;