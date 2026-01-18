"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateAdminForm() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    password: "",
    role: "SUPER_ADMIN",
  });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

      const data = await res.json();

      if (res.ok) {
        setMsg("کامیابی! ایڈمن اکاؤنٹ بن گیا ہے۔ اب آپ لاگ ان کر سکتے ہیں۔");
        setPayload({ name: "", email: "", password: "", role: "SUPER_ADMIN" });
        // 5 سیکنڈ بعد لاگ ان پیج پر بھیج دیں
        setTimeout(() => router.push("/admin/login"), 5000);
      } else {
        setMsg("ایرر: " + (data?.error || "کچھ غلط ہو گیا"));
      }
    } catch (err) {
      setMsg("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!isClient) return null;

  return (
    <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4">
      <h1 className="text-2xl font-semibold text-center text-gray-800">پہلا ایڈمن بنائیں</h1>
      
      <input
        type="text"
        placeholder="نام"
        value={payload.name}
        onChange={(e) => setPayload({ ...payload, name: e.target.value })}
        required
        className="w-full border p-2 rounded text-gray-700"
      />

      <input
        type="email"
        placeholder="ای میل"
        value={payload.email}
        onChange={(e) => setPayload({ ...payload, email: e.target.value })}
        required
        className="w-full border p-2 rounded text-gray-700"
      />

      <input
        type="password"
        placeholder="پاسورڈ"
        value={payload.password}
        onChange={(e) => setPayload({ ...payload, password: e.target.value })}
        required
        className="w-full border p-2 rounded text-gray-700"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold disabled:opacity-50"
      >
        {loading ? "بن رہا ہے..." : "ایڈمن اکاؤنٹ رجسٹر کریں"}
      </button>

      {msg && (
        <div className={`text-center p-2 rounded ${msg.includes("کامیابی") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {msg}
        </div>
      )}
    </form>
  );
}