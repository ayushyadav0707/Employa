import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, JwtUserPayload } from '@/lib/auth/jwt';

export function enforceAttendanceAccess(request: NextRequest, targetEmployeeId?: string): {
  user: JwtUserPayload | null;
  errorResponse?: NextResponse;
  effectiveEmployeeId: string | undefined;
} {
  const user = getSessionUser(request);

  if (!user) {
    return {
      user: null,
      effectiveEmployeeId: targetEmployeeId
    };
  }

  if (user.role === 'Employee') {
    if (targetEmployeeId && targetEmployeeId !== user.id) {
      return {
        user,
        errorResponse: NextResponse.json(
          {
            success: false,
            message: 'Forbidden: Employees are strictly restricted to their own attendance records.'
          },
          { status: 403 }
        ),
        effectiveEmployeeId: user.id
      };
    }
    return {
      user,
      effectiveEmployeeId: user.id
    };
  }

  return {
    user,
    effectiveEmployeeId: targetEmployeeId
  };
}

export function enforceAdminRole(request: NextRequest): {
  user: JwtUserPayload | null;
  errorResponse?: NextResponse;
} {
  const user = getSessionUser(request);

  if (user && user.role !== 'Admin' && user.role !== 'HR') {
    return {
      user,
      errorResponse: NextResponse.json(
        {
          success: false,
          message: 'Forbidden: Only Admin / HR Officers can modify and regularize attendance.'
        },
        { status: 403 }
      )
    };
  }

  return { user };
}
