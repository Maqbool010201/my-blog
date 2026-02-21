"use client";
import { useState } from "react";

export default function SidebarClient({ siteId }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email, siteId }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("Welcome! You're subscribed. 🚀");
        setEmail("");
      } else {
        throw new Error(data.error || "Failed to subscribe");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg">
      <h3 className="text-xl font-bold mb-2">Join WiseMix</h3>
      <p className="text-blue-100 text-sm mb-4">Get AI & Next.js tips from my Saudi farm office.</p>

      {status === "success" ? (
        <div className="bg-white/20 p-3 rounded-xl text-center font-bold">{message}</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-xl text-gray-900 text-sm outline-none"
          />
          <button
            disabled={status === "loading"}
            className="w-full bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
          >
            {status === "loading" ? "Processing..." : "Subscribe Now"}
          </button>
        </form>
      )}
    </div>
  );
}
