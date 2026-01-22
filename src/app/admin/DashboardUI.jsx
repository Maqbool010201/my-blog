"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  FileText, Folder, FileCheck, Settings, MessageSquare,
  Megaphone, BarChart, PlusCircle, TrendingUp, Network, List,
  Users, LogOut, UserPlus
} from "lucide-react";

export default function AdminDashboardUI() {
  const router = useRouter();
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalPosts: 0, publishedPosts: 0, draftPosts: 0,
    totalCategories: 0, totalLegalPages: 0,
    totalContactMessages: 0, unreadContactMessages: 0,
    totalAds: 0, activeAds: 0, inactiveAds: 0,
    totalImpressions: 0, totalClicks: 0,
    totalSubscribers: 0, totalSocialLinks: 0,
  });
  const [loading, setLoading] = useState(true);

  // Stats فیچ کرنے کا فنکشن (بہتر سپیڈ اور میموری کے لیے useCallback کا استعمال)
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/dashboard/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
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
    // 'fixed inset-0' فرنٹ اینڈ کے ہیڈر/فوٹر کو مکمل طور پر بلاک کر دے گا
    <div className="fixed inset-0 z-[9999] flex bg-gray-50 overflow-hidden font-sans">

      {/* Sidebar Section */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-slate-900 text-white flex flex-col h-full shadow-2xl shrink-0">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-black italic uppercase tracking-tighter text-blue-400">
            Maqbool <span className="text-white">CMS</span>
          </h2>
        </div>

        {/* سائیڈ بار کے لنکس اب یہاں سکرول ہوں گے */}
        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-1">
          <SidebarLink href="/admin" icon={<BarChart size={18} />} label="Dashboard" isActive />

          <SidebarSectionLabel label="Content" />
          <SidebarLink href="/admin/posts" icon={<FileText size={18} />} label="Posts" count={stats.totalPosts} loading={loading} />
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
        </nav>

        {/* Logout - سائیڈ بار کے نیچے ہمیشہ فکس رہے گا */}
        <div className="p-4 bg-black/20 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition-all uppercase flex items-center justify-center gap-2 shadow-lg"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Section */}
      <section className="flex-1 h-full overflow-y-auto p-8 custom-scrollbar bg-slate-50">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Area */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
              <p className="text-slate-500 text-sm font-medium">Welcome, {session?.user?.name || 'Maqbool Ahmed'}</p>
            </div>

            <div className="flex gap-3">
              <Link href="/admin/users/add" className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-md">
                <UserPlus size={18} /> New User
              </Link>
              <Link href="/admin/posts/new" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md">
                <PlusCircle size={18} /> New Post
              </Link>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <DashboardCard title="Total Posts" value={stats.totalPosts} loading={loading} icon={<FileText className="text-blue-500" />} color="blue" />
            <DashboardCard title="Categories" value={stats.totalCategories} loading={loading} icon={<Folder className="text-emerald-500" />} color="green" />
            <DashboardCard title="Legal Pages" value={stats.totalLegalPages} loading={loading} icon={<FileCheck className="text-violet-500" />} color="purple" />
            <DashboardCard title="Subscribers" value={stats.totalSubscribers} loading={loading} icon={<List className="text-orange-500" />} color="orange" />
          </div>

          {/* Performance Grid */}
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" /> Ads & Engagement
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10">
            <DashboardCard title="Active Ads" value={stats.activeAds || 0} loading={loading} icon={<Megaphone className="text-blue-600" />} color="blue" />
            <DashboardCard title="Impressions" value={stats.totalImpressions?.toLocaleString() || "0"} loading={loading} icon={<TrendingUp className="text-emerald-600" />} color="green" />
            <DashboardCard title="Total Clicks" value={stats.totalClicks?.toLocaleString() || "0"} loading={loading} icon={<BarChart className="text-violet-600" />} color="purple" />
            <DashboardCard title="Unread Inbox" value={stats.unreadContactMessages || 0} loading={loading} icon={<MessageSquare className="text-rose-500" />} color="orange" />
          </div>

        </div>
      </section>

      {/* Custom Styles for Scrollbar */}
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

// --- Helper Components ---

function SidebarSectionLabel({ label }) {
  return <p className="text-[10px] uppercase font-black text-blue-300 mt-6 mb-2 opacity-40 px-2 tracking-widest">{label}</p>;
}

function SidebarLink({ href, icon, label, count, badge, loading, isActive }) {
  return (
    <Link href={href} className={`flex justify-between items-center px-4 py-3 rounded-xl transition-all ${isActive ? "bg-white/10 shadow-inner border-l-4 border-blue-400" : "hover:bg-white/5 opacity-80 hover:opacity-100"}`}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-semibold">{label}</span>
      </div>
      {!loading && (count !== undefined || (badge !== undefined && badge > 0)) && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${badge ? 'bg-rose-500 animate-pulse text-white' : 'bg-blue-500/20 text-blue-200'}`}>
          {badge || count}
        </span>
      )}
    </Link>
  );
}

function DashboardCard({ title, value, icon, loading, color }) {
  const colorClasses = { 
    blue: "border-blue-500 shadow-blue-50", 
    green: "border-emerald-500 shadow-emerald-50", 
    purple: "border-violet-500 shadow-violet-50", 
    orange: "border-orange-500 shadow-orange-50" 
  };
  
  return (
    <div className={`bg-white rounded-3xl shadow-sm p-6 flex items-center gap-5 border-b-4 ${colorClasses[color]} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
      <div className="p-3 bg-slate-50 rounded-2xl text-slate-700">{icon}</div>
      <div className="overflow-hidden">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{title}</p>
        <p className="text-2xl font-black text-slate-900 leading-none mt-1">
          {loading ? <span className="animate-pulse">...</span> : value}
        </p>
      </div>
    </div>
  );
}