'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (newPassword.includes(' ')) {
      setLoading(false);
      return setError('Password cannot contain spaces');
    }
    
    if (newPassword !== confirmPassword) {
      setLoading(false);
      return setError('Passwords do not match');
    }
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ newPassword }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || 'Password reset failed');
      }
    } catch (err) {
      setError('A server error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow border-t-4 border-purple-600">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">Change Password Required</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Since you logged in with a system-generated password, you must change it before continuing.
        </p>
        
        {error && <div className="mb-4 text-red-600 text-sm text-center font-medium bg-red-50 p-2 rounded">{error}</div>}
        {success && <div className="mb-4 text-green-700 text-sm text-center font-medium bg-green-50 p-3 rounded">Password updated successfully! Redirecting to login...</div>}
        
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">New Password</label>
              <input type="password" name="newPassword" minLength={6} required onKeyDown={(e) => { if (e.key === ' ') e.preventDefault(); }} className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Confirm New Password</label>
              <input type="password" name="confirmPassword" minLength={6} required onKeyDown={(e) => { if (e.key === ' ') e.preventDefault(); }} className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-purple-500" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white font-semibold p-2 rounded hover:bg-purple-700 transition-colors disabled:opacity-50">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
