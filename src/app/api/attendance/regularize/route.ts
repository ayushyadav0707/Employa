import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '@/lib/attendance/attendanceService';
import { enforceAdminRole } from '@/lib/attendance/authGuard';

export async function PUT(request: NextRequest) {
  try {
    const { errorResponse } = enforceAdminRole(request);
    if (errorResponse) return errorResponse;

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
