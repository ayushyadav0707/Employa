// This file is generated
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock, Square, XCircle, ChevronRight, Calendar as CalendarIcon, Check, CalendarDays, FileText, Download, ChevronLeft } from 'lucide-react';
import { checkIn, checkOut } from '@/app/actions/attendance';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: number;
  status: string;
  location: string | null;
  remarks: string | null;
  user?: { name: string; department: string | null };
}

interface AdminUser {
  id: string;
  name: string;
  loginId: string;
  department: string | null;
  jobTitle: string | null;
  profilePicture: string | null;
  todayAttendance: AttendanceRecord | null;
}

interface AdminStats {
  present: number;
  onLeave: number;
  halfDay: number;
  absent: number;
  total: number;
}

interface Props {
  isAdmin: boolean;
  currentUserId: string;
  currentUserName?: string;
  todayDate: string;
  viewMonthStr: string;
  adminUsers?: AdminUser[];
  adminStats?: AdminStats;
  monthRecords?: any[];
  myMonthRecords?: AttendanceRecord[];
  todayAttendance?: AttendanceRecord | null;
  myStats?: any;
}

function formatHours(decimalHours: number | null | undefined): React.ReactNode {
  if (!decimalHours) return '-';
  const hrs = Math.floor(decimalHours);
  const mins = Math.round((decimalHours - hrs) * 60);
  return (
    <span>
      {hrs}<span className="text-[0.65em] text-gray-500 font-bold ml-[1px] mr-1.5">h</span>
      {mins}<span className="text-[0.65em] text-gray-500 font-bold ml-[1px]">m</span>
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  if (status === 'Present' || status === 'Approved') {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-green-50 text-green-600 rounded-full text-[11px] font-bold whitespace-nowrap border border-green-100">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
        {status === 'Present' ? 'Present' : 'Approved'}
      </div>
    );
  }
  if (status === 'Leave' || status === 'Absent') {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-red-50 text-red-600 rounded-full text-[11px] font-bold whitespace-nowrap border border-red-100">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
        {status}
      </div>
    );
  }
  if (status === 'Half-day' || status === 'Half Day') {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-[11px] font-bold whitespace-nowrap border border-primary/20">
        <div className="w-1.5 h-1.5 rounded-full bg-primary text-black"></div>
        {status}
      </div>
    );
  }
  if (status === 'Invalid') {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-orange-50 text-orange-600 rounded-full text-[11px] font-bold whitespace-nowrap border border-orange-100">
        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
        {status}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-gray-50 text-gray-600 rounded-full text-[11px] font-bold whitespace-nowrap border border-border">
      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
      {status}
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function MonthPickerButton({ viewMonthStr, currentMonthName }: { viewMonthStr: string, currentMonthName: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex items-center">
      <input 
        ref={inputRef}
        type="month" 
        value={viewMonthStr} 
        onChange={(e) => {
          if (e.target.value) {
            router.push(`?month=${e.target.value}`);
          }
        }}
        className="absolute w-0 h-0 opacity-0 -z-10"
      />
      <button 
        onClick={() => {
          try {
            inputRef.current?.showPicker();
          } catch(e) {
            inputRef.current?.focus();
          }
        }}
        className="flex items-center gap-2 px-3 sm:px-4 py-0.5.5 sm:py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-[13px] font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
      >
        <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" /> 
        {currentMonthName}
      </button>
    </div>
  );
}

function AttendanceSummary({ stats, pct }: { stats: any, pct: number }) {
  const dash = pct;
  const offset = 0;

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-border p-4 flex flex-col xl:flex-row items-center gap-5 w-full">
      <div className="flex items-center gap-5 xl:pr-8 xl:border-r border-border w-full xl:w-auto shrink-0 justify-center xl:justify-start">
        <div className="relative w-[56px] h-[56px] shrink-0">
          <svg viewBox="-3 -3 42 42" className="w-full h-full transform -rotate-90">
            <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#f3f4f6" strokeWidth="4"></circle>
            <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#ef4444" strokeWidth="4" strokeDasharray={`${dash} 100`} strokeDashoffset={offset} strokeLinecap="round" className={pct > 0 ? "text-red-500" : "hidden"}></circle>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[13px] font-extrabold text-gray-900">{pct}%</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-bold text-gray-900 leading-tight">Attendance<br/>Rate</span>
          <span className="text-[11px] font-medium text-gray-500 mt-1">{stats.presentCount} of {stats.totalWorkingDays} days</span>
        </div>
      </div>

      <div className="flex-1 flex flex-wrap items-center justify-around xl:justify-between gap-4 w-full">
        <div className="flex flex-col items-center xl:items-start min-w-[70px]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[18px] font-extrabold text-gray-900 leading-none">{stats.presentCount}</span>
          </div>
          <span className="text-[12px] font-bold text-gray-500 mb-0.5">Present</span>
          <span className="text-[10px] font-medium text-gray-400">{stats.presentPct}%</span>
        </div>
        
        <div className="flex flex-col items-center xl:items-start min-w-[70px]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-[18px] font-extrabold text-gray-900 leading-none">{stats.absentCount}</span>
          </div>
          <span className="text-[12px] font-bold text-gray-500 mb-0.5">Absent</span>
          <span className="text-[10px] font-medium text-gray-400">{stats.absentPct}%</span>
        </div>

        <div className="flex flex-col items-center xl:items-start min-w-[70px]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span className="text-[18px] font-extrabold text-gray-900 leading-none">{stats.leaveCount}</span>
          </div>
          <span className="text-[12px] font-bold text-gray-500 mb-0.5">On Leave</span>
          <span className="text-[10px] font-medium text-gray-400">{stats.leavePct}%</span>
        </div>

        <div className="flex flex-col items-center xl:items-start min-w-[70px]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-2 h-2 rounded-full bg-primary text-black"></div>
            <span className="text-[18px] font-extrabold text-gray-900 leading-none">{stats.halfDayCount}</span>
          </div>
          <span className="text-[12px] font-bold text-gray-500 mb-0.5">Half Days</span>
          <span className="text-[10px] font-medium text-gray-400">{stats.halfPct}%</span>
        </div>

        <div className="flex flex-col items-center xl:items-start min-w-[70px]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span className="text-[18px] font-extrabold text-gray-900 leading-none">{stats.invalidCount}</span>
          </div>
          <span className="text-[12px] font-bold text-gray-500 mb-0.5">Invalid</span>
          <span className="text-[10px] font-medium text-gray-400">{stats.invalidPct}%</span>
        </div>
      </div>

      <div className="flex items-center gap-4 xl:pl-8 xl:border-l border-border justify-center xl:justify-start w-full xl:w-auto mt-4 xl:mt-0">
        <Clock className="w-6 h-6 text-gray-400" />
        <div className="flex flex-col">
          <span className="text-[18px] font-extrabold text-gray-900 leading-none">{formatHours(stats.totalHours)}</span>
          <span className="text-[12px] font-bold text-gray-500 mt-1">Total Hours</span>
        </div>
      </div>
    </div>
  );
}

function ModernCalendarGrid({ records, viewMonthStr, onPrevMonth, onNextMonth, onMonthSelect }: { records: AttendanceRecord[], viewMonthStr: string, onPrevMonth: ()=>void, onNextMonth: ()=>void, onMonthSelect?: (v: string) => void }) {
  const [year, monthNum] = viewMonthStr.split('-').map(Number);
  const month = monthNum - 1;
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const currentDay = today.getDate();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); 
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

  const getDotColor = (day: number, record?: AttendanceRecord) => {
    const date = new Date(year, month, day);
    const isSunday = date.getDay() === 0;
    const checkToday = new Date();
    const todayDateStr = `${checkToday.getFullYear()}-${String(checkToday.getMonth() + 1).padStart(2, '0')}-${String(checkToday.getDate()).padStart(2, '0')}`;
    checkToday.setHours(0, 0, 0, 0);

    if (record) {
      if (record.checkIn && !record.checkOut && record.date !== todayDateStr) return 'bg-orange-500';
      if (record.status === 'Present') return 'bg-green-500';
      if (record.status === 'Leave' || record.status === 'Absent') return 'bg-red-500';
      if (record.status === 'Half-day' || record.status === 'Half Day') return 'bg-primary text-black';
      return 'bg-gray-200';
    }
    if (isSunday) return 'bg-transparent';
    if (date < checkToday) return 'bg-red-500';
    return 'bg-transparent';
  };

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const paddingPrev = Array.from({ length: firstDayOfWeek }).map((_, i) => i);

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-border p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900 text-[15px]">Calendar</h3>
          <div className="relative flex items-center group cursor-pointer">
            <input 
              type="month" 
              value={viewMonthStr} 
              onChange={(e) => {
                if (e.target.value && onMonthSelect) {
                  onMonthSelect(e.target.value);
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <CalendarIcon className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onPrevMonth} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={onNextMonth} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="text-center font-bold text-[14px] text-gray-800 mb-3">{monthName}</div>
      <div className="grid grid-cols-7 gap-y-1 mb-4">
        {weekDays.map(d => (
          <div key={d} className="text-center text-[11px] font-bold text-gray-400">{d}</div>
        ))}
        {paddingPrev.map(i => (
          <div key={`prev-${i}`} className="flex justify-center py-0.5">
             <span className="text-[13px] font-medium text-gray-300"></span>
          </div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const r = records.find(rec => rec.date === dStr);
          const isToday = isCurrentMonth && day === currentDay;
          const dot = getDotColor(day, r);
          
          return (
            <div key={day} className="flex flex-col items-center justify-start gap-1.5 py-0.5">
              <div className={`w-7 h-7 flex items-center justify-center rounded-xl text-[13px] font-semibold transition-colors cursor-default ${isToday ? 'bg-primary/20 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}>
                {day}
              </div>
              <div className={`w-1.5 h-1.5 rounded-full ${dot}`}></div>
            </div>
          );
        })}
      </div>
      <div className="mt-auto pt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-semibold text-gray-500">
         <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div>Present</div>
         <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div>Absent</div>
         <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-400"></div>Leave</div>
         <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary text-black"></div>Half Day</div>
         <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div>Invalid</div>
      </div>
    </div>
  );
}

function TodayAttendanceCard({ todayAttendance, onCheckIn, onCheckOut, isPending }: { todayAttendance: AttendanceRecord | null, onCheckIn: ()=>void, onCheckOut: ()=>void, isPending: boolean }) {
  const isCheckedIn = !!todayAttendance?.checkIn && !todayAttendance?.checkOut;
  const isCheckedOut = !!todayAttendance?.checkOut;
  const isPresent = isCheckedIn || isCheckedOut || todayAttendance?.status === 'Present';

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    if (isCheckedIn) {
      const interval = setInterval(() => setNow(new Date()), 60000);
      return () => clearInterval(interval);
    }
  }, [isCheckedIn]);

  let statusPillText = 'Not checked in';
  let pillColor = 'bg-gray-100 text-gray-500 border-gray-200';
  let dotColor = 'bg-gray-400';
  
  if (isPresent) {
    statusPillText = 'Present';
    pillColor = 'bg-green-50 text-green-600 border-green-100';
    dotColor = 'bg-green-500';
  } else if (todayAttendance?.status === 'Absent' || todayAttendance?.status === 'Leave') {
    statusPillText = todayAttendance.status;
    pillColor = 'bg-red-50 text-red-600 border-red-100';
    dotColor = 'bg-red-500';
  }

  let workedStr = '0h 0m';
  if (isCheckedOut && todayAttendance?.totalHours) {
    const hrs = Math.floor(todayAttendance.totalHours);
    const mins = Math.round((todayAttendance.totalHours - hrs) * 60);
    workedStr = `${hrs}h ${mins}m`;
  } else if (isCheckedIn && todayAttendance?.checkIn) {
    const [h, m] = todayAttendance.checkIn.split(':').map(Number);
    const checkInDate = new Date();
    checkInDate.setHours(h, m, 0, 0);
    const diffMs = now.getTime() - checkInDate.getTime();
    if (diffMs > 0) {
      const totalMins = Math.floor(diffMs / 60000);
      const hrs = Math.floor(totalMins / 60);
      const mins = totalMins % 60;
      workedStr = `${hrs}h ${mins}m`;
    }
  }

  const checkInDisp = todayAttendance?.checkIn ? `${todayAttendance.checkIn} ${parseInt(todayAttendance.checkIn.split(':')[0]) >= 12 ? 'PM' : 'AM'}` : '--:--';

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-border p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-[15px]">Today's Attendance</h3>
        <div className={`flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold border ${pillColor}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>
          {statusPillText}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
             <Clock className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex flex-col">
            <div className="text-[18px] font-extrabold text-gray-900 leading-tight">{checkInDisp}</div>
            <div className="text-[13px] font-medium text-gray-500">{todayAttendance?.checkIn ? 'Checked in' : 'Not checked in'}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
             <Clock className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <div className="text-[13px] font-medium text-gray-500 mb-0.5">Hours Today</div>
            <div className="text-[18px] font-extrabold text-gray-900 leading-tight">{workedStr}</div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 flex flex-col gap-2.5">
        {!isCheckedOut && (
          <>
            {!isCheckedIn ? (
               <button onClick={onCheckIn} disabled={isPending} className="w-full py-2 bg-primary text-black rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70">
                 Clock In
               </button>
            ) : (
               <button onClick={onCheckOut} disabled={isPending} className="w-full py-2 bg-primary text-black rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70">
                 <Square className="w-4 h-4 fill-current" /> Clock Out
               </button>
            )}
          </>
        )}
        {isCheckedOut && (
           <div className="w-full py-2 bg-gray-100 text-gray-500 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2">
             <Check className="w-5 h-5" /> Completed
           </div>
        )}
        {isCheckedIn && <div className="text-center text-[13px] font-medium text-gray-500">You've been working for {workedStr}</div>}
      </div>
    </div>
  );
}

function RecentRecordsTable({ records }: { records: AttendanceRecord[] }) {
  const checkToday = new Date();
  const todayDateStr = `${checkToday.getFullYear()}-${String(checkToday.getMonth() + 1).padStart(2, '0')}-${String(checkToday.getDate()).padStart(2, '0')}`;

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-border p-4 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-[15px]">Recent Records</h3>
        <Link href="/attendance" className="text-xs font-bold text-primary hover:text-black transition-colors flex items-center">
          View All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>
      <div className="flex-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <table className="w-full text-left min-w-[350px]">
          <thead>
            <tr className="text-[11px] font-bold text-gray-400 border-b border-gray-50">
              <th className="pb-3 font-medium px-2">Date</th>
              <th className="pb-3 font-medium px-2">Check In</th>
              <th className="pb-3 font-medium px-2">Check Out</th>
              <th className="pb-3 font-medium px-2">Worked</th>
              <th className="pb-3 font-medium px-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {records.slice(0, 5).map(r => {
              const [y, m, d] = r.date.split('-');
              const dateStr = `${d} ${new Date(Number(y), Number(m)-1).toLocaleString('default', { month: 'short' })}`;
              return (
                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-1.5 px-2 text-[13px] font-semibold text-gray-900 whitespace-nowrap">{dateStr}</td>
                  <td className="py-1.5 px-2 text-[13px] font-semibold text-gray-600 whitespace-nowrap">{r.checkIn || '—'}</td>
                  <td className="py-1.5 px-2 text-[13px] font-semibold text-gray-600 whitespace-nowrap">{r.checkOut || '—'}</td>
                  <td className="py-1.5 px-2 text-[13px] font-semibold text-gray-900 whitespace-nowrap">{r.totalHours ? formatHours(r.totalHours) : '—'}</td>
                  <td className="py-1.5 px-2 flex justify-end">
                    <StatusPill status={r.checkIn && !r.checkOut && r.date !== todayDateStr ? 'Invalid' : r.status} />
                  </td>
                </tr>
              );
            })}
            {records.length === 0 && (
              <tr>
                <td colSpan={5} className="py-0.50 text-center text-[13px] font-semibold text-gray-400">No attendance records yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AttendanceTrendChart({ records, viewMonthStr }: { records: AttendanceRecord[], viewMonthStr: string }) {
  const [year, monthNum] = viewMonthStr.split('-').map(Number);
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  
  const weeks: { label: string, start: number, end: number, hours: number, total: number }[] = [];
  let currentWeek = { label: 'W1', start: 1, end: 1, hours: 0, total: 0 };
  
  const today = new Date();
  today.setHours(0,0,0,0);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthNum - 1, day);
    if (day === daysInMonth) {
      currentWeek.end = day;
      weeks.push({ ...currentWeek });
    } else if (date.getDay() === 0) {
      if (day > 1) {
        currentWeek.end = day;
        weeks.push({ ...currentWeek });
        currentWeek = { label: `W${weeks.length + 1}`, start: day + 1, end: day + 1, hours: 0, total: 0 };
      }
    }
  }

  weeks.forEach(w => {
    for(let d = w.start; d <= w.end; d++) {
      const date = new Date(year, monthNum - 1, d);
      if (date.getDay() === 0) continue; 
      if (date > today) continue; 
      w.total++;
      const dStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const rec = records.find(r => r.date === dStr);
      if (rec && rec.totalHours) {
         w.hours += rec.totalHours;
      }
    }
  });

  const maxHours = Math.max(...weeks.map(w => w.hours), 0.1);
  
  const pathDataPoints = weeks.map((w, idx) => {
    const p = (w.hours / maxHours) * 100;
    const x = (idx / (weeks.length > 1 ? weeks.length - 1 : 1)) * 100;
    const scaledP = p * 0.9; 
    const y = 100 - scaledP; 
    return { x, y, hours: w.hours, label: w.label };
  });

  let pathD = '';
  if (pathDataPoints.length > 0) {
    pathD = `M${pathDataPoints[0].x},${pathDataPoints[0].y}`;
    for (let i = 1; i < pathDataPoints.length; i++) {
      const prev = pathDataPoints[i - 1];
      const curr = pathDataPoints[i];
      const cx = prev.x + (curr.x - prev.x) / 2;
      pathD += ` C${cx},${prev.y} ${cx},${curr.y} ${curr.x},${curr.y}`;
    }
  }
  
  const areaD = `${pathD} L100,100 L0,100 Z`;

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const q25 = maxHours * 0.25;
  const q50 = maxHours * 0.5;
  const q75 = maxHours * 0.75;
  const q100 = maxHours;

  const renderYLabel = (val: number) => {
    if (val === 0) return '0h';
    const h = Math.floor(val);
    const m = Math.round((val - h) * 60);
    if (m === 0) return `${h}h`;
    if (h === 0) return `${m}m`;
    return `${h}h`;
  };

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-border p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-[15px]">Attendance Trend</h3>
        <select className="text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg px-2 py-0.5 outline-none shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
          <option>Weekly</option>
        </select>
      </div>
      <div className="flex-1 flex flex-col relative min-h-[110px] pl-10 pb-4">
        {/* Y Axis */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-bold text-gray-400 text-right pr-2 w-10">
           <span>{renderYLabel(q100)}</span>
           <span>{renderYLabel(q75)}</span>
           <span>{renderYLabel(q50)}</span>
           <span>{renderYLabel(q25)}</span>
           <span>0h</span>
        </div>
        {/* Grid lines */}
        <div className="absolute left-10 right-2 top-1 bottom-6 flex flex-col justify-between pointer-events-none">
           <div className="w-full h-px bg-gray-100"></div>
           <div className="w-full h-px bg-gray-100"></div>
           <div className="w-full h-px bg-gray-100"></div>
           <div className="w-full h-px bg-gray-100"></div>
           <div className="w-full h-px bg-gray-100"></div>
        </div>
        
        {/* SVG Chart */}
        <div className="absolute left-10 right-2 top-1 bottom-6 overflow-visible pointer-events-none">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d={areaD} fill="url(#grad)" opacity="0.2" />
            <path d={pathD} fill="none" stroke="#FFCC2D" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFCC2D" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FFCC2D" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* HTML Data Points */}
        <div className="absolute left-10 right-2 top-1 bottom-6 overflow-visible">
          {pathDataPoints.map((pt, i) => (
             <div 
               key={i}
               className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-white border-2 border-primary cursor-pointer hover:scale-125 transition-transform z-10"
               style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
               onMouseEnter={() => setHoveredIdx(i)}
               onMouseLeave={() => setHoveredIdx(null)}
             >
                {hoveredIdx === i && (
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-0.5.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in duration-200 z-20">
                     <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-gray-300" />
                        {Math.floor(pt.hours)}h {Math.round((pt.hours - Math.floor(pt.hours)) * 60)}m
                     </div>
                     <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                   </div>
                )}
             </div>
          ))}
        </div>
        
        {/* X Axis */}
        <div className="absolute left-10 right-2 bottom-0 flex justify-between text-[10px] font-bold text-gray-400">
           {weeks.map(w => <span key={w.label} className="-ml-2 w-4 text-center">{w.label}</span>)}
        </div>
      </div>
    </div>
  );
}

function MonthlyBreakdownChart({ stats }: { stats: any }) {
  const dash1 = stats.presentPct;
  const offset1 = 0;
  const dash2 = stats.absentPct;
  const offset2 = -dash1;
  const dash3 = stats.leavePct;
  const offset3 = offset2 - dash2;
  const dash4 = stats.halfPct;
  const offset4 = offset3 - dash3;
  const dash5 = stats.invalidPct;
  const offset5 = offset4 - dash4;

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-border p-4 flex flex-col h-full">
      <h3 className="font-bold text-gray-900 text-[15px] mb-4">Monthly Breakdown</h3>
      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center sm:justify-around gap-4 px-2">
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="-3 -3 42 42" className="w-full h-full transform -rotate-90">
            <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#f3f4f6" strokeWidth="6"></circle>
            <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#22c55e" strokeWidth="6" strokeDasharray={`${dash1} 100`} strokeDashoffset={offset1}></circle>
            <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#ef4444" strokeWidth="6" strokeDasharray={`${dash2} 100`} strokeDashoffset={offset2}></circle>
            <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#facc15" strokeWidth="6" strokeDasharray={`${dash3} 100`} strokeDashoffset={offset3}></circle>
            <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#a855f7" strokeWidth="6" strokeDasharray={`${dash4} 100`} strokeDashoffset={offset4}></circle>
            <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#f97316" strokeWidth="6" strokeDasharray={`${dash5} 100`} strokeDashoffset={offset5}></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[18px] font-extrabold text-gray-900 leading-tight">{stats.totalWorkingDays}</span>
            <span className="text-[10px] text-gray-500 font-bold">Total Days</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2.5 w-full sm:w-auto min-w-[140px]">
          <div className="flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div><span className="font-semibold text-gray-600">Present</span></div>
            <span className="font-bold text-gray-900">{stats.presentCount} <span className="text-gray-400 font-medium ml-1">({stats.presentPct}%)</span></span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div><span className="font-semibold text-gray-600">Absent</span></div>
            <span className="font-bold text-gray-900">{stats.absentCount} <span className="text-gray-400 font-medium ml-1">({stats.absentPct}%)</span></span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div><span className="font-semibold text-gray-600">On Leave</span></div>
            <span className="font-bold text-gray-900">{stats.leaveCount} <span className="text-gray-400 font-medium ml-1">({stats.leavePct}%)</span></span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-primary text-black"></div><span className="font-semibold text-gray-600">Half Day</span></div>
            <span className="font-bold text-gray-900">{stats.halfDayCount} <span className="text-gray-400 font-medium ml-1">({stats.halfPct}%)</span></span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div><span className="font-semibold text-gray-600">Invalid</span></div>
            <span className="font-bold text-gray-900">{stats.invalidCount} <span className="text-gray-400 font-medium ml-1">({stats.invalidPct}%)</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionsCard() {
  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-border p-4 flex flex-col h-full">
      <h3 className="font-bold text-gray-900 text-[15px] mb-4">Quick Actions</h3>
      <div className="flex flex-col gap-2.5 flex-1 justify-center">
        <Link href="/time-off" className="flex items-center justify-between p-2.5 rounded-xl border border-border hover:bg-gray-50 transition-colors group">
          <div className="flex items-center gap-2.5.5">
             <CalendarDays className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
             <span className="text-[13px] font-bold text-gray-700">Apply for Leave</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
        </Link>
        <Link href="/attendance" className="flex items-center justify-between p-2.5 rounded-xl border border-border hover:bg-gray-50 transition-colors group cursor-pointer">
          <div className="flex items-center gap-2.5.5">
             <FileText className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
             <span className="text-[13px] font-bold text-gray-700">Attendance Report</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
        </Link>
        <div className="flex items-center justify-between p-2.5 rounded-xl border border-border hover:bg-gray-50 transition-colors group cursor-pointer">
          <div className="flex items-center gap-2.5.5">
             <Download className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
             <span className="text-[13px] font-bold text-gray-700">Export Records</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
        </div>
      </div>
    </div>
  );
}

function RecordModal({ record, onClose }: { record: AttendanceRecord | null, onClose: () => void }) {
  if (!record) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-border bg-gray-50/50">
          <h3 className="font-bold text-gray-900 text-[15px]">Attendance Details</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-50">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</span>
            <span className="text-sm font-bold text-gray-900">{record.date}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-50">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</span>
            <StatusPill status={record.status} />
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-50">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Check In</span>
            <span className="text-sm font-bold text-gray-900">{record.checkIn || '-'}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-50">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Check Out</span>
            <span className="text-sm font-bold text-gray-900">{record.checkOut || '-'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Working Hours</span>
            <span className="text-sm font-bold text-gray-900">{formatHours(record.totalHours)}</span>
          </div>
        </div>
        <div className="p-4 border-t border-border bg-gray-50/50">
          <button onClick={onClose} className="w-full py-1.5 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-gray-800 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AttendancePageClient({
  isAdmin, currentUserId, currentUserName, todayDate, viewMonthStr,
  adminUsers, adminStats, monthRecords,
  myMonthRecords, todayAttendance, myStats
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  
  const [year, monthNum] = viewMonthStr.split('-').map(Number);
  const currentMonthName = new Date(year, monthNum - 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    const d = new Date(year, monthNum - 2, 1);
    router.push(`?month=${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const d = new Date(year, monthNum, 1);
    router.push(`?month=${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleCheckIn = () => {
    startTransition(async () => {
      const res = await checkIn();
      if (res.success) router.refresh();
    });
  };

  const handleCheckOut = () => {
    startTransition(async () => {
      const res = await checkOut();
      if (res.success) router.refresh();
    });
  };

  const renderEmployeeView = () => {
    const records = myMonthRecords || [];
    let presentCount = 0;
    let leaveCount = 0;
    let absentCount = 0;
    let halfDayCount = 0;
    let invalidCount = 0;

    const daysInMonth = new Date(year, monthNum, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthNum - 1, day);
      const isSunday = date.getDay() === 0;
      const dStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const record = records.find(r => r.date === dStr);

      if (record) {
        if (record.checkIn && !record.checkOut && record.date !== todayDate) invalidCount++;
        else if (record.status === 'Present') presentCount++;
        else if (record.status === 'Leave') leaveCount++;
        else if (record.status === 'Absent') absentCount++;
        else if (record.status === 'Half-day' || record.status === 'Half Day') halfDayCount++;
      } else {
        if (!isSunday && date < today) {
          absentCount++; 
        }
      }
    }

    const totalWorkingDays = presentCount + leaveCount + absentCount + halfDayCount + invalidCount;
    
    const presentPct = totalWorkingDays > 0 ? Math.round((presentCount / totalWorkingDays) * 100) : 0;
    const leavePct = totalWorkingDays > 0 ? Math.round((leaveCount / totalWorkingDays) * 100) : 0;
    const absentPct = totalWorkingDays > 0 ? Math.round((absentCount / totalWorkingDays) * 100) : 0;
    const halfPct = totalWorkingDays > 0 ? Math.round((halfDayCount / totalWorkingDays) * 100) : 0;
    const invalidPct = totalWorkingDays > 0 ? Math.round((invalidCount / totalWorkingDays) * 100) : 0;

    const stats = {
      presentCount, leaveCount, absentCount, halfDayCount, invalidCount, totalWorkingDays,
      presentPct, leavePct, absentPct, halfPct, invalidPct,
      totalHours: myStats?.totalHours || 0
    };

    const firstName = currentUserName?.split(' ')[0] || 'User';

    return (
      <div className="flex flex-col gap-4 w-full max-w-[1400px] mx-auto pb-4 animate-in fade-in duration-500">
        {/* Summary Banner */}
        <AttendanceSummary stats={stats} pct={presentPct} />

        {/* Middle Row: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ModernCalendarGrid records={records} viewMonthStr={viewMonthStr} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} onMonthSelect={(val) => router.push(`?month=${val}`)} />
          <TodayAttendanceCard todayAttendance={todayAttendance || null} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} isPending={isPending} />
          <div className="md:col-span-2 lg:col-span-1">
            <RecentRecordsTable records={records} />
          </div>
        </div>

        {/* Bottom Row: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="md:col-span-2 lg:col-span-1">
            <AttendanceTrendChart records={records} viewMonthStr={viewMonthStr} />
          </div>
          <MonthlyBreakdownChart stats={stats} />
          <QuickActionsCard />
        </div>
      </div>
    );
  };

  const renderAdminView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-4 w-full animate-in fade-in duration-500">
      <div className="lg:col-span-12 bg-white rounded-[24px] p-5 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-border flex flex-col min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-x-6 sm:gap-x-10 gap-y-1">
            <div className="flex flex-col">
               <div className="flex items-center gap-1.5"><span className="font-bold text-[22px] text-gray-900">{adminStats?.present || 0}</span><div className="w-2 h-2 rounded-full bg-green-500"></div></div>
               <span className="text-gray-400 text-[11px] uppercase tracking-wider font-bold mt-0.5">Total Present</span>
            </div>
            <div className="flex flex-col">
               <div className="flex items-center gap-1.5"><span className="font-bold text-[22px] text-gray-900">{adminStats?.onLeave || 0}</span><div className="w-2 h-2 rounded-full bg-red-500"></div></div>
               <span className="text-gray-400 text-[11px] uppercase tracking-wider font-bold mt-0.5">Total Leaves</span>
            </div>
            <div className="flex flex-col">
               <div className="flex items-center gap-1.5"><span className="font-bold text-[22px] text-gray-900">{adminStats?.halfDay || 0}</span><div className="w-2 h-2 rounded-full bg-yellow-400"></div></div>
               <span className="text-gray-400 text-[11px] uppercase tracking-wider font-bold mt-0.5">Half Days</span>
            </div>
            <div className="flex flex-col">
               <div className="flex items-center gap-1.5"><span className="font-bold text-[22px] text-gray-900">{adminStats?.absent || 0}</span><div className="w-2 h-2 rounded-full bg-gray-300"></div></div>
               <span className="text-gray-400 text-[11px] uppercase tracking-wider font-bold mt-0.5">Absent</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-gray-50 px-5 py-3 rounded-2xl border border-border">
             <div className="text-right">
               <div className="text-2xl font-bold text-gray-900">{adminStats?.total || 0}</div>
               <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Total Staff</div>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          <h2 className="text-[18px] lg:text-[18px] font-bold text-gray-900">Today's Attendance</h2>
          <MonthPickerButton viewMonthStr={viewMonthStr} currentMonthName={currentMonthName} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 flex-1">
          {(adminUsers || []).map(u => (
            <div key={u.id} className="flex flex-row items-center justify-between p-2.5 sm:p-4 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-gray-50">
              <div className="flex gap-2.5 sm:gap-5 items-center">
                 <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                   {u.profilePicture ? <img src={u.profilePicture} alt={u.name} className="h-full w-full rounded-full object-cover" /> : u.name.charAt(0)}
                 </div>
                 <div className="flex flex-col w-[100px] sm:w-[130px]">
                   <span className="text-[14px] font-bold text-gray-900 truncate whitespace-nowrap">{u.name}</span>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate mt-0.5 whitespace-nowrap">{u.department || 'No Dept'}</span>
                 </div>
                 
                 <div className="flex flex-col w-[45px] ml-2">
                  <span className="text-[14px] font-bold text-gray-900 whitespace-nowrap">{u.todayAttendance?.checkIn || '-'}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5 whitespace-nowrap">In</span>
                </div>
                <div className="flex flex-col w-[85px] ml-2">
                  <span className="text-[14px] font-bold text-gray-900 whitespace-nowrap">{formatHours(u.todayAttendance?.totalHours)}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5 whitespace-nowrap">Worked</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-auto">
                <StatusPill status={u.todayAttendance?.status || 'Absent'} />
                <button onClick={() => setSelectedRecord(u.todayAttendance || {
                  id: 'dummy',
                  date: new Date().toISOString().split('T')[0],
                  checkIn: null,
                  checkOut: null,
                  totalHours: 0,
                  status: 'Absent',
                  location: null,
                  remarks: 'No attendance logged for today.'
                })} className="text-xs font-bold text-gray-900 flex items-center gap-0.5 hover:text-primary-hover transition-colors bg-white px-2 sm:px-3 py-1 rounded-full border border-gray-200 shadow-sm whitespace-nowrap ml-1">
                   <span className="hidden sm:inline">Details</span> <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {(adminUsers || []).length === 0 && (
            <div className="text-center py-8 text-gray-400 font-bold text-sm xl:col-span-2">No employees found.</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isAdmin ? renderAdminView() : renderEmployeeView()}
      <RecordModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
    </>
  );
}
