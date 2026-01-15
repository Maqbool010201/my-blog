"use client";
import { useState } from "react";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  async function handle(e) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/admin/request-reset", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) setStatus("ok");
    else setStatus("error");
  }

  return (
    <div style={{ maxWidth: 480, margin: "4rem auto" }}>
      <h2>Forgot password</h2>
      <form onSubmit={handle}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <button type="submit">Send reset link</button>
      </form>

      {status === "ok" && <p>Check your email for reset instructions (we won’t tell if this email exists).</p>}
      {status === "error" && <p style={{color: "red"}}>Something went wrong</p>}
    </div>
  );
}
