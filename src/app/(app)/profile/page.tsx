import ProfileForm from "@/components/profile/ProfileForm";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function MyProfilePage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const isAdmin = session.role === "ADMIN";

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      leaveBalance: true,
    }
  });

  if (!user) redirect('/login');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">Manage your personal information and view your job details.</p>
      </div>
      
      <ProfileForm user={user} isAdmin={isAdmin} leaveBalance={user.leaveBalance} />
    </div>
  );
}
