"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/RichTextEditor";

// ImageKit public endpoint
const IMAGEKIT_ENDPOINT = "https://ik.imagekit.io/ag0dicbdub";

export default function EditPost() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug; // ڈائینامک سلگ حاصل کرنا

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
  const [existingMainImage, setExistingMainImage] = useState(null);
  const [existingOgImage, setExistingOgImage] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [ogImageFile, setOgImageFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- 1. Load Categories ---------------- */
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setError("Failed to load categories"));
  }, []);

  /* ---------------- 2. Load Post Data ---------------- */
  useEffect(() => {
    if (!slug) return;

    const loadPost = async () => {
      try {
        setLoading(true);
        // ہم یہاں siteId=wisemix بھیج رہے ہیں تاکہ API اسے پہچان لے
        const res = await fetch(`/api/posts/${slug}?admin=true&siteId=wisemix`);
        
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to load post");
        }

        const post = await res.json();

        setFormData({
          title: post.title || "",
          slug: post.slug || "",
          shortDesc: post.shortDesc || "",
          content: post.content || "",
          metaTitle: post.metaTitle || "",
          metaDesc: post.metaDesc || "",
          ogTitle: post.ogTitle || "",
          ogDesc: post.ogDesc || "",
          canonical: post.canonical || "",
          categoryId: post.categoryId?.toString() || "",
          status: post.published ? "published" : "draft",
          featured: post.featured || false,
        });

        setExistingMainImage(post.mainImage || null);
        setExistingOgImage(post.ogImage || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  /* ---------------- 3. Handlers ---------------- */
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const uploadToImageKit = async (file) => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });

    if (!res.ok) throw new Error("Image upload failed");

    const data = await res.json();
    return data.url; // ہم مکمل URL ڈیٹا بیس میں سیو کریں گے
  };

  /* ---------------- 4. Save Changes ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let mainImage = existingMainImage;
      let ogImage = existingOgImage;

      // اگر نئی فائل سلیکٹ کی ہے تو اپلوڈ کریں
      if (mainImageFile) {
        mainImage = await uploadToImageKit(mainImageFile);
      }
      if (ogImageFile) {
        ogImage = await uploadToImageKit(ogImageFile);
      }

      const payload = {
        ...formData,
        mainImage,
        ogImage: ogImage || mainImage,
        categoryId: Number(formData.categoryId),
        published: formData.status === "published",
      };

      const res = await fetch(`/api/posts/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update post");
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading post data...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">Edit Blog Post</h1>
        <Link href="/admin/posts" className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
          ← Back
        </Link>
      </div>

      {error && <div className="bg-red-500 text-white p-4 mb-6 rounded-lg shadow-md">{error}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Post Title</label>
                <input required type="text" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (URL) - Don't change unless necessary</label>
                <input type="text" value={formData.slug} readOnly className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Short Description</label>
                <textarea value={formData.shortDesc} onChange={(e) => handleChange("shortDesc", e.target.value)} rows={3} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
                <RichTextEditor value={formData.content} onChange={(val) => handleChange("content", val)} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Publish Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <select required value={formData.categoryId} onChange={(e) => handleChange("categoryId", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg">
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select value={formData.status} onChange={(e) => handleChange("status", e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.featured} onChange={(e) => handleChange("featured", e.target.checked)} className="w-5 h-5 rounded" />
                <span className="font-semibold text-gray-700">Featured Post</span>
              </label>

              <button disabled={saving} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400">
                {saving ? "Saving Changes..." : "Update Post"}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Media</h2>
            <div className="space-y-4">
              {existingMainImage && (
                <div>
                  <p className="text-xs font-bold text-gray-500 mb-1">Current Image:</p>
                  <img src={existingMainImage.startsWith('http') ? existingMainImage : `${IMAGEKIT_ENDPOINT}${existingMainImage}`} className="w-full h-32 object-cover rounded-lg border mb-2" alt="Current" />
                </div>
              )}
              <label className="block text-sm font-semibold text-gray-700">Change Main Image</label>
              <input type="file" accept="image/*" onChange={(e) => setMainImageFile(e.target.files[0])} className="text-xs" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}