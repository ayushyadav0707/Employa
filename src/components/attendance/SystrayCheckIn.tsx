'use client';

import { useState, useEffect, useTransition } from 'react';
import { checkIn, checkOut, getTodayAttendance } from '@/app/actions/attendance';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

const OFFICE_LAT = 21.104719;
const OFFICE_LNG = 79.042799;
const ALLOWED_RADIUS = 200; // 200 meters to account for GPS inaccuracies inside buildings

// Haversine formula to calculate distance in meters
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; 
}

export default function SystrayCheckIn() {
  const [status, setStatus] = useState<'Present' | 'Absent' | 'Leave' | 'Loading'>('Loading');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);

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
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsCheckingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const distance = getDistance(
          OFFICE_LAT, OFFICE_LNG,
          position.coords.latitude, position.coords.longitude
        );

        if (distance > ALLOWED_RADIUS) {
          setIsCheckingLocation(false);
          alert(`🚫 Geofence Alert: You are ${Math.round(distance)} meters away!\n\nYou must be within ${ALLOWED_RADIUS}m of the office (${OFFICE_LAT}, ${OFFICE_LNG}) to clock in.`);
          return;
        }

        // Inside geofence, proceed with check-in
        startTransition(async () => {
          const res = await checkIn();
          if (res.success) {
            setStatus('Present');
            setIsCheckedIn(true);
          }
          setIsCheckingLocation(false);
        });
      },
      (error) => {
        setIsCheckingLocation(false);
        alert("📍 Unable to retrieve your location. Please allow location access in your browser to check in.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleCheckOut = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsCheckingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const distance = getDistance(
          OFFICE_LAT, OFFICE_LNG,
          position.coords.latitude, position.coords.longitude
        );

        if (distance > ALLOWED_RADIUS) {
          setIsCheckingLocation(false);
          alert(`🚫 Geofence Alert: You are ${Math.round(distance)} meters away!\n\nYou must be within ${ALLOWED_RADIUS}m of the office to clock out. If you forgot to clock out before leaving, please contact HR to regularize your timesheet.`);
          return;
        }

        // Inside geofence, proceed with check-out
        startTransition(async () => {
          const res = await checkOut();
          if (res.success) {
            setIsCheckedIn(false);
          }
          setIsCheckingLocation(false);
        });
      },
      (error) => {
        setIsCheckingLocation(false);
        alert("📍 Unable to retrieve your location. Please allow location access in your browser to check out.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
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
            disabled={isPending || isCheckingLocation}
            className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 text-xs font-bold rounded-lg border border-green-200 transition-colors disabled:opacity-50"
          >
            {(isPending || isCheckingLocation) ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <LogIn className="w-3.5 h-3.5 mr-1.5" />}
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
