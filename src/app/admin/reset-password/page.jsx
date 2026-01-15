"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(null);

  // Extract token and email from query params
  useEffect(() => {
    const urlToken = searchParams.get("token");
    const urlEmail = searchParams.get("email");

    if (!urlToken || !urlEmail) {
      setError("Invalid reset link. Missing token or email.");
      setTokenValid(false);
      return;
    }

    setToken(decodeURIComponent(urlToken));
    setEmail(decodeURIComponent(urlEmail));

    verifyToken(decodeURIComponent(urlToken), decodeURIComponent(urlEmail));
  }, [searchParams]);

  // Verify token API call
  const verifyToken = async (token, email) => {
    try {
      const res = await fetch("/api/admin/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email }),
      });

      const data = await res.json();

      if (data.valid) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
        setError(data.error || "Invalid or expired reset link");
      }
    } catch (err) {
      setTokenValid(false);
      setError("Failed to verify token. Please try again.");
    }
  };

  // Submit new password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!tokenValid) {
      setError("Reset token is invalid or expired");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Password reset successful! Redirecting to login...");
        setTimeout(() => router.push("/admin/login"), 3000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (err) {
      setError("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verifying reset link...</p>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 mb-2">{error}</p>
        <Link href="/admin/forgot-password" className="text-blue-600 underline">
          Generate new reset token
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Reset Password</h1>

        {message && <p className="text-green-600 text-center">{message}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded-lg"
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded-lg"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
