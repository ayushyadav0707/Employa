import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { verifyToken: token } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        emailVerified: new Date(),
        verifyToken: null // One-time use to prevent reuse
      }
    });

    // Redirect to login with a success parameter
    return NextResponse.redirect(new URL('/login?verified=true', req.url));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
