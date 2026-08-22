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
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // EMAIL VERIFICATION GATE (The Hard Gate we locked in)
    if (user.emailVerified === null) {
      return NextResponse.json({ error: 'Please verify your email before logging in.' }, { status: 403 });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await createSession({
      id: user.id,
      role: user.role,
      loginId: user.loginId,
      isFirstLogin: user.isFirstLogin
    });

    return NextResponse.json({ message: 'Logged in successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed due to an unexpected error.' }, { status: 500 });
  }
}
