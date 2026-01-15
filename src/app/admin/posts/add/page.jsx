"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import slugify from "slugify";
import RichTextEditor from "@/components/RichTextEditor";

export default function AddPost() {
  const router = useRouter();

  // 1. تمام فیلڈز کے لیے اسٹیٹ (State)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDesc: "",
    content: "",
    metaTitle: "",
    metaDesc: "",
    ogTitle: "",
    ogDesc: "",
    canonical: "",
    categoryId: "",
    status: "published",
    featured: false,
  });

  const [categories, setCategories] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [ogImageFile, setOgImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* ---------------- Categories لوڈ کرنا ---------------- */
  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(setCategories)
      .catch(() => setError("Failed to load categories"));
  }, []);

  /* -------- خود بخود سلگ اور ایس ای او ڈیٹا بنانا -------- */
  useEffect(() => {
    if (!formData.title) return;

    const slug = slugify(formData.title, { lower: true, strict: true });
    // یہاں اپنی ویب سائٹ کا اصلی لنک لکھیں
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; 

    setFormData(prev => ({
      ...prev,
      slug,
      metaTitle: prev.metaTitle || formData.title,
      ogTitle: prev.ogTitle || formData.title,
      canonical: prev.canonical || `${siteUrl}/blog/${slug}`,
      ogDesc: prev.ogDesc || formData.shortDesc,
    }));
  }, [formData.title, formData.shortDesc]);

  /* ---------------- ہینڈلرز ---------------- */
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // تصویر کو ImageKit پر اپلوڈ کرنے والا فنکشن
  const uploadToImageKit = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    
    const res = await fetch("/api/upload", { 
      method: "POST", 
      body: fd 
    });

    if (!res.ok) throw new Error("Image upload failed");
    
    const data = await res.json();
    return data.filePath; // یہ 'uploads/filename.jpg' واپس کرے گا
  };

  /* ---------------- فارم سبمٹ کرنا ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let mainImagePath = null;
      let ogImagePath = null;

      // اگر تصویر سلیکٹ کی گئی ہے تو اسے اپلوڈ کریں
      if (mainImageFile) {
        mainImagePath = await uploadToImageKit(mainImageFile);
      }
      if (ogImageFile) {
        ogImagePath = await uploadToImageKit(ogImageFile);
      }

      // ڈیٹا بیس کے لیے پے لوڈ تیار کریں
      const payload = {
        title: formData.title,
        slug: formData.slug,
        shortDesc: formData.shortDesc,
        content: formData.content,
        metaTitle: formData.metaTitle,
        metaDesc: formData.metaDesc,
        ogTitle: formData.ogTitle,
        ogDesc: formData.ogDesc,
        canonical: formData.canonical,
        mainImage: mainImagePath, // ImageKit پاتھ
        ogImage: ogImagePath || mainImagePath,
        categoryId: Number(formData.categoryId),
        published: formData.status === "published",
        featured: formData.featured,
      };

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create post");
      }

      setSuccess("Post created successfully! Redirecting...");
      setTimeout(() => router.push("/admin/posts"), 1500);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">Add New Blog Post</h1>
        <Link href="/admin/posts" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition">
          ← Back to List
        </Link>
      </div>

      {success && <div className="bg-green-500 text-white p-4 mb-6 rounded-lg shadow-md animate-pulse">{success}</div>}
      {error && <div className="bg-red-500 text-white p-4 mb-6 rounded-lg shadow-md">{error}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area (Left) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Post Title *</label>
                <input required type="text" value={formData.title} onChange={e => handleChange("title", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter a catchy title" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (URL) *</label>
                <input required type="text" value={formData.slug} onChange={e => handleChange("slug", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Short Description</label>
                <textarea value={formData.shortDesc} onChange={e => handleChange("shortDesc", e.target.value)} rows={3} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Briefly explain what this post is about..." />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Content *</label>
                <RichTextEditor value={formData.content} onChange={val => handleChange("content", val)} />
              </div>
            </div>
          </div>

          {/* SEO Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Search Engine Optimization (SEO)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Title</label>
                <input type="text" value={formData.metaTitle} onChange={e => handleChange("metaTitle", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Canonical URL</label>
                <input type="url" value={formData.canonical} onChange={e => handleChange("canonical", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Description</label>
                <textarea value={formData.metaDesc} onChange={e => handleChange("metaDesc", e.target.value)} rows={2} className="w-full p-3 border border-gray-300 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="space-y-6">
          {/* Publish Box */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Publish Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                <select required value={formData.categoryId} onChange={e => handleChange("categoryId", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg outline-none">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select value={formData.status} onChange={e => handleChange("status", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.featured} onChange={e => handleChange("featured", e.target.checked)} className="w-5 h-5 text-blue-600 rounded" />
                <span className="font-semibold text-gray-700">Mark as Featured</span>
              </label>
              <button disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400">
                {loading ? "Uploading & Saving..." : "Publish Post"}
              </button>
            </div>
          </div>

          {/* Media Box */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Featured Image</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Main Image *</label>
                <input type="file" accept="image/*" required onChange={e => setMainImageFile(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {mainImageFile && <p className="mt-2 text-xs text-green-600">Selected: {mainImageFile.name}</p>}
              </div>
              <div className="pt-4 border-t">
                <label className="block text-sm font-semibold text-gray-700 mb-1">OG Image (Social Share)</label>
                <input type="file" accept="image/*" onChange={e => setOgImageFile(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}