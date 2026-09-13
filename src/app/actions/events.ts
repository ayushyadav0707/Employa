'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createEvent(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return { success: false, error: 'Unauthorized' };

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const type = formData.get('type') as string;
  const eventDateStr = formData.get('eventDate') as string;
  const timeString = formData.get('timeString') as string;

  if (!title || !eventDateStr) return { success: false, error: 'Title and Date are required' };

  try {
    await prisma.event.create({
      data: {
        title,
        description,
        type,
        eventDate: new Date(eventDateStr),
        timeString
      }
    });
    revalidatePath('/dashboard');
    revalidatePath('/events');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteEvent(id: string) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return { success: false, error: 'Unauthorized' };

  try {
    await prisma.event.delete({ where: { id } });
    revalidatePath('/dashboard');
    revalidatePath('/events');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
