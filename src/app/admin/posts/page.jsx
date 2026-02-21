"use client";

import PostsList from "@/app/admin/PostsList";
import Link from "next/link";

export default function PostsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6 mb-4">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Back to Dashboard
        </Link>
      </div>
      <PostsList />
    </div>
  );
}
