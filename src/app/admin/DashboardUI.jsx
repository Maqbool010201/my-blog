"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FileText,
  Folder,
  FileCheck,
  Settings,
  MessageSquare,
  Megaphone,
  Layout,
  BarChart,
  PlusCircle,
  List,
  TrendingUp,
  ChartNetwork
} from "lucide-react";

export default function AdminDashboardUI() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    featuredPosts: 0,
    totalCategories: 0,
    totalLegalPages: 0,
    totalContactMessages: 0,
    unreadContactMessages: 0,
    totalAds: 0,
    activeAds: 0,
    inactiveAds: 0,
    totalImpressions: 0,
    totalClicks: 0,
    totalSubscribers: 0,
    totalSocialLinks: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch all counts, ignoring pagination
        const [
          postsRes,
          categoriesRes,
          legalPagesRes,
          contactRes,
          adsRes,
          newsletterRes,
          socialLinksRes
        ] = await Promise.all([
          fetch("/api/posts?admin=true&limit=1000"), // fetch all posts for stats
          fetch("/api/categories"),
          fetch("/api/legal-pages"),
          fetch("/api/contact"),
          fetch("/api/admin/advertisements"),
          fetch("/api/admin/newsletter"),
          fetch("/api/admin/social-links")
        ]);

        const postsData = postsRes.ok ? await postsRes.json() : { posts: [] };
        const categories = categoriesRes.ok ? await categoriesRes.json() : [];
        const legalPages = legalPagesRes.ok ? await legalPagesRes.json() : [];
        const contactData = contactRes.ok ? await contactRes.json() : { messages: [] };
        const adsData = adsRes.ok ? await adsRes.json() : { ads: [] };
        const newsletterData = newsletterRes.ok ? await newsletterRes.json() : { subscribers: [] };
        const socialLinksData = socialLinksRes.ok ? await socialLinksRes.json() : { links: [] };

        const posts = postsData.posts || [];
        const contactMessages = contactData.messages || [];
        const unreadMessages = contactMessages.filter(m => m.status === "unread").length;

        const totalAds = adsData.ads.length;
        const activeAds = adsData.ads.filter(a => a.isActive).length;
        const totalImpressions = adsData.ads.reduce((sum, a) => sum + (a.impressions || 0), 0);
        const totalClicks = adsData.ads.reduce((sum, a) => sum + (a.clicks || 0), 0);

        setStats({
          totalPosts: posts.length,
          publishedPosts: posts.filter(p => p.published).length,
          draftPosts: posts.filter(p => !p.published).length,
          featuredPosts: posts.filter(p => p.featured).length,
          totalCategories: categories.length,
          totalLegalPages: legalPages.length,
          totalContactMessages: contactMessages.length,
          unreadContactMessages: unreadMessages,
          totalAds,
          activeAds,
          inactiveAds: totalAds - activeAds,
          totalImpressions,
          totalClicks,
          totalSubscribers: newsletterData.subscribers?.length || 0,
          totalSocialLinks: socialLinksData.links?.length || 0,
        });

      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  return (
    <main className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 p-6 flex flex-col justify-between bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-lg">
        <div>
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

          <nav className="flex flex-col gap-2">
            <SidebarLink href="/admin" icon={<BarChart />} label="Dashboard" isActive />

            <p className="text-xs uppercase tracking-wider text-blue-300 mt-4 mb-2">Content</p>
            <SidebarLink href="/admin/posts" icon={<FileText />} label="Posts" count={stats.totalPosts} loading={loading} />
            <SidebarLink href="/admin/categories" icon={<Folder />} label="Categories" count={stats.totalCategories} loading={loading} />
            <SidebarLink href="/admin/legal-pages" icon={<FileCheck />} label="Legal Pages" count={stats.totalLegalPages} loading={loading} />

            <p className="text-xs uppercase tracking-wider text-blue-300 mt-4 mb-2">Advertisement</p>
            <SidebarLink href="/admin/advertisements" icon={<Megaphone />} label="Ads" count={stats.totalAds} loading={loading} />
            <SidebarLink href="/admin/advertisements/new" icon={<PlusCircle />} label="Create Ad" />
            <SidebarLink href="/admin/settings" icon={<Settings />} label="Settings" />

            <p className="text-xs uppercase tracking-wider text-blue-300 mt-4 mb-2">Management</p>
            <SidebarLink href="/admin/contact-messages" icon={<MessageSquare />} label="Contact Messages" count={stats.totalContactMessages} badge={stats.unreadContactMessages} loading={loading} />
            <SidebarLink href="/admin/newsletter-subscribers" icon={<Megaphone />} label="Newsletter" count={stats.totalSubscribers} loading={loading} />
            <SidebarLink href="/admin/social-links" icon={<ChartNetwork />} label="Social Links" count={stats.totalSocialLinks} loading={loading} />
          </nav>
        </div>

        <div className="mt-auto pt-4 border-t border-blue-500">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard title="Total Posts" value={stats.totalPosts} subtitle={`${stats.publishedPosts} published • ${stats.draftPosts} draft`} loading={loading} icon={<FileText className="w-10 h-10 text-blue-500" />} color="blue" />
          <DashboardCard title="Categories" value={stats.totalCategories} loading={loading} icon={<Folder className="w-10 h-10 text-green-500" />} color="green" />
          <DashboardCard title="Legal Pages" value={stats.totalLegalPages} loading={loading} icon={<FileCheck className="w-10 h-10 text-purple-500" />} color="purple" />
          <DashboardCard title="Social Links" value={stats.totalSocialLinks} loading={loading} icon={<ChartNetwork className="w-10 h-10 text-orange-500" />} color="orange" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Total Ads" value={stats.totalAds} subtitle={`${stats.activeAds} active • ${stats.inactiveAds} inactive`} loading={loading} icon={<Megaphone className="w-10 h-10 text-blue-500" />} color="blue" />
          <DashboardCard title="Ad Impressions" value={stats.totalImpressions.toLocaleString()} loading={loading} icon={<TrendingUp className="w-10 h-10 text-green-500" />} color="green" />
          <DashboardCard title="Ad Clicks" value={stats.totalClicks.toLocaleString()} loading={loading} icon={<BarChart className="w-10 h-10 text-purple-500" />} color="purple" />
          <DashboardCard title="Newsletter Subscribers" value={stats.totalSubscribers} loading={loading} icon={<Megaphone className="w-10 h-10 text-teal-500" />} color="teal" />
        </div>
      </section>
    </main>
  );
}

/* ---------------- Components ---------------- */

function SidebarLink({ href, icon, label, count, badge, loading, isActive }) {
  return (
    <Link
      href={href}
      className={`flex justify-between items-center px-4 py-2 rounded-md mb-1 transition-colors duration-200
        ${isActive ? "bg-blue-700" : "hover:bg-blue-500/20"}`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {loading ? <span>...</span> : count !== undefined ? <span className="bg-white/20 px-2 rounded-full">{count}</span> : null}
        {badge > 0 && <span className="bg-red-500 px-2 rounded-full">{badge}</span>}
      </div>
    </Link>
  );
}

function DashboardCard({ title, value, subtitle, icon, loading, color }) {
  const colorClasses = {
    blue: "border-l-4 border-blue-500",
    green: "border-l-4 border-green-500",
    purple: "border-l-4 border-purple-500",
    orange: "border-l-4 border-orange-500",
    teal: "border-l-4 border-teal-500",
  };

  return (
    <div className={`bg-white rounded-xl shadow p-4 flex items-center gap-4 ${colorClasses[color]} transition-all duration-200`}>
      <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{loading ? "..." : value}</p>
        {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
      </div>
    </div>
  );
}
