import prisma from '@/lib/prisma';
import Link from 'next/link';
import IKImage from '@/components/IKImage';
import Advertisement from '@/components/Advertisement/Advertisement';
import SidebarClient from './SidebarClient';


export default async function Sidebar() {
const [latestPosts, categories, ads] = await Promise.all([
prisma.post.findMany({ where: { siteId: "wisemix", published: true }, orderBy: { createdAt: 'desc' }, take: 5 }),
prisma.category.findMany({ where: { siteId: "wisemix" }, orderBy: { name: 'asc' } }),
prisma.advertisement.findMany({ where: { siteId: "wisemix", isActive: true, pageType: 'home' } })
]);


const sidebarTopAd = ads.find(ad => ad.position === 'sidebar-top');


return (
<aside className="w-full flex flex-col space-y-8 min-w-[300px]">
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-[300px]">
{sidebarTopAd ? <Advertisement adData={sidebarTopAd} /> : <div className="h-full flex items-center justify-center text-gray-300 text-xs">Advertisement Space</div>}
</div>


<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
<h3 className="text-lg font-bold mb-5">Latest Stories</h3>
<div className="space-y-5">
{latestPosts.map(post => (
<Link key={post.id} href={`/blog/${post.slug}`} className="flex gap-4 items-center">
<div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100">
<IKImage src={post.mainImage || "/placeholder.jpg"} alt={post.title} fill sizes="60px" className="object-cover" />
</div>
<p className="text-sm font-bold line-clamp-2">{post.title}</p>
</Link>
))}
</div>
</div>


<SidebarClient siteId="wisemix" />


<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
<h3 className="text-lg font-bold mb-4">Explore Topics</h3>
<div className="flex flex-wrap gap-2">
{categories.map(cat => (
<Link key={cat.id} href={`/category/${cat.slug}`} className="text-[11px] font-bold px-3 py-2 bg-gray-50 rounded-lg border">
{cat.name}
</Link>
))}
</div>
</div>
</aside>
);
}