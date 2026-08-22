'use client';

import React, { useState } from 'react';
import { AttendanceRecord } from '@/types/attendance';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';

interface AttendanceCalendarViewProps {
  records: AttendanceRecord[];
}

export const AttendanceCalendarView: React.FC<AttendanceCalendarViewProps> = ({ records }) => {
  const [currentMonth, setCurrentMonth] = useState(7);
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedRecord, setSelectedRecord] = useState<{ dateStr: string; record?: AttendanceRecord } | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push({ empty: true, dayNumber: 0, dateStr: '' });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = d.toString().padStart(2, '0');
    const monthStr = (currentMonth + 1).toString().padStart(2, '0');
    const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
    const record = records.find(r => r.date === dateStr);
    const dayOfWeek = new Date(currentYear, currentMonth, d).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    days.push({
      empty: false,
      dayNumber: d,
      dateStr,
      record,
      isWeekend
    });
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Monthly Attendance Calendar
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Click any active day to view logs and punch timings
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-900 dark:text-white px-3 min-w-[120px] text-center">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mt-4 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((wd, i) => (
          <div key={i} className="py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {wd}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 mt-1">
        {days.map((item, idx) => {
          if (item.empty) {
            return <div key={`empty-${idx}`} className="h-20 rounded-xl bg-slate-50/50 dark:bg-slate-800/20" />;
          }

          const hasRecord = !!item.record;
          const status = item.record?.status;

          return (
            <div
              key={`day-${item.dayNumber}`}
              onClick={() => setSelectedRecord({ dateStr: item.dateStr, record: item.record })}
              className={`h-20 p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                item.dateStr === '2026-08-22'
                  ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20'
                  : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${
                  item.dateStr === '2026-08-22'
                    ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                    : item.isWeekend
                    ? 'text-slate-400 dark:text-slate-500'
                    : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {item.dayNumber}
                </span>

                {item.dateStr === '2026-08-22' && (
                  <span className="text-[9px] font-semibold bg-indigo-600 text-white px-1.5 py-0.2 rounded">
                    Today
                  </span>
                )}
              </div>

              {hasRecord ? (
                <div className="mt-auto">
                  <div className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md truncate flex items-center justify-between ${
                    status === 'Present'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : status === 'Half-day'
                      ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      : status === 'Leave'
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}>
                    <span>{status}</span>
                    {item.record?.totalHours ? <span className="opacity-80">{item.record.totalHours}h</span> : null}
                  </div>
                </div>
              ) : item.isWeekend ? (
                <div className="mt-auto text-[10px] text-slate-400 dark:text-slate-600 font-medium">
                  Off
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  {new Date(selectedRecord.dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Day Log Details</p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedRecord.record ? (
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Status:</span>
                  <span className={`font-semibold px-2 py-0.5 rounded ${
                    selectedRecord.record.status === 'Present'
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                      : selectedRecord.record.status === 'Half-day'
                      ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                      : 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                  }`}>
                    {selectedRecord.record.status}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Check In Time:</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-white">
                    {selectedRecord.record.checkIn || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Check Out Time:</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-white">
                    {selectedRecord.record.checkOut || (selectedRecord.dateStr === '2026-08-22' ? 'In Progress' : 'N/A')}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Total Hours Worked:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedRecord.record.totalHours ? `${selectedRecord.record.totalHours} hrs` : '-'}
                  </span>
                </div>

                {selectedRecord.record.location && (
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Location:</span>
                    <span className="text-slate-900 dark:text-white font-medium">
                      {selectedRecord.record.location}
                    </span>
                  </div>
                )}

                {selectedRecord.record.remarks && (
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl mt-3 text-slate-600 dark:text-slate-300">
                    <strong>Remarks:</strong> {selectedRecord.record.remarks}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                No attendance logs found for this date.
              </div>
            )}

            <button
              onClick={() => setSelectedRecord(null)}
              className="mt-6 w-full py-2.5 rounded-xl font-medium text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
