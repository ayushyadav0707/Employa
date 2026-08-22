import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, Users, UserCircle, Calendar, DollarSign } from "lucide-react";
import AvatarDropdown from "@/components/profile/AvatarDropdown";
import StrictSessionGuard from "@/components/auth/StrictSessionGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dayflow HRMS",
  description: "Every workday, perfectly aligned.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased flex h-screen overflow-hidden`}>
        <StrictSessionGuard />
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-indigo-600 tracking-tight">dayflow.</h1>
          </div>
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <Link href="/dashboard" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group transition-all">
              <LayoutDashboard className="mr-3 h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
              Dashboard
            </Link>
            <Link href="/employees" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group transition-all">
              <Users className="mr-3 h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
              Employees
            </Link>
            <Link href="/profile" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group transition-all">
              <UserCircle className="mr-3 h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
              My Profile
            </Link>
            <Link href="/time-off" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group transition-all">
              <Calendar className="mr-3 h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
              Time Off
            </Link>
            <Link href="/payroll" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group transition-all">
              <DollarSign className="mr-3 h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
              Payroll
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sm:px-8 z-10 relative">
            <h2 className="text-lg font-medium text-gray-800">Welcome back!</h2>
            <div className="flex items-center space-x-3">
              <AvatarDropdown />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6 sm:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
