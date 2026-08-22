'use client';

import { useState } from 'react';
import { UserCircle, CalendarClock, PlaneTakeoff, LogOut, Search, ChevronRight, Activity, Users, Clock, CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardClient({ employees = [] }: { employees: any[] }) {
  const [isAdmin, setIsAdmin] = useState(false); // Toggle for testing
  const router = useRouter();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Test Toggle */}
      <div className="flex justify-end mb-4">
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={isAdmin} 
              onChange={() => setIsAdmin(!isAdmin)} 
            />
            <div className={`block w-14 h-8 rounded-full transition-colors ${isAdmin ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isAdmin ? 'transform translate-x-6' : ''}`}></div>
          </div>
          <div className="ml-3 text-sm font-medium text-gray-700">
            View as: {isAdmin ? 'Admin/HR' : 'Employee'}
          </div>
        </label>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your HR metrics.</p>
      </div>

      {!isAdmin ? (
        /* ================== EMPLOYEE DASHBOARD ================== */
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Quick Access Cards */}
            <Link href="/profile" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center group hover:shadow-md hover:border-indigo-200 transition-all text-center">
              <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-1">My Profile</h3>
              <p className="text-xs text-gray-500">View & edit personal details</p>
            </Link>

            <Link href="#" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center group hover:shadow-md hover:border-emerald-200 transition-all text-center">
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CalendarClock className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-1">Attendance</h3>
              <p className="text-xs text-gray-500">Clock in/out & daily views</p>
            </Link>

            <Link href="#" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center group hover:shadow-md hover:border-amber-200 transition-all text-center">
              <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PlaneTakeoff className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-1">Leave Requests</h3>
              <p className="text-xs text-gray-500">Apply for time-off</p>
            </Link>

            <button onClick={() => router.push('/')} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center group hover:shadow-md hover:border-red-200 transition-all text-center">
              <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-1">Log Out</h3>
              <p className="text-xs text-gray-500">End your session securely</p>
            </button>
          </div>

          {/* Recent Activity / Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-indigo-500" /> Recent Activity & Alerts
            </h3>
            <div className="space-y-4">
              <div className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Leave request approved</p>
                  <p className="text-xs text-gray-500 mt-1">Your leave request for 12 Oct - 14 Oct was approved by HR.</p>
                  <span className="text-[10px] text-gray-400 mt-2 block">2 hours ago</span>
                </div>
              </div>
              <div className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Clock-in Successful</p>
                  <p className="text-xs text-gray-500 mt-1">You clocked in at 08:55 AM today.</p>
                  <span className="text-[10px] text-gray-400 mt-2 block">Today at 08:55 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================== ADMIN DASHBOARD ================== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{employees.length}</p>
                </div>
                <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance Today</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">94%</p>
                </div>
                <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Leave Approvals</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
                </div>
                <div className="h-10 w-10 bg-amber-50 rounded-full flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </div>

            {/* Employee List Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">Employee Directory Overview</h3>
                <Link href="/employees" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {employees.slice(0, 4).map((emp) => (
                  <Link href={`/profile/${emp.id}`} key={emp.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden">
                        {emp.profilePicture ? (
                          <img src={emp.profilePicture} alt={emp.name} className="h-full w-full object-cover" />
                        ) : (
                          emp.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                        <p className="text-xs text-gray-500">{emp.jobTitle || 'Employee'} • {emp.department || 'No Dept'}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{emp.employeeId}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
             {/* Switch Between Employees (Quick Search) */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Switch Employee Profile</h3>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by name or ID..." 
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="text-xs text-gray-500">
                Use the search bar above to quickly switch and view any employee's full profile, attendance, and payroll details.
              </div>
            </div>

            {/* Leave Approvals Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Pending Leave Approvals</h3>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">3</span>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Sarah Connor</p>
                      <p className="text-xs text-gray-500">Sick Leave (2 days)</p>
                    </div>
                    <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded">Review</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
