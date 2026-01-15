"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { makeSlug } from "@/lib/utils";
import Link from "next/link";

export default function AddCategory() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleNameChange(e) {
    const newName = e.target.value;
    setName(newName);
    
    // Only auto-generate slug if slug is empty or matches the current name
    if (!slug || slug === makeSlug(name)) {
      setSlug(makeSlug(newName));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setErrorMessage("Category name is required");
      return;
    }
    
    if (!slug.trim()) {
      setErrorMessage("Slug is required");
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = { 
        name: name.trim(), 
        slug: slug.trim(), 
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim()
      };

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccessMessage("✅ Category created successfully!");
        
        // Clear form
        setName("");
        setSlug("");
        setMetaTitle("");
        setMetaDescription("");
        
        // Redirect to categories list after 2 seconds
        setTimeout(() => {
          router.push("/admin/categories");
        }, 2000);
      } else {
        setErrorMessage(`Error: ${result.error || "Failed to create category"}`);
      }
    } catch (error) {
      console.error("Error creating category:", error);
      setErrorMessage("Error creating category. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/categories">
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition flex items-center gap-2">
              ← Back to Categories
            </button>
          </Link>
          <h1 className="text-2xl font-bold">Add New Category</h1>
        </div>
        <Link href="/admin/categories">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            View All Categories
          </button>
        </Link>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {errorMessage}
          <button 
            onClick={() => setErrorMessage("")}
            className="ml-2 underline hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Add Category Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">Create New Category</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Category Name *
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={handleNameChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter category name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Slug *
              </label>
              <input
                required
                type="text"
                value={slug}
                onChange={e => setSlug(makeSlug(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="category-slug"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL-friendly version of the name
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={e => setMetaTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Meta title for SEO (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Meta Description
              </label>
              <textarea
                value={metaDescription}
                onChange={e => setMetaDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Meta description for SEO (optional)"
                rows="3"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit"
              disabled={loading || !name.trim() || !slug.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                "➕ Create Category"
              )}
            </button>

            <button 
              type="button"
              onClick={() => {
                setName("");
                setSlug("");
                setMetaTitle("");
                setMetaDescription("");
                setErrorMessage("");
              }}
              className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Clear Form
            </button>

            <Link href="/admin/categories">
              <button
                type="button"
                className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/admin">
          <button className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
            🏠 Admin Dashboard
          </button>
        </Link>
        <Link href="/admin/posts/add">
          <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
            📝 Add New Post
          </button>
        </Link>
      </div>
    </div>
  );
}