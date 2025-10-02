'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CustomerDetailPage({ params }) {
  const { id } = params;
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/customers/${id}`, { cache: 'no-store' });
        if (!res.ok) {
          setError('Customer not found');
          return;
        }
        const data = await res.json();
        if (active) setCustomer(data);
      } catch (err) {
        setError('Failed to load customer');
      }
    })();
    return () => { active = false; };
  }, [id]);

  return (
    <main className="max-w-3xl mx-auto p-6 font-sans">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Customer Detail</h1>
        <Link href="/" className="px-3 py-2 rounded-md border">← Back to Customers</Link>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {!error && !customer && <p>Loading…</p>}

      {customer && (
        <div className="bg-gray-50 border rounded-lg p-4">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(customer, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}



