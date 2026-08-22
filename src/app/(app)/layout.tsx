import SidebarNav from "@/components/SidebarNav";
import Image from "next/image";
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
        <div className="h-20 flex items-center px-8 border-b border-gray-100 gap-3">
          <Image src="/logo.png" alt="Employa Logo" width={32} height={32} className="object-contain" />
          <h1 className="text-[26px] font-bold text-violet-700 tracking-tight">Employa.</h1>
        </div>
        <SidebarNav isAdmin={isAdmin} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sm:px-8 z-10 shadow-sm relative">
          <h2 className="text-lg font-medium text-gray-800">Welcome back, <span className="font-bold text-violet-700">{userName}</span>!</h2>
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

