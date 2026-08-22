import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      leaveBalance: true,
      payrollConfig: true,
      attendances: true,
      leaveRequests: true,
    },
  });

  console.log('----------------------------------------------------------------------------------------------------');
  console.log(`✅ Total Seeded Users: ${users.length}`);
  console.log('----------------------------------------------------------------------------------------------------');

  for (const u of users) {
    const expectedPassword = u.loginId === 'DAYFLOWMASTER01' ? 'AdminPassword123!' : 'Employee123!';
    const isPasswordValid = await bcrypt.compare(expectedPassword, u.password);
    console.log(
      `👤 [${u.role.padEnd(8)}] ${u.name.padEnd(16)} | ID: ${u.loginId.padEnd(16)} | Email: ${u.email.padEnd(20)} | Password Check: ${isPasswordValid ? '✅ PASS' : '❌ FAIL'} | Sal: ₹${u.payrollConfig?.salary} | PTO: ${u.leaveBalance?.paidTimeOff}d`
    );
  }

  const totalAttendances = await prisma.attendance.count();
  const totalLeaves = await prisma.leaveRequest.count();
  console.log('----------------------------------------------------------------------------------------------------');
  console.log(`📊 Linked Records: ${totalAttendances} Attendance Logs | ${totalLeaves} Leave Requests`);
  console.log('----------------------------------------------------------------------------------------------------');
}

main().finally(() => prisma.$disconnect());
