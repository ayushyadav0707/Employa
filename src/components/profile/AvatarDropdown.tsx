'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut } from 'lucide-react';

interface AvatarDropdownProps {
  userName: string;
  userEmail: string;
  userInitial: string;
  profilePicture?: string | null;
}

export default function AvatarDropdown({ userName, userEmail, userInitial, profilePicture }: AvatarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none"
      >
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-black font-bold text-sm border-2 border-transparent hover:border-primary transition-colors shadow-sm overflow-hidden relative">
          {profilePicture ? (
            <img src={profilePicture} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            userInitial
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-border py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-border mb-1">
            <p className="text-sm font-bold text-text">{userName}</p>
            <p className="text-xs text-text-muted truncate mt-0.5">{userEmail}</p>
          </div>
          <Link 
            href="/profile" 
            onClick={() => setIsOpen(false)}
            className="flex items-center px-4 py-2.5 text-sm text-text hover:bg-bg-page hover:text-black font-medium transition-colors"
          >
            <User className="w-4 h-4 mr-2" />
            My Profile
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
