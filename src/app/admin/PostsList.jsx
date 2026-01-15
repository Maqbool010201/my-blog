"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ImageKit public endpoint
const IMAGEKIT_ENDPOINT = "https://ik.imagekit.io/ag0dicbdub";

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  /* ---------------- Fetch Posts ---------------- */
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/posts?admin=true&page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch posts");

      const data = await res.json();
      setPosts(data.posts || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setMessage("Error loading posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  /* ---------------- Update Featured / Published ---------------- */
  const updatePostField = async (post, field, value) => {
    try {
      setMessage("Updating...");
      const res = await fetch(`/api/posts/${post.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });

      if (!res.ok) throw new Error("Update failed");

      setPosts(posts.map(p =>
        p.id === post.id ? { ...p, [field]: value } : p
      ));

      setMessage(`"${post.title}" updated`);
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setMessage("Update failed");
    }
  };

  /* ---------------- Delete Post ---------------- */
  const deletePost = async (post) => {
    if (!confirm(`Delete "${post.title}"?`)) return;

    try {
      const res = await fetch(`/api/posts/${post.slug}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setMessage("Post deleted");
      fetchPosts();
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setMessage("Delete failed");
    }
  };

  /* ---------------- Loading State ---------------- */
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
        Loading posts...
      </div>
    );
  }

  /* ======================= UI ======================= */
  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-xl shadow-sm border">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold">Posts Management</h1>
          <p className="text-sm text-gray-500">Create, edit and manage posts</p>
        </div>

        <Link
          href="/admin/posts/add"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700"
        >
          + Add Post
        </Link>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700 rounded">
          {message}
        </div>
      )}

      {/* Table */}
      {posts.length === 0 ? (
        <div className="p-16 text-center text-gray-400">
          No posts found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {posts.map(post => {
                let imageUrl = "/uploads/placeholder.png";
                if (post.mainImage) {
                  imageUrl = post.mainImage.startsWith("http")
                    ? post.mainImage
                    : `${IMAGEKIT_ENDPOINT}/${post.mainImage}?tr=w-100,h-100,fo-auto`;
                }

                return (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <img
                        src={imageUrl}
                        alt={post.title}
                        className="w-14 h-14 object-cover rounded"
                        onError={e => (e.target.src = "/uploads/placeholder.png")}
                      />
                    </td>

                    <td className="p-4">
                      <p className="font-bold">{post.title}</p>
                      <p className="text-xs text-gray-400">/{post.slug}</p>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() =>
                          updatePostField(post, "published", !post.published)
                        }
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          post.published
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </button>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() =>
                          updatePostField(post, "featured", !post.featured)
                        }
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          post.featured
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {post.featured ? "Featured" : "Normal"}
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/posts/edit/${post.slug}`}
                          className="px-3 py-2 bg-blue-50 text-blue-600 rounded"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deletePost(post)}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-100 rounded disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-2 rounded ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-100 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
