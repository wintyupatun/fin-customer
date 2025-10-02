'use client';
import { useEffect, useState } from 'react';

export default function CustomersPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: '', dateOfBirth: '', memberNumber: '', interests: '', _id: ''
  });
  const [detail, setDetail] = useState(null);

  // Load list
  const load = async () => {
    const r = await fetch('/api/customers', { cache: 'no-store' });
    setItems(await r.json());
  };
  useEffect(() => { load(); }, []);

  const resetForm = () =>
    setForm({ name: '', dateOfBirth: '', memberNumber: '', interests: '', _id: '' });

  // Create/Update (no special validation)
  const save = async (e) => {
    e.preventDefault();
    const body = {
      name: form.name.trim(),
      dateOfBirth: form.dateOfBirth,
      memberNumber: Number(form.memberNumber),
      interests: form.interests.trim()
    };
    const url = form._id ? `/api/customers/${form._id}` : '/api/customers';
    const method = form._id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        alert(`Save failed: ${msg || res.status}`);
        return;
      }
      resetForm();
      await load();
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  // Delete
  const del = async (id) => {
    if (!confirm('Delete this customer?')) return;
    await fetch(`/api/customers/${id}`, { method: 'DELETE' });
    await load();
  };

  // Inline detail
  const showDetail = async (id) => {
    const r = await fetch(`/api/customers/${id}`, { cache: 'no-store' });
    setDetail(await r.json());
  };

  return (
    <main className="mx-auto max-w-5xl p-6 font-sans">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Customers</h1>
      </header>

      {/* Form */}
      <form onSubmit={save} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          className="rounded-xl border px-3 py-2"
          placeholder="Name"
          value={form.name}
          onChange={e=>setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="date"
          className="rounded-xl border px-3 py-2"
          value={form.dateOfBirth}
          onChange={e=>setForm({ ...form, dateOfBirth: e.target.value })}
          required
        />
        <input
          type="number" min="1"
          className="rounded-xl border px-3 py-2"
          placeholder="Member #"
          value={form.memberNumber}
          onChange={e=>setForm({ ...form, memberNumber: e.target.value })}
          required
        />
        <input
          className="rounded-xl border px-3 py-2"
          placeholder="Interests (comma separated)"
          value={form.interests}
          onChange={e=>setForm({ ...form, interests: e.target.value })}
        />
        <div className="col-span-full flex gap-3 pt-1">
          <button type="submit" className="rounded-2xl bg-black px-4 py-2 text-white">
            {form._id ? 'Update' : 'Save'}
          </button>
          {form._id && (
            <button type="button" onClick={resetForm} className="rounded-2xl border px-4 py-2">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">DOB</th>
              <th className="px-4 py-3">Member #</th>
              <th className="px-4 py-3">Interests</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c._id} className="border-t">
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3">
                  {c.dateOfBirth ? new Date(c.dateOfBirth).toISOString().slice(0,10) : ''}
                </td>
                <td className="px-4 py-3">{c.memberNumber}</td>
                <td className="px-4 py-3">{c.interests}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={()=>showDetail(c._id)} className="rounded border px-3 py-1">
                      Detail
                    </button>
                    <button
                      onClick={()=>setForm({
                        name: c.name,
                        dateOfBirth: new Date(c.dateOfBirth).toISOString().slice(0,10),
                        memberNumber: String(c.memberNumber),
                        interests: c.interests || '',
                        _id: c._id
                      })}
                      className="rounded border px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={()=>del(c._id)}
                      className="rounded bg-red-600 px-3 py-1 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr className="border-t">
                <td className="px-4 py-6 text-gray-500" colSpan={5}>No customers yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Inline Detail */}
      {detail && (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-semibold">Customer Detail</h2>
          <pre className="whitespace-pre-wrap rounded-2xl border bg-gray-50 p-4">
{JSON.stringify(detail, null, 2)}
          </pre>
        </section>
      )}
    </main>
  );
}




