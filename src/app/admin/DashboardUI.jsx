"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  FileText,
  Folder,
  FileCheck,
  Settings,
  MessageSquare,
  Megaphone,
  BarChart,
  PlusCircle,
  TrendingUp,
  Network,
  List,
  Users,
  LogOut,
  UserPlus,
} from "lucide-react";
import { getAdminPermissions } from "@/lib/adminPermissions";

export default function AdminDashboardUI() {
  const { data: session } = useSession();
  const ownerName = session?.user?.name?.trim() || "Admin";
  const brandName = ownerName.length > 18 ? ownerName.split(" ")[0] : ownerName;
  const perms = getAdminPermissions(session?.user?.role);
  const isSuperAdmin = perms.role === "SUPER_ADMIN";

  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
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

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/dashboard/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex bg-slate-50 overflow-hidden font-sans">
      <aside className="w-64 bg-white text-slate-900 flex flex-col h-full border-r border-slate-200 shadow-sm shrink-0">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
            {brandName} <span className="text-blue-600">Admin</span>
          </h2>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-1">
          <SidebarLink href="/admin" icon={<BarChart size={18} />} label="Dashboard" isActive />

          <SidebarSectionLabel label="Content" />
          <SidebarLink href="/admin/posts" icon={<FileText size={18} />} label="Posts" count={stats.totalPosts} loading={loading} />
          {isSuperAdmin && (
            <>
              <SidebarLink href="/admin/categories" icon={<Folder size={18} />} label="Categories" count={stats.totalCategories} loading={loading} />
              <SidebarLink href="/admin/legal-pages" icon={<FileCheck size={18} />} label="Legal Pages" count={stats.totalLegalPages} loading={loading} />

              <SidebarSectionLabel label="Revenue" />
              <SidebarLink href="/admin/advertisements" icon={<Megaphone size={18} />} label="Ads Manager" count={stats.totalAds} loading={loading} />

              <SidebarSectionLabel label="Users & Social" />
              <SidebarLink href="/admin/users" icon={<Users size={18} />} label="Manage Admins" loading={loading} />
              <SidebarLink href="/admin/contact-messages" icon={<MessageSquare size={18} />} label="Messages" badge={stats.unreadContactMessages} loading={loading} />
              <SidebarLink href="/admin/newsletter-subscribers" icon={<List size={18} />} label="Subscribers" count={stats.totalSubscribers} loading={loading} />
              <SidebarLink href="/admin/social-links" icon={<Network size={18} />} label="Social Links" count={stats.totalSocialLinks} loading={loading} />
              <SidebarLink href="/admin/settings" icon={<Settings size={18} />} label="Settings" />
            </>
          )}
        </nav>

        <div className="p-4 bg-slate-50 mt-auto border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black transition-all uppercase flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <section className="flex-1 h-full overflow-y-auto p-8 custom-scrollbar bg-gradient-to-b from-slate-50 to-blue-50/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
              <p className="text-slate-500 text-sm font-medium">Welcome, {ownerName}</p>
            </div>

            <div className="flex gap-3">
              {isSuperAdmin && (
                <Link href="/admin/users/add" className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-md">
                  <UserPlus size={18} /> New User
                </Link>
              )}
              {perms.canCreatePost && (
                <Link href="/admin/posts/add" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md">
                  <PlusCircle size={18} /> New Post
                </Link>
              )}
            </div>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 ${isSuperAdmin ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-6 mb-10`}>
            <DashboardCard title="Total Posts" value={stats.totalPosts} loading={loading} icon={<FileText className="text-blue-500" />} color="blue" />
            <DashboardCard title="Published" value={stats.publishedPosts} loading={loading} icon={<FileCheck className="text-violet-500" />} color="purple" />
            <DashboardCard title="Drafts" value={stats.draftPosts} loading={loading} icon={<Folder className="text-emerald-500" />} color="green" />
            {isSuperAdmin && (
              <DashboardCard title="Subscribers" value={stats.totalSubscribers} loading={loading} icon={<List className="text-orange-500" />} color="orange" />
            )}
          </div>

          {isSuperAdmin && (
            <>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" /> Ads & Engagement
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-8">
                <DashboardCard title="Active Ads" value={stats.activeAds || 0} loading={loading} icon={<Megaphone className="text-blue-600" />} color="blue" />
                <DashboardCard title="Impressions" value={stats.totalImpressions?.toLocaleString() || "0"} loading={loading} icon={<TrendingUp className="text-emerald-600" />} color="green" />
                <DashboardCard title="Total Clicks" value={stats.totalClicks?.toLocaleString() || "0"} loading={loading} icon={<BarChart className="text-violet-600" />} color="purple" />
                <DashboardCard title="Unread Inbox" value={stats.unreadContactMessages || 0} loading={loading} icon={<MessageSquare className="text-rose-500" />} color="orange" />
              </div>
            </>
          )}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-10">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {isSuperAdmin ? "Quick Performance Snapshot" : "Posts Snapshot"}
            </h3>
            <MiniBars
              loading={loading}
              items={
                isSuperAdmin
                  ? [
                      { label: "Impressions", value: Number(stats.totalImpressions || 0), color: "bg-blue-500" },
                      { label: "Clicks", value: Number(stats.totalClicks || 0), color: "bg-violet-500" },
                      { label: "Subscribers", value: Number(stats.totalSubscribers || 0), color: "bg-emerald-500" },
                      { label: "Unread", value: Number(stats.unreadContactMessages || 0), color: "bg-rose-500" },
                    ]
                  : [
                      { label: "Total Posts", value: Number(stats.totalPosts || 0), color: "bg-blue-500" },
                      { label: "Published", value: Number(stats.publishedPosts || 0), color: "bg-emerald-500" },
                      { label: "Drafts", value: Number(stats.draftPosts || 0), color: "bg-violet-500" },
                    ]
              }
            />
          </div>
        </div>
      </section>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
      `}</style>
    </div>
  );
}

function SidebarSectionLabel({ label }) {
  return <p className="text-[10px] uppercase font-black text-slate-500 mt-6 mb-2 px-2 tracking-widest">{label}</p>;
}

function SidebarLink({ href, icon, label, count, badge, loading, isActive }) {
  return (
    <Link
      href={href}
      className={`flex justify-between items-center px-4 py-3 rounded-xl transition-all ${
        isActive ? "bg-blue-50 border border-blue-200 text-blue-700" : "hover:bg-slate-100 text-slate-800"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-semibold">{label}</span>
      </div>
      {!loading && (count !== undefined || (badge !== undefined && badge > 0)) && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${badge ? "bg-rose-500 animate-pulse text-white" : "bg-slate-200 text-slate-700"}`}>
          {badge || count}
        </span>
      )}
    </Link>
  );
}

function DashboardCard({ title, value, icon, loading, color }) {
  const colorClasses = {
    blue: "from-blue-500/10 to-blue-50 border-blue-200",
    green: "from-emerald-500/10 to-emerald-50 border-emerald-200",
    purple: "from-violet-500/10 to-violet-50 border-violet-200",
    orange: "from-orange-500/10 to-orange-50 border-orange-200",
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-3xl shadow-sm p-6 flex items-center gap-5 border hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
      <div className="p-3 bg-white rounded-2xl text-slate-700 shadow-sm">{icon}</div>
      <div className="overflow-hidden">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{title}</p>
        <p className="text-2xl font-black text-slate-900 leading-none mt-1">
          {loading ? <span className="animate-pulse">...</span> : value}
        </p>
      </div>
    </div>
  );
}

function MiniBars({ items, loading }) {
  const max = Math.max(1, ...items.map((i) => i.value || 0));
  return (
    <div className="space-y-4">
      {items.map((item) => {
        const width = loading ? 40 : Math.max(6, Math.round((item.value / max) * 100));
        return (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-700">{item.label}</span>
              <span className="font-semibold text-slate-900">{loading ? "..." : item.value.toLocaleString()}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
