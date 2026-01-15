// app/admin/forgot-password/page.js
"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setGeneratedToken("");
    setResetLink("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setMessage(data.message);
        setGeneratedToken(data.token || "");
        setResetLink(data.resetLink || "");
      }
    } catch (err) {
      console.error(err);
      setError("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Generate a reset token for development
        </p>

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-center text-sm">{message}</p>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-center text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Admin Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Reset Token"
            )}
          </button>
        </form>

        {/* Token Display Section */}
        {generatedToken && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">🔑 Generated Token</h3>
            
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">Token:</label>
              <div className="flex items-center">
                <code className="flex-1 bg-gray-800 text-gray-100 p-2 rounded text-sm font-mono break-all">
                  {generatedToken}
                </code>
                <button
                  onClick={() => copyToClipboard(generatedToken)}
                  className="ml-2 px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">Reset Link:</label>
              <div className="flex items-center">
                <code className="flex-1 bg-blue-50 text-blue-700 p-2 rounded text-sm break-all">
                  {resetLink}
                </code>
                <button
                  onClick={() => copyToClipboard(resetLink)}
                  className="ml-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-500"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-300">
              <p className="text-sm text-gray-600 mb-2">Next Steps:</p>
              <ol className="text-sm text-gray-700 list-decimal pl-5 space-y-1">
                <li>Copy the token or click the reset link</li>
                <li>Go to reset password page</li>
                <li>Enter new password and submit</li>
              </ol>
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Remember password?{" "}
            <Link href="/admin/login" className="text-blue-600 hover:text-blue-800 underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}