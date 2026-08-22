import ProfileForm from "@/components/profile/ProfileForm";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect('/login');

  const { id } = await params;

  // Employees can only view their own profile via /profile (redirect to it)
  if (session.role !== 'ADMIN' && session.id !== id) {
    redirect('/profile');
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      leaveBalance: true,
    }
  });

  if (!user) notFound();

  const isAdmin = session.role === "ADMIN";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex items-center gap-4">
        <Link href="/employees" className="flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Directory
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
        <p className="text-gray-500">{user.jobTitle} • {user.department}</p>
      </div>
      
      <ProfileForm user={user} isAdmin={isAdmin} leaveBalance={user.leaveBalance} />
    </div>
  );
}
