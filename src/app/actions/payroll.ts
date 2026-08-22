'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateMonthlyWage(userId: string, salary: number) {
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
