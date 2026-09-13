import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from 'react';
import { TimeOffClient } from '@/components/leave/TimeOffClient';

export default async function TimeOffPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const isAdmin = session.role === "ADMIN";
  const userId = session.id;

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, loginId: true }
  });

  // Fetch leave balance for the current user
  const balance = await prisma.leaveBalance.findUnique({
    where: { userId },
  });

  // Admin sees all requests; employee sees only their own
  const requests = await prisma.leaveRequest.findMany({
    where: isAdmin ? { user: { companyName: session.companyName } } : { userId },
    orderBy: { startDate: 'desc' },
    include: {
      user: {
        select: { name: true, loginId: true }
      }
    }
  });

  // Serialize dates to strings for client component compatibility
  const serializedRequests = requests.map(r => ({
    ...r,
    startDate: r.startDate instanceof Date ? r.startDate.toISOString().split('T')[0] : r.startDate,
    endDate: r.endDate instanceof Date ? r.endDate.toISOString().split('T')[0] : r.endDate,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
    updatedAt: r.updatedAt instanceof Date ? r.updatedAt.toISOString() : r.updatedAt,
  }));


  // Dynamic Leave Calculation
  const currentMonth = new Date().getMonth(); // 0-11
  const baseBalances = {
    'Annual Leave': 12,
    'Sick Leave': 7,
    'Casual Leave': 12,
    'Earned Leave': currentMonth
  };

  const usedBalances = {
    'Annual Leave': 0,
    'Sick Leave': 0,
    'Casual Leave': 0,
    'Earned Leave': 0
  };

  const myApprovedLeavesThisYear = await prisma.leaveRequest.findMany({
    where: {
      userId: session.id,
      status: 'Approved',
      startDate: { gte: new Date(new Date().getFullYear(), 0, 1) }
    }
  });

  myApprovedLeavesThisYear.forEach(leave => {
    let type = leave.type;
    if (type === 'Paid Time off' || type === 'Paid time off') type = 'Annual Leave';
    if (type === 'Sick time off') type = 'Sick Leave';
    if (type === 'Unpaid Leaves') type = 'Casual Leave';
    if (type in usedBalances) {
      usedBalances[type as keyof typeof usedBalances] += leave.allocationDays || 0;
    }
  });

  const leaveBalances = {
    annual: Math.max(0, baseBalances['Annual Leave'] - usedBalances['Annual Leave']),
    sick: Math.max(0, baseBalances['Sick Leave'] - usedBalances['Sick Leave']),
    casual: Math.max(0, baseBalances['Casual Leave'] - usedBalances['Casual Leave']),
    earned: Math.max(0, baseBalances['Earned Leave'] - usedBalances['Earned Leave'])
  };

  const serializedBalance = leaveBalances;

  return (
    <TimeOffClient
      role={isAdmin ? 'Admin' : 'Employee'}
      initialBalance={serializedBalance}
      initialRequests={serializedRequests}
      userId={userId}
      currentUser={currentUser}
    />
  );
}
