// src/app/admin/legal-pages/page.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
  const [originalSlug, setOriginalSlug] = useState(''); // Track original slug
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    fetchLegalPages();
  }, []);

  const fetchLegalPages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/legal-pages');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched pages:', data); // Debug
        // Check content for each page
        data.forEach(page => {
          console.log(`Page "${page.title}":`, {
            hasContent: !!page.content,
            contentLength: page.content?.length || 0,
            contentPreview: page.content?.substring(0, 100) || 'No content'
          });
        });
        setLegalPages(data);
      } else {
        console.error('Failed to fetch:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching legal pages:', error);
      alert('Error fetching legal pages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      // For updates, use the ORIGINAL slug, not the one in form
      const url = editingId 
        ? `/api/legal-pages/${originalSlug}`  // Use original slug
        : '/api/legal-pages';
      
      const method = editingId ? 'PUT' : 'POST';

      console.log('Submitting:', { url, method, formData, editingId, originalSlug });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (response.ok) {
        setFormData({ slug: '', title: '', content: '', description: '', order: 0 });
        setEditingId(null);
        setOriginalSlug('');
        fetchLegalPages();
        alert(editingId ? 'Legal page updated successfully!' : 'Legal page created successfully!');
      } else {
        alert(responseData.error || 'Failed to save legal page');
      }
    } catch (error) {
      console.error('Error saving legal page:', error);
      alert('Error saving legal page: ' + error.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleEdit = (page) => {
    console.log('Editing page:', page);
    console.log('Page content length:', page.content?.length);
    console.log('Page content preview:', page.content?.substring(0, 100));
    
    setFormData({
      slug: page.slug || '',
      title: page.title || '',
      content: page.content || '', // Make sure content is included
      description: page.description || '',
      order: page.order || 0
    });
    setEditingId(page.id);
    setOriginalSlug(page.slug); // Store original slug
    
    // Scroll to form and focus
    setTimeout(() => {
      document.querySelector('textarea')?.focus();
      document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDelete = async (slug) => {
    if (confirm('Are you sure you want to delete this page?')) {
      try {
        console.log('Deleting:', slug);
        const response = await fetch(`/api/legal-pages/${slug}`, { 
          method: 'DELETE' 
        });
        
        const result = await response.json();
        console.log('Delete response:', result);
        
        if (response.ok) {
          fetchLegalPages();
          alert('Legal page deleted successfully!');
        } else {
          alert(result.error || 'Failed to delete legal page');
        }
      } catch (error) {
        console.error('Error deleting legal page:', error);
        alert('Error deleting legal page');
      }
    }
  };

  const resetForm = () => {
    setFormData({ slug: '', title: '', content: '', description: '', order: 0 });
    setEditingId(null);
    setOriginalSlug('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Legal Pages Management</h1>
              <p className="text-gray-600 mt-2">
                Create and manage legal pages like Privacy Policy, Terms of Service, etc.
              </p>
              {editingId && (
                <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm">
                  <span className="font-medium">Editing:</span> {formData.title} 
                  <span className="ml-2 text-gray-600">(Original slug: {originalSlug})</span>
                </div>
              )}
            </div>
            <Link 
              href="/admin"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? `Edit Legal Page: ${formData.title}` : 'Create New Legal Page'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="privacy-policy"
                    required
                    disabled={editingId} // Disable slug editing during update
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {editingId ? 'Slug cannot be changed during edit' : 'URL-friendly name (lowercase, hyphens)'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
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

              <div>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (HTML) *
                  <span className="ml-2 text-xs text-gray-500">
                    {formData.content.length} characters
                  </span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows="12"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Enter HTML content here..."
                  required
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>You can use HTML tags like &lt;h1&gt;, &lt;p&gt;, &lt;ul&gt;, etc.</span>
                  <span>{formData.content ? '✅ Has content' : '❌ No content'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first in lists
                </p>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saveLoading ? 'Saving...' : editingId ? 'Update Page' : 'Create Page'}
                </button>

                {editingId && (
                  <>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                      Cancel Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // Test the API endpoint
                        fetch(`/api/legal-pages/${originalSlug}`)
                          .then(res => res.json())
                          .then(data => {
                            console.log('Test fetch:', data);
                            alert(`API test: ${data.content ? 'Content exists' : 'No content'}`);
                          });
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600"
                    >
                      Test API
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>

          {/* Right Column - List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Legal Pages</h2>
              <p className="text-gray-600 text-sm mt-1">
                {loading ? 'Loading...' : `${legalPages.length} page${legalPages.length !== 1 ? 's' : ''} found`}
              </p>
              <button
                onClick={() => {
                  console.log('Current pages:', legalPages);
                  legalPages.forEach(p => console.log(p.slug, '-', p.content?.length || 0, 'chars'));
                }}
                className="mt-2 text-xs bg-gray-200 px-2 py-1 rounded"
              >
                Debug Log
              </button>
            </div>
            
            <div className="divide-y">
              {loading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading legal pages...</p>
                </div>
              ) : legalPages.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-gray-500">No legal pages created yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Create your first legal page using the form
                  </p>
                </div>
              ) : (
                legalPages.map((page) => (
                  <div key={page.id} className="p-6 flex justify-between items-start hover:bg-gray-50">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{page.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">/{page.slug}</p>
                      {page.description && (
                        <p className="text-gray-500 text-sm mt-2">{page.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Order: {page.order}</span>
                        <span>•</span>
                        <span>Content: {page.content?.length || 0} chars</span>
                        <span>•</span>
                        <span>Updated: {new Date(page.updatedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <a 
                          href={`/legal/${page.slug}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </a>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(page)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(page.slug)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}