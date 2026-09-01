import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, createSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { emailOrLoginId, password } = await req.json();
    
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrLoginId },
          { loginId: emailOrLoginId }
        ]
      }
    });

    if (!user) {
      await prisma.activityLog.create({
        data: {
          message: `Failed login attempt for unknown ID: ${emailOrLoginId}`,
          type: 'Warning',
          icon: 'AlertTriangle'
        }
      });
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // EMAIL VERIFICATION GATE (The Hard Gate we locked in)
    if (user.emailVerified === null) {
      return NextResponse.json({ error: 'Please verify your email before logging in.' }, { status: 403 });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          message: `Failed login attempt (invalid password).`,
          type: 'Warning',
          icon: 'AlertTriangle'
        }
      });
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // ENFORCE TEMP PASSWORD EXPIRY
    if (user.isFirstLogin) {
      const now = new Date();
      const issuedAt = new Date(user.passwordIssuedAt);
      const hoursSinceIssue = (now.getTime() - issuedAt.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceIssue > 24) {
        await prisma.activityLog.create({
          data: {
            userId: user.id,
            message: `Login failed: Temporary password expired.`,
            type: 'Warning',
            icon: 'Clock'
          }
        });
        return NextResponse.json({ error: 'Temporary password expired. Please contact Admin.' }, { status: 403 });
      }
    }

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        message: `Logged in successfully.`,
        type: 'Success',
        icon: 'LogIn'
      }
    });

    await createSession({
      id: user.id,
      role: user.role,
      loginId: user.loginId,
      isFirstLogin: user.isFirstLogin,
      companyName: user.companyName
    });

    return NextResponse.json({ message: 'Logged in successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed due to an unexpected error.' }, { status: 500 });
  }
}
