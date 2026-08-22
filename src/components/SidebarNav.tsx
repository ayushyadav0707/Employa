'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserCircle, Calendar, DollarSign, UserPlus, Clock } from "lucide-react";

interface SidebarNavProps {
  isAdmin: boolean;
}

export default function SidebarNav({ isAdmin }: SidebarNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/employees', label: 'Directory', icon: Users, exact: true },
    { href: '/attendance', label: 'Attendance', icon: Clock },
    { href: '/profile', label: 'My Profile', icon: UserCircle },
    { href: '/time-off', label: 'Time Off', icon: Calendar },
  ];

  if (isAdmin) {
    navItems.push({ href: '/payroll', label: 'Payroll Config', icon: DollarSign });
    navItems.push({ href: '/employees/new', label: 'Register Employee', icon: UserPlus });
  }

  return (
    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
      {navItems.map((item) => {
        // Determine if active
        const isActive = item.exact 
          ? pathname === item.href
          : pathname.startsWith(item.href);
          
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-5 py-3.5 text-[15px] rounded-[100px] transition-all group ${
              isActive
                ? 'bg-[#f5f3ff] text-violet-700 font-bold shadow-sm'
                : 'text-slate-600 font-medium hover:text-violet-600 hover:bg-slate-50'
            }`}
          >
            <Icon 
              strokeWidth={isActive ? 2.5 : 2} 
              className={`mr-4 h-6 w-6 transition-colors ${
                isActive ? 'text-violet-700' : 'text-slate-400 group-hover:text-violet-600'
              }`} 
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
