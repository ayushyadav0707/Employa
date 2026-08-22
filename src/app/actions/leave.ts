'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitLeaveRequest(formData: {
  userId: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  attachmentUrl?: string;
}) {
  const start = new Date(formData.startDate);
  const end = new Date(formData.endDate);
  
  if (end < start) {
    throw new Error('End date must be on or after start date.');
  }

  // Calculate allocation days
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const allocationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // Validation: Sick leave requires attachment
  if (formData.type === 'Sick time off' && !formData.attachmentUrl) {
    throw new Error('Sick leave request requires a doctor\'s certificate (attachment).');
  }

  // Save to database
  await prisma.leaveRequest.create({
    data: {
      userId: formData.userId,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      allocationDays,
      reason: formData.reason,
      status: 'Pending',
      attachmentUrl: formData.attachmentUrl || null,
    },
  });

  revalidatePath('/time-off');
}

export async function updateLeaveRequestStatus(
  id: string,
  status: 'Approved' | 'Rejected',
  adminComment: string
) {
  // Begin transaction to ensure consistency when updating balance
  await prisma.$transaction(async (tx) => {
    const request = await tx.leaveRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new Error('Leave request not found.');
    }

    if (!request.userId) {
      throw new Error('Leave request has no associated user.');
    }

    if (request.status !== 'Pending') {
      throw new Error('This request has already been processed.');
    }

    // Update status
    await tx.leaveRequest.update({
      where: { id },
      data: {
        status,
        adminComment,
      },
    });

    // If approved, decrement the balance
    if (status === 'Approved') {
      const balance = await tx.leaveBalance.findUnique({
        where: { userId: request.userId },
      });

      if (balance) {
        if (request.type === 'Paid Time off') {
          await tx.leaveBalance.update({
            where: { userId: request.userId },
            data: { paidTimeOff: Math.max(0, balance.paidTimeOff - request.allocationDays) },
          });
        } else if (request.type === 'Sick time off') {
          await tx.leaveBalance.update({
            where: { userId: request.userId },
            data: { sickTimeOff: Math.max(0, balance.sickTimeOff - request.allocationDays) },
          });
        }
      }
    }
  });

  revalidatePath('/time-off');
}
