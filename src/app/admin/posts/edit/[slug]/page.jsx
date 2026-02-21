"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import RichTextEditor from "@/components/RichTextEditor";
import { resolveImageUrl } from "@/lib/resolveImageUrl";
import { DEFAULT_SITE_ID } from "@/lib/site";
import { compressToWebp } from "@/lib/compressToWebp";
import { getAdminPermissions, POST_EDITING_POLICIES } from "@/lib/adminPermissions";

export default function EditPost() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const perms = getAdminPermissions(session?.user?.role);
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
    editingPolicy: POST_EDITING_POLICIES.OWNER_ONLY,
  });

  const [categories, setCategories] = useState([]);
  const [existingMainImage, setExistingMainImage] = useState(null);
  const [existingOgImage, setExistingOgImage] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [ogImageFile, setOgImageFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const canPublishPost = Boolean(perms.canPublishPost);
  const isSuperAdmin = perms.role === "SUPER_ADMIN";
  const isContentOnlyEdit =
    !canPublishPost && formData.editingPolicy === POST_EDITING_POLICIES.SUPER_ADMIN_CONTENT_ONLY;

  /* ---------------- 1. Load Categories ---------------- */
  useEffect(() => {
    fetch("/api/categories")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load categories");
        return data;
      })
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Failed to load categories"));
  }, []);

  /* ---------------- 2. Load Post Data ---------------- */
  useEffect(() => {
    if (!slug) return;
    if (status === "loading") return;
    if (status !== "authenticated") {
      setError("Please login to edit posts.");
      setLoading(false);
      router.push("/admin/login");
      return;
    }

    const loadPost = async () => {
      try {
        setLoading(true);
        // ہم یہاں siteId=wisemix بھیج رہے ہیں تاکہ API اسے پہچان لے
        const res = await fetch(`/api/posts/${slug}?admin=true&siteId=${DEFAULT_SITE_ID}`, {
          credentials: "include",
        });
        
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
          editingPolicy: post.editingPolicy || POST_EDITING_POLICIES.OWNER_ONLY,
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
  }, [slug, status]);

  /* ---------------- 3. Handlers ---------------- */
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const uploadToImageKit = async (file) => {
    const webpFile = await compressToWebp(file);
    const fd = new FormData();
    fd.append("file", webpFile);

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
      if (!isContentOnlyEdit && mainImageFile) {
        mainImage = await uploadToImageKit(mainImageFile);
      }
      if (!isContentOnlyEdit && ogImageFile) {
        ogImage = await uploadToImageKit(ogImageFile);
      }

      const payload = isContentOnlyEdit
        ? {
            content: formData.content,
          }
        : {
            title: formData.title,
            slug: formData.slug,
            shortDesc: formData.shortDesc,
            content: formData.content,
            metaTitle: formData.metaTitle,
            metaDesc: formData.metaDesc,
            categoryId: Number(formData.categoryId),
            mainImage,
            ogImage: ogImage || mainImage,
          };

      if (canPublishPost) {
        payload.published = formData.status === "published";
        payload.featured = Boolean(formData.featured);
      }

      if (isSuperAdmin) {
        payload.editingPolicy = formData.editingPolicy;
      }

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
                <input required type="text" value={formData.title} disabled={isContentOnlyEdit} onChange={(e) => handleChange("title", e.target.value)} className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${isContentOnlyEdit ? "bg-gray-100 cursor-not-allowed" : ""}`} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (URL) - Don't change unless necessary</label>
                <input type="text" value={formData.slug} readOnly className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Short Description</label>
                <textarea value={formData.shortDesc} disabled={isContentOnlyEdit} onChange={(e) => handleChange("shortDesc", e.target.value)} rows={3} className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${isContentOnlyEdit ? "bg-gray-100 cursor-not-allowed" : ""}`} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
                <RichTextEditor value={formData.content} onChange={(val) => handleChange("content", val)} />
              </div>
              {isContentOnlyEdit && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  This post is shared by Super Admin in content-only mode. You can update content only.
                </div>
              )}
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
                <select required disabled={isContentOnlyEdit} value={formData.categoryId} onChange={(e) => handleChange("categoryId", e.target.value)} className={`w-full p-3 border border-gray-300 rounded-lg ${isContentOnlyEdit ? "bg-gray-100 cursor-not-allowed" : ""}`}>
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {canPublishPost ? (
                <>
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
                </>
              ) : (
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                  Status and featured controls are managed by publishing roles.
                </div>
              )}

              {isSuperAdmin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Editor Access Policy</label>
                  <select
                    value={formData.editingPolicy}
                    onChange={(e) => handleChange("editingPolicy", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value={POST_EDITING_POLICIES.OWNER_ONLY}>Owner Only</option>
                    <option value={POST_EDITING_POLICIES.SUPER_ADMIN_CONTENT_ONLY}>Allow Editors: Content Only</option>
                  </select>
                </div>
              )}

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
                  <img src={resolveImageUrl(existingMainImage)} className="w-full h-32 object-cover rounded-lg border mb-2" alt="Current" />
                </div>
              )}
              <label className="block text-sm font-semibold text-gray-700">Change Main Image</label>
              <input type="file" disabled={isContentOnlyEdit} accept="image/*" onChange={(e) => setMainImageFile(e.target.files[0])} className="text-xs disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}


