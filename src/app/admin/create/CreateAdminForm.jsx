"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateAdminForm() {
  const router = useRouter();
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMsg(null);

    if (payload.password !== payload.confirmPassword) {
      setMsg("Error: Password and confirm password do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          password: payload.password,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setMsg("First admin created. Redirecting to login...");
        setTimeout(() => router.push("/admin/login"), 1200);
      } else {
        setMsg(`Error: ${data?.error || "unknown error"}`);
      }
    } catch (err) {
      setMsg(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4"
    >
      <h1 className="text-2xl font-semibold text-center">First Admin Setup</h1>
      <p className="text-sm text-gray-500 text-center">
        This page works only once. After first admin creation, setup is locked.
      </p>

      <input
        type="text"
        placeholder="Name"
        value={payload.name}
        onChange={(e) => setPayload((prev) => ({ ...prev, name: e.target.value }))}
        required
        className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <input
        type="email"
        placeholder="Email"
        value={payload.email}
        onChange={(e) => setPayload((prev) => ({ ...prev, email: e.target.value }))}
        required
        className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <input
        type="password"
        placeholder="Password (min 8 chars)"
        value={payload.password}
        onChange={(e) => setPayload((prev) => ({ ...prev, password: e.target.value }))}
        required
        minLength={8}
        className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={payload.confirmPassword}
        onChange={(e) => setPayload((prev) => ({ ...prev, confirmPassword: e.target.value }))}
        required
        minLength={8}
        className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create First Admin"}
      </button>

      <Link href="/admin/login" className="block text-center text-sm text-blue-600 hover:underline">
        Go to login
      </Link>

      {msg && (
        <div
          className={`text-center mt-2 ${
            msg.startsWith("First admin created") ? "text-green-600" : "text-red-600"
          }`}
        >
          {msg}
        </div>
      )}
    </form>
  );
}
