'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserCircle, Calendar, DollarSign, UserPlus, Clock, Lightbulb, Leaf, Target, Award, Coffee } from "lucide-react";

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
    navItems.push({ href: '/employees/new', label: 'Register', icon: UserPlus });
  }

  const getThought = () => {
    if (pathname.startsWith('/profile')) return { text: "Great people build great teams.", Icon: Target };
    if (pathname.startsWith('/employees') && !pathname.includes('new')) return { text: "Great teams build great things.", Icon: Users };
    if (pathname.startsWith('/time-off')) return { text: "Take time off.\nCome back stronger.", Icon: Leaf };
    if (pathname.startsWith('/attendance')) return { text: "Consistency is the key to success.", Icon: Clock };
    if (pathname.startsWith('/payroll')) return { text: "Hard work deserves its reward.", Icon: Award };
    return { text: "Small steps every day.", Icon: Lightbulb };
  };

  const thought = getThought();
  const ThoughtIcon = thought.Icon;

  return (
    <div className="flex-1 overflow-y-auto px-5 pb-6">
      <div className="grid grid-cols-2 gap-3">
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
              className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-all border aspect-square ${
                isActive
                  ? 'bg-black border-black text-white shadow-md'
                  : 'bg-white border-border text-text hover:border-black/20 hover:bg-gray-50'
              }`}
            >
              <div className={`p-2.5 rounded-2xl mb-3 ${isActive ? 'bg-white/10 text-primary' : 'bg-gray-100 text-text-muted'}`}>
                <Icon strokeWidth={2.5} className="w-5 h-5" />
              </div>
              <span className={`text-[12.5px] font-bold tracking-wide text-center ${isActive ? 'text-white' : 'text-text'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 px-2 space-y-4">
        {/* Restored Thoughts Widget */}
        <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20 relative">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <ThoughtIcon className="w-4 h-4 text-primary" strokeWidth={2.5} />
          </div>
          <p className="text-[13px] font-bold text-gray-900 leading-relaxed whitespace-pre-line">
            {thought.text}
          </p>
          <div className="w-8 h-0.5 bg-primary mt-4 rounded-full"></div>
        </div>

        {/* Need Help */}
        <div className="bg-primary/10 rounded-2xl p-5 border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/20 rounded-full blur-2xl -mr-8 -mt-8"></div>
          <p className="text-[13px] font-bold text-black leading-relaxed">
            Need help?
          </p>
          <p className="text-[12px] text-text-muted mt-1">
            Check the documentation or contact IT.
          </p>
        </div>
      </div>
    </div>
  );
}
