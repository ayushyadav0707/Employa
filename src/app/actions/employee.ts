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

    // Login ID Generation Logic: [OI][First 2 Name + First 2 Last Name][Year][Seq]
    const year = new Date().getFullYear();
    const parts = name.trim().split(' ');
    const first = parts[0] || 'XX';
    const last = parts.length > 1 ? parts[parts.length - 1] : 'XX';
    const prefix = `OI${first.substring(0,2).toUpperCase()}${last.substring(0,2).toUpperCase()}${year}`;

    // Get count for sequence
    const currentYearEmployees = await prisma.user.count({
      where: {
        loginId: {
          startsWith: prefix
        }
      }
    });
    
    const seq = String(currentYearEmployees + 1).padStart(4, '0');
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
        emailVerified: new Date(), // Auto-verify so they can login
        isFirstLogin: true, // Force password reset on first login
        leaveBalance: { create: { paidTimeOff: 24, sickTimeOff: 7 } },
        payrollConfig: { create: { salary, taxPct: 10 } },
      }
    });

    revalidatePath('/employees');
    return { success: true, employee: newEmployee, password: rawPassword };
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
