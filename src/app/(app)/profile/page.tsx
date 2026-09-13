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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <ProfileForm user={user} isAdmin={isAdmin} leaveBalance={user.leaveBalance} isOwnProfile={true} />
    </div>
  );
}
