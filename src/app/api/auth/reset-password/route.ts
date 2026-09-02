import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, getSession, clearSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { newPassword } = await req.json();
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    if (newPassword.includes(' ')) {
      return NextResponse.json({ error: 'Password cannot contain spaces' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(newPassword);

    const user = await prisma.user.update({
      where: { id: session.id },
      data: { 
        password: hashedPassword,
        isFirstLogin: false 
      }
    });

    // Log the successful password reset (First Login)
    await prisma.activityLog.create({
      data: {
        userId: session.id,
        message: 'Password was reset (First login completion).',
        type: 'Success',
        icon: 'ShieldCheck'
      }
    });

    // Destroy the current session so the user is forced to log in again with their new password
    await clearSession();

    return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
