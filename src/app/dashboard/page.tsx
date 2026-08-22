import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  // Fetch employees for Admin view list and metrics
  const employees = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      employeeId: true,
      jobTitle: true,
      department: true,
      profilePicture: true,
      role: true,
    }
  });

  return <DashboardClient employees={employees} />;
}
