export type UserRole = 'Admin' | 'HR' | 'Employee';

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
