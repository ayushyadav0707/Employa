import os

files = {}

files['src/types/attendance.ts'] = """export type UserRole = 'Admin' | 'HR' | 'Employee';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  designation?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Half-day' | 'Leave';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName?: string;
  department?: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: number;
  status: AttendanceStatus;
  remarks?: string;
  breakDurationMinutes?: number;
  location?: string;
}

export interface ClockSessionState {
  isCheckedIn: boolean;
  checkInTime: string | null;
  elapsedSeconds: number;
  isOnBreak: boolean;
  breakStartTime: string | null;
  accumulatedBreakSeconds: number;
  lastRecordId?: string;
}

export interface AttendanceStats {
  totalWorkdays: number;
  presentCount: number;
  absentCount: number;
  halfDayCount: number;
  leaveCount: number;
  attendanceRatePercentage: number;
  avgHoursPerDay: number;
  totalHoursWorked: number;
  overtimeHours: number;
}

export interface AttendanceFilterState {
  searchQuery: string;
  department: string;
  status: string;
  startDate: string;
  endDate: string;
  employeeId?: string;
}
"""

files['src/lib/attendance/mockData.ts'] = """import { AttendanceRecord, UserSummary } from '@/types/attendance';

export const MOCK_EMPLOYEES: UserSummary[] = [
  {
    id: 'EMP001',
    name: 'John Doe',
    email: 'john@dayflow.com',
    role: 'Employee',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'EMP002',
    name: 'Sarah Jenkins',
    email: 'sarah@dayflow.com',
    role: 'Employee',
    department: 'Design',
    designation: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'EMP003',
    name: 'Alex Rivera',
    email: 'alex@dayflow.com',
    role: 'Employee',
    department: 'Product',
    designation: 'Product Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'EMP004',
    name: 'Emily Zhang',
    email: 'emily.hr@dayflow.com',
    role: 'Admin',
    department: 'Human Resources',
    designation: 'HR Lead & Ops',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'EMP005',
    name: 'Marcus Vance',
    email: 'marcus@dayflow.com',
    role: 'Employee',
    department: 'Engineering',
    designation: 'Backend Architect',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'EMP006',
    name: 'Priya Sharma',
    email: 'priya@dayflow.com',
    role: 'Employee',
    department: 'Marketing',
    designation: 'Growth Marketer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'ATT-20260822-001',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    date: '2026-08-22',
    checkIn: '09:02 AM',
    checkOut: null,
    totalHours: 0,
    status: 'Present',
    location: 'HQ - Floor 3',
    remarks: 'Checked in on time'
  },
  {
    id: 'ATT-20260822-002',
    employeeId: 'EMP002',
    employeeName: 'Sarah Jenkins',
    department: 'Design',
    date: '2026-08-22',
    checkIn: '08:45 AM',
    checkOut: null,
    totalHours: 0,
    status: 'Present',
    location: 'HQ - Design Lab',
    remarks: 'Early arrival'
  },
  {
    id: 'ATT-20260822-003',
    employeeId: 'EMP003',
    employeeName: 'Alex Rivera',
    department: 'Product',
    date: '2026-08-22',
    checkIn: '09:15 AM',
    checkOut: null,
    totalHours: 0,
    status: 'Present',
    location: 'Remote (Home Office)',
    remarks: 'Work from home'
  },
  {
    id: 'ATT-20260822-004',
    employeeId: 'EMP004',
    employeeName: 'Emily Zhang',
    department: 'Human Resources',
    date: '2026-08-22',
    checkIn: '09:00 AM',
    checkOut: null,
    totalHours: 0,
    status: 'Present',
    location: 'HQ - HR Suite'
  },
  {
    id: 'ATT-20260822-005',
    employeeId: 'EMP005',
    employeeName: 'Marcus Vance',
    department: 'Engineering',
    date: '2026-08-22',
    checkIn: null,
    checkOut: null,
    totalHours: 0,
    status: 'Leave',
    remarks: 'Approved Sick Leave'
  },
  {
    id: 'ATT-20260822-006',
    employeeId: 'EMP006',
    employeeName: 'Priya Sharma',
    department: 'Marketing',
    date: '2026-08-22',
    checkIn: '10:30 AM',
    checkOut: null,
    totalHours: 0,
    status: 'Half-day',
    location: 'HQ - Floor 2',
    remarks: 'Doctor appointment morning'
  },
  {
    id: 'ATT-20260821-001',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    date: '2026-08-21',
    checkIn: '08:58 AM',
    checkOut: '05:30 PM',
    totalHours: 8.5,
    status: 'Present',
    location: 'HQ - Floor 3',
    breakDurationMinutes: 45
  },
  {
    id: 'ATT-20260820-001',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    date: '2026-08-20',
    checkIn: '09:05 AM',
    checkOut: '05:15 PM',
    totalHours: 8.2,
    status: 'Present',
    location: 'HQ - Floor 3',
    breakDurationMinutes: 50
  },
  {
    id: 'ATT-20260819-001',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    date: '2026-08-19',
    checkIn: '09:12 AM',
    checkOut: '01:30 PM',
    totalHours: 4.3,
    status: 'Half-day',
    location: 'HQ - Floor 3',
    remarks: 'Personal commitment in afternoon'
  },
  {
    id: 'ATT-20260818-001',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    date: '2026-08-18',
    checkIn: '08:50 AM',
    checkOut: '06:00 PM',
    totalHours: 9.1,
    status: 'Present',
    location: 'Remote (Home Office)',
    breakDurationMinutes: 40
  },
  {
    id: 'ATT-20260817-001',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    date: '2026-08-17',
    checkIn: '09:00 AM',
    checkOut: '05:00 PM',
    totalHours: 8.0,
    status: 'Present',
    location: 'HQ - Floor 3',
    breakDurationMinutes: 60
  },
  {
    id: 'ATT-20260814-001',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    date: '2026-08-14',
    checkIn: '09:00 AM',
    checkOut: '05:30 PM',
    totalHours: 8.5,
    status: 'Present',
    location: 'HQ - Floor 3'
  },
  {
    id: 'ATT-20260813-001',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    date: '2026-08-13',
    checkIn: null,
    checkOut: null,
    totalHours: 0,
    status: 'Leave',
    remarks: 'Paid Leave - Family event'
  },
  {
    id: 'ATT-20260812-001',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    date: '2026-08-12',
    checkIn: '08:55 AM',
    checkOut: '05:05 PM',
    totalHours: 8.2,
    status: 'Present',
    location: 'HQ - Floor 3'
  },
  {
    id: 'ATT-20260811-001',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    date: '2026-08-11',
    checkIn: '09:10 AM',
    checkOut: '05:40 PM',
    totalHours: 8.5,
    status: 'Present',
    location: 'HQ - Floor 3'
  },
  {
    id: 'ATT-20260810-001',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    date: '2026-08-10',
    checkIn: '09:00 AM',
    checkOut: '05:00 PM',
    totalHours: 8.0,
    status: 'Present',
    location: 'Remote (Home Office)'
  }
];
"""

files['src/lib/attendance/attendanceService.ts'] = """import { AttendanceFilterState, AttendanceRecord, AttendanceStats, AttendanceStatus, ClockSessionState } from '@/types/attendance';
import { INITIAL_ATTENDANCE_RECORDS, MOCK_EMPLOYEES } from './mockData';

const ATTENDANCE_STORAGE_KEY = 'dayflow_attendance_records';
const CLOCK_SESSION_KEY = 'dayflow_clock_session';

export class AttendanceService {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  public static getRecords(): AttendanceRecord[] {
    if (!this.isBrowser()) {
      return INITIAL_ATTENDANCE_RECORDS;
    }
    const stored = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(INITIAL_ATTENDANCE_RECORDS));
      return INITIAL_ATTENDANCE_RECORDS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_ATTENDANCE_RECORDS;
    }
  }

  public static saveRecords(records: AttendanceRecord[]): void {
    if (this.isBrowser()) {
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(records));
    }
  }

  public static getClockSession(employeeId: string): ClockSessionState {
    const defaultState: ClockSessionState = {
      isCheckedIn: false,
      checkInTime: null,
      elapsedSeconds: 0,
      isOnBreak: false,
      breakStartTime: null,
      accumulatedBreakSeconds: 0
    };

    if (!this.isBrowser()) return defaultState;

    const stored = localStorage.getItem(`${CLOCK_SESSION_KEY}_${employeeId}`);
    if (!stored) return defaultState;

    try {
      const session: ClockSessionState = JSON.parse(stored);
      if (session.isCheckedIn && session.checkInTime) {
        const checkInDate = new Date(session.checkInTime).getTime();
        const now = Date.now();
        let totalElapsed = Math.max(0, Math.floor((now - checkInDate) / 1000));
        
        if (session.isOnBreak && session.breakStartTime) {
          const breakStart = new Date(session.breakStartTime).getTime();
          const currentBreakSeconds = Math.max(0, Math.floor((now - breakStart) / 1000));
          totalElapsed -= (session.accumulatedBreakSeconds + currentBreakSeconds);
        } else {
          totalElapsed -= session.accumulatedBreakSeconds;
        }

        session.elapsedSeconds = Math.max(0, totalElapsed);
      }
      return session;
    } catch {
      return defaultState;
    }
  }

  public static saveClockSession(employeeId: string, state: ClockSessionState): void {
    if (this.isBrowser()) {
      localStorage.setItem(`${CLOCK_SESSION_KEY}_${employeeId}`, JSON.stringify(state));
    }
  }

  public static clockIn(employeeId: string, location: string = 'HQ - Floor 3'): { session: ClockSessionState; record: AttendanceRecord } {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const todayStr = '2026-08-22';
    const emp = MOCK_EMPLOYEES.find(e => e.id === employeeId);

    const recordId = `ATT-${todayStr.replace(/-/g, '')}-${employeeId}`;
    const newRecord: AttendanceRecord = {
      id: recordId,
      employeeId,
      employeeName: emp?.name || 'Employee',
      department: emp?.department || 'General',
      date: todayStr,
      checkIn: timeFormatted,
      checkOut: null,
      totalHours: 0,
      status: 'Present',
      location,
      remarks: 'Clocked in via Dayflow Live Engine'
    };

    const session: ClockSessionState = {
      isCheckedIn: true,
      checkInTime: now.toISOString(),
      elapsedSeconds: 0,
      isOnBreak: false,
      breakStartTime: null,
      accumulatedBreakSeconds: 0,
      lastRecordId: recordId
    };

    this.saveClockSession(employeeId, session);

    const records = this.getRecords();
    const existingIndex = records.findIndex(r => r.date === todayStr && r.employeeId === employeeId);
    if (existingIndex >= 0) {
      records[existingIndex] = { ...records[existingIndex], ...newRecord };
    } else {
      records.unshift(newRecord);
    }
    this.saveRecords(records);

    return { session, record: newRecord };
  }

  public static clockOut(employeeId: string): { session: ClockSessionState; record: AttendanceRecord | null } {
    const session = this.getClockSession(employeeId);
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const todayStr = '2026-08-22';

    let totalHours = 8.0;
    if (session.checkInTime) {
      const start = new Date(session.checkInTime).getTime();
      const end = now.getTime();
      const netSeconds = Math.max(0, (end - start) / 1000 - session.accumulatedBreakSeconds);
      const computed = parseFloat((netSeconds / 3600).toFixed(2));
      totalHours = computed > 0 ? computed : 8.0;
    }

    const updatedSession: ClockSessionState = {
      isCheckedIn: false,
      checkInTime: null,
      elapsedSeconds: 0,
      isOnBreak: false,
      breakStartTime: null,
      accumulatedBreakSeconds: 0
    };
    this.saveClockSession(employeeId, updatedSession);

    const records = this.getRecords();
    const recordIndex = records.findIndex(r => r.date === todayStr && r.employeeId === employeeId);
    let updatedRecord: AttendanceRecord | null = null;

    if (recordIndex >= 0) {
      const status: AttendanceStatus = totalHours >= 7 ? 'Present' : totalHours >= 3.5 ? 'Half-day' : 'Absent';
      records[recordIndex] = {
        ...records[recordIndex],
        checkOut: timeFormatted,
        totalHours,
        status,
        breakDurationMinutes: Math.round(session.accumulatedBreakSeconds / 60)
      };
      updatedRecord = records[recordIndex];
      this.saveRecords(records);
    }

    return { session: updatedSession, record: updatedRecord };
  }

  public static toggleBreak(employeeId: string): ClockSessionState {
    const session = this.getClockSession(employeeId);
    if (!session.isCheckedIn) return session;

    const now = new Date();
    if (!session.isOnBreak) {
      session.isOnBreak = true;
      session.breakStartTime = now.toISOString();
    } else {
      if (session.breakStartTime) {
        const breakStart = new Date(session.breakStartTime).getTime();
        const diffSeconds = Math.max(0, Math.floor((now.getTime() - breakStart) / 1000));
        session.accumulatedBreakSeconds += diffSeconds;
      }
      session.isOnBreak = false;
      session.breakStartTime = null;
    }

    this.saveClockSession(employeeId, session);
    return session;
  }

  public static regularizeRecord(recordId: string, updates: Partial<AttendanceRecord>): AttendanceRecord | null {
    const records = this.getRecords();
    const index = records.findIndex(r => r.id === recordId);
    if (index === -1) return null;

    records[index] = { ...records[index], ...updates };
    this.saveRecords(records);
    return records[index];
  }

  public static filterRecords(filters: AttendanceFilterState): AttendanceRecord[] {
    const records = this.getRecords();
    return records.filter(r => {
      if (filters.employeeId && r.employeeId !== filters.employeeId) {
        return false;
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = r.employeeName?.toLowerCase().includes(q);
        const matchId = r.employeeId.toLowerCase().includes(q);
        const matchDept = r.department?.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchDept) return false;
      }
      if (filters.department && filters.department !== 'ALL' && r.department !== filters.department) {
        return false;
      }
      if (filters.status && filters.status !== 'ALL' && r.status !== filters.status) {
        return false;
      }
      if (filters.startDate && r.date < filters.startDate) {
        return false;
      }
      if (filters.endDate && r.date > filters.endDate) {
        return false;
      }
      return true;
    });
  }

  public static calculateStats(records: AttendanceRecord[]): AttendanceStats {
    const total = records.length || 1;
    const present = records.filter(r => r.status === 'Present').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const halfDay = records.filter(r => r.status === 'Half-day').length;
    const leave = records.filter(r => r.status === 'Leave').length;

    const totalHoursWorked = records.reduce((acc, r) => acc + (r.totalHours || 0), 0);
    const avgHours = records.length ? (totalHoursWorked / records.length) : 0;
    const overtimeHours = records.reduce((acc, r) => acc + (r.totalHours > 8 ? r.totalHours - 8 : 0), 0);

    const attendanceRate = Math.round(((present + halfDay * 0.5) / total) * 100);

    return {
      totalWorkdays: records.length,
      presentCount: present,
      absentCount: absent,
      halfDayCount: halfDay,
      leaveCount: leave,
      attendanceRatePercentage: isNaN(attendanceRate) ? 100 : attendanceRate,
      avgHoursPerDay: parseFloat(avgHours.toFixed(1)),
      totalHoursWorked: parseFloat(totalHoursWorked.toFixed(1)),
      overtimeHours: parseFloat(overtimeHours.toFixed(1))
    };
  }

  public static exportToCsv(records: AttendanceRecord[], filename = 'attendance_report.csv'): void {
    if (!this.isBrowser()) return;
    const headers = ['Record ID', 'Employee ID', 'Employee Name', 'Department', 'Date', 'Check In', 'Check Out', 'Total Hours', 'Status', 'Location', 'Remarks'];
    const rows = records.map(r => [
      r.id,
      r.employeeId,
      `\"${r.employeeName || ''}\"`,
      `\"${r.department || ''}\"`,
      r.date,
      r.checkIn || 'N/A',
      r.checkOut || 'N/A',
      r.totalHours,
      r.status,
      `\"${r.location || ''}\"`,
      `\"${r.remarks || ''}\"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(', '))].join('\\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
"""

files['src/app/api/attendance/route.ts'] = """import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '@/lib/attendance/attendanceService';
import { AttendanceFilterState } from '@/types/attendance';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId') || undefined;
    const searchQuery = searchParams.get('searchQuery') || '';
    const department = searchParams.get('department') || 'ALL';
    const status = searchParams.get('status') || 'ALL';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    const filters: AttendanceFilterState = {
      employeeId,
      searchQuery,
      department,
      status,
      startDate,
      endDate
    };

    const records = AttendanceService.filterRecords(filters);
    const stats = AttendanceService.calculateStats(records);

    return NextResponse.json({
      success: true,
      data: records,
      stats
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch attendance records', error: String(error) },
      { status: 500 }
    );
  }
}
"""

files['src/app/api/attendance/clock-in/route.ts'] = """import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '@/lib/attendance/attendanceService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, location } = body;

    if (!employeeId) {
      return NextResponse.json({ success: false, message: 'employeeId is required' }, { status: 400 });
    }

    const result = AttendanceService.clockIn(employeeId, location || 'HQ - Floor 3');

    return NextResponse.json({
      success: true,
      message: 'Clocked in successfully',
      data: result
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Clock-in failed', error: String(error) },
      { status: 500 }
    );
  }
}
"""

files['src/app/api/attendance/clock-out/route.ts'] = """import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '@/lib/attendance/attendanceService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId } = body;

    if (!employeeId) {
      return NextResponse.json({ success: false, message: 'employeeId is required' }, { status: 400 });
    }

    const result = AttendanceService.clockOut(employeeId);

    return NextResponse.json({
      success: true,
      message: 'Clocked out successfully',
      data: result
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Clock-out failed', error: String(error) },
      { status: 500 }
    );
  }
}
"""

files['src/app/api/attendance/regularize/route.ts'] = """import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '@/lib/attendance/attendanceService';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Record ID is required' }, { status: 400 });
    }

    const updated = AttendanceService.regularizeRecord(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Attendance record updated successfully',
      data: updated
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update record', error: String(error) },
      { status: 500 }
    );
  }
}
"""

files['src/app/layout.tsx'] = """import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dayflow HRMS - Human Resource Management System',
  description: 'Real-time Attendance Tracking, Profile, Leaves and Payroll for Modern Teams',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
"""

files['src/app/page.tsx'] = """import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/attendance');
}
"""

files['src/components/attendance/ClockWidget.tsx'] = """'use client';

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
"""

files['src/components/attendance/AttendanceStatsCards.tsx'] = """'use client';

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
"""

files['src/components/attendance/AttendanceDailyView.tsx'] = """'use client';

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
"""

files['src/components/attendance/AttendanceWeeklyView.tsx'] = """'use client';

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
"""

files['src/components/attendance/AttendanceCalendarView.tsx'] = """'use client';

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
"""

files['src/components/attendance/AttendanceRegularizeModal.tsx'] = """'use client';

import React, { useState } from 'react';
import { AttendanceRecord, AttendanceStatus } from '@/types/attendance';
import { X, Save } from 'lucide-react';

interface AttendanceRegularizeModalProps {
  record: AttendanceRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRecord: AttendanceRecord) => void;
}

export const AttendanceRegularizeModal: React.FC<AttendanceRegularizeModalProps> = ({
  record,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen || !record) return null;

  const [checkIn, setCheckIn] = useState(record.checkIn || '');
  const [checkOut, setCheckOut] = useState(record.checkOut || '');
  const [totalHours, setTotalHours] = useState(record.totalHours || 0);
  const [status, setStatus] = useState<AttendanceStatus>(record.status);
  const [remarks, setRemarks] = useState(record.remarks || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...record,
      checkIn: checkIn || null,
      checkOut: checkOut || null,
      totalHours: Number(totalHours),
      status,
      remarks
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Regularize Attendance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {record.employeeName} ({record.employeeId}) • {record.date}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Attendance Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Present">Present</option>
              <option value="Half-day">Half-day</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Check In (e.g. 09:00 AM)
              </label>
              <input
                type="text"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                placeholder="09:00 AM"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Check Out (e.g. 05:00 PM)
              </label>
              <input
                type="text"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                placeholder="05:00 PM"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Total Hours Worked
            </label>
            <input
              type="number"
              step="0.1"
              value={totalHours}
              onChange={(e) => setTotalHours(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              HR Remarks / Justification
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Reason for manual regularisation"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-sm transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              Save Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
"""

files['src/components/attendance/AttendanceAdminTable.tsx'] = """'use client';

import React, { useState } from 'react';
import { AttendanceRecord } from '@/types/attendance';
import { Search, Download, Edit3, Users } from 'lucide-react';
import { AttendanceService } from '@/lib/attendance/attendanceService';
import { AttendanceRegularizeModal } from './AttendanceRegularizeModal';
import { MOCK_EMPLOYEES } from '@/lib/attendance/mockData';

interface AttendanceAdminTableProps {
  records: AttendanceRecord[];
  onRecordUpdated?: () => void;
}

export const AttendanceAdminTable: React.FC<AttendanceAdminTableProps> = ({ records, onRecordUpdated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('');
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  const filteredRecords = records.filter(r => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = r.employeeName?.toLowerCase().includes(q);
      const matchId = r.employeeId.toLowerCase().includes(q);
      if (!matchName && !matchId) return false;
    }
    if (selectedDept !== 'ALL' && r.department !== selectedDept) {
      return false;
    }
    if (selectedStatus !== 'ALL' && r.status !== selectedStatus) {
      return false;
    }
    if (selectedDate && r.date !== selectedDate) {
      return false;
    }
    return true;
  });

  const departments = ['ALL', 'Engineering', 'Design', 'Product', 'Human Resources', 'Marketing'];
  const statuses = ['ALL', 'Present', 'Half-day', 'Absent', 'Leave'];

  const handleExport = () => {
    AttendanceService.exportToCsv(filteredRecords, `dayflow_attendance_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleSaveRegularization = (updated: AttendanceRecord) => {
    AttendanceService.regularizeRecord(updated.id, updated);
    onRecordUpdated?.();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Company-wide Attendance Registry
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time logs, punctuality monitoring, and HR regularization
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 my-5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search name or EMP ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="relative">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept === 'ALL' ? '🏢 All Departments' : dept}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {statuses.map(st => (
              <option key={st} value={st}>
                {st === 'ALL' ? '⚡ All Statuses' : st}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Check In</th>
              <th className="py-3 px-4">Check Out</th>
              <th className="py-3 px-4">Total Hours</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Location / Remarks</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-normal">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  No attendance records found matching filters.
                </td>
              </tr>
            ) : (
              filteredRecords.map((r) => {
                const empMeta = MOCK_EMPLOYEES.find(e => e.id === r.employeeId);
                return (
                  <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center font-bold text-[10px] text-slate-600 dark:text-slate-300 shrink-0">
                          {empMeta?.avatar ? (
                            <img src={empMeta.avatar} alt={r.employeeName} className="w-full h-full object-cover" />
                          ) : (
                            r.employeeId.slice(0, 3)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{r.employeeName || r.employeeId}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{r.employeeId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {r.department || 'General'}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px]">
                      {r.date}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {r.checkIn || '-'}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {r.checkOut || (r.date === '2026-08-22' && r.checkIn ? 'In Progress' : '-')}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {r.totalHours > 0 ? `${r.totalHours} hrs` : '-'}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        r.status === 'Present'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : r.status === 'Half-day'
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : r.status === 'Leave'
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-slate-500 dark:text-slate-400 max-w-xs truncate">
                      {r.remarks || r.location || 'Standard Shift'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setEditingRecord(r)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors cursor-pointer"
                        title="Adjust / Regularize"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AttendanceRegularizeModal
        record={editingRecord}
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        onSave={handleSaveRegularization}
      />
    </div>
  );
};
"""

files['src/components/attendance/index.ts'] = """export * from './ClockWidget';
export * from './AttendanceStatsCards';
export * from './AttendanceDailyView';
export * from './AttendanceWeeklyView';
export * from './AttendanceCalendarView';
export * from './AttendanceAdminTable';
export * from './AttendanceRegularizeModal';
"""

files['src/app/attendance/page.tsx'] = """'use client';

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
"""

for rel_path, content in files.items():
    d = os.path.dirname(rel_path)
    if d and not os.path.exists(d):
        os.makedirs(d, exist_ok=True)
    with open(rel_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content.strip() + '\n')
    print('Successfully generated:', rel_path)
