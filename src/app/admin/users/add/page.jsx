"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function AddUser() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "CLIENT", siteId: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/users");
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link href="/admin/users" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition">
        <ArrowLeft size={18} /> Back to Users
      </Link>
      
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
        <h2 className="text-2xl font-black mb-6">Create New Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-2">Full Name</label>
            <input required className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-blue-500 outline-none" type="text" placeholder="John Doe" 
              onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-2">Email Address</label>
            <input required className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-blue-500 outline-none" type="email" placeholder="john@example.com" 
              onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-2">Password</label>
            <input required className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-blue-500 outline-none" type="password" placeholder="••••••••" 
              onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Role</label>
              <select className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-blue-500 outline-none" 
                onChange={e => setForm({...form, role: e.target.value})}>
                <option value="CLIENT">Client Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Site ID</label>
              <input className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-blue-500 outline-none" type="text" placeholder="e.g. site-001" 
                onChange={e => setForm({...form, siteId: e.target.value})} />
            </div>
          </div>
          <button disabled={loading} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl mt-4 hover:bg-blue-700 transition flex items-center justify-center gap-2">
            {loading ? "Creating..." : <><Save size={20} /> Save Admin Account</>}
          </button>
        </form>
      </div>
    </div>
  );
}