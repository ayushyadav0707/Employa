'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEmployeePage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ loginId: string; tempPassword: string; name: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/users/create-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (res.ok) {
        setSuccessData(resData.employee);
        form.reset();
      } else {
        setError(resData.error || 'Failed to create employee');
      }
    } catch (err) {
      setError('A server error occurred while creating the employee.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-8">
      <div className="max-w-xl w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Register Employee</h1>
          <button onClick={() => router.push('/dashboard')} className="text-sm text-gray-500 hover:text-black">
            &larr; Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 text-center font-medium">
            {error}
          </div>
        )}

        {successData ? (
          <div className="mb-6 p-6 bg-green-50 rounded-md border border-green-200">
            <h2 className="text-green-800 font-bold text-lg mb-2">Employee Created Successfully!</h2>
            <p className="text-sm text-green-700 mb-4">Please securely share these credentials with {successData.name}. They will be forced to change this password on their first login.</p>
            
            <div className="bg-white p-4 rounded border border-green-100 mb-4">
              <div className="flex flex-col gap-2">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Login ID:</span>
                  <div className="font-mono text-lg font-bold text-black">{successData.loginId}</div>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Temp Password:</span>
                  <div className="font-mono text-lg font-bold text-black">{successData.tempPassword}</div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSuccessData(null)}
              className="w-full bg-green-600 text-white font-medium py-2 rounded hover:bg-green-700 transition-colors"
            >
              Register Another Employee
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
              <input type="text" name="name" required className="w-full border border-gray-200 px-3 py-2 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" placeholder="e.g. Jane Doe" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <input type="email" name="email" required className="w-full border border-gray-200 px-3 py-2 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" placeholder="jane@company.com" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number (Optional)</label>
              <input type="tel" name="phone" className="w-full border border-gray-200 px-3 py-2 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" placeholder="+1 234 567 8900" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Role</label>
              <select name="role" required className="w-full border border-gray-200 px-3 py-2 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all">
                <option value="Employee">Employee</option>
                <option value="HR">HR / Admin</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-black text-white font-medium py-2.5 rounded-md hover:bg-gray-800 transition-colors mt-6 disabled:bg-gray-400">
              {loading ? 'Creating...' : 'Register Employee'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
