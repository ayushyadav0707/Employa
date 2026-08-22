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

  const sampleAttendances = [
    { userId: johnId, date: '2026-08-22', checkIn: '09:02 AM', checkOut: null, totalHours: 0, status: 'Present', location: 'HQ - Floor 3', remarks: 'Checked in on time' },
    { userId: sarahId, date: '2026-08-22', checkIn: '08:45 AM', checkOut: null, totalHours: 0, status: 'Present', location: 'HQ - Design Lab', remarks: 'Early arrival' },
    { userId: alexId, date: '2026-08-22', checkIn: '09:15 AM', checkOut: null, totalHours: 0, status: 'Present', location: 'Remote (Home Office)', remarks: 'Work from home' },
    { userId: emilyId, date: '2026-08-22', checkIn: '09:00 AM', checkOut: null, totalHours: 0, status: 'Present', location: 'HQ - HR Suite' },
    { userId: priyaId, date: '2026-08-22', checkIn: '10:30 AM', checkOut: null, totalHours: 0, status: 'Half-day', location: 'HQ - Floor 2', remarks: 'Doctor appointment' },

    { userId: johnId, date: '2026-08-21', checkIn: '08:58 AM', checkOut: '05:30 PM', totalHours: 8.5, status: 'Present', location: 'HQ - Floor 3', breakDurationMinutes: 45 },
    { userId: johnId, date: '2026-08-20', checkIn: '09:05 AM', checkOut: '05:15 PM', totalHours: 8.2, status: 'Present', location: 'HQ - Floor 3', breakDurationMinutes: 50 },
    { userId: johnId, date: '2026-08-19', checkIn: '09:12 AM', checkOut: '01:30 PM', totalHours: 4.3, status: 'Half-day', location: 'HQ - Floor 3', remarks: 'Personal commitment afternoon' },
    { userId: johnId, date: '2026-08-18', checkIn: '08:50 AM', checkOut: '06:00 PM', totalHours: 9.1, status: 'Present', location: 'Remote (Home Office)', breakDurationMinutes: 40 },
    { userId: johnId, date: '2026-08-17', checkIn: '09:00 AM', checkOut: '05:00 PM', totalHours: 8.0, status: 'Present', location: 'HQ - Floor 3', breakDurationMinutes: 60 },
  ];

  for (const att of sampleAttendances) {
    await prisma.attendance.create({ data: att });
  }
  console.log(`✅ Seeded ${sampleAttendances.length} sample attendance logs.`);

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
}

main()
  .catch((e) => {
    console.error('❌ Failed to seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
