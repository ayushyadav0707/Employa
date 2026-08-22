'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

export async function updateMonthlyWage(userId: string, salary: number) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required.');
  }

  if (salary < 0) {
    throw new Error('Monthly wage cannot be negative.');
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      salary,
    },
  });

  revalidatePath('/payroll');
}
