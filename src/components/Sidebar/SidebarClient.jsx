'use client';

import { useState } from 'react';

export default function SidebarClient() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error('Subscription failed');
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-5 text-white">
      <h3 className="text-lg font-bold mb-3">Newsletter</h3>
      <p className="text-blue-100 text-sm mb-4">Get the latest posts delivered right to your inbox.</p>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white text-sm" 
          required
        />
        <button 
          type="submit" 
          className="w-full bg-white text-blue-600 font-semibold rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors text-sm"
        >
          Subscribe
        </button>
      </form>
      {success && <p className="mt-2 text-green-200 text-sm">Subscribed successfully!</p>}
      {error && <p className="mt-2 text-red-200 text-sm">{error}</p>}
    </div>
  );
}
