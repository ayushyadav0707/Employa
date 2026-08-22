'use client';

import React from 'react';
import { AttendanceStats } from '@/types/attendance';
import { CheckCircle2, Clock, CalendarDays, TrendingUp } from 'lucide-react';

interface AttendanceStatsCardsProps {
  stats: AttendanceStats;
  isAdmin?: boolean;
}

export const AttendanceStatsCards: React.FC<AttendanceStatsCardsProps> = ({ stats, isAdmin = false }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {isAdmin ? 'Team Attendance Rate' : 'Attendance Rate'}
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.attendanceRatePercentage}%
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
            Target: 95%
          </span>
        </div>
        <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-1.5 rounded-full"
            style={{ width: `${Math.min(100, stats.attendanceRatePercentage)}%` }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {isAdmin ? 'Present Today' : 'Days Present'}
          </span>
          <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.presentCount}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            / {stats.totalWorkdays} workdays
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          {stats.halfDayCount > 0 ? `+ ${stats.halfDayCount} half-days logged` : 'Consistent attendance'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {isAdmin ? 'On Leave / Absent' : 'Leaves & Absences'}
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <CalendarDays className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.leaveCount + stats.absentCount}
          </span>
          <span className="text-xs text-amber-600 dark:text-amber-400">
            ({stats.leaveCount} Leave, {stats.absentCount} Absent)
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          {stats.absentCount === 0 ? 'Zero unexcused absences' : `${stats.absentCount} unexcused absence`}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {isAdmin ? 'Avg Daily Hours' : 'Hours Logged'}
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {isAdmin ? `${stats.avgHoursPerDay}h` : `${stats.totalHoursWorked}h`}
          </span>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            {stats.overtimeHours > 0 ? `+${stats.overtimeHours}h OT` : 'On target'}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Avg: {stats.avgHoursPerDay} hrs/day
        </p>
      </div>
    </div>
  );
};
