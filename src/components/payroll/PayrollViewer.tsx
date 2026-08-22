'use client';

import React from 'react';
import { EmployeePayslip } from './EmployeePayslip';
import { AdminPayrollControl } from './AdminPayrollControl';

interface PayrollViewerProps {
  role: 'Employee' | 'Admin';
  user: any;
  allUsers?: any[] | null;
}

export const PayrollViewer: React.FC<PayrollViewerProps> = ({ role, user, allUsers }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Payroll &amp; Salary Management
        </h2>
      </div>

      {role === 'Employee' ? (
        <EmployeePayslip user={user} />
      ) : (
        <AdminPayrollControl user={user} allUsers={allUsers} />
      )}
    </div>
  );
};
