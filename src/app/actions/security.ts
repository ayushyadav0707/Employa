'use server';

import { prisma } from '@/lib/prisma';
import { getSession, clearSession, hashPassword, comparePassword } from '@/lib/auth';

export async function changePassword(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: 'Unauthorized' };

    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, error: 'All fields are required.' };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: 'New passwords do not match.' };
    }
    
    if (newPassword === currentPassword) {
      return { success: false, error: 'New password must be different from current password.' };
    }
    
    if (newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const user = await prisma.user.findUnique({ where: { id: session.id } });
    if (!user) return { success: false, error: 'User not found.' };

    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) return { success: false, error: 'Incorrect current password.' };

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: session.id },
      data: { password: hashedPassword }
    });
    
    await prisma.activityLog.create({
      data: {
        userId: session.id,
        message: 'Password was changed successfully.',
        type: 'Info',
        icon: 'Lock'
      }
    });

    // Destroy the current session forcing the user to log back in
    await clearSession();

    return { success: true };
  } catch (error) {
    console.error('Password change error:', error);
    return { success: false, error: 'Failed to change password.' };
  }
}
