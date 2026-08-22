import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, getSession } from '@/lib/auth';
import crypto from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // 1. EXPLICIT ROLE GATE
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { name, email, phone, role } = await req.json();

    // Check if email already exists in the system
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'This email is already in use by another account' }, { status: 400 });
    }

    // Map the UI 'HR' role to the DB 'ADMIN' role. Default to EMPLOYEE.
    const dbRole = role === 'HR' ? 'ADMIN' : 'EMPLOYEE';

    // Fetch the admin's company to assign to the employee
    const admin = await prisma.user.findUnique({ where: { id: session.id } });
    if (!admin || !admin.companyName) {
      return NextResponse.json({ error: 'Admin company missing' }, { status: 400 });
    }
    const companyName = admin.companyName;

    // 2. Generate temp password
    const tempPassword = crypto.randomBytes(4).toString('hex'); // 8 character random string
    const hashedPassword = await hashPassword(tempPassword);

    // 3. Generate custom Login ID (Strict Wireframe Format)
    // A. Company Initials (e.g. "Odoo India" -> "OI")
    const compWords = companyName.trim().split(/\s+/);
    const compInitials = compWords.length > 1 
      ? (compWords[0][0] + compWords[1][0]).toUpperCase() 
      : companyName.substring(0, 2).toUpperCase().padEnd(2, 'X');

    // B. Employee Name Initials (First 2 of First Name + First 2 of Last Name)
    const nameWords = (name || 'User').trim().split(/\s+/);
    let nameCode = '';
    if (nameWords.length > 1) {
      const first2 = nameWords[0].substring(0, 2).toUpperCase().padEnd(2, 'X');
      const last2 = nameWords[nameWords.length - 1].substring(0, 2).toUpperCase().padEnd(2, 'X');
      nameCode = `${first2}${last2}`;
    } else {
      nameCode = nameWords[0].substring(0, 4).toUpperCase().padEnd(4, 'X');
    }

    // C. Year and Sequence
    const year = new Date().getFullYear();
    const count = await prisma.user.count({ 
      where: { companyName, createdAt: { gte: new Date(year, 0, 1) } } 
    });
    
    // Combine: OIJODO20220001
    const loginId = `${compInitials}${nameCode}${year}${(count + 1).toString().padStart(4, '0')}`;

    // 4. Create Employee
    const user = await prisma.user.create({
      data: {
        companyName,
        name,
        email,
        phone,
        loginId,
        password: hashedPassword,
        role: dbRole,
        isFirstLogin: true, 
        emailVerified: new Date(), // Implicitly verified since Admin created them
      }
    });

    // 5. SEND REAL EMAIL VIA RESEND
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_123456789') {
      try {
        await resend.emails.send({
          from: 'Dayflow HR <onboarding@resend.dev>',
          to: [email],
          subject: `Welcome to ${companyName} - Your Dayflow HR Account`,
          html: `
            <h2>Welcome to the team, ${name}!</h2>
            <p>Your HR administrator has created a Dayflow account for you.</p>
            <p><strong>Your Login ID:</strong> ${user.loginId}</p>
            <p><strong>Your Temporary Password:</strong> ${tempPassword}</p>
            <br/>
            <p>Please log in at <a href="http://localhost:3000/login">http://localhost:3000/login</a>.</p>
            <p><em>Note: You will be required to change your password immediately upon your first login.</em></p>
          `
        });
      } catch (emailError) {
        console.error('[RESEND EMAIL FAILED]', emailError);
        // We don't throw a 500 here because the user was successfully created in the DB.
        // HR can still copy the credentials from the screen.
      }
    } else {
      console.log(`[MOCK EMAIL] Employee created: LoginID=${user.loginId} TempPass=${tempPassword}`);
    }

    // 6. RETURN PLAINTEXT PASSWORD ONCE
    return NextResponse.json({ 
      message: 'Employee created successfully',  
      employee: {
        loginId: user.loginId,
        name: user.name,
        email: user.email,
        tempPassword // Returned in plaintext for HR to relay manually
      }
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
