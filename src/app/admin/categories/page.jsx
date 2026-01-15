"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setMessage('Error loading categories');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/id/${id}`, {
        method: 'DELETE'
      });

      const result = await res.json();

      if (res.ok) {
        setMessage('✅ Category deleted successfully');
        fetchCategories(); // Refresh the list
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setMessage('❌ Error deleting category');
    }
  };

  if (loading) return <div className="p-6">Loading categories...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories Management</h1>
        <Link href="/admin/categories/add">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Add New Category
          </button>
        </Link>
      </div>

      {message && (
        <div className={`p-4 mb-4 rounded ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
          <button 
            onClick={() => setMessage('')}
            className="ml-2 underline hover:opacity-70"
          >
            Dismiss
          </button>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No categories found.</p>
          <Link href="/admin/categories/add">
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Create Your First Category
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                    {category.metaTitle && (
                      <div className="text-sm text-gray-500 mt-1">
                        {category.metaTitle}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{category.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {category._count?.posts || 0} posts
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link 
                      href={`/admin/categories/edit/${category.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="text-red-600 hover:text-red-900 transition"
                      disabled={category._count?.posts > 0}
                      title={category._count?.posts > 0 ? 'Cannot delete category with posts' : 'Delete category'}
                    >
                      Delete
                    </button>
                    {category._count?.posts > 0 && (
                      <div className="text-xs text-red-500 mt-1">
                        Has {category._count.posts} posts
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick Navigation */}
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/admin">
          <button className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
            🏠 Back to Dashboard
          </button>
        </Link>
        <Link href="/admin/posts">
          <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
            📝 Manage Posts
          </button>
        </Link>
      </div>
    </div>
  );
}