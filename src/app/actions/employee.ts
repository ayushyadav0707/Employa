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

    // Get the most recent employee with this prefix to determine the next sequence
    // It remains company-scoped to prevent tracking total count across tenants and avoid collisions
    const lastEmployee = await prisma.user.findFirst({
      where: {
        companyName: session.companyName,
        loginId: {
          startsWith: prefix
        }
      },
      orderBy: {
        loginId: 'desc'
      },
      select: {
        loginId: true
      }
    });
    
    let nextSeqNum = 1;
    if (lastEmployee && lastEmployee.loginId) {
      const lastSeqStr = lastEmployee.loginId.substring(prefix.length);
      const lastSeq = parseInt(lastSeqStr, 10);
      if (!isNaN(lastSeq)) {
        nextSeqNum = lastSeq + 1;
      }
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
      await resend.emails.send({
        from: 'Dayflow HR <onboarding@dayflow.com>',
        to: email,
        subject: 'Welcome to Dayflow - Your Login Credentials',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Dayflow!</h2>
            <p>Hi ${name},</p>
            <p>Your Dayflow HRMS account has been created.</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Login ID:</strong> ${loginId}</p>
              <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${rawPassword}</p>
            </div>
            <p style="color: #d97706; font-size: 14px;">⚠️ Please log in and change your password immediately.</p>
            <br/>
            <p>Best,<br/>Dayflow HR Team</p>
          </div>
        `
      });
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
  } catch (error) {
    console.error('Failed to create employee', error);
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

    // Soft delete: keep historical records intact
    await prisma.user.update({
      where: { id },
      data: { status: 'TERMINATED' }
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
