"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Shield, User, Globe } from "lucide-react";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 bg-white min-h-screen rounded-3xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Admins</h1>
          <p className="text-gray-500 font-medium">Manage all platform administrators and clients</p>
        </div>
        <Link href="/admin/users/add" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-100">
          <Plus size={20} /> Add New Admin
        </Link>
      </div>

      <div className="overflow-hidden border border-gray-100 rounded-3xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Administrator</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Permission Role</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Assigned Site ID</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="4" className="p-10 text-center animate-pulse text-gray-400 font-bold">Fetching secure data...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="4" className="p-10 text-center text-gray-400">No administrators found.</td></tr>
            ) : users.map((user) => (
              <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-black shadow-md">
                      {user.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase ${user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role === 'SUPER_ADMIN' ? <Shield size={12} /> : <User size={12} />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm font-mono text-gray-600">
                    <Globe size={14} className="text-gray-300" />
                    {user.siteId || <span className="text-gray-300">All Sites</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}