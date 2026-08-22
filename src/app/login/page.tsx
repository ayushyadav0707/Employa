'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (res.ok) {
      router.push('/dashboard');
      router.refresh();
    } else {
      try {
        const data = await res.json();
        setError(data.error || 'Login failed');
      } catch (err) {
        setError('A server error occurred.');
      }
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white p-10 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-2">Enter your credentials to access your account</p>
        </div>

        {error && <div className="mb-6 text-red-600 text-sm text-center font-medium bg-red-50 py-2 rounded-md">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Login ID / Email</label>
            <input name="emailOrLoginId" required className="w-full border border-gray-200 px-3 py-2 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
            <input type="password" name="password" required onKeyDown={(e) => { if (e.key === ' ') e.preventDefault(); }} className="w-full border border-gray-200 px-3 py-2 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
          </div>
          <button type="submit" className="w-full bg-black text-white font-medium py-2.5 rounded-md hover:bg-gray-800 transition-colors mt-6">
            Sign In
          </button>
        </form>
        
      </div>
    </div>
  );
}
