'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link'; // ✅ Added for Breadcrumbs

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // --- SEO BREADCRUMB CONFIG ---
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wisemixmedia.com";
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Contact Us",
        "item": `${siteUrl}/contact`,
      },
    ],
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateDomain = (email) => {
    const domain = email.split('@')[1];
    if (domain.includes('..')) return false;
    if (domain.endsWith('.')) return false;
    const parts = domain.split('.');
    const tld = parts[parts.length - 1];
    return /^[a-zA-Z]{2,}$/.test(tld);
  };

  const validateDisposableEmail = (email) => {
    const disposableDomains = [
      'tempmail.com', 'mailinator.com', 'guerrillamail.com', '10minutemail.com',
      'yopmail.com', 'throwawaymail.com', 'fakeinbox.com', 'temp-mail.org',
      'sharklasers.com', 'getairmail.com', 'maildrop.cc', 'tempinbox.com',
      'dispostable.com', 'mailnesia.com', 'trashmail.com', 'temp-mail.io',
      'mailcatch.com', 'disposablemail.com', 'spambox.us', 'tempail.com'
    ];
    const domain = email.split('@')[1].toLowerCase();
    return !disposableDomains.some(disposable => domain === disposable);
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address (e.g., name@example.com)';
      isValid = false;
    } else if (!validateDomain(formData.email)) {
      errors.email = 'Invalid domain format in email address';
      isValid = false;
    } else {
      const isRealEmail = validateDisposableEmail(formData.email);
      if (!isRealEmail) {
        errors.email = 'Please use a permanent email address. Disposable/temporary emails are not accepted.';
        isValid = false;
      }
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
      isValid = false;
    } else if (formData.subject.trim().length < 3) {
      errors.subject = 'Subject must be at least 3 characters';
      isValid = false;
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message should be at least 10 characters long';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Your message has been sent successfully! We\'ll get back to you soon.'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setFormErrors({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. Google SEO Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* 2. Visual Breadcrumbs (User UX) */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Contact Us</span>
          </nav>

          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Contact Us
            </motion.h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions, suggestions, or want to collaborate? We'd love to hear from you.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-600 mb-6">Fill out the form below and we'll get back to you promptly.</p>

                {status.message && (
                  <div className={`mb-6 p-4 rounded-lg ${
                    status.type === 'success' 
                      ? 'bg-green-50 border border-green-200 text-green-800' 
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    <div className="flex items-center">
                      {status.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 mr-2" />
                      ) : (
                        <AlertCircle className="w-5 h-5 mr-2" />
                      )}
                      <span>{status.message}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="John Doe"
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="john@example.com"
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        formErrors.subject ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="How can we help you?"
                    />
                    {formErrors.subject && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                        formErrors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Please describe your inquiry in detail..."
                    />
                    {formErrors.message && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-gray-500">* Required fields</p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-semibold text-blue-900">Valid Email Examples</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Accepted: name@example.com, first.last@company.co.uk<br />
                        Rejected: name@example, name@.com, name@example..com
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-semibold text-blue-900">Typical Response Time</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        We strive to respond to all inquiries within 24 hours during business days.
                        For urgent matters, please mention "URGENT" in your subject line.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}