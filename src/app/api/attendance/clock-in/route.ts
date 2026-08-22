import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '@/lib/attendance/attendanceService';
import { enforceAttendanceAccess } from '@/lib/attendance/authGuard';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, location } = body;

    if (!employeeId) {
      return NextResponse.json({ success: false, message: 'employeeId is required' }, { status: 400 });
    }

    const { errorResponse } = enforceAttendanceAccess(request, employeeId);
    if (errorResponse) return errorResponse;

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
