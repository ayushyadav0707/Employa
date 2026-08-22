'use client';

import React, { useState, useEffect } from 'react';
import { Play, Square, Coffee, Clock, MapPin, CheckCircle, Building2, Laptop } from 'lucide-react';
import { ClockSessionState } from '@/types/attendance';
import { AttendanceService } from '@/lib/attendance/attendanceService';

interface ClockWidgetProps {
  employeeId: string;
  employeeName?: string;
  onSessionChange?: () => void;
}

export const ClockWidget: React.FC<ClockWidgetProps> = ({
  employeeId,
  employeeName = 'John Doe',
  onSessionChange
}) => {
  const [session, setSession] = useState<ClockSessionState>({
    isCheckedIn: false,
    checkInTime: null,
    elapsedSeconds: 0,
    isOnBreak: false,
    breakStartTime: null,
    accumulatedBreakSeconds: 0
  });

  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<'HQ - Floor 3' | 'Remote (Work From Home)' | 'Client Office'>('HQ - Floor 3');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentTime(new Date());
    const currentSession = AttendanceService.getClockSession(employeeId);
    setSession(currentSession);
  }, [employeeId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());

      if (session.isCheckedIn && session.checkInTime) {
        const checkInMs = new Date(session.checkInTime).getTime();
        const nowMs = Date.now();
        let totalElapsed = Math.max(0, Math.floor((nowMs - checkInMs) / 1000));

        if (session.isOnBreak && session.breakStartTime) {
          const breakStartMs = new Date(session.breakStartTime).getTime();
          const currentBreakSeconds = Math.max(0, Math.floor((nowMs - breakStartMs) / 1000));
          totalElapsed -= (session.accumulatedBreakSeconds + currentBreakSeconds);
        } else {
          totalElapsed -= session.accumulatedBreakSeconds;
        }

        setSession(prev => ({
          ...prev,
          elapsedSeconds: Math.max(0, totalElapsed)
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [session.isCheckedIn, session.checkInTime, session.isOnBreak, session.breakStartTime, session.accumulatedBreakSeconds]);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClockIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      const result = AttendanceService.clockIn(employeeId, selectedLocation);
      setSession(result.session);
      setIsLoading(false);
      onSessionChange?.();
    }, 300);
  };

  const handleClockOut = () => {
    if (!confirm('Are you sure you want to clock out for the day?')) return;
    setIsLoading(true);
    setTimeout(() => {
      const result = AttendanceService.clockOut(employeeId);
      setSession(result.session);
      setIsLoading(false);
      onSessionChange?.();
    }, 300);
  };

  const handleToggleBreak = () => {
    setIsLoading(true);
    setTimeout(() => {
      const updated = AttendanceService.toggleBreak(employeeId);
      setSession(updated);
      setIsLoading(false);
      onSessionChange?.();
    }, 200);
  };

  const targetHoursSeconds = 8 * 3600;
  const progressPercent = Math.min(100, Math.round((session.elapsedSeconds / targetHoursSeconds) * 100));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden transition-all">
      <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -z-10 opacity-20 transition-all ${
        session.isCheckedIn
          ? session.isOnBreak
            ? 'bg-amber-500'
            : 'bg-emerald-500'
          : 'bg-indigo-500'
      }`} />

      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Real-time Attendance
            </span>
            {session.isCheckedIn ? (
              session.isOnBreak ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  On Break
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Working Now
                </span>
              )
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Not Checked In
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {currentTime ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) : '--:--:--'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {currentTime ? currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }) : 'Loading...'}
          </p>
        </div>

        {!session.isCheckedIn && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedLocation('HQ - Floor 3')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                selectedLocation === 'HQ - Floor 3'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Office HQ
            </button>
            <button
              onClick={() => setSelectedLocation('Remote (Work From Home)')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                selectedLocation === 'Remote (Work From Home)'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              Remote WFH
            </button>
          </div>
        )}
      </div>

      <div className="my-6 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col items-center px-4">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {session.isCheckedIn ? 'Active Work Time' : 'Today Work Timer'}
            </span>
            <span className={`text-4xl font-extrabold tracking-tight font-mono ${
              session.isCheckedIn
                ? session.isOnBreak
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-700 dark:text-slate-300'
            }`}>
              {formatTimer(session.elapsedSeconds)}
            </span>
          </div>
        </div>

        {session.isCheckedIn && (
          <div className="mt-4 max-w-md mx-auto">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span>Progress (8h Target)</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {!session.isCheckedIn ? (
          <button
            onClick={handleClockIn}
            disabled={isLoading}
            className="col-span-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md hover:shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Clock In Now</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleToggleBreak}
              disabled={isLoading}
              className={`py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                session.isOnBreak
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>{session.isOnBreak ? 'Resume Work' : 'Take a Break'}</span>
            </button>

            <button
              onClick={handleClockOut}
              disabled={isLoading}
              className="py-3 px-4 rounded-xl font-medium text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-sm hover:shadow-rose-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Clock Out</span>
            </button>
          </>
        )}
      </div>

      {session.isCheckedIn && session.checkInTime && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            Started at {new Date(session.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {selectedLocation}
          </span>
        </div>
      )}
    </div>
  );
};
