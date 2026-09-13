import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { getSession } from "@/lib/auth";

function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const isAdmin = session.role === "ADMIN";
  const today = getTodayDateString();

  // 1. Fetch Users
  const employees = await prisma.user.findMany({
    where: { 
      companyName: session.companyName,
      status: { not: 'TERMINATED' }
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      loginId: true,
      jobTitle: true,
      department: true,
      profilePicture: true,
      role: true,
      createdAt: true,
    }
  });

  // 2. Fetch Tasks (Admin sees all Admin tasks for company, Employee sees their own tasks)
  const tasks = await prisma.task.findMany({
    where: isAdmin ? { user: { role: 'ADMIN', companyName: session.companyName } } : { userId: session.id },
    orderBy: { dueDate: 'asc' },
    take: 5
  });

  // 3. Fetch Events (All users see today's/upcoming events - NOTE: Events are global as they have no relations)
  const events = await prisma.event.findMany({
    orderBy: { eventDate: 'asc' },
    take: 5
  });

  // 4. Fetch Activity Logs
  const activities = await prisma.activityLog.findMany({
    where: isAdmin ? { user: { companyName: session.companyName } } : { userId: session.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      user: {
        select: {
          name: true,
          profilePicture: true
        }
      }
    }
  });

  // 5. Fetch Attendance Data for Stats
  let adminStats = null;
  let employeeStats = null;

  if (isAdmin) {
    const todayAttendances = await prisma.attendance.findMany({
      where: { 
        date: today,
        user: { companyName: session.companyName }
      }
    });
    
    const present = todayAttendances.filter(a => a.status === 'Present').length;
    const halfDay = todayAttendances.filter(a => a.status === 'Half-day').length;
    const onLeave = todayAttendances.filter(a => a.status === 'Leave').length;
    
    // Group employees by employment type
    const employmentTypeCounts = await prisma.user.groupBy({
      by: ['employmentType'],
      where: { companyName: session.companyName, status: { not: 'TERMINATED' } },
      _count: { employmentType: true },
    });
    const empTypeMap: Record<string, number> = {};
    for (const row of employmentTypeCounts) {
      empTypeMap[row.employmentType] = row._count.employmentType;
    }
    
    
    // Dynamic Leave Calculation
    const currentMonth = new Date().getMonth();
    const baseBalances = {
      'Annual Leave': 12,
      'Sick Leave': 7,
      'Casual Leave': 12,
      'Earned Leave': currentMonth
    };
    const usedBalances = { 'Annual Leave': 0, 'Sick Leave': 0, 'Casual Leave': 0, 'Earned Leave': 0 };

    const myApprovedLeavesThisYear = await prisma.leaveRequest.findMany({
      where: {
        userId: session.id,
        status: 'Approved',
        startDate: { gte: new Date(new Date().getFullYear(), 0, 1) }
      }
    });

    myApprovedLeavesThisYear.forEach(leave => {
      let type = leave.type;
      if (type === 'Paid Time off' || type === 'Paid time off') type = 'Annual Leave';
      if (type === 'Sick time off') type = 'Sick Leave';
      if (type === 'Unpaid Leaves') type = 'Casual Leave';
      if (type in usedBalances) {
        usedBalances[type as keyof typeof usedBalances] += leave.allocationDays || 0;
      }
    });

    const leaveBalances = {
      annual: Math.max(0, baseBalances['Annual Leave'] - usedBalances['Annual Leave']),
      sick: Math.max(0, baseBalances['Sick Leave'] - usedBalances['Sick Leave']),
      casual: Math.max(0, baseBalances['Casual Leave'] - usedBalances['Casual Leave']),
      earned: Math.max(0, baseBalances['Earned Leave'] - usedBalances['Earned Leave'])
    };

    adminStats = {
      leaveBalances,
      totalEmployees: employees.length,
      presentToday: present,
      onLeaveToday: onLeave,
      halfDayToday: halfDay,
      absentToday: employees.length - present - onLeave - halfDay,
      permanentCount: empTypeMap['PERMANENT'] || 0,
      contractCount: empTypeMap['CONTRACT'] || 0,
      internCount: empTypeMap['INTERN'] || 0,
    };
  } else {
    // Get all attendances for this month for the employee
    const currentMonthPrefix = today.substring(0, 7); // e.g. "2026-08"
    const myAttendances = await prisma.attendance.findMany({
      where: { 
        userId: session.id,
        date: { startsWith: currentMonthPrefix }
      }
    });

    let totalHours = 0;
    let presentDays = 0;
    let halfDays = 0;
    
    myAttendances.forEach(a => {
      totalHours += a.totalHours || 0;
      if (a.status === 'Present') presentDays++;
      if (a.status === 'Half-day') halfDays++;
    });

    const leaveRequests = await prisma.leaveRequest.findMany({
      where: {
        userId: session.id,
        status: 'Approved'
      }
    });
    
    // Simplification for days on leave in current month (just count allocation days for approved leaves)
    const onLeaveDays = leaveRequests.reduce((acc, curr) => acc + curr.allocationDays, 0);

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let presentCount = 0;
    let leaveCount = 0;
    let absentCount = 0;
    let halfDayCount = 0;
    let invalidCount = 0;

    const todayStr = getTodayDateString();

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isSunday = date.getDay() === 0;
      
      const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const record = myAttendances.find(a => a.date === dStr);

      if (record) {
        if (record.checkIn && !record.checkOut && record.date !== todayStr) invalidCount++;
        else if (record.status === 'Present') presentCount++;
        else if (record.status === 'Leave') leaveCount++;
        else if (record.status === 'Absent') absentCount++;
        else if (record.status === 'Half-day' || record.status === 'Half Day') halfDayCount++;
      } else {
        const checkToday = new Date();
        checkToday.setHours(0, 0, 0, 0);
        if (!isSunday && date < checkToday) {
          absentCount++;
        }
      }
    }

    const totalWorkingDays = presentCount + leaveCount + absentCount + halfDayCount + invalidCount;

    // Get last 6 days hours
    const last6DaysStart = new Date();
    last6DaysStart.setDate(last6DaysStart.getDate() - 5);
    const last6DaysStartStr = last6DaysStart.toISOString().split('T')[0];

    const last6DaysAttendances = await prisma.attendance.findMany({
      where: {
        userId: session.id,
        date: { gte: last6DaysStartStr, lte: today }
      }
    });

    const last6DaysHours = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const record = last6DaysAttendances.find(a => a.date === dateStr);
      last6DaysHours.push(record?.totalHours || 0);
    }

    
    // Dynamic Leave Calculation
    const currentMonth = new Date().getMonth();
    const baseBalances = {
      'Annual Leave': 12,
      'Sick Leave': 7,
      'Casual Leave': 12,
      'Earned Leave': currentMonth
    };
    const usedBalances = { 'Annual Leave': 0, 'Sick Leave': 0, 'Casual Leave': 0, 'Earned Leave': 0 };

    const myApprovedLeavesThisYear = await prisma.leaveRequest.findMany({
      where: {
        userId: session.id,
        status: 'Approved',
        startDate: { gte: new Date(new Date().getFullYear(), 0, 1) }
      }
    });

    myApprovedLeavesThisYear.forEach(leave => {
      let type = leave.type;
      if (type === 'Paid Time off' || type === 'Paid time off') type = 'Annual Leave';
      if (type === 'Sick time off') type = 'Sick Leave';
      if (type === 'Unpaid Leaves') type = 'Casual Leave';
      if (type in usedBalances) {
        usedBalances[type as keyof typeof usedBalances] += leave.allocationDays || 0;
      }
    });

    const leaveBalances = {
      annual: Math.max(0, baseBalances['Annual Leave'] - usedBalances['Annual Leave']),
      sick: Math.max(0, baseBalances['Sick Leave'] - usedBalances['Sick Leave']),
      casual: Math.max(0, baseBalances['Casual Leave'] - usedBalances['Casual Leave']),
      earned: Math.max(0, baseBalances['Earned Leave'] - usedBalances['Earned Leave'])
    };

    employeeStats = {
      leaveBalances,
      totalHours: Number(totalHours.toFixed(2)),
      presentDays: presentCount,
      onLeaveDays: leaveCount,
      absentDays: absentCount,
      halfDays: halfDayCount,
      invalidDays: invalidCount,
      totalWorkingDays,
      last6DaysHours
    };
  }

  return (
    <DashboardClient 
      employees={employees} 
      isAdmin={isAdmin} 
      isFirstLogin={session.isFirstLogin}
      adminStats={adminStats}
      employeeStats={employeeStats}
      tasks={tasks}
      events={events}
      activities={activities}
      currentUser={{ name: employees.find(e => e.id === session.id)?.name || 'User' }}
    />
  );
}
