import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AttendancePageClient from "./AttendancePageClient";

function getISTDate() {
  const options: Intl.DateTimeFormatOptions = { 
    timeZone: 'Asia/Kolkata',
    year: 'numeric', month: '2-digit', day: '2-digit'
  };
  const formatter = new Intl.DateTimeFormat('en-CA', options);
  const parts = formatter.formatToParts(new Date());
  
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  
  return {
    dateString: `${year}-${month}-${day}`,
    monthPrefix: `${year}-${month}`
  };
}

export default async function AttendancePage({ searchParams }: { searchParams: { month?: string } }) {
  const session = await getSession();
  if (!session) redirect('/login');

  const isAdmin = session.role === "ADMIN";
  const { dateString: today, monthPrefix: currentMonthPrefix } = getISTDate();
  
  // Await searchParams before accessing properties per Next.js 15+ rules
  const resolvedParams = await searchParams;
  const monthPrefix = resolvedParams.month || currentMonthPrefix;

  if (isAdmin) {
    // Admin: Fetch all active employees with today's attendance (today is fixed to actual today for check-ins)
    const usersWithTodayAttendance = await prisma.user.findMany({
      where: { 
        companyName: session.companyName,
        status: { not: 'TERMINATED' }, loginId: { not: 'DAYFLOWMASTER01' }
      },
      select: {
        id: true,
        name: true,
        loginId: true,
        department: true,
        jobTitle: true,
        profilePicture: true,
        attendances: {
          where: { date: today },
          take: 1,
        }
      },
      orderBy: { name: 'asc' }
    });

    // All attendance records for selected month for stats
    const allMonthRecords = await prisma.attendance.findMany({
      where: { 
        date: { startsWith: monthPrefix },
        user: { companyName: session.companyName }
      },
      include: {
        user: {
          select: { name: true, loginId: true, department: true }
        }
      },
      orderBy: { date: 'desc' }
    });

    const todayStats = {
      present: usersWithTodayAttendance.filter(u => u.attendances[0]?.status === 'Present').length,
      onLeave: usersWithTodayAttendance.filter(u => u.attendances[0]?.status === 'Leave').length,
      halfDay: usersWithTodayAttendance.filter(u => u.attendances[0]?.status === 'Half-day').length,
      absent: usersWithTodayAttendance.filter(u => !u.attendances[0]).length,
      total: usersWithTodayAttendance.length,
    };

    return (
      <AttendancePageClient
        isAdmin={true}
        currentUserId={session.id}
        currentUserName={session.name || 'Admin'}
        todayDate={today}
        viewMonthStr={monthPrefix}
        adminUsers={usersWithTodayAttendance.map(u => ({
          id: u.id,
          name: u.name,
          loginId: u.loginId,
          department: u.department,
          jobTitle: u.jobTitle,
          profilePicture: u.profilePicture,
          todayAttendance: u.attendances[0] || null,
        }))}
        adminStats={todayStats}
        monthRecords={allMonthRecords}
      />
    );
  } else {
    // Employee: Fetch own attendance for selected month
    const myMonthRecords = await prisma.attendance.findMany({
      where: {
        userId: session.id,
        date: { startsWith: monthPrefix }
      },
      orderBy: { date: 'desc' }
    });

    const todayAttendance = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId: session.id,
          date: today
        }
      }
    });

    const totalHours = myMonthRecords.reduce((sum, r) => sum + (r.totalHours || 0), 0);
    const invalidCheckInsCount = myMonthRecords.filter(r => r.checkIn && !r.checkOut && r.date !== today).length;
    const presentDaysCount = myMonthRecords.filter(r => r.status === 'Present' && !(r.checkIn && !r.checkOut && r.date !== today)).length;
    const halfDays = myMonthRecords.filter(r => r.status === 'Half-day' || r.status === 'Half Day').length;
    const presentDays = presentDaysCount + (halfDays * 0.5);

    return (
      <AttendancePageClient
        isAdmin={false}
        currentUserId={session.id}
        currentUserName={session.name || 'User'}
        todayDate={today}
        viewMonthStr={monthPrefix}
        myMonthRecords={myMonthRecords}
        todayAttendance={todayAttendance}
        myStats={{
          totalHours: Number(totalHours.toFixed(2)),
          presentDays,
          halfDays,
          totalRecords: myMonthRecords.length,
        }}
      />
    );
  }
}
