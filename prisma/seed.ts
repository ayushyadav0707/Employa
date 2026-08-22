import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Dayflow HRMS Personas & Master Dataset...');

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
    },
    {
      name: 'Emily Zhang',
      role: 'ADMIN' as const,
      loginId: 'OIEMZH20260001',
      email: 'emily.hr@dayflow.com',
      password: 'Employee123!',
      jobTitle: 'HR Lead & People Ops',
      department: 'Human Resources',
      salary: 95000,
      panNo: 'EMZHG5678K',
      uanNo: '100904123451',
      bankAccount: 'ICIC000100200301',
      phone: '9876543211',
      address: '742 Evergreen Terrace, Sector 4, Bangalore',
      profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      isFirstLogin: false,
    },
    {
      name: 'John Doe',
      role: 'EMPLOYEE' as const,
      loginId: 'OIJODO20260002',
      email: 'john@dayflow.com',
      password: 'Employee123!',
      jobTitle: 'Senior Frontend Architect',
      department: 'Engineering',
      salary: 110000,
      panNo: 'JOHND1234A',
      uanNo: '100904123452',
      bankAccount: 'SBI000100200302',
      phone: '9876543212',
      address: 'Flat 402, Sunshine Heights, Whitefield, Bangalore',
      profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isFirstLogin: false,
    },
    {
      name: 'Sarah Jenkins',
      role: 'EMPLOYEE' as const,
      loginId: 'OISJEN20260003',
      email: 'sarah@dayflow.com',
      password: 'Employee123!',
      jobTitle: 'Lead UI/UX Designer',
      department: 'Product & Design',
      salary: 85000,
      panNo: 'SARAH5678B',
      uanNo: '100904123453',
      bankAccount: 'AXIS000100200303',
      phone: '9876543213',
      address: 'Villa 12, Palm Meadows, Indiranagar, Bangalore',
      profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      isFirstLogin: false,
    },
    {
      name: 'Alex Rivera',
      role: 'EMPLOYEE' as const,
      loginId: 'OIARIV20260004',
      email: 'alex@dayflow.com',
      password: 'Employee123!',
      jobTitle: 'Senior Product Manager',
      department: 'Product Management',
      salary: 95000,
      panNo: 'ALEXR9012C',
      uanNo: '100904123454',
      bankAccount: 'KOTAK000100200304',
      phone: '9876543214',
      address: '22 Baker Street, Koramangala, Bangalore',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isFirstLogin: false,
    },
    {
      name: 'Priya Sharma',
      role: 'EMPLOYEE' as const,
      loginId: 'OIPSHA20260005',
      email: 'priya@dayflow.com',
      password: 'Employee123!',
      jobTitle: 'Product Marketing Lead',
      department: 'Growth & Marketing',
      salary: 75000,
      panNo: 'PRIYS3456D',
      uanNo: '100904123455',
      bankAccount: 'YESB000100200305',
      phone: '9876543215',
      address: 'Apt 101, Green Glen Layout, Bellandur, Bangalore',
      profilePicture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      isFirstLogin: false,
    },
  ];

  const createdUsers: Record<string, string> = {};

  for (const p of personas) {
    const hashedPassword = await bcrypt.hash(p.password, 10);
    const user = await prisma.user.create({
      data: {
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
        salary: p.salary,
        panNo: p.panNo,
        uanNo: p.uanNo,
        bankAccount: p.bankAccount,
        companyName: 'Dayflow Inc',
        emailVerified: new Date(),
        isFirstLogin: p.isFirstLogin,
        leaveBalance: { create: { paidTimeOff: 24, sickTimeOff: 7 } },
        payrollConfig: { create: { salary: p.salary, taxPct: 10 } },
      },
    });

    createdUsers[p.loginId] = user.id;
  }

  console.log('✅ Seeded 6 personas successfully with LeaveBalances & PayrollConfigs.');

  const johnId = createdUsers['OIJODO20260002'];
  const sarahId = createdUsers['OISJEN20260003'];
  const alexId = createdUsers['OIARIV20260004'];
  const emilyId = createdUsers['OIEMZH20260001'];
  const priyaId = createdUsers['OIPSHA20260005'];

  const adminId = createdUsers['DAYFLOWMASTER01'];
  const allUserIds = [adminId, johnId, sarahId, alexId, emilyId, priyaId];
  let generatedAttendances = [];
  
  // Generate attendance from August 1 to August 22, 2026
  for (let day = 1; day <= 22; day++) {
    const dateStr = `2026-08-${day.toString().padStart(2, '0')}`;
    const d = new Date(dateStr);
    const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday

    for (const uId of allUserIds) {
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue; // Skip weekends
      }

      // Add some randomness
      const rand = Math.random();
      let status = 'Present';
      let checkIn: string | null = '09:00 AM';
      let checkOut: string | null = '05:30 PM';
      let totalHours = 8.5;
      let remarks: string | null = null;

      if (rand > 0.9) {
        status = 'Absent';
        checkIn = null;
        checkOut = null;
        totalHours = 0;
        remarks = 'Unplanned absence';
      } else if (rand > 0.8) {
        status = 'Half-day';
        checkIn = '09:00 AM';
        checkOut = '01:00 PM';
        totalHours = 4.0;
        remarks = 'Doctor appointment';
      } else if (rand > 0.7) {
        checkIn = '09:30 AM';
        totalHours = 8.0;
        remarks = 'Late arrival';
      }

      // On Aug 22 (today), some people haven't checked out yet
      if (day === 22 && status === 'Present') {
        checkOut = null;
        totalHours = 0; // Not checked out
      }

      generatedAttendances.push({
        userId: uId,
        date: dateStr,
        checkIn,
        checkOut,
        totalHours,
        status,
        location: uId === alexId ? 'Remote (Home Office)' : 'HQ - Floor 3',
        remarks
      });
    }
  }

  for (const att of generatedAttendances) {
    await prisma.attendance.create({ data: att });
  }
  console.log(`✅ Seeded ${generatedAttendances.length} sample attendance logs across the month.`);

  await prisma.leaveRequest.create({
    data: {
      userId: alexId,
      type: 'Paid',
      startDate: new Date('2026-08-28'),
      endDate: new Date('2026-08-30'),
      allocationDays: 3,
      reason: 'Annual family vacation trip',
      status: 'Pending',
    }
  });

  await prisma.leaveRequest.create({
    data: {
      userId: johnId,
      type: 'Paid',
      startDate: new Date('2026-08-13'),
      endDate: new Date('2026-08-13'),
      allocationDays: 1,
      reason: 'Family ceremony attendance',
      status: 'Approved',
      adminComment: 'Approved by HR Lead',
    }
  });

  await prisma.leaveRequest.create({
    data: {
      userId: sarahId,
      type: 'Unpaid',
      startDate: new Date('2026-08-10'),
      endDate: new Date('2026-08-11'),
      allocationDays: 2,
      reason: 'Personal workshop',
      status: 'Rejected',
      adminComment: 'Design sprint milestone week',
    }
  });

  console.log('✅ Seeded 3 sample leave requests (1 Pending, 1 Approved, 1 Rejected).');

  // Seed Events
  await prisma.event.createMany({
    data: [
      { title: 'Employee Birthday', description: 'Rahim Uddin', type: 'Birthday', eventDate: new Date(), timeString: '10:30 AM' },
      { title: 'Work Anniversary', description: 'Sumaiya Akter', type: 'Anniversary', eventDate: new Date(), timeString: '11:00 AM' },
      { title: 'Payroll Processing', description: 'May 2026 Payroll', type: 'Payroll', eventDate: new Date(), timeString: '02:00 PM' },
      { title: 'Training Program', description: 'Leadership Training', type: 'Training', eventDate: new Date(), timeString: '03:30 PM' },
    ]
  });
  console.log('✅ Seeded 4 sample Events.');

  // Seed Tasks
  await prisma.task.createMany({
    data: [
      { userId: createdUsers['DAYFLOWMASTER01'], title: 'Review Leave Requests', category: 'Leave Management', priority: 'High', dueDate: new Date('2026-08-25'), status: 'In Progress' },
      { userId: createdUsers['DAYFLOWMASTER01'], title: 'Payroll Verification', category: 'Payroll', priority: 'Medium', dueDate: new Date('2026-08-26'), status: 'Pending' },
      { userId: createdUsers['DAYFLOWMASTER01'], title: 'Interview Schedule', category: 'Recruitment', priority: 'Medium', dueDate: new Date('2026-08-27'), status: 'In Progress' },
      
      { userId: johnId, title: 'Submit Weekly Report', category: 'Operations', priority: 'High', dueDate: new Date('2026-08-23'), status: 'In Progress' },
      { userId: johnId, title: 'Update Profile Details', category: 'HR', priority: 'Medium', dueDate: new Date('2026-08-25'), status: 'Pending' },
      
      { userId: sarahId, title: 'Complete Compliance Course', category: 'Training', priority: 'High', dueDate: new Date('2026-08-30'), status: 'Not Started' },
    ]
  });
  console.log('✅ Seeded 6 sample Tasks.');

  // Seed ActivityLogs
  await prisma.activityLog.createMany({
    data: [
      { userId: johnId, message: 'You checked in successfully.', type: 'Success', icon: 'Check', createdAt: new Date(Date.now() - 1000 * 60 * 2) }, // 2 min ago
      { userId: sarahId, message: 'Your leave request was approved.', type: 'Success', icon: 'Check', createdAt: new Date(Date.now() - 1000 * 60 * 15) }, // 15 min ago
      { userId: adminId, message: 'New employee Rakib Hasan has been added.', type: 'Info', icon: 'User', createdAt: new Date(Date.now() - 1000 * 60 * 2) },
      { userId: adminId, message: 'Leave request submitted by Sumaiya Akter.', type: 'Info', icon: 'File', createdAt: new Date(Date.now() - 1000 * 60 * 15) },
      { userId: adminId, message: 'Payroll for August 2026 has been completed.', type: 'Success', icon: 'DollarSign', createdAt: new Date(Date.now() - 1000 * 60 * 60) }, // 1 hour ago
      { userId: johnId, message: 'August 2026 Payslip is available.', type: 'Info', icon: 'DollarSign', createdAt: new Date(Date.now() - 1000 * 60 * 60) }, // 1 hour ago
    ]
  });
  console.log('✅ Seeded 6 sample ActivityLogs.');
}

main()
  .catch((e) => {
    console.error('❌ Failed to seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
