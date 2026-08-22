'use client';

import React, { useState, useEffect } from 'react';
import { UserRole } from '@/types/attendance';
import { MOCK_EMPLOYEES } from '@/lib/attendance/mockData';
import { AttendanceService } from '@/lib/attendance/attendanceService';
import {
  ClockWidget,
  AttendanceStatsCards,
  AttendanceDailyView,
  AttendanceWeeklyView,
  AttendanceCalendarView,
  AttendanceAdminTable
} from '@/components/attendance';
import { ShieldCheck, UserCheck, RefreshCw, Sparkles, User } from 'lucide-react';

export default function AttendancePage() {
  const [role, setRole] = useState<UserRole>('Employee');
  const [selectedEmpId, setSelectedEmpId] = useState('EMP001');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [records, setRecords] = useState(AttendanceService.getRecords());
  const [session, setSession] = useState(AttendanceService.getClockSession(selectedEmpId));

  useEffect(() => {
    setRecords(AttendanceService.getRecords());
    setSession(AttendanceService.getClockSession(selectedEmpId));
  }, [selectedEmpId, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const currentEmp = MOCK_EMPLOYEES.find(e => e.id === selectedEmpId) || MOCK_EMPLOYEES[0];
  const userRecords = records.filter(r => r.employeeId === selectedEmpId);
  const todayRecord = userRecords.find(r => r.date === '2026-08-22');

  const employeeStats = AttendanceService.calculateStats(userRecords);
  const companyStats = AttendanceService.calculateStats(records);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-black text-base">
              D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 dark:text-white text-base tracking-tight">Dayflow HRMS</h1>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  Attendance Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-none mt-0.5">Dev 3: Clock-In & Attendance Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <User className="w-3.5 h-3.5 text-slate-400 ml-2" />
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 pr-2 py-1 outline-none cursor-pointer"
              >
                {MOCK_EMPLOYEES.map(emp => (
                  <option key={emp.id} value={emp.id} className="dark:bg-slate-900">
                    {emp.name} ({emp.id}) - {emp.department}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setRole('Employee')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  role === 'Employee'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Employee</span>
              </button>
              <button
                onClick={() => setRole('Admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  role === 'Admin'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin / HR</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 text-indigo-200 text-xs font-medium backdrop-blur-xs mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>{role === 'Employee' ? 'Personal Attendance Workplace' : 'HR Attendance Operations Console'}</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                {role === 'Employee' ? `Welcome back, ${currentEmp.name}` : 'Company Attendance Monitoring & Audits'}
              </h2>
              <p className="text-xs text-indigo-200 mt-1 max-w-xl">
                {role === 'Employee'
                  ? `Department: ${currentEmp.department} • Designation: ${currentEmp.designation} • Employee ID: ${currentEmp.id}`
                  : 'Full visibility over check-ins, employee punctuality, leave status, and manual attendance regularization.'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Logs</span>
              </button>
            </div>
          </div>
        </div>

        <AttendanceStatsCards
          stats={role === 'Employee' ? employeeStats : companyStats}
          isAdmin={role === 'Admin'}
        />

        {role === 'Employee' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <ClockWidget
                  employeeId={selectedEmpId}
                  employeeName={currentEmp.name}
                  onSessionChange={handleRefresh}
                />
              </div>

              <div className="lg:col-span-5">
                <AttendanceDailyView
                  record={todayRecord}
                  session={session}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <AttendanceWeeklyView records={userRecords} />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <AttendanceCalendarView records={userRecords} />
            </div>
          </>
        )}

        {role === 'Admin' && (
          <div className="space-y-6">
            <AttendanceAdminTable
              records={records}
              onRecordUpdated={handleRefresh}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <AttendanceCalendarView records={records} />
              </div>
              <div className="lg:col-span-5">
                <AttendanceWeeklyView records={records} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
