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
    where: { companyName: session.companyName },
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
    // We can also check LeaveRequests that overlap with today
    
    adminStats = {
      totalEmployees: employees.length,
      presentToday: present,
      onLeaveToday: onLeave,
      halfDayToday: halfDay,
      absentToday: employees.length - present - onLeave - halfDay,
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

    // Calculate actual working days elapsed this month (Mon-Fri)
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    let workingDaysSoFar = 0;
    for (let d = 1; d <= now.getDate(); d++) {
      const day = new Date(year, month, d).getDay();
      if (day !== 0 && day !== 6) workingDaysSoFar++;
    }

    // Get last 6 days hours
    const last6DaysHours = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const record = myAttendances.find(a => a.date === dateStr);
      last6DaysHours.push(record?.totalHours || 0);
    }

    employeeStats = {
      totalHours: Math.round(totalHours),
      presentDays,
      onLeaveDays,
      absentDays: Math.max(0, workingDaysSoFar - presentDays - halfDays - onLeaveDays),
      halfDays,
      totalWorkingDays: workingDaysSoFar,
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
