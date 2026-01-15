"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import slugify from "slugify";
import RichTextEditor from "@/components/RichTextEditor";

// ImageKit public endpoint
const IMAGEKIT_ENDPOINT = "https://ik.imagekit.io/ag0dicbdub";

export default function EditPost() {
  const router = useRouter();
  const { slug } = useParams();

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

  /* ---------------- Load Categories ---------------- */
  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(setCategories)
      .catch(() => setError("Failed to load categories"));
  }, []);

  /* ---------------- Load Post ---------------- */
  useEffect(() => {
    if (!slug) return;

    const loadPost = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}?admin=true`);
        if (!res.ok) throw new Error("Failed to load post");

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

  /* ---------------- Auto Slug + SEO ---------------- */
  useEffect(() => {
    if (!formData.title) return;

    const newSlug = slugify(formData.title, { lower: true, strict: true });
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    setFormData(prev => ({
      ...prev,
      slug: newSlug,
      metaTitle: prev.metaTitle || formData.title,
      ogTitle: prev.ogTitle || formData.title,
      canonical: prev.canonical || `${siteUrl}/blog/${newSlug}`,
      ogDesc: prev.ogDesc || formData.shortDesc,
    }));
  }, [formData.title, formData.shortDesc]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /* ---------------- Image Upload ---------------- */
  const uploadToImageKit = async (file) => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });

    if (!res.ok) throw new Error("Image upload failed");

    const data = await res.json();
    return data.filePath;
  };

  /* ---------------- Save Changes ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let mainImage = existingMainImage;
      let ogImage = existingOgImage;

      if (mainImageFile) {
        mainImage = await uploadToImageKit(mainImageFile);
      }
      if (ogImageFile) {
        ogImage = await uploadToImageKit(ogImageFile);
      }

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
        mainImage,
        ogImage: ogImage || mainImage,
        categoryId: Number(formData.categoryId),
        published: formData.status === "published",
        featured: formData.featured,
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

      // ✅ Redirect immediately after save
      router.replace("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading post...</div>;
  }

  /* ============================ UI ============================ */
  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">Edit Blog Post</h1>
        <Link href="/admin/posts" className="bg-gray-200 px-4 py-2 rounded-lg">
          ← Back
        </Link>
      </div>

      {error && <div className="bg-red-500 text-white p-4 mb-6 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <label className="font-bold">Title</label>
            <input
              value={formData.title}
              onChange={e => handleChange("title", e.target.value)}
              className="w-full p-3 border rounded mt-1"
              required
            />

            <label className="font-bold mt-4 block">Short Description</label>
            <textarea
              value={formData.shortDesc}
              onChange={e => handleChange("shortDesc", e.target.value)}
              className="w-full p-3 border rounded mt-1"
            />

            <label className="font-bold mt-4 block">Content</label>
            <RichTextEditor
              value={formData.content}
              onChange={val => handleChange("content", val)}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <label className="font-bold">Category</label>
            <select
              value={formData.categoryId}
              onChange={e => handleChange("categoryId", e.target.value)}
              className="w-full p-3 border rounded mt-1"
              required
            >
              <option value="">Select</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <label className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={e => handleChange("featured", e.target.checked)}
              />
              Featured
            </label>

            <button
              disabled={saving}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-bold disabled:bg-gray-400"
            >
              {saving ? "Updating..." : "Update Post"}
            </button>
          </div>

          {/* IMAGES */}
          <div className="bg-white p-6 rounded-xl shadow">
            {existingMainImage && (
              <>
                <p className="font-semibold text-sm mb-1">Current Main Image</p>
                <img
                  src={`${IMAGEKIT_ENDPOINT}/${existingMainImage}?tr=w-400,h-250,fo-auto`}
                  className="rounded-lg border mb-4"
                  alt="Main"
                />
              </>
            )}

            <label className="font-semibold text-sm">Replace Main Image</label>
            <input type="file" onChange={e => setMainImageFile(e.target.files[0])} />

            {existingOgImage && (
              <>
                <p className="font-semibold text-sm mt-4 mb-1">Current OG Image</p>
                <img
                  src={`${IMAGEKIT_ENDPOINT}/${existingOgImage}?tr=w-400,h-250,fo-auto`}
                  className="rounded-lg border mb-4"
                  alt="OG"
                />
              </>
            )}

            <label className="font-semibold text-sm">Replace OG Image</label>
            <input type="file" onChange={e => setOgImageFile(e.target.files[0])} />
          </div>
        </div>
      </form>
    </div>
  );
}
