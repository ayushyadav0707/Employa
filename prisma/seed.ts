import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Dayflow HRMS Personas & Master Dataset...');

  // ─── STEP 1: Clear all non-unique dependent data FIRST (safest order) ─────
  // This runs before anything else so any interruption leaves the DB in a
  // known empty state for these tables rather than a partial state.
  await prisma.activityLog.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.leaveRequest.deleteMany({});
  // Attendance uses upsert so we don't delete it — preserves real user data
  // if seed is run on a live DB with real check-ins.

  // ─── STEP 2: Upsert personas (idempotent: creates or updates all fields) ──
  const personas = [
    {
      name: 'Master Admin',
      role: 'ADMIN' as const,
      loginId: 'DAYFLOWMASTER01',
      email: 'admin@dayflow.com',
      password: 'AdminPassword123!',
      jobTitle: 'Chief Operating Officer',
      department: 'Executive',
      salary: 150000,
      panNo: 'ABCDE1234F',
      uanNo: '100904123450',
      bankAccount: 'HDFC000100200300',
      phone: '9876543210',
      address: 'Dayflow HQ Executive Floor, Silicon Valley Road, Bangalore',
      profilePicture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      isFirstLogin: false,
      employmentType: 'PERMANENT' as const,
    },
    
  ];

  const createdUsers: Record<string, string> = {};

  for (const p of personas) {
    const hashedPassword = await bcrypt.hash(p.password, 10);

    // Full upsert: update ALL fields on re-seed so data stays in sync
    const user = await prisma.user.upsert({
      where: { loginId: p.loginId },
      update: {
        name: p.name,
        email: p.email,
        role: p.role,
        phone: p.phone,
        address: p.address,
        profilePicture: p.profilePicture,
        jobTitle: p.jobTitle,
        department: p.department,
        employmentType: p.employmentType,
        salary: p.salary,
        panNo: p.panNo,
        uanNo: p.uanNo,
        bankAccount: p.bankAccount,
        isFirstLogin: p.isFirstLogin,
        // Note: password intentionally NOT updated on re-seed
        // so real users can change their password without it being reset
      },
      create: {
        loginId: p.loginId,
        email: p.email,
        password: hashedPassword,
        role: p.role,
        name: p.name,
        phone: p.phone,
        address: p.address,
        profilePicture: p.profilePicture,
        jobTitle: p.jobTitle,
        department: p.department,
        employmentType: p.employmentType,
        salary: p.salary,
        panNo: p.panNo,
        uanNo: p.uanNo,
        bankAccount: p.bankAccount,
        companyName: 'Dayflow Inc',
        emailVerified: new Date(),
        isFirstLogin: p.isFirstLogin,
      },
    });

    // Upsert LeaveBalance separately — nested create in upsert throws if it exists
    await prisma.leaveBalance.upsert({
      where: { userId: user.id },
      update: { paidTimeOff: 24, sickTimeOff: 7 },
      create: { userId: user.id, paidTimeOff: 24, sickTimeOff: 7 },
    });

    // Upsert PayrollConfig separately — same reason
    await prisma.payrollConfig.upsert({
      where: { userId: user.id },
      update: { salary: p.salary, taxPct: 10 },
      create: { userId: user.id, salary: p.salary, taxPct: 10 },
    });

    createdUsers[p.loginId] = user.id;
  }

  console.log('✅ Seeded 6 personas with LeaveBalances & PayrollConfigs.');

  // ─── STEP 3: Attendance (upsert — safe to re-run, preserves real data) ────
  const johnId   = createdUsers['OIJODO20260002'];
  const sarahId  = createdUsers['OISJEN20260003'];
  const alexId   = createdUsers['OIARIV20260004'];
  const emilyId  = createdUsers['OIEMZH20260001'];
  const priyaId  = createdUsers['OIPSHA20260005'];
  const adminId  = createdUsers['DAYFLOWMASTER01'];
  const allUserIds = [adminId, johnId, sarahId, alexId, emilyId, priyaId];

  let attendanceCount = 0;
  for (let day = 1; day <= 22; day++) {
    const dateStr = `2026-08-${day.toString().padStart(2, '0')}`;
    const dayOfWeek = new Date(dateStr).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

    for (const uId of allUserIds) {
      const rand = Math.random();
      let status = 'Present';
      let checkIn: string | null = '09:00 AM';
      let checkOut: string | null = '05:30 PM';
      let totalHours = 8.5;
      let remarks: string | null = null;

      if (rand > 0.9) {
        status = 'Absent'; checkIn = null; checkOut = null; totalHours = 0; remarks = 'Unplanned absence';
      } else if (rand > 0.8) {
        status = 'Half-day'; checkIn = '09:00 AM'; checkOut = '01:00 PM'; totalHours = 4.0; remarks = 'Doctor appointment';
      } else if (rand > 0.7) {
        checkIn = '09:30 AM'; totalHours = 8.0; remarks = 'Late arrival';
      }

      if (day === 22 && status === 'Present') {
        checkOut = null; totalHours = 0;
      }

      await prisma.attendance.upsert({
        where: { userId_date: { userId: uId, date: dateStr } },
        update: { status, checkIn, checkOut, totalHours, remarks },
        create: {
          userId: uId, date: dateStr, checkIn, checkOut, totalHours, status,
          location: uId === alexId ? 'Remote (Home Office)' : 'HQ - Floor 3',
          remarks,
        },
      });
      attendanceCount++;
    }
  }
  console.log(`✅ Seeded ${attendanceCount} attendance records.`);

  // ─── STEP 4: Recreate leave requests, events, tasks, activity logs ────────
  // Already deleted at top of main() so these are always clean re-creates
  await prisma.leaveRequest.createMany({
    data: [
      { userId: alexId, type: 'Paid', startDate: new Date('2026-08-28'), endDate: new Date('2026-08-30'), allocationDays: 3, reason: 'Annual family vacation trip', status: 'Pending' },
      { userId: johnId, type: 'Paid', startDate: new Date('2026-08-13'), endDate: new Date('2026-08-13'), allocationDays: 1, reason: 'Family ceremony attendance', status: 'Approved', adminComment: 'Approved by HR Lead' },
      { userId: sarahId, type: 'Unpaid', startDate: new Date('2026-08-10'), endDate: new Date('2026-08-11'), allocationDays: 2, reason: 'Personal workshop', status: 'Rejected', adminComment: 'Design sprint milestone week' },
    ],
  });
  console.log('✅ Seeded 3 leave requests.');

  await prisma.event.createMany({
    data: [
      { title: 'Employee Birthday', description: 'Rahim Uddin', type: 'Birthday', eventDate: new Date('2026-09-14T10:30:00'), timeString: '10:30 AM' },
      { title: 'Work Anniversary', description: 'Sumaiya Akter', type: 'Anniversary', eventDate: new Date('2026-09-15T11:00:00'), timeString: '11:00 AM' },
      { title: 'Payroll Processing', description: 'September 2026 Payroll', type: 'Payroll', eventDate: new Date('2026-09-28T14:00:00'), timeString: '02:00 PM' },
      { title: 'Leadership Training', description: 'Q3 Leadership Program', type: 'Training', eventDate: new Date('2026-09-20T15:30:00'), timeString: '03:30 PM' },
    ],
  });
  console.log('✅ Seeded 4 events with real future dates.');

  await prisma.task.createMany({
    data: [
      { userId: adminId, title: 'Review Leave Requests', category: 'Leave Management', priority: 'High', dueDate: new Date('2026-09-15'), status: 'In Progress' },
      { userId: adminId, title: 'Payroll Verification', category: 'Payroll', priority: 'Medium', dueDate: new Date('2026-09-28'), status: 'Pending' },
      { userId: adminId, title: 'Interview Schedule', category: 'Recruitment', priority: 'Medium', dueDate: new Date('2026-09-20'), status: 'In Progress' },
      { userId: johnId, title: 'Submit Weekly Report', category: 'Operations', priority: 'High', dueDate: new Date('2026-09-14'), status: 'In Progress' },
      { userId: johnId, title: 'Update Profile Details', category: 'HR', priority: 'Medium', dueDate: new Date('2026-09-16'), status: 'Pending' },
      { userId: sarahId, title: 'Complete Compliance Course', category: 'Training', priority: 'High', dueDate: new Date('2026-09-30'), status: 'Not Started' },
    ],
  });
  console.log('✅ Seeded 6 tasks.');

  await prisma.activityLog.createMany({
    data: [
      { userId: johnId,  message: 'John checked in successfully.',                type: 'Success', icon: 'Check',       createdAt: new Date(Date.now() - 1000 * 60 * 2) },
      { userId: sarahId, message: 'Sarah\'s leave request was approved.',          type: 'Success', icon: 'Check',       createdAt: new Date(Date.now() - 1000 * 60 * 15) },
      { userId: adminId, message: 'New employee Rakib Hasan has been added.',      type: 'Info',    icon: 'User',        createdAt: new Date(Date.now() - 1000 * 60 * 30) },
      { userId: adminId, message: 'Leave request submitted by Sumaiya Akter.',     type: 'Info',    icon: 'File',        createdAt: new Date(Date.now() - 1000 * 60 * 45) },
      { userId: adminId, message: 'Payroll for August 2026 has been completed.',   type: 'Success', icon: 'DollarSign',  createdAt: new Date(Date.now() - 1000 * 60 * 60) },
      { userId: johnId,  message: 'August 2026 Payslip is now available.',         type: 'Info',    icon: 'DollarSign',  createdAt: new Date(Date.now() - 1000 * 60 * 90) },
    ],
  });
  console.log('✅ Seeded 6 activity logs.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

