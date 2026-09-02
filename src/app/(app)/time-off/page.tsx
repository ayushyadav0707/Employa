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

  return (
    <TimeOffClient
      role={isAdmin ? 'Admin' : 'Employee'}
      initialBalance={balance || { paidTimeOff: 24, sickTimeOff: 7 }}
      initialRequests={serializedRequests}
      userId={userId}
      currentUser={currentUser}
    />
  );
}
