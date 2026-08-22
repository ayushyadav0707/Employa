'use client';

import React from 'react';
import { AttendanceRecord, ClockSessionState } from '@/types/attendance';
import { Coffee, LogIn, LogOut, MapPin, Info } from 'lucide-react';

interface AttendanceDailyViewProps {
  record?: AttendanceRecord;
  session?: ClockSessionState;
}

export const AttendanceDailyView: React.FC<AttendanceDailyViewProps> = ({ record, session }) => {
  const isCheckedIn = session?.isCheckedIn || (record && record.checkIn && !record.checkOut);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Today's Attendance Timeline</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Live work activity log and shift progression</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          record?.status === 'Present'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
            : record?.status === 'Half-day'
            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
            : record?.status === 'Leave'
            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
        }`}>
          {record?.status || (isCheckedIn ? 'Present (Active)' : 'Not Started')}
        </span>
      </div>

      <div className="mt-6 space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        <div className="relative flex items-start gap-4">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
            record?.checkIn || session?.checkInTime
              ? 'bg-emerald-600 text-white ring-4 ring-emerald-50 dark:ring-emerald-950'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
          }`}>
            <LogIn className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">Shift Check-In</span>
              <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                {record?.checkIn || (session?.checkInTime ? new Date(session.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Pending')}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {record?.location || 'Office HQ - Main Gate Sensor'}
            </p>
          </div>
        </div>

        <div className="relative flex items-start gap-4">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
            session?.accumulatedBreakSeconds || (record?.breakDurationMinutes && record.breakDurationMinutes > 0)
              ? 'bg-amber-500 text-white ring-4 ring-amber-50 dark:ring-amber-950'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
          }`}>
            <Coffee className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">Lunch & Refreshment Break</span>
              <span className="text-xs font-mono font-medium text-amber-600 dark:text-amber-400">
                {session?.isOnBreak ? 'Active Break' : `${record?.breakDurationMinutes || Math.round((session?.accumulatedBreakSeconds || 0) / 60)} mins`}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Standard lunch allowance: 45 - 60 minutes
            </p>
          </div>
        </div>

        <div className="relative flex items-start gap-4">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
            record?.checkOut
              ? 'bg-indigo-600 text-white ring-4 ring-indigo-50 dark:ring-indigo-950'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
          }`}>
            <LogOut className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">Shift Check-Out</span>
              <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
                {record?.checkOut || (isCheckedIn ? 'In Progress' : 'Pending')}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {record?.totalHours ? `Total Recorded: ${record.totalHours} hrs` : isCheckedIn ? 'Currently working shift' : 'Not clocked out yet'}
            </p>
          </div>
        </div>
      </div>

      {record?.remarks && (
        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-xl flex items-start gap-2.5 text-xs text-blue-800 dark:text-blue-300">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Supervisor / System Remarks:</span> {record.remarks}
          </div>
        </div>
      )}
    </div>
  );
};
