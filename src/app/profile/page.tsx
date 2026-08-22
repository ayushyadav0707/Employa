import ProfileForm from "@/components/profile/ProfileForm";

export default function MyProfilePage() {
  const isAdmin = true; // Mock role

  // Normally we would fetch the logged in user here
  const mockUser = {
    name: "Archie",
    email: "archie@dayflow.com",
    jobTitle: "Software Engineer",
    department: "Engineering",
    phone: "+1 555-0198",
    address: "123 Tech Lane, SF",
    salary: 120000,
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">Manage your personal information and view your job details.</p>
      </div>
      
      <ProfileForm user={mockUser} isAdmin={isAdmin} />
    </div>
  );
}
