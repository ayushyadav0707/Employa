import { NextResponse } from 'next/server';
import { clearSession, getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const session = await getSession();
  
  if (session) {
    await prisma.activityLog.create({
      data: {
        userId: session.id,
        message: 'User logged out.',
        type: 'Info',
        icon: 'LogOut'
      }
    });
  }

  await clearSession();
  return NextResponse.json({ success: true }, { status: 200 });
}
