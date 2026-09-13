'use client';

import { useState, useEffect } from 'react';
import { 
  UserCircle, Clock, CalendarCheck, CheckCircle2, 
  ArrowRight, UserCheck, UserX, Gift, Star, DollarSign, GraduationCap,
  Activity, Users, File, Check, MoreVertical, Briefcase, Calendar, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardClient({ 
  employees = [], 
  isAdmin = false, 
  isFirstLogin = false,
  adminStats,
  employeeStats,
  tasks = [],
  events = [],
  activities = [],
  currentUser
}: { 
  employees?: any[], 
  isAdmin?: boolean, 
  isFirstLogin?: boolean,
  adminStats?: any,
  employeeStats?: any,
  tasks?: any[],
  events?: any[],
  activities?: any[],
  currentUser?: { name: string, profilePicture?: string }
}) {
  
  const firstName = currentUser?.name?.split(' ')[0] || 'User';
  const leaveBalances = adminStats?.leaveBalances || employeeStats?.leaveBalances || { annual: 12, sick: 7, casual: 12, earned: 0 };

  
  // Stats
  const totalEmp = adminStats?.totalEmployees || employeeStats?.totalWorkingDays || 0;
  const presentCount = adminStats?.presentToday || employeeStats?.presentDays || 0;
  const leaveCount = adminStats?.onLeaveToday || employeeStats?.onLeaveDays || 0;
  
  const presentPct = totalEmp > 0 ? Math.round((presentCount / totalEmp) * 100) : 0;

  // Employment type counts from DB (admin only)
  const permanentCount = adminStats?.permanentCount || 0;
  const contractCount = adminStats?.contractCount || 0;
  const internCount = adminStats?.internCount || 0;
  const empTypeTotal = permanentCount + contractCount + internCount;
  const permanentPct = empTypeTotal > 0 ? Math.round((permanentCount / empTypeTotal) * 100) : 0;
  const contractPct = empTypeTotal > 0 ? Math.round((contractCount / empTypeTotal) * 100) : 0;
  const internPct = empTypeTotal > 0 ? Math.round((internCount / empTypeTotal) * 100) : 0;

  // Custom Radial Gauge Math
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  // Make it a 180 degree semi-circle arc (or a 270 degree arc). Let's do a 240 degree arc.
  const arcLength = circumference * (240 / 360);
  const strokeDasharray = `${arcLength} ${circumference}`;
  const strokeDashoffset = arcLength - (arcLength * (presentPct / 100));

  const [mounted, setMounted] = useState(false);
  
  // Hydration fix
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch on initial render

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight">
            Overview
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Welcome back, {firstName}. Here's your HR summary.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/employees/new" className="px-4 py-2 bg-primary text-black font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-colors">
            + New Employee
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COL: Radial Gauge + Mini Cards */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Radial Gauge Chart */}
            <div className="bg-white rounded-[24px] border border-border shadow-sm p-6 flex flex-col items-center justify-center relative overflow-hidden">
              <h3 className="w-full text-left font-bold text-gray-900 mb-6">Workforce Status</h3>
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-125" viewBox="0 0 140 140">
                  {/* Background Arc */}
                  <circle 
                    cx="70" cy="70" r={radius}
                    fill="none" stroke="#FFF9E8" strokeWidth="12"
                    strokeDasharray={strokeDasharray}
                    strokeLinecap="round"
                    className="transform rotate-[150deg] origin-center"
                  />
                  {/* Foreground Arc */}
                  <circle 
                    cx="70" cy="70" r={radius}
                    fill="none" stroke="#FFCC2D" strokeWidth="12"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transform rotate-[150deg] origin-center transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                  <span className="text-4xl font-extrabold text-gray-900">{presentPct}%</span>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">Present Today</span>
                </div>
              </div>
              <div className="w-full flex justify-between items-center mt-6 px-4">
                <div className="text-center">
                  <div className="w-3 h-3 rounded-full bg-primary mx-auto mb-1"></div>
                  <p className="text-[11px] font-bold text-gray-500">Present ({presentCount})</p>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 rounded-full bg-gray-200 mx-auto mb-1"></div>
                  <p className="text-[11px] font-bold text-gray-500">Absent/Leave</p>
                </div>
              </div>
            </div>

            {/* Employment Status Bar Chart */}
            <div className="bg-white rounded-[24px] border border-border shadow-sm p-6 flex flex-col">
              <h3 className="font-bold text-gray-900 mb-8">Employment Status</h3>
              {empTypeTotal === 0 ? (
                <p className="text-sm text-gray-400 italic text-center py-8">No data yet</p>
              ) : (
                <div className="flex-1 flex items-end justify-around pb-4 gap-4">
                  {/* Permanent Bar */}
                  <div className="flex flex-col items-center gap-3 w-16 group">
                    <div className="relative w-full h-32 bg-[#FFF9E8] rounded-t-xl rounded-b-md flex items-end overflow-visible">
                      <div className="absolute w-full bg-primary rounded-t-xl rounded-b-md transition-all duration-700" style={{ height: `${permanentPct}%` }}></div>
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white shadow-sm z-10">{permanentPct}%</div>
                    </div>
                    <span className="text-[11px] font-bold text-gray-500">Permanent</span>
                  </div>
                  {/* Contract Bar */}
                  <div className="flex flex-col items-center gap-3 w-16 group">
                    <div className="relative w-full h-32 bg-[#FFF9E8] rounded-t-xl rounded-b-md flex items-end overflow-visible">
                      <div className="absolute w-full bg-[#252525] rounded-t-xl rounded-b-md transition-all duration-700" style={{ height: `${contractPct}%` }}></div>
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded-full border-2 border-[#252525] shadow-sm z-10">{contractPct}%</div>
                    </div>
                    <span className="text-[11px] font-bold text-gray-500">Contract</span>
                  </div>
                  {/* Intern Bar */}
                  <div className="flex flex-col items-center gap-3 w-16 group">
                    <div className="relative w-full h-32 bg-[#FFF9E8] rounded-t-xl rounded-b-md flex items-end overflow-visible">
                      <div className="absolute w-full bg-gray-300 rounded-t-xl rounded-b-md transition-all duration-700" style={{ height: `${internPct}%` }}></div>
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-gray-600 text-[10px] font-bold px-2 py-1 rounded-full border-2 border-gray-300 shadow-sm z-10">{internPct}%</div>
                    </div>
                    <span className="text-[11px] font-bold text-gray-500">Intern</span>
                  </div>
                </div>
              )}
            </div>
            
          </div>

          {/* Leave Balance Mini-Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-[20px] border border-border shadow-sm flex flex-col relative overflow-hidden group hover:border-primary transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <h4 className="text-2xl font-extrabold text-gray-900 mb-1">{leaveBalances.annual}</h4>
                <p className="text-[11px] font-bold text-gray-500">Annual Leave</p>
              <Link href="/time-off" className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-4 h-4 text-primary" />
              </Link>
            </div>
            <div className="bg-white p-4 rounded-[20px] border border-border shadow-sm flex flex-col relative overflow-hidden group hover:border-primary transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <h4 className="text-2xl font-extrabold text-gray-900 mb-1">{leaveBalances.sick}</h4>
                <p className="text-[11px] font-bold text-gray-500">Sick Leave</p>
              <Link href="/time-off" className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-4 h-4 text-primary" />
              </Link>
            </div>
            <div className="bg-white p-4 rounded-[20px] border border-border shadow-sm flex flex-col relative overflow-hidden group hover:border-primary transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                <Briefcase className="w-4 h-4 text-primary" />
              </div>
              <h4 className="text-2xl font-extrabold text-gray-900 mb-1">{leaveBalances.casual}</h4>
                <p className="text-[11px] font-bold text-gray-500">Casual Leave</p>
              <Link href="/time-off" className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-4 h-4 text-primary" />
              </Link>
            </div>
            <div className="bg-white p-4 rounded-[20px] border border-border shadow-sm flex flex-col relative overflow-hidden group hover:border-primary transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#FFF9E8] flex items-center justify-center mb-3">
                <UserCheck className="w-4 h-4 text-primary" />
              </div>
              <h4 className="text-2xl font-extrabold text-gray-900 mb-1">{leaveBalances.earned}</h4>
                <p className="text-[11px] font-bold text-gray-500">Earned Leave</p>
              <Link href="/time-off" className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-4 h-4 text-primary" />
              </Link>
            </div>
          </div>

          {/* Employee List Table */}
          <div className="bg-white rounded-[24px] border border-border shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Recent Employees</h3>
              <Link href="/employees" className="text-[12px] font-bold text-primary hover:text-primary-hover">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-6">Employee</th>
                    <th className="py-3 px-6">ID</th>
                    <th className="py-3 px-6">Department</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {employees.slice(0, 5).map((emp, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-6 flex items-center gap-3">
                        {emp.profilePicture ? (
                           <img src={emp.profilePicture} className="w-8 h-8 rounded-full object-cover" alt="" />
                        ) : (
                           <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                             {emp.name.charAt(0)}
                           </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 text-[13px]">{emp.name}</p>
                          <p className="text-[11px] text-gray-500">{emp.jobTitle}</p>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-[12px] font-mono text-gray-600">{emp.loginId}</td>
                      <td className="py-3 px-6">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md uppercase tracking-wide">
                          {emp.department || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <Link href={`/profile/${emp.id}`} className="text-gray-400 hover:text-primary transition-colors">
                          <MoreVertical className="w-5 h-5 ml-auto" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                     <tr><td colSpan={4} className="py-8 text-center text-gray-500 text-sm">No employees found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COL: Schedule & Activity */}
        <div className="flex flex-col gap-6">
          
          {/* Schedule Panel */}
          <div className="bg-white rounded-[24px] border border-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900">Upcoming Schedule</h3>
              <Link href="/events" className="text-[12px] font-bold text-primary hover:text-primary-hover">Add</Link>
            </div>
            <div className="space-y-4">
              {events.length === 0 ? (
                 <p className="text-sm text-gray-500 italic text-center py-4">No events scheduled.</p>
              ) : (
                 events.slice(0, 4).map((evt, idx) => (
                   <div key={idx} className="flex gap-4 items-start p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                     <div className="w-12 h-12 rounded-xl bg-[#FFF9E8] flex flex-col items-center justify-center shrink-0 border border-primary/20">
                       <span className="text-[10px] font-bold text-gray-500 uppercase">{new Date(evt.eventDate).toLocaleString('default', { month: 'short' })}</span>
                       <span className="text-[16px] font-extrabold text-primary leading-none mt-0.5">{new Date(evt.eventDate).getDate()}</span>
                     </div>
                     <div className="flex-1 mt-0.5">
                       <h4 className="text-[13px] font-bold text-gray-900">{evt.title}</h4>
                       <p className="text-[11px] font-medium text-gray-500 mt-0.5">{evt.timeString || 'All Day'}</p>
                     </div>
                   </div>
                 ))
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-[24px] border border-border shadow-sm p-6 flex-1 flex flex-col">
            <h3 className="font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:via-gray-200 before:to-transparent">
              {activities.slice(0, 5).map((act, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Timeline Dot */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-primary text-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute left-0 md:left-1/2 -translate-x-1/2">
                    <Activity className="w-3 h-3" />
                  </div>
                  {/* Card */}
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm ml-auto md:ml-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{act.type || 'System'}</span>
                      <span className="text-[10px] font-bold text-gray-400">
                        {new Date(act.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-[12px] font-medium text-gray-700">{act.message}</p>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <p className="text-sm text-gray-500 italic text-center py-4 relative z-10 bg-white">No recent activity.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
