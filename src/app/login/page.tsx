'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, UserSquare2 } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { 'Content-Type': 'application/json' }
    });
    
    setIsSubmitting(false);
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
    <div className="flex min-h-screen w-full bg-white font-sans">
      
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 sm:p-12 lg:p-16 xl:p-24 relative">
        
        {/* Logo */}
        <div className="flex items-center gap-3 mb-16 lg:mb-32">
          <Image src="/logo.png" alt="Employa Logo" width={32} height={32} className="object-contain" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">Employa</span>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
          <p className="text-[13.5px] text-gray-500 font-medium mb-10">
            Welcome back! Please enter your credentials to continue.
          </p>

          {error && (
            <div className="mb-6 text-red-600 text-[13px] text-center font-bold bg-red-50 py-3 rounded-xl border border-red-100">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-[13px] font-bold text-gray-700">Employee ID or Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserSquare2 className="h-5 w-5 text-gray-400 stroke-[2]" />
                </div>
                <input 
                  name="emailOrLoginId" 
                  type="text"
                  placeholder="Enter ID or email"
                  required 
                  className="w-full border border-gray-200 pl-12 pr-4 py-3.5 rounded-xl text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFCC2D]/20 focus:border-[#FFCC2D] transition-all font-medium text-[14px]" 
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-[13px] font-bold text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 stroke-[2]" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password" 
                  placeholder="Enter password"
                  required 
                  onKeyDown={(e) => { if (e.key === ' ') e.preventDefault(); }} 
                  className="w-full border border-gray-200 pl-12 pr-12 py-3.5 rounded-xl text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFCC2D]/20 focus:border-[#FFCC2D] transition-all font-medium text-[14px]" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 stroke-[2]" />
                  ) : (
                    <Eye className="h-5 w-5 stroke-[2]" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#FFCC2D] text-black font-bold py-3.5 rounded-xl hover:bg-[#e6b826] active:scale-[0.99] transition-all disabled:opacity-50 mt-4"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

      </div>

      {/* Right Column - Brand Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#FFF9E8] relative flex-col justify-start pt-12 xl:pt-16 px-16 xl:px-24 overflow-hidden border-l border-gray-200">
        
        {/* Quote Block */}
        <div className="relative z-10 max-w-lg w-full">
          {/* Quote Icon */}
          <div className="mb-6">
            <svg width="46" height="40" viewBox="0 0 42 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 20C12 28 8 36 0 36V28C4 28 6 24 6 20H0V0H18V20H12ZM36 20C36 28 32 36 24 36V28C28 28 30 24 30 20H24V0H42V20H36Z" fill="#FFCC2D"/>
            </svg>
          </div>
          
          <p className="text-[20px] xl:text-[24px] font-bold text-gray-900 leading-[1.6] mb-10">
            "Employa has completely transformed how we handle our HR operations. The intuitive interface and seamless tools make everything from payroll to attendance completely effortless. It's built exactly how HR software should be."
          </p>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 relative bg-black flex items-center justify-center border-2 border-gray-100 shadow-sm">
              <img 
                src="/team-adapt-logo.png" 
                alt="Team ADAP(T) Logo" 
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-gray-900">Team ADAP(T)</h4>
              <p className="text-[13px] font-medium text-gray-500">Executive</p>
            </div>
          </div>
        </div>

        {/* City Illustration */}
        <div className="absolute bottom-0 right-0 w-[120%] flex justify-end items-end z-0 opacity-100 translate-x-[5%] pointer-events-none">
          <svg width="600" height="400" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-[500px] object-contain object-bottom origin-bottom-right">
            {/* Background Building Left */}
            <path d="M50 400 L50 250 L150 200 L150 400 Z" fill="#E0F2FE" stroke="#334155" strokeWidth="4" strokeLinejoin="round"/>
            
            {/* Background Building Middle-Left */}
            <path d="M120 400 L160 150 L280 100 L320 130 L320 400 Z" fill="white" stroke="#334155" strokeWidth="4" strokeLinejoin="round"/>
            
            {/* Background Building Middle-Right */}
            <path d="M280 400 L280 180 L420 140 L420 400 Z" fill="#F1F5F9" stroke="#334155" strokeWidth="4" strokeLinejoin="round"/>
            
            {/* Foreground Building Tall Right */}
            <path d="M380 400 L380 50 L480 30 L480 400 Z" fill="#FEF3C7" stroke="#334155" strokeWidth="4" strokeLinejoin="round"/>
            
            {/* Right Edge Building */}
            <path d="M480 200 L550 160 L550 400 Z" fill="#E0F2FE" stroke="#334155" strokeWidth="4" strokeLinejoin="round"/>
            
            {/* Foreground Small Pink Building */}
            <path d="M250 400 L250 280 L350 240 L350 400 Z" fill="#FCE7F3" stroke="#334155" strokeWidth="4" strokeLinejoin="round"/>
            
            {/* Slanted lines on Middle-Left Building */}
            <line x1="150" y1="380" x2="180" y2="180" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="170" y1="380" x2="200" y2="180" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="190" y1="380" x2="220" y2="180" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>

            {/* Windows on Background Middle-Right */}
            <line x1="310" y1="180" x2="310" y2="200" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="330" y1="180" x2="330" y2="200" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="350" y1="180" x2="350" y2="200" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="370" y1="180" x2="370" y2="200" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>

            <line x1="310" y1="220" x2="310" y2="240" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="330" y1="220" x2="330" y2="240" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="350" y1="220" x2="350" y2="240" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="370" y1="220" x2="370" y2="240" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>

            <line x1="310" y1="260" x2="310" y2="280" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="330" y1="260" x2="330" y2="280" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="350" y1="260" x2="350" y2="280" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="370" y1="260" x2="370" y2="280" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>

            <line x1="310" y1="300" x2="310" y2="320" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="330" y1="300" x2="330" y2="320" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="350" y1="300" x2="350" y2="320" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="370" y1="300" x2="370" y2="320" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>

            {/* Windows on Foreground Tall Right */}
            <line x1="410" y1="80" x2="410" y2="100" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="440" y1="80" x2="440" y2="100" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            
            <line x1="410" y1="120" x2="410" y2="140" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="440" y1="120" x2="440" y2="140" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>

            <line x1="410" y1="160" x2="410" y2="180" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="440" y1="160" x2="440" y2="180" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>

            <line x1="410" y1="200" x2="410" y2="220" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="440" y1="200" x2="440" y2="220" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>

            <line x1="410" y1="240" x2="410" y2="260" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="440" y1="240" x2="440" y2="260" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>

            <line x1="410" y1="280" x2="410" y2="300" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="440" y1="280" x2="440" y2="300" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>

            <line x1="410" y1="320" x2="410" y2="340" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="440" y1="320" x2="440" y2="340" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>

            <line x1="410" y1="360" x2="410" y2="380" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="440" y1="360" x2="440" y2="380" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>

            {/* Windows on Pink Building */}
            <line x1="270" y1="300" x2="330" y2="280" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="270" y1="330" x2="330" y2="310" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="270" y1="360" x2="330" y2="340" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>

            {/* Horizontal lines on Left Building */}
            <line x1="70" y1="280" x2="130" y2="280" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="70" y1="310" x2="130" y2="310" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="70" y1="340" x2="130" y2="340" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="70" y1="370" x2="130" y2="370" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>

            {/* Trees */}
            <circle cx="160" cy="380" r="25" fill="white" stroke="#334155" strokeWidth="4"/>
            <circle cx="160" cy="350" r="20" fill="white" stroke="#334155" strokeWidth="4"/>
            <line x1="160" y1="360" x2="160" y2="400" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="160" y1="380" x2="145" y2="365" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="160" y1="380" x2="175" y2="365" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>

            <circle cx="490" cy="370" r="30" fill="white" stroke="#334155" strokeWidth="4"/>
            <circle cx="490" cy="335" r="25" fill="white" stroke="#334155" strokeWidth="4"/>
            <line x1="490" y1="350" x2="490" y2="400" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="490" y1="375" x2="475" y2="355" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="490" y1="375" x2="505" y2="355" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            
            <circle cx="550" cy="385" r="20" fill="white" stroke="#334155" strokeWidth="4"/>
            <circle cx="550" cy="360" r="15" fill="white" stroke="#334155" strokeWidth="4"/>
            <line x1="550" y1="370" x2="550" y2="400" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="550" y1="385" x2="540" y2="370" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            <line x1="550" y1="385" x2="560" y2="370" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
            
          </svg>
        </div>
      </div>
      
    </div>
  );
}
