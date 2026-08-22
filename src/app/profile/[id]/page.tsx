import ProfileForm from "@/components/profile/ProfileForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isAdmin = true; // Mock role

  if (!isAdmin) {
    return <div>Unauthorized access.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employee Profile</h1>
        <p className="text-gray-500">View and edit {user.name}&apos;s profile information.</p>
      </div>
      
      <ProfileForm user={user} isAdmin={isAdmin} />
    </div>
  );
}
