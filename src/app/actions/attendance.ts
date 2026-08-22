'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export async function getTodayAttendance() {
  const session = await getSession();
  if (!session) return null;

  const today = getTodayDateString();

  return await prisma.attendance.findUnique({
    where: {
      userId_date: {
        userId: session.id,
        date: today
      }
    }
  });
}

export async function checkIn() {
  const session = await getSession();
  if (!session) return { success: false, error: 'Unauthorized' };

  const today = getTodayDateString();
  const now = new Date();
  const timeString = now.toTimeString().split(' ')[0].substring(0, 5); // HH:mm

  try {
    const attendance = await prisma.attendance.upsert({
      where: {
        userId_date: {
          userId: session.id,
          date: today
        }
      },
      update: {
        checkIn: timeString, // If they already existed but no checkin
        status: 'Present'
      },
      create: {
        userId: session.id,
        date: today,
        checkIn: timeString,
        status: 'Present',
        location: 'HQ - Floor 3'
      }
    });

    revalidatePath('/', 'layout');
    return { success: true, attendance };
  } catch (error) {
    console.error('Check in error:', error);
    return { success: false, error: 'Failed to check in' };
  }
}

export async function checkOut() {
  const session = await getSession();
  if (!session) return { success: false, error: 'Unauthorized' };

  const today = getTodayDateString();
  const now = new Date();
  const timeString = now.toTimeString().split(' ')[0].substring(0, 5); // HH:mm

  try {
    const existing = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId: session.id,
          date: today
        }
      }
    });

    if (!existing || !existing.checkIn) {
      return { success: false, error: 'Cannot check out without checking in first' };
    }

    // Calculate total hours
    const checkInTime = existing.checkIn.split(':').map(Number);
    const checkOutTime = timeString.split(':').map(Number);
    
    let hours = (checkOutTime[0] - checkInTime[0]) + (checkOutTime[1] - checkInTime[1]) / 60;
    hours = Math.max(0, hours); // Ensure no negative

    const attendance = await prisma.attendance.update({
      where: {
        userId_date: {
          userId: session.id,
          date: today
        }
      },
      data: {
        checkOut: timeString,
        totalHours: Number(hours.toFixed(2))
      }
    });

    revalidatePath('/', 'layout');
    return { success: true, attendance };
  } catch (error) {
    console.error('Check out error:', error);
    return { success: false, error: 'Failed to check out' };
  }
}
