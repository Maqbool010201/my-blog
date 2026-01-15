"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import slugify from 'slugify';

export default function EditCategory() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    metaTitle: '',
    metaDescription: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      const res = await fetch(`/api/categories/id/${id}`);
      if (!res.ok) throw new Error('Failed to fetch category');
      const category = await res.json();
      
      setFormData({
        name: category.name || '',
        description: category.description || '',
        metaTitle: category.metaTitle || '',
        metaDescription: category.metaDescription || ''
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      setMessage('Error loading category');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch(`/api/categories/id/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage('✅ Category updated successfully');
        setTimeout(() => {
          router.push('/admin/categories');
        }, 1500);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setMessage('❌ Error updating category');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/categories">
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              ← Back to Categories
            </button>
          </Link>
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/categories">
          <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
            ← Back to Categories
          </button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Category</h1>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meta Title</label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => handleInputChange('metaTitle', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meta Description</label>
            <textarea
              value={formData.metaDescription}
              onChange={(e) => handleInputChange('metaDescription', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                '💾 Update Category'
              )}
            </button>

            <Link href="/admin/categories">
              <button
                type="button"
                className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}