'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PAGE_TYPES = [
  { value: 'home', label: 'Homepage' },
  { value: 'post', label: 'Blog Post' },
  { value: 'category', label: 'Category Page' },
  { value: 'tool', label: 'Tool Page' }, // New type for /tools/*
];

const POSITIONS = {
  home: [
    'content-top',
    'content-middle',
    'content-bottom',
    'sidebar-top',
    'sidebar-bottom',
  ],
  post: ['content-top', 'content-middle', 'content-bottom'],
  category: ['content-top', 'content-bottom', 'sidebar-top', 'sidebar-bottom'],
  tool: ['content-top', 'content-bottom', 'sidebar-top', 'sidebar-bottom'],
};

const AD_TYPES = ['AFFILIATE', 'LINK', 'BANNER', 'POPUP', 'VIDEO', 'CUSTOM'];

export default function NewAdPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    adType: 'CUSTOM',
    pageType: 'home',
    pageSlug: '',
    position: POSITIONS.home[0],
    html: '',
    linkUrl: '',
    image: '',
    script: '',
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'pageType' ? { position: POSITIONS[value][0] } : {}),
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/admin/advertisements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setLoading(false);
    if (res.ok) router.push('/admin/advertisements');
    else alert('Failed to create advertisement');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">

        <button onClick={() => router.push('/admin')} className="mb-4 px-4 py-2 bg-gray-200 rounded-lg">← Back</button>

        <h1 className="text-2xl font-bold mb-6 text-center">Create Advertisement</h1>

        <form onSubmit={submit} className="space-y-4">
          <input name="title" placeholder="Ad title" value={form.title} onChange={handleChange} required className="w-full border p-3 rounded-lg" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select name="adType" value={form.adType} onChange={handleChange} className="border p-3 rounded-lg">
              {AD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            <select name="pageType" value={form.pageType} onChange={handleChange} className="border p-3 rounded-lg">
              {PAGE_TYPES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>

            <select name="position" value={form.position} onChange={handleChange} className="border p-3 rounded-lg">
              {POSITIONS[form.pageType].map((pos) => <option key={pos} value={pos}>{pos}</option>)}
            </select>
          </div>

          {form.pageType !== 'home' && (
            <input
              name="pageSlug"
              placeholder="Slug or path (optional, e.g. post slug or tool path)"
              value={form.pageSlug}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
          )}

          <textarea name="html" placeholder="HTML Ad code" value={form.html} onChange={handleChange} rows={3} className="w-full border p-3 rounded-lg font-mono" />

          <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="w-full border p-3 rounded-lg" />
          <input name="linkUrl" placeholder="Link URL" value={form.linkUrl} onChange={handleChange} className="w-full border p-3 rounded-lg" />

          <label className="flex items-center gap-2">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} /> Active
          </label>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => router.back()} className="border px-4 py-2 rounded-lg">Cancel</button>
            <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg">{loading ? 'Saving…' : 'Create Ad'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
