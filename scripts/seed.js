import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EMPLOYEES = [
  {
    id: 'EMP001',
    employeeId: 'EMP001',
    name: 'John Doe',
    email: 'john@dayflow.com',
    password: 'password123',
    role: 'Employee',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    salary: 75000
  },
  {
    id: 'EMP002',
    employeeId: 'EMP002',
    name: 'Sarah Jenkins',
    email: 'sarah@dayflow.com',
    password: 'password123',
    role: 'Employee',
    department: 'Design',
    designation: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    salary: 68000
  },
  {
    id: 'EMP003',
    employeeId: 'EMP003',
    name: 'Alex Rivera',
    email: 'alex@dayflow.com',
    password: 'password123',
    role: 'Employee',
    department: 'Product',
    designation: 'Product Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    salary: 82000
  },
  {
    id: 'EMP004',
    employeeId: 'EMP004',
    name: 'Emily Zhang',
    email: 'emily.hr@dayflow.com',
    password: 'password123',
    role: 'Admin',
    department: 'Human Resources',
    designation: 'HR Lead & Ops',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    salary: 90000
  },
  {
    id: 'EMP005',
    employeeId: 'EMP005',
    name: 'Marcus Vance',
    email: 'marcus@dayflow.com',
    password: 'password123',
    role: 'Employee',
    department: 'Engineering',
    designation: 'Backend Architect',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    salary: 95000
  },
  {
    id: 'EMP006',
    employeeId: 'EMP006',
    name: 'Priya Sharma',
    email: 'priya@dayflow.com',
    password: 'password123',
    role: 'Employee',
    department: 'Marketing',
    designation: 'Growth Marketer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    salary: 62000
  }
];

const ATTENDANCES = [
  { employeeId: 'EMP001', date: '2026-08-22', checkIn: '09:02 AM', checkOut: null, totalHours: 0, status: 'Present', location: 'HQ - Floor 3', remarks: 'Checked in on time' },
  { employeeId: 'EMP002', date: '2026-08-22', checkIn: '08:45 AM', checkOut: null, totalHours: 0, status: 'Present', location: 'HQ - Design Lab', remarks: 'Early arrival' },
  { employeeId: 'EMP003', date: '2026-08-22', checkIn: '09:15 AM', checkOut: null, totalHours: 0, status: 'Present', location: 'Remote (Home Office)', remarks: 'Work from home' },
  { employeeId: 'EMP004', date: '2026-08-22', checkIn: '09:00 AM', checkOut: null, totalHours: 0, status: 'Present', location: 'HQ - HR Suite' },
  { employeeId: 'EMP005', date: '2026-08-22', checkIn: null, checkOut: null, totalHours: 0, status: 'Leave', remarks: 'Approved Sick Leave' },
  { employeeId: 'EMP006', date: '2026-08-22', checkIn: '10:30 AM', checkOut: null, totalHours: 0, status: 'Half-day', location: 'HQ - Floor 2', remarks: 'Doctor appointment' },
  { employeeId: 'EMP001', date: '2026-08-21', checkIn: '08:58 AM', checkOut: '05:30 PM', totalHours: 8.5, status: 'Present', location: 'HQ - Floor 3', breakDurationMinutes: 45 },
  { employeeId: 'EMP001', date: '2026-08-20', checkIn: '09:05 AM', checkOut: '05:15 PM', totalHours: 8.2, status: 'Present', location: 'HQ - Floor 3', breakDurationMinutes: 50 },
  { employeeId: 'EMP001', date: '2026-08-19', checkIn: '09:12 AM', checkOut: '01:30 PM', totalHours: 4.3, status: 'Half-day', location: 'HQ - Floor 3', remarks: 'Personal commitment' },
  { employeeId: 'EMP001', date: '2026-08-18', checkIn: '08:50 AM', checkOut: '06:00 PM', totalHours: 9.1, status: 'Present', location: 'Remote (Home Office)', breakDurationMinutes: 40 },
  { employeeId: 'EMP001', date: '2026-08-17', checkIn: '09:00 AM', checkOut: '05:00 PM', totalHours: 8.0, status: 'Present', location: 'HQ - Floor 3', breakDurationMinutes: 60 }
];

const LEAVES = [
  { employeeId: 'EMP005', type: 'Sick', startDate: '2026-08-22', endDate: '2026-08-22', reason: 'Viral fever', status: 'Approved', comments: 'Approved by HR' },
  { employeeId: 'EMP001', type: 'Paid', startDate: '2026-08-13', endDate: '2026-08-13', reason: 'Family event', status: 'Approved', comments: 'Approved' },
  { employeeId: 'EMP003', type: 'Paid', startDate: '2026-08-28', endDate: '2026-08-30', reason: 'Annual vacation', status: 'Pending' }
];

async function main() {
  console.log('Seeding SQLite database with Dayflow initial users and attendance...');

  for (const emp of EMPLOYEES) {
    await prisma.user.upsert({
      where: { id: emp.id },
      update: emp,
      create: emp
    });

    // Dev 4: Create default LeaveBalance and PayrollConfig
    await prisma.leaveBalance.upsert({
      where: { userId: emp.id },
      update: {},
      create: {
        userId: emp.id,
        paidTimeOff: 24,
        sickTimeOff: 7
      }
    });

    await prisma.payrollConfig.upsert({
      where: { userId: emp.id },
      update: {},
      create: {
        userId: emp.id,
        basicSalaryPercent: 50,
        hraPercent: 50,
        standardAllowPercent: 16.67,
        perfBonusPercent: 8.33,
        travelAllowPercent: 8.333,
        pfPercent: 12,
        profTax: 200
      }
    });
  }
  console.log(`Seeded ${EMPLOYEES.length} users.`);

  for (const att of ATTENDANCES) {
    await prisma.attendance.create({
      data: att
    });
  }
  console.log(`Seeded ${ATTENDANCES.length} attendance records.`);

  for (const lv of LEAVES) {
    await prisma.leaveRequest.create({
      data: lv
    });
  }
  console.log(`Seeded ${LEAVES.length} leave requests.`);

  console.log('Database seeding complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
