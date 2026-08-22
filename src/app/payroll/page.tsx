import React from 'react';
import { prisma } from '@/lib/prisma';
import { PayrollViewer } from '@/components/payroll/PayrollViewer';

type SearchParams = Promise<{ role?: string }>;

interface PayrollPageProps {
  searchParams: SearchParams;
}

export default async function PayrollPage({ searchParams }: PayrollPageProps) {
  const { role = 'Employee' } = await searchParams;

  // Load first Employee's details and their payroll configuration
  const user = await prisma.user.findFirst({
    where: { role: 'Employee' },
    include: {
      payrollConfig: true,
    },
  });

  return (
    <PayrollViewer
      role={role as 'Employee' | 'Admin'}
      user={user}
    />
  );
}
