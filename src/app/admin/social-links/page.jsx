'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SocialLinksAdmin() {
  const [links, setLinks] = useState([]);
  const [platform, setPlatform] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Load social links from API
  const loadLinks = async () => {
    try {
      const res = await fetch('/api/admin/social-links');
      const data = await res.json();
      setLinks(data.links || []);
    } catch (err) {
      console.error('Failed to load social links', err);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  // Add new social link
  const addLink = async () => {
    if (!platform || !url) return alert('Platform and URL are required');
    setLoading(true);
    try {
      await fetch('/api/admin/social-links', {
        method: 'POST',
        body: JSON.stringify({ platform, url }),
        headers: { 'Content-Type': 'application/json' },
      });
      setPlatform('');
      setUrl('');
      await loadLinks();
    } catch (err) {
      console.error('Failed to add link', err);
    } finally {
      setLoading(false);
    }
  };

  // Update existing link
  const updateLink = async (id) => {
    const newUrl = prompt('Enter new URL:');
    if (!newUrl) return;
    try {
      await fetch('/api/admin/social-links', {
        method: 'PUT',
        body: JSON.stringify({ id, url: newUrl }),
        headers: { 'Content-Type': 'application/json' },
      });
      loadLinks();
    } catch (err) {
      console.error('Failed to update link', err);
    }
  };

  // Delete a link
  const deleteLink = async (id) => {
    if (!confirm('Delete this link?')) return;
    try {
      await fetch(`/api/admin/social-links?id=${id}`, { method: 'DELETE' });
      loadLinks();
    } catch (err) {
      console.error('Failed to delete link', err);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Back to Dashboard */}
      <button
        onClick={() => router.push('/admin')}
        className="mb-6 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
      >
        &larr; Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-6">Manage Social Links</h1>

      {/* Add new link form */}
      <div className="flex gap-2 mb-4">
        <input
          placeholder="Platform (facebook, twitter, etc.)"
          value={platform}
          onChange={e => setPlatform(e.target.value)}
          className="border p-2 rounded-lg flex-1"
        />
        <input
          placeholder="URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="border p-2 rounded-lg flex-2"
        />
        <button
          onClick={addLink}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>

      {/* List of links */}
      <ul className="space-y-2">
        {links.map(link => (
          <li key={link.id} className="flex justify-between items-center border p-2 rounded-lg">
            <span>{link.platform}: {link.url}</span>
            <div className="space-x-2">
              <button
                onClick={() => updateLink(link.id)}
                className="text-yellow-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteLink(link.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
