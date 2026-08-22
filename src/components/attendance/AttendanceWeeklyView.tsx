'use client';

import React from 'react';
import { AttendanceRecord } from '@/types/attendance';
import { BarChart3 } from 'lucide-react';

interface AttendanceWeeklyViewProps {
  records: AttendanceRecord[];
}

export const AttendanceWeeklyView: React.FC<AttendanceWeeklyViewProps> = ({ records }) => {
  const weekDays = [
    { dayName: 'Mon', date: '2026-08-17', fullDate: 'Aug 17' },
    { dayName: 'Tue', date: '2026-08-18', fullDate: 'Aug 18' },
    { dayName: 'Wed', date: '2026-08-19', fullDate: 'Aug 19' },
    { dayName: 'Thu', date: '2026-08-20', fullDate: 'Aug 20' },
    { dayName: 'Fri', date: '2026-08-21', fullDate: 'Aug 21' },
    { dayName: 'Sat', date: '2026-08-22', fullDate: 'Aug 22' },
    { dayName: 'Sun', date: '2026-08-23', fullDate: 'Aug 23' },
  ];

  const weekData = weekDays.map(wd => {
    const match = records.find(r => r.date === wd.date);
    const hours = match?.totalHours || (match?.status === 'Present' && !match.checkOut ? 8.0 : 0);
    return {
      ...wd,
      record: match,
      hours,
      status: match?.status || (['Sat', 'Sun'].includes(wd.dayName) ? 'Weekend' : 'Absent')
    };
  });

  const totalWeekHours = weekData.reduce((acc, curr) => acc + curr.hours, 0);
  const targetWeekHours = 40;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Weekly Timesheet Summary
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Week of Aug 17 - Aug 23, 2026</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Logged: <strong className="text-slate-900 dark:text-white">{totalWeekHours.toFixed(1)} hrs</strong></span>
          <span className="text-slate-400 dark:text-slate-600">/</span>
          <span className="text-slate-500 dark:text-slate-400">Target: <strong className="text-slate-900 dark:text-white">{targetWeekHours} hrs</strong></span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-2 sm:gap-3">
        {weekData.map((d, index) => {
          const heightPercent = Math.min(100, Math.round((d.hours / 10) * 100));
          const isWeekend = ['Sat', 'Sun'].includes(d.dayName);

          return (
            <div key={index} className="flex flex-col items-center group">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
                {d.hours > 0 ? `${d.hours}h` : '-'}
              </span>

              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl h-32 flex flex-col justify-end p-1.5 relative overflow-hidden">
                <div className="absolute bottom-[80%] left-0 right-0 border-b border-dashed border-slate-300 dark:border-slate-600 z-10" title="8h Standard Target" />

                <div
                  className={`w-full rounded-lg transition-all duration-500 ${
                    d.status === 'Present'
                      ? 'bg-gradient-to-t from-emerald-600 to-teal-500'
                      : d.status === 'Half-day'
                      ? 'bg-gradient-to-t from-amber-500 to-amber-400'
                      : d.status === 'Leave'
                      ? 'bg-gradient-to-t from-blue-500 to-blue-400'
                      : isWeekend
                      ? 'bg-slate-200 dark:bg-slate-700/50'
                      : 'bg-transparent'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              <span className={`text-xs font-bold mt-2.5 ${
                d.date === '2026-08-22' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
              }`}>
                {d.dayName}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {d.fullDate}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
          <span>Present (Full Day)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
          <span>Half-Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
          <span>Approved Leave</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" />
          <span>Weekend / Off</span>
        </div>
      </div>
    </div>
  );
};
