'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

function getISTDate(date: Date = new Date()) {
  // Convert to IST string format: YYYY-MM-DD, HH:mm:ss
  const options: Intl.DateTimeFormatOptions = { 
    timeZone: 'Asia/Kolkata',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false 
  };
  
  const formatter = new Intl.DateTimeFormat('en-CA', options); // en-CA gives YYYY-MM-DD
  const parts = formatter.formatToParts(date);
  
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  const hour = parts.find(p => p.type === 'hour')?.value;
  const minute = parts.find(p => p.type === 'minute')?.value;
  
  return {
    dateString: `${year}-${month}-${day}`,
    timeString: `${hour}:${minute}`
  };
}

export async function getTodayAttendance() {
  const session = await getSession();
  if (!session) return null;

  const { dateString: today } = getISTDate();

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

  const { dateString: today, timeString } = getISTDate();

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

  const { dateString: today, timeString } = getISTDate();

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
