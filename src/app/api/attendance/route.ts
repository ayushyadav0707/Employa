import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '@/lib/attendance/attendanceService';
import { enforceAttendanceAccess } from '@/lib/attendance/authGuard';
import { AttendanceFilterState } from '@/types/attendance';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedEmpId = searchParams.get('employeeId') || undefined;

    const { errorResponse, effectiveEmployeeId } = enforceAttendanceAccess(request, requestedEmpId);
    if (errorResponse) return errorResponse;

    const searchQuery = searchParams.get('searchQuery') || '';
    const department = searchParams.get('department') || 'ALL';
    const status = searchParams.get('status') || 'ALL';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    const filters: AttendanceFilterState = {
      employeeId: effectiveEmployeeId,
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
