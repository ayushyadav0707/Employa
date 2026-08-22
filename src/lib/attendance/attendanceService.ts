import { AttendanceFilterState, AttendanceRecord, AttendanceStats, AttendanceStatus, ClockSessionState } from '@/types/attendance';
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
      `"${r.employeeName || ''}"`,
      `"${r.department || ''}"`,
      r.date,
      r.checkIn || 'N/A',
      r.checkOut || 'N/A',
      r.totalHours,
      r.status,
      `"${r.location || ''}"`,
      `"${r.remarks || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(', '))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
