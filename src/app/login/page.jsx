"use client";

import { useEffect, useState } from "react";
import { signIn, useSession, getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

function getRedirectByRole(role) {
  const normalized = String(role || "").toUpperCase();
  if (normalized === "SUPER_ADMIN") return "/admin/login";
  if (normalized === "POSTS_WRITER") return "/admin/posts/add";
  if (normalized === "POSTS_EDITOR") return "/admin/posts";
  if (normalized === "POSTS_MANAGER") return "/admin/posts";
  return "/admin/dashboard";
}

export default function FrontendLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "authenticated") return;
    const target = getRedirectByRole(session?.user?.role);
    router.push(target);
  }, [status, session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
        return;
      }

      const currentSession = await getSession();
      const normalizedRole = String(currentSession?.user?.role || "").toUpperCase();
      if (normalizedRole === "SUPER_ADMIN") {
        await signOut({ redirect: false });
        setError("Super admin must login from /admin/login");
        return;
      }
      const target = getRedirectByRole(currentSession?.user?.role);
      router.push(target);
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl p-8">
        <h1 className="text-2xl font-black text-slate-900 text-center">Team Login</h1>
        <p className="text-sm text-slate-500 text-center mt-2">
          Sign in to access your assigned role panel.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-7">
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-black transition"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {error && <p className="text-red-600 text-center mt-4 text-sm font-semibold">{error}</p>}
      </div>
    </div>
  );
}
