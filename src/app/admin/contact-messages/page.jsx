// src/app/admin/contact-messages/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Mail, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Archive, 
  Reply, 
  Trash2, 
  Calendar,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function ContactMessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 10
  });

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        status: filters.status,
        page: filters.page,
        limit: filters.limit
      }).toString();

      const response = await fetch(`/api/contact?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setMessages(data.messages);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filters.status, filters.page]);

  const handleStatusUpdate = async (messageId, newStatus) => {
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchMessages();
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchMessages();
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      unread: 'bg-red-100 text-red-800',
      read: 'bg-yellow-100 text-yellow-800',
      replied: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.unread;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
              <p className="text-gray-600 mt-2">
                Manage and respond to contact form submissions
              </p>
            </div>
            <Link 
              href="/admin"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                  >
                    <option value="all">All Messages</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{pagination.totalItems || 0}</div>
                  <div className="text-sm text-blue-800">Total Messages</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {messages.filter(m => m.status === 'unread').length}
                  </div>
                  <div className="text-sm text-red-800">Unread</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {messages.filter(m => m.status === 'replied').length}
                  </div>
                  <div className="text-sm text-green-800">Replied</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {messages.filter(m => m.status === 'archived').length}
                  </div>
                  <div className="text-sm text-gray-800">Archived</div>
                </div>
              </div>
            </div>

            {/* Messages Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        From
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          </div>
                          <p className="mt-2 text-gray-500">Loading messages...</p>
                        </td>
                      </tr>
                    ) : messages.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No messages found</p>
                        </td>
                      </tr>
                    ) : (
                      messages.map((message) => (
                        <tr 
                          key={message.id}
                          className={`hover:bg-gray-50 cursor-pointer ${selectedMessage?.id === message.id ? 'bg-blue-50' : ''}`}
                          onClick={() => setSelectedMessage(message)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-blue-600" />
                                </div>
                              </div>
                              <div className="ml-3">
                                <div className="font-medium text-gray-900">{message.name}</div>
                                <div className="text-sm text-gray-500">{message.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-xs truncate">{message.subject}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                              {formatDate(message.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              {message.status === 'unread' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(message.id, 'read');
                                  }}
                                  className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                                  title="Mark as read"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}
                              {message.status !== 'replied' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(message.id, 'replied');
                                  }}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                                  title="Mark as replied"
                                >
                                  <Reply className="w-4 h-4" />
                                </button>
                              )}
                              {message.status !== 'archived' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(message.id, 'archived');
                                  }}
                                  className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                                  title="Archive"
                                >
                                  <Archive className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(message.id);
                                }}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.total > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Page <span className="font-medium">{pagination.current}</span> of{' '}
                    <span className="font-medium">{pagination.total}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                      disabled={filters.page === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: Math.min(5, pagination.total) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={i}
                          onClick={() => setFilters({ ...filters, page: pageNum })}
                          className={`px-3 py-1 border rounded-md text-sm font-medium ${
                            filters.page === pageNum
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                      disabled={filters.page === pagination.total}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Message Detail View */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              {selectedMessage ? (
                <>
                  <div className="flex items-start justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Message Details</h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.status)}`}>
                      {selectedMessage.status.charAt(0).toUpperCase() + selectedMessage.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">From</h3>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{selectedMessage.name}</div>
                          <div className="text-sm text-gray-500">{selectedMessage.email}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Subject</h3>
                      <p className="text-gray-900 font-medium">{selectedMessage.subject}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Message</h3>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Received</h3>
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(selectedMessage.createdAt)}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Actions</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`, '_blank')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                          <Reply className="w-4 h-4 mr-2" />
                          Reply
                        </button>
                        <button
                          onClick={() => handleDelete(selectedMessage.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a message to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}