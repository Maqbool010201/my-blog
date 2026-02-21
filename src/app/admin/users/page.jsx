"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Plus,
  Shield,
  User,
  Globe,
  PenTool,
  Pencil,
  ShieldCheck,
  ArrowLeft,
  Save,
  Trash2,
} from "lucide-react";

const ROLE_META = {
  SUPER_ADMIN: {
    label: "Super Admin",
    icon: Shield,
    styles: "bg-fuchsia-100 text-fuchsia-700",
  },
  POSTS_MANAGER: {
    label: "Posts Manager",
    icon: ShieldCheck,
    styles: "bg-emerald-100 text-emerald-700",
  },
  POSTS_EDITOR: {
    label: "Posts Editor",
    icon: Pencil,
    styles: "bg-amber-100 text-amber-700",
  },
  POSTS_WRITER: {
    label: "Posts Writer",
    icon: PenTool,
    styles: "bg-blue-100 text-blue-700",
  },
};

export default function UsersList() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [roleDrafts, setRoleDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch users");
      const list = Array.isArray(data) ? data : [];
      setUsers(list);
      setRoleDrafts(
        list.reduce((acc, user) => {
          acc[user.id] = user.role;
          return acc;
        }, {})
      );
    } catch (err) {
      setMessage(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const saveRole = async (user) => {
    try {
      setUpdatingId(user.id);
      setMessage("");
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, role: roleDrafts[user.id] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update role");
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: data.user?.role || roleDrafts[user.id] } : u))
      );
      setMessage(`Updated role for ${user.name}`);
    } catch (err) {
      setMessage(err.message || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUser = async (user) => {
    if (!confirm(`Delete user "${user.name}"?`)) return;
    try {
      setDeletingId(user.id);
      setMessage("");
      const res = await fetch(`/api/admin/users?id=${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete user");
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setMessage(`Deleted ${user.name}`);
    } catch (err) {
      setMessage(err.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-8">
          <div className="p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Manage Team Access</h1>
                <p className="text-slate-300 text-sm mt-2">
                  Single-tenant admin users with assignable post roles.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admin/dashboard"
                  className="bg-slate-700 text-white px-6 py-3 rounded-2xl font-black inline-flex items-center gap-2 hover:bg-slate-600 transition"
                >
                  <ArrowLeft size={18} /> Back to Dashboard
                </Link>
                <Link
                  href="/admin/users/add"
                  className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black inline-flex items-center gap-2 hover:bg-slate-100 transition"
                >
                  <Plus size={20} /> Add User
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-hidden border border-slate-200 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Administrator
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Permission Role
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Site
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="p-10 text-center animate-pulse text-slate-400 font-bold">
                        Fetching team members...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-slate-400">
                        No administrators found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => {
                      const roleInfo = ROLE_META[user.role] || {
                        label: user.role || "Unknown",
                        icon: User,
                        styles: "bg-slate-100 text-slate-700",
                      };
                      const Icon = roleInfo.icon;

                      return (
                        <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-md">
                                {user.name?.[0] || "U"}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{user.name}</div>
                                <div className="text-xs text-slate-400">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase ${roleInfo.styles}`}
                            >
                              <Icon size={12} />
                              {roleInfo.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm font-mono text-slate-600">
                              <Globe size={14} className="text-slate-300" />
                              {user.siteId || <span className="text-slate-300">Default Site</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end items-center gap-2">
                              <select
                                value={roleDrafts[user.id] || user.role}
                                onChange={(e) =>
                                  setRoleDrafts((prev) => ({ ...prev, [user.id]: e.target.value }))
                                }
                                className="border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                              >
                                <option value="POSTS_MANAGER">Posts Manager</option>
                                <option value="POSTS_EDITOR">Posts Editor</option>
                                <option value="POSTS_WRITER">Posts Writer</option>
                                <option value="SUPER_ADMIN">Super Admin</option>
                              </select>
                              <button
                                onClick={() => saveRole(user)}
                                disabled={
                                  updatingId === user.id ||
                                  deletingId === user.id ||
                                  roleDrafts[user.id] === user.role ||
                                  Number(session?.user?.id) === Number(user.id)
                                }
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-black disabled:opacity-50"
                              >
                                <Save size={12} />
                                {updatingId === user.id ? "Saving" : "Edit"}
                              </button>
                              <button
                                onClick={() => deleteUser(user)}
                                disabled={deletingId === user.id || Number(session?.user?.id) === Number(user.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-black disabled:opacity-50"
                              >
                                <Trash2 size={12} />
                                {deletingId === user.id ? "Deleting" : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {message && (
            <div className="px-6 pb-6 text-sm font-semibold text-slate-700">{message}</div>
          )}
        </div>
      </div>
    </div>
  );
}
