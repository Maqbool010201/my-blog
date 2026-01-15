"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FeaturedPostsAdmin() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingPostId, setUpdatingPostId] = useState(null);

  // Fetch featured posts
  const loadFeaturedPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts/featured");
      if (!res.ok) throw new Error("Failed to fetch featured posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedPosts();
  }, []);

  // Toggle featured status
  const toggleFeatured = async (post) => {
    setUpdatingPostId(post.id);
    try {
      const res = await fetch(`/api/posts/${post.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !post.featured }),
      });
      if (!res.ok) throw new Error("Failed to update featured status");

      // Refetch featured posts after update
      await loadFeaturedPosts();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingPostId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition w-full md:w-auto">
              ← Dashboard
            </button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Posts</h1>
        </div>
        <Link href="/admin/posts">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full md:w-auto">
            View All Posts
          </button>
        </Link>
      </div>

      {/* No posts */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-semibold mb-2">No Featured Posts Yet</h3>
          <p className="text-gray-600 mb-4">Mark some posts as featured to see them here.</p>
          <Link href="/admin/posts">
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              Manage Posts
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-semibold text-lg">{post.title}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {post.category?.name} • {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-sm ${post.featured ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                  {post.featured ? "Featured" : "Normal"}
                </span>
                <button
                  onClick={() => toggleFeatured(post)}
                  disabled={updatingPostId === post.id}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                >
                  {updatingPostId === post.id ? "Updating..." : post.featured ? "Remove" : "Make Featured"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
