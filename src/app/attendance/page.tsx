'use client';

import React, { useState, useEffect } from 'react';
import { UserRole } from '@/types/attendance';
import { AttendanceService } from '@/lib/attendance/attendanceService';
import {
  ClockWidget,
  AttendanceStatsCards,
  AttendanceDailyView,
  AttendanceWeeklyView,
  AttendanceCalendarView,
  AttendanceAdminTable
} from '@/components/attendance';
import { RefreshCw, User } from 'lucide-react';

const SEEDED_PERSONAS = [
  { id: 'OIJODO20260002', name: 'John Doe', department: 'Engineering', designation: 'Senior Frontend Architect', role: 'EMPLOYEE' },
  { id: 'OISJEN20260003', name: 'Sarah Jenkins', department: 'Product & Design', designation: 'Lead UI/UX Designer', role: 'EMPLOYEE' },
  { id: 'OIARIV20260004', name: 'Alex Rivera', department: 'Product Management', designation: 'Senior Product Manager', role: 'EMPLOYEE' },
  { id: 'OIPSHA20260005', name: 'Priya Sharma', department: 'Growth & Marketing', designation: 'Product Marketing Lead', role: 'EMPLOYEE' },
  { id: 'OIEMZH20260001', name: 'Emily Zhang', department: 'Human Resources', designation: 'HR Lead & People Ops', role: 'ADMIN' },
  { id: 'DAYFLOWMASTER01', name: 'Master Admin', department: 'Executive', designation: 'Chief Operating Officer', role: 'ADMIN' },
];

export default function AttendancePage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState('OIJODO20260002');
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

  const currentEmp = SEEDED_PERSONAS.find(e => e.id === selectedEmpId) || SEEDED_PERSONAS[0];
  const userRecords = records.filter(r => r.employeeId === selectedEmpId);
  const todayRecord = userRecords.find(r => r.date === '2026-08-22');

  const employeeStats = AttendanceService.calculateStats(userRecords);
  const companyStats = AttendanceService.calculateStats(records);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Top Bar Header & View Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance & Live Clock</h1>
          <p className="text-gray-500 text-sm">
            {isAdmin
              ? 'Company-wide attendance monitoring, punctuality metrics, and HR regularization.'
              : 'Track daily shift punches, live stopwatch, timesheet logs, and monthly calendar.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* Employee Switcher */}
          {!isAdmin && (
            <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 shadow-xs">
              <User className="w-4 h-4 text-gray-400" />
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="text-xs font-semibold text-gray-700 bg-transparent outline-none cursor-pointer"
              >
                {SEEDED_PERSONAS.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.department})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sync Button */}
          <button
            onClick={handleRefresh}
            title="Refresh Attendance Logs"
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            <span className="hidden md:inline">Sync</span>
          </button>

          {/* View Toggle (Admin/HR vs Employee) */}
          <label className="flex items-center cursor-pointer bg-white border border-gray-300 rounded-lg px-3 py-1.5 shadow-xs">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
              />
              <div className={`block w-11 h-6 rounded-full transition-colors ${isAdmin ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform ${isAdmin ? 'transform translate-x-5' : ''}`}></div>
            </div>
            <span className="ml-2.5 text-xs font-medium text-gray-700 select-none">
              View as: <strong className="text-gray-900">{isAdmin ? 'Admin / HR' : 'Employee'}</strong>
            </span>
          </label>
        </div>
      </div>

      {/* Stats Cards */}
      <AttendanceStatsCards
        stats={!isAdmin ? employeeStats : companyStats}
        isAdmin={isAdmin}
      />

      {/* EMPLOYEE VIEW */}
      {!isAdmin && (
        <div className="space-y-6">
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <AttendanceWeeklyView records={userRecords} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <AttendanceCalendarView records={userRecords} />
          </div>
        </div>
      )}

      {/* ADMIN VIEW */}
      {isAdmin && (
        <div className="space-y-6">
          <AttendanceAdminTable
            records={records}
            onRecordUpdated={handleRefresh}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <AttendanceCalendarView records={records} />
            </div>
            <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <AttendanceWeeklyView records={records} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
