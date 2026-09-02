'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

import { getSession } from '@/lib/auth';

function generatePassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function createEmployee(formData: FormData) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin access required.' };
    }
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const panNo = formData.get('panNo') as string;
    const uanNo = formData.get('uanNo') as string;
    const jobTitle = formData.get('jobTitle') as string;
    const department = formData.get('department') as string;
    const salary = Number(formData.get('salary')) || 0;

    // Login ID Generation Logic: TA[YYYY][FirstInit][LastInit][Seq]
    const year = new Date().getFullYear();
    const parts = name.trim().split(' ');
    const firstInit = parts[0] ? parts[0].charAt(0).toUpperCase() : 'X';
    const lastInit = parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : 'X';
    const prefix = `TA${year}${firstInit}${lastInit}`;

    // Get all loginIds for this company this year to find the highest sequence
    // The sequence is company-wide, not dependent on the initials.
    const allCompanyEmployees = await prisma.user.findMany({
      where: {
        companyName: session.companyName,
        loginId: {
          startsWith: `TA${year}`
        }
      },
      select: { loginId: true }
    });
    
    let nextSeqNum = 1;
    if (allCompanyEmployees.length > 0) {
      const sequences = allCompanyEmployees.map(emp => {
        // ID format is TA2026AY002. Last 3 chars are sequence.
        const seqStr = emp.loginId.slice(-3);
        const num = parseInt(seqStr, 10);
        return isNaN(num) ? 0 : num;
      });
      nextSeqNum = Math.max(...sequences) + 1;
    }
    
    const seq = String(nextSeqNum).padStart(3, '0');
    const loginId = `${prefix}${seq}`;

    // Auto-generate initial password and hash it
    const rawPassword = generatePassword();
    const password = await bcrypt.hash(rawPassword, 10);

    const newEmployee = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        address,
        panNo,
        uanNo,
        jobTitle,
        department,
        salary,
        loginId,
        password, // Hashed with bcrypt
        role: 'EMPLOYEE',
        companyName: session.companyName, // Inherit Admin's company
        emailVerified: new Date(), // Auto-verify so they can login
        isFirstLogin: true, // Force password reset on first login
        leaveBalance: { create: { paidTimeOff: 24, sickTimeOff: 7 } },
        payrollConfig: { create: { salary, taxPct: 10 } },
      }
    });

    let emailSent = false;
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');
      const { data, error } = await resend.emails.send({
        from: 'Team ADAP(T) <onboarding@resend.dev>',
        to: 'admin.team.adapt@gmail.com', // Hardcoded to bypass Sandbox restrictions
        subject: 'Your Employa account is ready',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
            <div style="background-color: #111827; padding: 24px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">Welcome to Team ADAP(T)</h2>
            </div>
            <div style="padding: 32px 24px;">
              <p style="font-size: 16px; color: #374151; margin-top: 0; margin-bottom: 16px;">Hi ${name},</p>
              <p style="font-size: 16px; color: #374151; margin-top: 0; margin-bottom: 24px; line-height: 1.5;">An account has been created for you on Employa HRMS. Use the credentials below to log in for the first time.</p>
              
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Employee ID</p>
                <p style="margin: 0 0 20px 0; font-size: 24px; color: #0f172a; font-weight: 700; letter-spacing: 0.02em;">${loginId}</p>
                
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Temporary Password</p>
                <p style="margin: 0; font-size: 18px; color: #0f172a; font-weight: 600; font-family: monospace; background: #e2e8f0; display: inline-block; padding: 4px 12px; border-radius: 4px;">${rawPassword}</p>
              </div>
              
              <div style="background-color: #fefce8; border-left: 4px solid #eab308; padding: 16px; margin-bottom: 32px; border-radius: 0 4px 4px 0;">
                <p style="margin: 0; color: #854d0e; font-size: 14px; line-height: 1.5;">⚠️ This password is temporary. You'll be asked to set a new one immediately after your first login.</p>
              </div>
              
              <div style="text-align: center; margin-bottom: 32px;">
                <a href="https://employa-hrms.vercel.app/login" style="display: inline-block; background-color: #7c3aed; color: #ffffff; text-decoration: none; font-weight: 600; padding: 14px 28px; border-radius: 6px; font-size: 16px;">Log In to Dayflow &rarr;</a>
              </div>
              
              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">If you weren't expecting this account, please contact your HR administrator.</p>
            </div>
            <div style="background-color: #f9fafb; padding: 20px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">&copy; 2026 Team ADAP(T) . All rights reserved.</p>
            </div>
          </div>
        `
      });

      if (error) {
        throw new Error(error.message);
      }

      emailSent = true;
      console.log('Successfully sent onboarding email to', email);
    } catch (emailError) {
      console.error('Failed to send onboarding email via Resend:', emailError);
      
      // Log the email failure to ActivityLog so Admins have a persistent record
      await prisma.activityLog.create({
        data: {
          userId: session.id, // The Admin who created the employee
          message: `Failed to send onboarding email to ${email} (User: ${loginId}). Ensure they receive their temporary password manually.`,
          type: 'Warning',
          icon: 'Mail'
        }
      });
    }

    // Log the successful creation
    await prisma.activityLog.create({
      data: {
        userId: session.id, // The Admin who created the employee
        message: `Created new employee: ${name} (${loginId})`,
        type: 'Success',
        icon: 'UserPlus'
      }
    });

    revalidatePath('/employees');
    return { success: true, employee: newEmployee, password: rawPassword, emailSent };
  } catch (error: any) {
    console.error('Failed to create employee', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return { success: false, error: 'An employee with this email address already exists.' };
    }
    return { success: false, error: 'Failed to create employee' };
  }
}

export async function updateEmployee(id: string, formData: FormData) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }
    
    // Only Admin can update other users' profiles
    if (session.role !== 'ADMIN' && session.id !== id) {
      return { success: false, error: 'Unauthorized: Cannot update another user\'s profile.' };
    }

    const data: any = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      panNo: formData.get('panNo') as string,
      uanNo: formData.get('uanNo') as string,
      jobTitle: formData.get('jobTitle') as string,
      department: formData.get('department') as string,
    };

    if (formData.has('profilePicture')) {
      const pic = formData.get('profilePicture') as string;
      if (pic && pic.trim() !== '') {
        data.profilePicture = pic;
      }
    }

    if (formData.has('salary') && session.role === 'ADMIN') {
      data.salary = Number(formData.get('salary'));
    }

    const updated = await prisma.user.update({
      where: { id },
      data
    });

    revalidatePath(`/profile/${id}`);
    revalidatePath('/employees');
    return { success: true, employee: updated };
  } catch (error) {
    console.error('Failed to update employee', error);
    return { success: false, error: 'Failed to update employee' };
  }
}

export async function resetEmployeePassword(id: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    const employee = await prisma.user.findUnique({ where: { id, companyName: session.companyName } });
    if (!employee) return { success: false, error: 'Employee not found.' };

    const rawPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        isFirstLogin: true, // Force them to change it again on login
        passwordIssuedAt: new Date(), // Reset the 24-hour clock correctly without mutating tenure
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        message: `Regenerated temporary password for ${employee.name} (${employee.loginId}).`,
        type: 'Success',
        icon: 'Key'
      }
    });

    return { success: true, password: rawPassword };
  } catch (error) {
    console.error('Failed to reset employee password', error);
    return { success: false, error: 'Failed to reset password' };
  }
}

export async function deleteEmployee(id: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    const employee = await prisma.user.findUnique({
      where: { id, companyName: session.companyName }
    });

    if (!employee) return { success: false, error: 'Employee not found.' };

    // Email Release Strategy: rename the email to free it up for future hires
    // e.g. john@company.com -> john@company.com.terminated.1709123841
    let newEmail = employee.email;
    if (newEmail) {
      newEmail = `${newEmail}.terminated.${Date.now()}`;
    }

    // Soft delete: keep historical records intact
    await prisma.user.update({
      where: { id },
      data: { 
        status: 'TERMINATED',
        email: newEmail
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        message: `Terminated employee: ${employee.name} (${employee.loginId}).`,
        type: 'Warning',
        icon: 'UserX'
      }
    });

    revalidatePath('/employees');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete employee', error);
    return { success: false, error: 'Failed to delete employee' };
  }
}
