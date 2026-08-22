'use client';

import { useState, useEffect, useTransition } from 'react';
import { checkIn, checkOut, getTodayAttendance } from '@/app/actions/attendance';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export default function SystrayCheckIn() {
  const [status, setStatus] = useState<'Present' | 'Absent' | 'Leave' | 'Loading'>('Loading');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadAttendance() {
      const att = await getTodayAttendance();
      if (att) {
        if (att.status === 'Present') {
          setStatus('Present');
          setIsCheckedIn(!att.checkOut);
        } else if (att.status === 'Leave') {
          setStatus('Leave');
          setIsCheckedIn(false);
        } else {
          setStatus('Absent');
          setIsCheckedIn(false);
        }
      } else {
        setStatus('Absent');
        setIsCheckedIn(false);
      }
    }
    loadAttendance();
  }, []);

  const handleCheckIn = () => {
    startTransition(async () => {
      const res = await checkIn();
      if (res.success) {
        setStatus('Present');
        setIsCheckedIn(true);
      }
    });
  };

  const handleCheckOut = () => {
    startTransition(async () => {
      const res = await checkOut();
      if (res.success) {
        setIsCheckedIn(false);
      }
    });
  };

  if (status === 'Loading') {
    return <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse"></div>;
  }

  return (
    <div className="flex items-center space-x-3 mr-4">
      {/* Status Dot */}
      <div className="flex items-center group relative cursor-help">
        {status === 'Present' && isCheckedIn && (
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        )}
        {status === 'Present' && !isCheckedIn && (
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        )}
        {status === 'Absent' && (
          <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400"></span>
        )}
        {status === 'Leave' && (
          <span className="text-xs">✈️</span>
        )}
        
        {/* Tooltip */}
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
          {status === 'Leave' ? 'On Leave' : isCheckedIn ? 'Checked In' : status === 'Present' ? 'Checked Out' : 'Not Checked In'}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-2">
        {!isCheckedIn && status === 'Absent' && (
          <button
            onClick={handleCheckIn}
            disabled={isPending}
            className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 text-xs font-bold rounded-lg border border-green-200 transition-colors disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <LogIn className="w-3.5 h-3.5 mr-1.5" />}
            Check In
          </button>
        )}
        
        {isCheckedIn && (
          <button
            onClick={handleCheckOut}
            disabled={isPending}
            className="flex items-center px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold rounded-lg border border-red-200 transition-colors disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5 mr-1.5" />}
            Check Out
          </button>
        )}
      </div>
    </div>
  );
}
