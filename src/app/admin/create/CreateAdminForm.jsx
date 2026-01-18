"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CreateAdminForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [payload, setPayload] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
  });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Set isClient to true on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle authentication and authorization
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.role !== "SUPER_ADMIN") {
      router.push("/admin/login");
    } else {
      setIsAuthorized(true);
    }
  }, [session, status, router]);

  // Submit handler
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => {
        setMsg("Server returned non-JSON response");
        return null;
      });

      if (res.ok && data?.admin) {
        setMsg("Created: " + data.admin.email);
        setPayload({ name: "", email: "", password: "", role: "ADMIN" });
      } else {
        setMsg("Error: " + (data?.error || "unknown"));
      }
    } catch (err) {
      setMsg("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // Don't render anything on server to prevent mismatch
  if (!isClient) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4">
        {/* Empty form skeleton for server render */}
        <h1 className="text-2xl font-semibold text-center">Create Admin</h1>
        <div className="space-y-4">
          <div className="w-full border px-4 py-2 rounded-lg h-10 bg-gray-100"></div>
          <div className="w-full border px-4 py-2 rounded-lg h-10 bg-gray-100"></div>
          <div className="w-full border px-4 py-2 rounded-lg h-10 bg-gray-100"></div>
          <div className="w-full border px-4 py-2 rounded-lg h-10 bg-gray-100"></div>
          <div className="w-full bg-gray-200 text-white py-2 rounded-lg font-semibold h-10"></div>
        </div>
      </div>
    );
  }

  // Show loading state only on client
  if (status === "loading") {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center py-8">Checking authentication...</div>
      </div>
    );
  }

  // Don't show form if not authorized
  if (!isAuthorized) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center py-8">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4"
    >
      <h1 className="text-2xl font-semibold text-center">Create Admin</h1>

      <input
        type="text"
        placeholder="Name"
        value={payload.name}
        onChange={(e) =>
          setPayload((prev) => ({ ...prev, name: e.target.value }))
        }
        required
        className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <input
        type="email"
        placeholder="Email"
        value={payload.email}
        onChange={(e) =>
          setPayload((prev) => ({ ...prev, email: e.target.value }))
        }
        required
        className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <input
        type="password"
        placeholder="Password"
        value={payload.password}
        onChange={(e) =>
          setPayload((prev) => ({ ...prev, password: e.target.value }))
        }
        required
        className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <select
        value={payload.role}
        onChange={(e) =>
          setPayload((prev) => ({ ...prev, role: e.target.value }))
        }
        className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="ADMIN">ADMIN</option>
        <option value="EDITOR">EDITOR</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Admin"}
      </button>

      {msg && (
        <div
          className={`text-center mt-2 ${
            msg.startsWith("Created") ? "text-green-600" : "text-red-600"
          }`}
        >
          {msg}
        </div>
      )}
    </form>
  );
}