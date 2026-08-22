import Link from "next/link";
import { LayoutDashboard, Users, UserCircle, Calendar, DollarSign, UserPlus, Clock } from "lucide-react";
import AvatarDropdown from "@/components/profile/AvatarDropdown";
import SystrayCheckIn from "@/components/attendance/SystrayCheckIn";
import StrictSessionGuard from "@/components/auth/StrictSessionGuard";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN";

  // Fetch real user info for the dropdown
  let userName = 'User';
  let userEmail = '';
  let userProfilePic: string | null = null;
  if (session?.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.id },
      select: { name: true, email: true, profilePicture: true }
    });
    if (dbUser) {
      userName = dbUser.name;
      userEmail = dbUser.email;
      userProfilePic = dbUser.profilePicture;
    }
  }
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="bg-gray-50 text-gray-900 flex h-screen overflow-hidden">
      <StrictSessionGuard />
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex z-20 shadow-sm">
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
          <h1 className="text-[26px] font-bold text-indigo-600 tracking-tight">Employa</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-8 px-8 space-y-6">
          <Link href="/dashboard" className="flex items-center text-[15px] font-medium text-slate-700 hover:text-indigo-600 group transition-all">
            <LayoutDashboard strokeWidth={1.5} className="mr-4 h-6 w-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            Dashboard
          </Link>
          <Link href="/employees" className="flex items-center text-[15px] font-medium text-slate-700 hover:text-indigo-600 group transition-all">
            <Users strokeWidth={1.5} className="mr-4 h-6 w-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            Directory
          </Link>
          <Link href="/attendance" className="flex items-center text-[15px] font-medium text-slate-700 hover:text-indigo-600 group transition-all">
            <Clock strokeWidth={1.5} className="mr-4 h-6 w-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            Attendance
          </Link>
          <Link href="/profile" className="flex items-center text-[15px] font-medium text-slate-700 hover:text-indigo-600 group transition-all">
            <UserCircle strokeWidth={1.5} className="mr-4 h-6 w-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            My Profile
          </Link>
          <Link href="/time-off" className="flex items-center text-[15px] font-medium text-slate-700 hover:text-indigo-600 group transition-all">
            <Calendar strokeWidth={1.5} className="mr-4 h-6 w-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            Time Off
          </Link>
          {isAdmin && (
            <>
              <Link href="/payroll" className="flex items-center text-[15px] font-medium text-slate-700 hover:text-indigo-600 group transition-all">
                <DollarSign strokeWidth={1.5} className="mr-4 h-6 w-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                Payroll Config
              </Link>
              <Link href="/employees/new" className="flex items-center text-[15px] font-medium text-slate-700 hover:text-indigo-600 group transition-all">
                <UserPlus strokeWidth={1.5} className="mr-4 h-6 w-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                Register Employee
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sm:px-8 z-10 shadow-sm relative">
          <h2 className="text-lg font-medium text-gray-800">Welcome back, <span className="font-bold text-indigo-600">{userName}</span>!</h2>
          <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
            <SystrayCheckIn />
            <AvatarDropdown userName={userName} userEmail={userEmail} userInitial={userInitial} profilePicture={userProfilePic} />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#f8f9fc]">
          {children}
        </main>
      </div>
    </div>
  );
}

