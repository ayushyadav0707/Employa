'use client';

import React from 'react';
import { EmployeeLeaveView } from './EmployeeLeaveView';
import { AdminLeaveApproval } from './AdminLeaveApproval';

interface TimeOffClientProps {
  role: 'Employee' | 'Admin';
  initialBalance: { annual: number; sick: number; casual: number; earned: number };
  initialRequests: any[];
  userId: string;
  currentUser?: any;
}

export const TimeOffClient: React.FC<TimeOffClientProps> = ({
  role,
  initialBalance,
  initialRequests,
  userId,
  currentUser,
}) => {
  return (
    <div className="flex flex-col h-full w-full max-w-[1400px] mx-auto animate-in fade-in duration-500">
      {role === 'Employee' ? (
        <EmployeeLeaveView
          balance={initialBalance}
          requests={initialRequests}
          userId={userId}
          currentUser={currentUser}
        />
      ) : (
        <AdminLeaveApproval
          requests={initialRequests}
        />
      )}
    </div>
  );
};
