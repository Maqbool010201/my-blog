'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdsListPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAds = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/advertisements');
      const data = await res.json();
      setAds(data.ads || []);
    } catch (err) {
      console.error('Failed to load ads', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAds(); }, []);

  // FIXED: Now accepting the full 'ad' object to satisfy API requirements
  const toggle = async (id, adToUpdate) => {
    try {
      const res = await fetch(`/api/admin/advertisements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // Spreading the existing ad data and just flipping isActive
        body: JSON.stringify({ 
          ...adToUpdate, 
          isActive: !adToUpdate.isActive 
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Failed to toggle ad', err);
        alert(`Error: ${err.error || 'Failed to update status'}`);
        return;
      }

      const updatedAd = await res.json();
      // Update local state with the returned ad from database
      setAds(prev => prev.map(ad => ad.id === id ? updatedAd : ad));
    } catch (err) {
      console.error('Error toggling ad', err);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this ad?')) return;
    try {
      const res = await fetch(`/api/admin/advertisements/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        console.error('Failed to delete ad', err);
        return;
      }
      setAds(prev => prev.filter(ad => ad.id !== id));
    } catch (err) {
      console.error('Error deleting ad', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <button
          onClick={() => (window.location.href = '/admin')}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium shadow"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold text-gray-800 text-center sm:text-left flex-1">Advertisements</h1>

        <Link
          href="/admin/advertisements/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow"
        >
          + Add New Ad
        </Link>
      </div>

      {loading && <p className="text-center text-gray-500">Loading ads...</p>}
      {!loading && ads.length === 0 && <p className="text-center text-gray-500 mt-10 text-lg">No advertisements found.</p>}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {ads.map(ad => (
          <div key={ad.id} className="bg-white rounded-xl shadow-lg p-4 flex flex-col justify-between hover:shadow-2xl transition duration-300">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{ad.title}</h2>
              <p className="text-gray-500 mt-1 text-sm">
                Page Type: <span className="font-medium">{ad.pageType}</span> | 
                Position: <span className="font-medium">{ad.position}</span>
              </p>
              {ad.image && <img src={ad.image} alt={ad.title} className="mt-3 rounded-md w-full h-40 object-cover shadow-sm" />}
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                // CHANGED: Passing the whole 'ad' object here
                onClick={() => toggle(ad.id, ad)}
                className={`px-3 py-1 rounded-lg text-white text-sm font-medium ${ad.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} transition`}
              >
                {ad.isActive ? 'Active' : 'Inactive'}
              </button>

              <div className="space-x-3">
                <Link href={`/admin/advertisements/edit/${ad.id}`} className="text-blue-600 hover:underline text-sm font-medium">Edit</Link>
                <button onClick={() => remove(ad.id)} className="text-red-600 hover:underline text-sm font-medium">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}