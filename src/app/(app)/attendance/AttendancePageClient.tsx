'use client';

import React, { useState } from 'react';
import { Clock, Users, Calendar, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { checkIn, checkOut } from '@/app/actions/attendance';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: number;
  status: string;
  location: string | null;
  remarks: string | null;
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

interface MyStats {
  totalHours: number;
  presentDays: number;
  halfDays: number;
  totalRecords: number;
}

interface Props {
  isAdmin: boolean;
  currentUserId: string;
  todayDate: string;
  // Admin props
  adminUsers?: AdminUser[];
  adminStats?: AdminStats;
  monthRecords?: any[];
  // Employee props
  myMonthRecords?: AttendanceRecord[];
  todayAttendance?: AttendanceRecord | null;
  myStats?: MyStats;
}

function StatusBadge({ status }: { status: string }) {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold';
  if (status === 'Present') return <span className={`${base} bg-green-100 text-green-700`}>Present</span>;
  if (status === 'Half-day') return <span className={`${base} bg-yellow-100 text-yellow-700`}>Half-day</span>;
  if (status === 'Leave') return <span className={`${base} bg-blue-100 text-blue-700`}>Leave</span>;
  if (status === 'Absent') return <span className={`${base} bg-red-100 text-red-700`}>Absent</span>;
  return <span className={`${base} bg-gray-100 text-gray-600`}>{status}</span>;
}

function CheckInButton({ todayAttendance }: { todayAttendance: AttendanceRecord | null }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [message, setMessage] = useState('');

  const isCheckedIn = !!todayAttendance?.checkIn && !todayAttendance?.checkOut;
  const isCheckedOut = !!todayAttendance?.checkOut;

  const handleCheckIn = () => {
    startTransition(async () => {
      const res = await checkIn();
      if (res.success) {
        setMessage('Checked in successfully!');
        router.refresh();
      } else {
        setMessage(res.error || 'Failed to check in');
      }
    });
  };

  const handleCheckOut = () => {
    startTransition(async () => {
      const res = await checkOut();
      if (res.success) {
        setMessage('Checked out successfully!');
        router.refresh();
      } else {
        setMessage(res.error || 'Failed to check out');
      }
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-1">Today's Clock</h3>
      <p className="text-sm text-gray-500 mb-5">Punch in and out for today's shift</p>

      {message && (
        <div className="mb-4 px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200">
          {message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Check In</p>
          <p className="text-xl font-bold text-gray-900">{todayAttendance?.checkIn || '—'}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Check Out</p>
          <p className="text-xl font-bold text-gray-900">{todayAttendance?.checkOut || '—'}</p>
        </div>
      </div>

      {todayAttendance && (
        <div className="mb-5">
          <StatusBadge status={todayAttendance.status} />
          {todayAttendance.totalHours > 0 && (
            <span className="ml-2 text-sm text-gray-500 font-medium">{todayAttendance.totalHours.toFixed(2)}h worked</span>
          )}
          {todayAttendance.location && (
            <p className="text-xs text-gray-400 mt-1">📍 {todayAttendance.location}</p>
          )}
        </div>
      )}

      {!isCheckedOut && (
        <div className="flex gap-3">
          {!isCheckedIn && (
            <button
              onClick={handleCheckIn}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              {isPending ? 'Processing...' : 'Check In'}
            </button>
          )}
          {isCheckedIn && (
            <button
              onClick={handleCheckOut}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow transition-colors disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              {isPending ? 'Processing...' : 'Check Out'}
            </button>
          )}
        </div>
      )}

      {isCheckedOut && (
        <div className="text-center text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg py-3">
          ✅ Shift complete for today!
        </div>
      )}
    </div>
  );
}

export default function AttendancePageClient({
  isAdmin, currentUserId, todayDate,
  adminUsers, adminStats, monthRecords,
  myMonthRecords, todayAttendance, myStats
}: Props) {
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredAdminUsers = (adminUsers || []).filter(u => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Present') return u.todayAttendance?.status === 'Present';
    if (filterStatus === 'Absent') return !u.todayAttendance;
    if (filterStatus === 'Leave') return u.todayAttendance?.status === 'Leave';
    if (filterStatus === 'Half-day') return u.todayAttendance?.status === 'Half-day';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
        <p className="text-gray-500 text-sm">
          {isAdmin ? 'Company-wide attendance monitoring and HR oversight.' : 'Your attendance records and daily clock-in/out.'}
        </p>
      </div>

      {/* Stats Cards */}
      {isAdmin && adminStats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: 'Total Employees', value: adminStats.total, color: 'indigo' },
            { label: 'Present Today', value: adminStats.present, color: 'green' },
            { label: 'On Leave', value: adminStats.onLeave, color: 'blue' },
            { label: 'Half Day', value: adminStats.halfDay, color: 'yellow' },
            { label: 'No Record', value: adminStats.absent, color: 'red' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
              <p className={`text-3xl font-black text-${color}-600`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {!isAdmin && myStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Hours (Month)', value: `${myStats.totalHours}h` },
            { label: 'Present Days', value: myStats.presentDays },
            { label: 'Half Days', value: myStats.halfDays },
            { label: 'Total Records', value: myStats.totalRecords },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-3xl font-black text-indigo-600">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Employee: Clock In/Out + History */}
      {!isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <CheckInButton todayAttendance={todayAttendance || null} />
          </div>
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">This Month's Records</h3>
              </div>
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Check In</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Check Out</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(myMonthRecords || []).map(r => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.date}</td>
                        <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.checkIn || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.checkOut || '—'}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-700">{r.totalHours > 0 ? `${r.totalHours.toFixed(2)}h` : '—'}</td>
                      </tr>
                    ))}
                    {(myMonthRecords || []).length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">No attendance records this month.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin: Employee Table */}
      {isAdmin && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Today's Attendance — {todayDate}</h3>
            <div className="flex gap-2">
              {['All', 'Present', 'Half-day', 'Leave', 'Absent'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    filterStatus === s
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAdminUsers.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm mr-3">
                          {u.profilePicture
                            ? <img src={u.profilePicture} alt={u.name} className="h-full w-full rounded-full object-cover" />
                            : u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{u.name}</div>
                          <div className="text-xs text-gray-400 font-mono">{u.loginId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.department || '—'}</td>
                    <td className="px-6 py-4">
                      {u.todayAttendance
                        ? <StatusBadge status={u.todayAttendance.status} />
                        : <StatusBadge status="Absent" />}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.todayAttendance?.checkIn || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.todayAttendance?.checkOut || '—'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                      {u.todayAttendance?.totalHours ? `${u.todayAttendance.totalHours.toFixed(2)}h` : '—'}
                    </td>
                  </tr>
                ))}
                {filteredAdminUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">No records match the selected filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin: Monthly Records Table */}
      {isAdmin && monthRecords && monthRecords.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Monthly Attendance Records</h3>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Dept</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {monthRecords.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{r.date}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{r.user?.name || r.userId}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{r.user?.department || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">{r.totalHours > 0 ? `${r.totalHours.toFixed(2)}h` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
