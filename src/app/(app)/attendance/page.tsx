import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AttendancePageClient from "./AttendancePageClient";

function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

function getCurrentMonthPrefix() {
  return new Date().toISOString().substring(0, 7);
}

export default async function AttendancePage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const isAdmin = session.role === "ADMIN";
  const today = getTodayDateString();
  const monthPrefix = getCurrentMonthPrefix();

  if (isAdmin) {
    // Admin: Fetch all employees with today's attendance
    const usersWithTodayAttendance = await prisma.user.findMany({
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

    // All attendance records this month for stats
    const allMonthRecords = await prisma.attendance.findMany({
      where: { date: { startsWith: monthPrefix } },
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
        todayDate={today}
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
    // Employee: Fetch own attendance for month
    const myMonthRecords = await prisma.attendance.findMany({
      where: {
        userId: session.id,
        date: { startsWith: monthPrefix }
      },
      orderBy: { date: 'desc' }
    });

    const todayAttendance = myMonthRecords.find(r => r.date === today) || null;

    const totalHours = myMonthRecords.reduce((sum, r) => sum + (r.totalHours || 0), 0);
    const presentDays = myMonthRecords.filter(r => r.status === 'Present').length;
    const halfDays = myMonthRecords.filter(r => r.status === 'Half-day').length;

    return (
      <AttendancePageClient
        isAdmin={false}
        currentUserId={session.id}
        todayDate={today}
        myMonthRecords={myMonthRecords}
        todayAttendance={todayAttendance}
        myStats={{
          totalHours: Math.round(totalHours * 10) / 10,
          presentDays,
          halfDays,
          totalRecords: myMonthRecords.length,
        }}
      />
    );
  }
}
