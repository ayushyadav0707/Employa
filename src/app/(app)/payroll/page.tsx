import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from 'react';
import { PayrollViewer } from '@/components/payroll/PayrollViewer';

export default async function PayrollPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const isAdmin = session.role === "ADMIN";

  // Load the current user's details and their payroll configuration
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      payrollConfig: true,
    },
  });

  // Admin also gets list of all employees for the admin view
  let allUsers = null;
  if (isAdmin) {
    allUsers = await prisma.user.findMany({
      where: { companyName: session.companyName },
      include: { payrollConfig: true },
      orderBy: { name: 'asc' }
    });
  }

  return (
    <PayrollViewer
      role={isAdmin ? 'Admin' : 'Employee'}
      user={user}
      allUsers={allUsers}
    />
  );
}
