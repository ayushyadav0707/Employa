import React from 'react';
import { prisma } from '@/lib/prisma';
import { TimeOffClient } from '@/components/leave/TimeOffClient';

type SearchParams = Promise<{ role?: string }>;

interface TimeOffPageProps {
  searchParams: SearchParams;
}

export default async function TimeOffPage({ searchParams }: TimeOffPageProps) {
  const { role = 'Employee' } = await searchParams;

  // Find the first employee in the system
  const employee = await prisma.user.findFirst({
    where: { role: 'Employee' },
    select: { id: true },
  });

  const userId = employee?.id ?? '';

  // Fetch leave balance for that employee
  const balance = await prisma.leaveBalance.findFirst({
    where: { user: { role: 'Employee' } },
  });

  // Fetch leave requests — Admin sees all, Employee sees own
  const requests = await prisma.leaveRequest.findMany({
    where: role === 'Admin' ? undefined : { userId },
    orderBy: { startDate: 'desc' },
  });

  return (
    <TimeOffClient
      role={role as 'Employee' | 'Admin'}
      initialBalance={balance || { paidTimeOff: 24, sickTimeOff: 7 }}
      initialRequests={requests}
      userId={userId}
    />
  );
}
