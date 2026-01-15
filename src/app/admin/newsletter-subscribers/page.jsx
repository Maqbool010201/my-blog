"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NewsletterSubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        const res = await fetch("/api/admin/newsletter");
        if (res.ok) {
          const data = await res.json();
          setSubscribers(data.subscribers);
        }
      } catch (error) {
        console.error("Fetch subscribers error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscribers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Newsletter Subscribers</h1>
      <Link href="/admin" className="text-blue-600 mb-4 inline-block">← Back to Dashboard</Link>

      {loading ? (
        <p>Loading...</p>
      ) : subscribers.length === 0 ? (
        <p>No subscribers found.</p>
      ) : (
        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Subscribed At</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((sub) => (
              <tr key={sub.id} className="border-b">
                <td className="p-3">{sub.email}</td>
                <td className="p-3">{new Date(sub.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
