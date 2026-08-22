'use client';

import React from 'react';
import { EmployeeLeaveView } from './EmployeeLeaveView';
import { AdminLeaveApproval } from './AdminLeaveApproval';

interface TimeOffClientProps {
  role: 'Employee' | 'Admin';
  initialBalance: { paidTimeOff: number; sickTimeOff: number };
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
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Time Off Management
        </h2>
      </div>

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
