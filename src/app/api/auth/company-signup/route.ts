import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import crypto from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { companyName, name, email, phone, password } = await req.json();
    console.log("PAYLOAD:", { companyName, name, email, phone, password });
    
    if (typeof password === 'string' && password.includes(' ')) {
      return NextResponse.json({ error: 'Password cannot contain spaces' }, { status: 400 });
    }
    
    // Check if email exists
    console.log("-> checking email existence...");
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    console.log("-> generating login ID...");
    // Generate HR Login ID (Company Registration)
    const safeCompany = companyName || 'OO';
    const safeName = name || 'User';
    const initials = safeCompany.substring(0, 2).toUpperCase() + safeName.replace(/\s+/g, '').substring(0, 4).toUpperCase();
    const year = new Date().getFullYear();
    console.log("-> counting users...");
    const count = await prisma.user.count({ 
      where: { companyName: safeCompany, createdAt: { gte: new Date(year, 0, 1) } } 
    });
    const loginId = `${initials}${year}${(count + 1).toString().padStart(4, '0')}`;

    console.log("-> hashing password...");
    const hashedPassword = await hashPassword(password);
    const verifyToken = crypto.randomBytes(32).toString('hex');

    console.log("-> creating user...");
    const user = await prisma.user.create({
      data: {
        companyName: safeCompany,
        name,
        email,
        phone,
        loginId,
        password: hashedPassword,
        role: 'ADMIN', // The person registering the company is the Admin
        isFirstLogin: false, // Admin sets their own password initially
        verifyToken,
        emailVerified: new Date(), // Implicitly verify since it's an internal/API-only onboarding route now
      }
    });

    const verifyLink = `http://localhost:3000/api/auth/verify?token=${verifyToken}`;
    
    // REAL EMAIL INTEGRATION (RESEND)
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_123456789') {
      const { data, error: resendError } = await resend.emails.send({
        from: 'Dayflow <onboarding@resend.dev>',
        to: [email],
        subject: 'Verify your Dayflow Company Account',
        html: `<p>Hi ${name},</p><p>Click <a href="${verifyLink}">here</a> to verify your company account.</p>`
      });

      if (resendError) {
        console.error('[RESEND ERROR]', resendError);
        return NextResponse.json({ error: 'Failed to send verification email. Resend Sandbox restriction: Ensure you are using the verified Resend account owner email.' }, { status: 400 });
      }
    } else {
      // Fallback for local testing if real API key is missing
      console.log(`\n\n=== [MOCK EMAIL] ===\nVerification link for ${email}:\n${verifyLink}\n====================\n\n`);
    }

    return NextResponse.json({ 
      message: 'Company registered. Please check your email (or server console) for the verification link.' 
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
