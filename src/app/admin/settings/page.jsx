"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const DEFAULT_BRANDING = {
  siteName: "",
  logoUrl: "",
  logoAlt: "",
  logoDisplay: "IMAGE_AND_TEXT",
  logoWidth: 180,
  logoHeight: 48,
};

const DEFAULT_ADS = {
  googleSiteVerification: "",
  googleAdsenseClientId: "",
  googleAnalyticsId: "",
  adsTxtContent: "",
};

const DEFAULT_STORAGE = {
  storageProvider: "LOCAL",
  imageKitPublicKey: "",
  imageKitPrivateKey: "",
  imageKitUrlEndpoint: "",
  imageKitFolder: "",
  cloudinaryCloudName: "",
  cloudinaryApiKey: "",
  cloudinaryApiSecret: "",
  cloudinaryFolder: "",
};

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    ...DEFAULT_BRANDING,
    ...DEFAULT_STORAGE,
    ...DEFAULT_ADS,
  });

  const preview = useMemo(() => {
    const siteName = form.siteName || "My Website";
    const mode = form.logoDisplay || "IMAGE_AND_TEXT";
    const showImage = Boolean(form.logoUrl) && mode !== "TEXT_ONLY";
    const showText = mode !== "IMAGE_ONLY";
    return { siteName, showImage, showText };
  }, [form.siteName, form.logoDisplay, form.logoUrl]);

  async function loadSettings() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load settings");

      const s = data.settings || {};
      setForm({
        siteName: s.siteName || "",
        logoUrl: s.logoUrl || "",
        logoAlt: s.logoAlt || "",
        logoDisplay: s.logoDisplay || "IMAGE_AND_TEXT",
        logoWidth: Number(s.logoWidth) || 180,
        logoHeight: Number(s.logoHeight) || 48,
        storageProvider: s.storageProvider || "LOCAL",
        imageKitPublicKey: s.imageKitPublicKey || "",
        imageKitPrivateKey: s.imageKitPrivateKey || "",
        imageKitUrlEndpoint: s.imageKitUrlEndpoint || "",
        imageKitFolder: s.imageKitFolder || "",
        cloudinaryCloudName: s.cloudinaryCloudName || "",
        cloudinaryApiKey: s.cloudinaryApiKey || "",
        cloudinaryApiSecret: s.cloudinaryApiSecret || "",
        cloudinaryFolder: s.cloudinaryFolder || "",
        googleSiteVerification: s.googleSiteVerification || "",
        googleAdsenseClientId: s.googleAdsenseClientId || "",
        googleAnalyticsId: s.googleAnalyticsId || "",
        adsTxtContent: s.adsTxtContent || "",
      });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function savePatch(key, patch) {
    setSaving(key);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");
      setMessage("Settings saved.");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setSaving("");
    }
  }

  async function uploadLogo(file) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url;
  }

  async function onUploadLogo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const url = await uploadLogo(file);
      setForm((prev) => ({ ...prev, logoUrl: url }));
      await savePatch("branding", { logoUrl: url });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-sm text-gray-600">Configure branding, tracking, and ads in one place.</p>
        </div>
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-white border rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Branding</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  savePatch("branding", {
                    siteName: form.siteName,
                    logoUrl: form.logoUrl,
                    logoAlt: form.logoAlt,
                    logoDisplay: form.logoDisplay,
                    logoWidth: form.logoWidth,
                    logoHeight: form.logoHeight,
                  })
                }
                disabled={saving === "branding"}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving === "branding" ? "Saving..." : "Save Branding"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({ ...prev, ...DEFAULT_BRANDING }));
                  savePatch("branding", DEFAULT_BRANDING);
                }}
                disabled={saving === "branding"}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Website Name">
              <input
                value={form.siteName}
                onChange={(e) => setForm((prev) => ({ ...prev, siteName: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="My Blog3"
              />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Logo Display Mode">
              <select
                value={form.logoDisplay}
                onChange={(e) => setForm((prev) => ({ ...prev, logoDisplay: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="IMAGE_AND_TEXT">Logo + Text</option>
                <option value="IMAGE_ONLY">Logo Only</option>
                <option value="TEXT_ONLY">Text Only</option>
              </select>
            </Field>
            <Field label="Logo Alt Text">
              <input
                value={form.logoAlt}
                onChange={(e) => setForm((prev) => ({ ...prev, logoAlt: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Brand logo"
              />
            </Field>
          </div>

          <Field label="Logo URL">
            <div className="space-y-2">
              <input
                value={form.logoUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, logoUrl: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="/uploads/myblogv3/posts/logo.png"
              />
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center px-3 py-2 bg-gray-100 rounded-lg border cursor-pointer hover:bg-gray-200">
                  {uploading ? "Uploading..." : "Choose Logo From Device"}
                  <input type="file" accept="image/*" className="hidden" onChange={onUploadLogo} />
                </label>
                <span className="text-xs text-gray-500">Recommended: 180x48 px (or 360x96 px @2x).</span>
              </div>
            </div>
          </Field>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Logo Width (px)">
              <input
                type="number"
                min={60}
                max={400}
                value={form.logoWidth}
                onChange={(e) => setForm((prev) => ({ ...prev, logoWidth: Number(e.target.value) || 180 }))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </Field>
            <Field label="Logo Height (px)">
              <input
                type="number"
                min={20}
                max={120}
                value={form.logoHeight}
                onChange={(e) => setForm((prev) => ({ ...prev, logoHeight: Number(e.target.value) || 48 }))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </Field>
          </div>
        </section>

        <section className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-semibold text-gray-900">Header Preview</h3>
          <div className="border rounded-xl p-4 bg-gray-50">
            <div className="h-14 px-3 bg-white border rounded-lg flex items-center gap-2">
              {preview.showImage ? (
                <img
                  src={form.logoUrl}
                  alt={form.logoAlt || preview.siteName}
                  style={{ width: `${form.logoWidth}px`, height: `${form.logoHeight}px` }}
                  className="object-contain max-w-[180px]"
                />
              ) : (
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-900 text-white font-bold text-lg">
                  {preview.siteName.charAt(0).toUpperCase()}
                </span>
              )}
              {preview.showText && <span className="font-semibold text-gray-900">{preview.siteName}</span>}
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Use transparent PNG/SVG for best results. Large logos are automatically constrained in header preview.
          </p>
        </section>
      </div>

      <section className="bg-white border rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Image Storage Provider</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                savePatch("storage", {
                  storageProvider: form.storageProvider,
                  imageKitPublicKey: form.imageKitPublicKey,
                  imageKitPrivateKey: form.imageKitPrivateKey,
                  imageKitUrlEndpoint: form.imageKitUrlEndpoint,
                  imageKitFolder: form.imageKitFolder,
                  cloudinaryCloudName: form.cloudinaryCloudName,
                  cloudinaryApiKey: form.cloudinaryApiKey,
                  cloudinaryApiSecret: form.cloudinaryApiSecret,
                  cloudinaryFolder: form.cloudinaryFolder,
                })
              }
              disabled={saving === "storage"}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving === "storage" ? "Saving..." : "Save Storage"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm((prev) => ({ ...prev, ...DEFAULT_STORAGE }));
                savePatch("storage", DEFAULT_STORAGE);
              }}
              disabled={saving === "storage"}
              className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>

        <Field label="Storage Provider">
          <select
            value={form.storageProvider}
            onChange={(e) => setForm((prev) => ({ ...prev, storageProvider: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="LOCAL">Local (dev only)</option>
            <option value="IMAGEKIT">ImageKit</option>
            <option value="CLOUDINARY">Cloudinary</option>
          </select>
        </Field>

        {form.storageProvider === "IMAGEKIT" && (
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="ImageKit Public Key">
              <input
                value={form.imageKitPublicKey}
                onChange={(e) => setForm((prev) => ({ ...prev, imageKitPublicKey: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </Field>
            <Field label="ImageKit Private Key">
              <input
                value={form.imageKitPrivateKey}
                onChange={(e) => setForm((prev) => ({ ...prev, imageKitPrivateKey: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </Field>
            <Field label="ImageKit URL Endpoint">
              <input
                value={form.imageKitUrlEndpoint}
                onChange={(e) => setForm((prev) => ({ ...prev, imageKitUrlEndpoint: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="https://ik.imagekit.io/your_id"
              />
            </Field>
            <Field label="ImageKit Folder (optional)">
              <input
                value={form.imageKitFolder}
                onChange={(e) => setForm((prev) => ({ ...prev, imageKitFolder: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="myblog/posts"
              />
            </Field>
          </div>
        )}

        {form.storageProvider === "CLOUDINARY" && (
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Cloudinary Cloud Name">
              <input
                value={form.cloudinaryCloudName}
                onChange={(e) => setForm((prev) => ({ ...prev, cloudinaryCloudName: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </Field>
            <Field label="Cloudinary API Key">
              <input
                value={form.cloudinaryApiKey}
                onChange={(e) => setForm((prev) => ({ ...prev, cloudinaryApiKey: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </Field>
            <Field label="Cloudinary API Secret">
              <input
                value={form.cloudinaryApiSecret}
                onChange={(e) => setForm((prev) => ({ ...prev, cloudinaryApiSecret: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </Field>
            <Field label="Cloudinary Folder (optional)">
              <input
                value={form.cloudinaryFolder}
                onChange={(e) => setForm((prev) => ({ ...prev, cloudinaryFolder: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="myblog/posts"
              />
            </Field>
          </div>
        )}

        <p className="text-xs text-gray-500">
          For Vercel production, use ImageKit or Cloudinary. Local storage is only for local development.
        </p>
      </section>

      <section className="bg-white border rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Tracking & Ads</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                savePatch("ads", {
                  googleSiteVerification: form.googleSiteVerification,
                  googleAdsenseClientId: form.googleAdsenseClientId,
                  googleAnalyticsId: form.googleAnalyticsId,
                  adsTxtContent: form.adsTxtContent,
                })
              }
              disabled={saving === "ads"}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving === "ads" ? "Saving..." : "Save Tracking"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm((prev) => ({ ...prev, ...DEFAULT_ADS }));
                savePatch("ads", DEFAULT_ADS);
              }}
              disabled={saving === "ads"}
              className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Google Site Verification">
            <input
              value={form.googleSiteVerification}
              onChange={(e) => setForm((prev) => ({ ...prev, googleSiteVerification: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2"
            />
          </Field>
          <Field label="Google AdSense Client ID">
            <input
              value={form.googleAdsenseClientId}
              onChange={(e) => setForm((prev) => ({ ...prev, googleAdsenseClientId: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="ca-pub-xxxxxxxxxxxxxxxx"
            />
          </Field>
          <Field label="Google Analytics ID">
            <input
              value={form.googleAnalyticsId}
              onChange={(e) => setForm((prev) => ({ ...prev, googleAnalyticsId: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="G-XXXXXXXXXX"
            />
          </Field>
        </div>

        <Field label="ads.txt Content">
          <textarea
            value={form.adsTxtContent}
            onChange={(e) => setForm((prev) => ({ ...prev, adsTxtContent: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 min-h-40 font-mono text-sm"
            placeholder="google.com, pub-xxxxxxxxxxxxxxxx, DIRECT, f08c47fec0942fa0"
          />
        </Field>
      </section>

      {message && (
        <p className={`text-sm font-medium ${message.startsWith("Error:") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
