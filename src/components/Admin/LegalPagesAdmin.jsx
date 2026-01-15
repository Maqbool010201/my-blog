// src/components/Admin/LegalPagesAdmin.jsx
'use client';

import { useState, useEffect } from 'react';

export default function LegalPagesAdmin() {
  const [legalPages, setLegalPages] = useState([]);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    description: '',
    order: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLegalPages();
  }, []);

  const fetchLegalPages = async () => {
    try {
      const response = await fetch('/api/legal-pages');
      const data = await response.json();
      setLegalPages(data);
    } catch (error) {
      console.error('Error fetching legal pages:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId 
        ? `/api/legal-pages/${formData.slug}`
        : '/api/legal-pages';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ slug: '', title: '', content: '', description: '', order: 0 });
        setEditingId(null);
        fetchLegalPages();
      }
    } catch (error) {
      console.error('Error saving legal page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page) => {
    setFormData({
      slug: page.slug,
      title: page.title,
      content: page.content,
      description: page.description || '',
      order: page.order
    });
    setEditingId(page.id);
  };

  const handleDelete = async (slug) => {
    if (confirm('Are you sure you want to delete this page?')) {
      try {
        await fetch(`/api/legal-pages/${slug}`, { method: 'DELETE' });
        fetchLegalPages();
      } catch (error) {
        console.error('Error deleting legal page:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Legal Pages</h1>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="privacy-policy"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Privacy Policy"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description of the page"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content (HTML)
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows="10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter HTML content here..."
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : editingId ? 'Update Page' : 'Create Page'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setFormData({ slug: '', title: '', content: '', description: '', order: 0 });
              setEditingId(null);
            }}
            className="ml-4 bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* List of Legal Pages */}
      <div className="bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold p-6 border-b">Legal Pages</h2>
        <div className="divide-y">
          {legalPages.map((page) => (
            <div key={page.id} className="p-6 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{page.title}</h3>
                <p className="text-sm text-gray-600">/{page.slug}</p>
                <p className="text-sm text-gray-500">{page.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(page)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(page.slug)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}