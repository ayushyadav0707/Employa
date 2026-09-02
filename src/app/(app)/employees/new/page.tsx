import ProfileForm from "@/components/profile/ProfileForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewEmployeePage() {
  const session = await getSession();
  if (!session) redirect('/login');
  
  // Only admins can register new employees
  if (session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
        <p className="text-gray-500">Enter the details to register a new employee to the HRMS.</p>
      </div>
      
      <ProfileForm isAdmin={true} />
    </div>
  );
}
