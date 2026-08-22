'use client';

import { useState } from 'react';
import { 
  UserCircle, Clock, CalendarCheck, CheckCircle2, 
  ArrowRight, UserCheck, UserX, Gift, Star, DollarSign, GraduationCap,
  Activity, Users, File, Check
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  currentUser?: { name: string }
}) {
  const router = useRouter();
  
  // Use real DB stats or fallback to 0 if not yet loaded properly
  const totalEmp = adminStats?.totalEmployees || 0; 
  const presentCount = adminStats?.presentToday || 0;
  const leaveCount = adminStats?.onLeaveToday || 0;
  const absentCount = adminStats?.absentToday || 0;
  const halfDayCount = adminStats?.halfDayToday || 0;

  const empTotalHours = employeeStats?.totalHours || 0;
  const empPresentDays = employeeStats?.presentDays || 0;
  const empOnLeaveDays = employeeStats?.onLeaveDays || 0;
  const empAbsentDays = employeeStats?.absentDays || 0;
  const empHalfDays = employeeStats?.halfDays || 0;

  // Calculate Doughnut chart percentages dynamically based on Admin vs Employee context
  const totalDoughnutCount = isAdmin ? totalEmp : (employeeStats?.totalWorkingDays || 22);
  const presentPct = totalDoughnutCount > 0 ? (isAdmin ? presentCount : empPresentDays) / totalDoughnutCount * 100 : 0;
  const leavePct = totalDoughnutCount > 0 ? (isAdmin ? leaveCount : empOnLeaveDays) / totalDoughnutCount * 100 : 0;
  const absentPct = totalDoughnutCount > 0 ? (isAdmin ? absentCount : empAbsentDays) / totalDoughnutCount * 100 : 0;
  const halfPct = totalDoughnutCount > 0 ? (isAdmin ? halfDayCount : empHalfDays) / totalDoughnutCount * 100 : 0;

  // Dash arrays (stroke length mapping)
  const offset1 = 0;
  const dash1 = presentPct;
  const offset2 = -dash1;
  const dash2 = leavePct;
  const offset3 = offset2 - dash2;
  const dash3 = absentPct;
  const offset4 = offset3 - dash3;
  const dash4 = halfPct;

  const firstName = currentUser?.name?.split(' ')[0] || 'Ayush';

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold text-gray-900 flex items-center">
            Good morning, {isAdmin ? 'Admin' : firstName} <span className="ml-2 text-2xl">👋</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening in your {isAdmin ? 'organization' : 'workday'} today.</p>
        </div>
      </div>

      {/* TOP METRICS ROW (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center">
                {isAdmin ? <Users className="w-6 h-6 text-purple-500 fill-purple-100" /> : <Clock className="w-6 h-6 text-purple-500" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">{isAdmin ? 'Total Employees' : 'Total Hours'}</p>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{isAdmin ? totalEmp.toLocaleString() : empTotalHours}</h3>
              </div>
            </div>
          </div>
          <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
            <ArrowRight className="w-3 h-3 -rotate-45" /> {isAdmin ? 'Live Data' : 'Live Data'} <span className="text-gray-400 font-medium">from database</span>
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-emerald-500 fill-emerald-100" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">{isAdmin ? 'Present Today' : 'Days Present'}</p>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{isAdmin ? presentCount.toLocaleString() : empPresentDays}</h3>
              </div>
            </div>
          </div>
          <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
             {presentPct.toFixed(1)}% <span className="text-gray-400 font-medium">{isAdmin ? 'of total' : 'attendance rate'}</span>
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6 text-amber-500 fill-amber-100" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">{isAdmin ? 'On Leave Today' : 'Days On Leave'}</p>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{isAdmin ? leaveCount.toLocaleString() : empOnLeaveDays}</h3>
              </div>
            </div>
          </div>
          <p className="text-xs font-semibold text-amber-500 flex items-center gap-1">
             {leavePct.toFixed(1)}% <span className="text-gray-400 font-medium">{isAdmin ? 'of total' : 'leave utilization'}</span>
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
                <UserX className="w-6 h-6 text-red-500 fill-red-100" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">{isAdmin ? 'Absent Today' : 'Days Absent'}</p>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{isAdmin ? absentCount.toLocaleString() : empAbsentDays}</h3>
              </div>
            </div>
          </div>
          <p className="text-xs font-semibold text-red-500 flex items-center gap-1">
             {absentPct.toFixed(1)}% <span className="text-gray-400 font-medium">{isAdmin ? 'of total' : 'absenteeism rate'}</span>
          </p>
        </div>

      </div>

      {/* MIDDLE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attendance Overview (Doughnut) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">{isAdmin ? 'Attendance Overview' : 'My Attendance'}</h3>
            <span className="text-xs font-semibold text-gray-500 border border-gray-200 rounded-md px-2 py-1">This Month ⌄</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-6">
            <div className="relative w-40 h-40">
              {/* CSS Doughnut Chart Dynamic */}
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#f3f4f6" strokeWidth="4"></circle>
                {/* Present (Emerald) */}
                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray={`${dash1} 100`} strokeDashoffset={offset1} strokeLinecap="round"></circle>
                {/* Leave (Amber) */}
                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#f59e0b" strokeWidth="4" strokeDasharray={`${dash2} 100`} strokeDashoffset={offset2}></circle>
                {/* Absent (Red) */}
                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#ef4444" strokeWidth="4" strokeDasharray={`${dash3} 100`} strokeDashoffset={offset3}></circle>
                {/* Half Day (Purple) */}
                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#8b5cf6" strokeWidth="4" strokeDasharray={`${dash4} 100`} strokeDashoffset={offset4}></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-gray-900">{presentPct.toFixed(0)}%</span>
                <span className="text-xs text-gray-500 font-medium">Present</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <span className="font-medium text-gray-600 w-16">Present</span>
                <span className="font-bold text-gray-900">{isAdmin ? presentCount : empPresentDays} <span className="text-gray-400 font-normal">({presentPct.toFixed(1)}%)</span></span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <span className="font-medium text-gray-600 w-16">On Leave</span>
                <span className="font-bold text-gray-900">{isAdmin ? leaveCount : empOnLeaveDays} <span className="text-gray-400 font-normal">({leavePct.toFixed(1)}%)</span></span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <span className="font-medium text-gray-600 w-16">Absent</span>
                <span className="font-bold text-gray-900">{isAdmin ? absentCount : empAbsentDays} <span className="text-gray-400 font-normal">({absentPct.toFixed(1)}%)</span></span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                <span className="font-medium text-gray-600 w-16">Half Day</span>
                <span className="font-bold text-gray-900">{isAdmin ? halfDayCount : empHalfDays} <span className="text-gray-400 font-normal">({halfPct.toFixed(1)}%)</span></span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 text-center">
            <Link href="/attendance" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center justify-center">
              View {isAdmin ? 'Attendance Report' : 'My Attendance'} <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Trend (Line Chart) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">{isAdmin ? 'Employee Growth' : 'My Hours'}</h3>
            <span className="text-xs font-semibold text-gray-500 border border-gray-200 rounded-md px-2 py-1">{isAdmin ? 'Last 6 Months' : 'Last 6 Days'} ⌄</span>
          </div>
          <div className="flex-1 flex flex-col justify-end relative h-40">
            
            {(() => {
              // Generate live trend data
              let labels = [];
              let points = [];
              
              if (isAdmin) {
                // Admin: Cumulative Employee Growth over last 6 months
                const months = [];
                for (let i = 5; i >= 0; i--) {
                  const d = new Date();
                  d.setMonth(d.getMonth() - i);
                  months.push(d);
                  labels.push(d.toLocaleDateString('en-GB', { month: 'short' }));
                }
                
                // Count employees joined before or during each month
                points = months.map(month => {
                  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
                  return employees.filter(e => new Date(e.createdAt) <= endOfMonth).length;
                });
                // Ensure there's at least 1 point, and avoid division by zero
                const max = Math.max(...points, 10);
                points = points.map(p => (p / max) * 100); 

              } else {
                // Employee: Hours worked over last 6 days
                const days = [];
                for (let i = 5; i >= 0; i--) {
                  const d = new Date();
                  d.setDate(d.getDate() - i);
                  days.push(d);
                  labels.push(d.toLocaleDateString('en-GB', { weekday: 'short' }));
                }
                // Use real data from the database
                const maxHour = Math.max(...(employeeStats?.last6DaysHours || []), 8);
                points = (employeeStats?.last6DaysHours || [0, 0, 0, 0, 0, 0]).map((h: number) => Math.min((h / maxHour) * 100, 100));
              }

              // Build SVG Path
              // viewBox is 0 0 100 100. Y is inverted (0 is top, 100 is bottom)
              const pathPoints = points.map((p, idx) => {
                const x = (idx / 5) * 100;
                const y = 100 - p; // Invert Y
                return `${x},${y}`;
              });
              
              const pathD = `M${pathPoints.join(' L')}`;
              const areaD = `${pathD} L100,100 L0,100 Z`;

              return (
                <>
                  <div className="absolute inset-0 flex items-end overflow-hidden">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                      <path d={areaD} fill="url(#gradient)" opacity="0.1" />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#ffffff" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-2 z-10 w-full px-1">
                    {labels.map((lbl, i) => <span key={i}>{lbl}</span>)}
                  </div>
                </>
              );
            })()}

          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 text-center">
            <Link href={isAdmin ? "/employees" : "/attendance"} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center justify-center">
              View Full Report <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Today's Events */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">{isAdmin ? "Today's Events" : "My Schedule"}</h3>
            <Link href="/events" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">View All</Link>
          </div>
          <div className="space-y-5 flex-1">
            {events.length === 0 ? (
              <p className="text-sm text-gray-500 italic text-center mt-8">No events scheduled.</p>
            ) : (
              events.map((evt, idx) => {
                let Icon = Star;
                let bgClass = "bg-gray-50";
                let iconClass = "text-gray-600";
                
                if (evt.type === 'Birthday') { Icon = Gift; bgClass = 'bg-purple-50'; iconClass = 'text-purple-600'; }
                else if (evt.type === 'Anniversary') { Icon = Star; bgClass = 'bg-amber-50'; iconClass = 'text-amber-600 fill-amber-100'; }
                else if (evt.type === 'Payroll') { Icon = DollarSign; bgClass = 'bg-emerald-50'; iconClass = 'text-emerald-600'; }
                else if (evt.type === 'Training') { Icon = GraduationCap; bgClass = 'bg-blue-50'; iconClass = 'text-blue-600'; }

                return (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${bgClass} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${iconClass}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900">{evt.title}</h4>
                      <p className="text-xs text-gray-500">{evt.description}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-400">{evt.timeString || 'All Day'}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending Tasks */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">{isAdmin ? 'Pending Tasks' : 'My Tasks'}</h3>
            <Link href="/tasks" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">View All</Link>
          </div>
          <div className="overflow-x-auto">
            {tasks.length === 0 ? (
              <p className="text-sm text-gray-500 italic text-center py-8">No pending tasks. You're all caught up!</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400 font-medium border-b border-gray-100">
                    <th className="pb-3 font-medium">Task</th>
                    <th className="pb-3 font-medium">Priority</th>
                    <th className="pb-3 font-medium">Due Date</th>
                    <th className="pb-3 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tasks.map((task, idx) => {
                    let dotColor = "bg-gray-500";
                    if (task.priority === 'High') dotColor = "bg-red-500";
                    else if (task.priority === 'Medium') dotColor = "bg-amber-500";
                    else if (task.priority === 'Low') dotColor = "bg-emerald-500";

                    let statusClass = "bg-gray-100 text-gray-600";
                    if (task.status === 'In Progress') statusClass = "bg-blue-50 text-blue-600";
                    else if (task.status === 'Pending') statusClass = "bg-amber-50 text-amber-600";
                    else if (task.status === 'Completed') statusClass = "bg-emerald-50 text-emerald-600";

                    return (
                      <tr key={idx}>
                        <td className="py-3">
                          <p className="font-bold text-gray-900 text-xs">{task.title}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{task.category}</p>
                        </td>
                        <td className="py-3">
                          <span className="flex items-center text-xs font-semibold text-gray-600">
                            <span className={`w-2 h-2 rounded-full ${dotColor} mr-2`}></span> {task.priority}
                          </span>
                        </td>
                        <td className="py-3 text-xs text-gray-600 font-medium">
                          {new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-3 text-center">
                          <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-md ${statusClass}`}>
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">{isAdmin ? 'Recent Activity' : 'My Activity Log'}</h3>
            <Link href="/activity" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">View All</Link>
          </div>
          <div className="space-y-5">
            {activities.length === 0 ? (
              <p className="text-sm text-gray-500 italic text-center py-8">No recent activity.</p>
            ) : (
              activities.map((act, idx) => {
                let badgeClass = "bg-blue-500";
                if (act.type === 'Success') badgeClass = "bg-green-500";
                else if (act.type === 'Warning') badgeClass = "bg-amber-500";
                else if (act.type === 'Error') badgeClass = "bg-red-500";

                let IconEl = Activity;
                if (act.icon === 'User') IconEl = UserCircle;
                else if (act.icon === 'Check') IconEl = Check;
                else if (act.icon === 'DollarSign') IconEl = DollarSign;
                else if (act.icon === 'File') IconEl = File;

                // Simple relative time approximation
                const msAgo = Date.now() - new Date(act.createdAt).getTime();
                const minutesAgo = Math.floor(msAgo / 60000);
                let timeStr = `${minutesAgo} min ago`;
                if (minutesAgo > 60) timeStr = `${Math.floor(minutesAgo/60)} hours ago`;
                if (minutesAgo > 1440) timeStr = `${Math.floor(minutesAgo/1440)} days ago`;

                const fallbackInitials = act.user?.name?.substring(0, 2).toUpperCase() || 'SYS';

                return (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      {act.user?.profilePicture ? (
                         <img src={act.user.profilePicture} className="w-8 h-8 rounded-full object-cover" alt="Profile" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                          {fallbackInitials}
                        </div>
                      )}
                      <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 ${badgeClass} border-2 border-white rounded-full`}></div>
                    </div>
                    <div className="flex-1 mt-1">
                      <p className="text-sm font-semibold text-gray-900">{act.message}</p>
                    </div>
                    <span className="text-xs text-gray-400 font-medium mt-1">{timeStr}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
