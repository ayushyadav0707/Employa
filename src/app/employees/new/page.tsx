import ProfileForm from "@/components/profile/ProfileForm";

export default function NewEmployeePage() {
  const isAdmin = true;

  if (!isAdmin) {
    return <div>Unauthorized access.</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
        <p className="text-gray-500">Enter the details to register a new employee to the HRMS.</p>
      </div>
      
      <ProfileForm isAdmin={isAdmin} />
    </div>
  );
}
