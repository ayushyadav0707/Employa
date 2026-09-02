'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Users, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
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
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#f8f9fc] overflow-hidden p-4">
      {/* Background Pattern Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-[40px] border-[#f0f2f9] opacity-50 z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border-[60px] border-[#f0f2f9] opacity-30 z-0"></div>
      
      {/* Decorative dots (simulated) */}
      <div className="absolute top-1/4 left-1/4 grid grid-cols-4 gap-2 opacity-10 z-0">
        {[...Array(16)].map((_, i) => (
          <div key={`dot-l-${i}`} className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
        ))}
      </div>
      <div className="absolute bottom-1/4 right-1/4 grid grid-cols-4 gap-2 opacity-10 z-0">
        {[...Array(16)].map((_, i) => (
          <div key={`dot-r-${i}`} className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
        ))}
      </div>
      <div className="absolute right-1/3 top-1/3 w-32 h-32 rounded-full bg-[#f0f2f9] opacity-60 z-0"></div>

      <div className="w-full max-w-md bg-white p-10 sm:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white z-10">
        
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-2">
            <Image src="/logo.png" alt="Employa Logo" width={64} height={64} className="object-contain" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Employa</h1>
          
          <h2 className="text-3xl font-bold text-slate-900 mt-6 mb-2">Sign In</h2>
          <p className="text-sm text-slate-500 font-medium text-center">
            Enter your credentials to access your account
          </p>
        </div>

        {error && (
          <div className="mb-6 text-red-600 text-sm text-center font-medium bg-red-50 py-2.5 rounded-lg border border-red-100">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400 stroke-[2]" />
              </div>
              <input 
                name="emailOrLoginId" 
                type="text"
                placeholder="Enter your email"
                required 
                className="w-full border border-slate-200 pl-11 pr-4 py-3 rounded-xl text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm" 
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 stroke-[2]" />
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                name="password" 
                placeholder="Enter your password"
                required 
                onKeyDown={(e) => { if (e.key === ' ') e.preventDefault(); }} 
                className="w-full border border-slate-200 pl-11 pr-11 py-3 rounded-xl text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 stroke-[2]" />
                ) : (
                  <Eye className="h-5 w-5 stroke-[2]" />
                )}
              </button>
            </div>
          </div>

          {/* Options Row */}
          <div className="flex items-center justify-between pt-1 pb-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border-2 border-slate-300 rounded-[6px] peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center group-hover:border-indigo-500">
                  <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] transition-all"
          >
            Sign In
          </button>
        </form>


      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center z-10">
        <p className="text-xs font-medium text-slate-400">
          © 2026 Employa. All rights reserved.
        </p>
      </div>
    </div>
  );
}
