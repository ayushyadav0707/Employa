import { prisma } from "@/lib/prisma";
import EmployeesClient from "./EmployeesClient";

function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export default async function EmployeesPage() {
  const today = getTodayDateString();

  const employees = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      loginId: true,
      jobTitle: true,
      department: true,
      profilePicture: true,
      attendances: {
        where: { date: today },
        select: { status: true },
        take: 1,
      }
    }
  });

  // Map each employee to include their real today's attendance status
  const employeesWithStatus = employees.map(emp => ({
    id: emp.id,
    name: emp.name,
    loginId: emp.loginId,
    jobTitle: emp.jobTitle,
    department: emp.department,
    profilePicture: emp.profilePicture,
    todayStatus: emp.attendances[0]?.status || null,
  }));

  return <EmployeesClient employees={employeesWithStatus} />;
}
