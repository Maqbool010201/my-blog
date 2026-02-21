"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Pencil, PenTool, ShieldCheck } from "lucide-react";
import Link from "next/link";

const ROLE_OPTIONS = [
  {
    value: "POSTS_MANAGER",
    label: "Posts Manager",
    description: "Full posts CRUD, including publish and delete.",
    icon: ShieldCheck,
    theme: "from-emerald-500 to-teal-500",
  },
  {
    value: "POSTS_EDITOR",
    label: "Posts Editor",
    description: "Edit existing posts only.",
    icon: Pencil,
    theme: "from-amber-500 to-orange-500",
  },
  {
    value: "POSTS_WRITER",
    label: "Posts Writer",
    description: "Create new posts only (saved as draft).",
    icon: PenTool,
    theme: "from-sky-500 to-blue-600",
  },
  {
    value: "SUPER_ADMIN",
    label: "Super Admin",
    description: "Full admin control across all modules.",
    icon: ShieldCheck,
    theme: "from-fuchsia-500 to-purple-600",
  },
];

export default function AddUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "POSTS_MANAGER",
  });
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
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition"
      >
        <ArrowLeft size={18} /> Back to Users
      </Link>

      <div className="rounded-3xl border border-slate-200 shadow-xl bg-white overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">Create Admin User</h2>
          <p className="text-slate-300 mt-2 text-sm">
            Assign a role based on exactly what this person should do in posts management.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">
                Full Name
              </label>
              <input
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 ring-blue-500 outline-none"
                type="text"
                placeholder="John Doe"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">
                Email Address
              </label>
              <input
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 ring-blue-500 outline-none"
                type="email"
                placeholder="john@example.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Password</label>
            <input
              required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 ring-blue-500 outline-none"
              type="password"
              placeholder="********"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-3">Role</label>
            <div className="grid md:grid-cols-2 gap-3">
              {ROLE_OPTIONS.map((role) => {
                const Icon = role.icon;
                const selected = form.role === role.value;
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: role.value })}
                    className={`text-left rounded-2xl border p-4 transition ${
                      selected
                        ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${role.theme} text-white flex items-center justify-center`}
                      >
                        <Icon size={16} />
                      </span>
                      <span className="font-black text-sm">{role.label}</span>
                    </div>
                    <p className={`text-xs ${selected ? "text-slate-300" : "text-slate-500"}`}>
                      {role.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl mt-2 hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            {loading ? "Creating..." : <><Save size={20} /> Save Admin Account</>}
          </button>
        </form>
      </div>
    </div>
  );
}
