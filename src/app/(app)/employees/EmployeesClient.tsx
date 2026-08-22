'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, ChevronRight } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  loginId: string;
  jobTitle: string | null;
  department: string | null;
  profilePicture: string | null;
  todayStatus: string | null;
}

export default function EmployeesClient({ employees }: { employees: Employee[] }) {
  const [search, setSearch] = useState('');

  const filtered = employees.filter(emp => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.loginId.toLowerCase().includes(q) ||
      (emp.department || '').toLowerCase().includes(q) ||
      (emp.jobTitle || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
          <p className="text-gray-500">Manage your team members and their account permissions here.</p>
        </div>
        <Link 
          href="/employees/new" 
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, ID, department..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="text-sm text-gray-500 ml-4 whitespace-nowrap">
            {filtered.length} / {employees.length} employees
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500">
              {search ? `No employees found matching "${search}".` : 'No employees found. Add one to get started.'}
            </div>
          ) : (
            filtered.map((emp) => {
              const status = emp.todayStatus || 'unknown';

              return (
                <Link 
                  href={`/profile/${emp.id}`} 
                  key={emp.id}
                  className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group relative cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  
                  {/* Status Indicator */}
                  <div className="absolute top-4 right-4 z-10" title={`Status: ${status}`}>
                    {(status === 'Present' || status === 'Half-day') && (
                      <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </div>
                    )}
                    {status === 'Leave' && <span className="text-[14px] leading-none grayscale opacity-80">✈️</span>}
                    {status === 'Absent' && <span className="inline-flex rounded-full h-3 w-3 bg-red-400"></span>}
                    {status === 'unknown' && <span className="inline-flex rounded-full h-3 w-3 bg-gray-300"></span>}
                  </div>

                  {/* Profile Picture */}
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-3xl mb-5 group-hover:scale-105 transition-transform duration-300 overflow-hidden shadow-sm relative z-10 border-4 border-white">
                    {emp.profilePicture ? (
                      <img src={emp.profilePicture} alt={emp.name} className="h-full w-full object-cover" />
                    ) : (
                      emp.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  
                  {/* Basic Info */}
                  <h3 className="text-lg font-bold text-gray-900 text-center tracking-tight group-hover:text-indigo-600 transition-colors relative z-10">{emp.name}</h3>
                  <p className="text-sm font-medium text-gray-500 mb-1 relative z-10">{emp.jobTitle || 'Employee'}</p>
                  <p className="text-xs text-gray-400 mb-4 relative z-10">{emp.department || 'Employa HR'}</p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 w-full flex justify-between items-center relative z-10">
                    <div className="text-left">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">ID</p>
                      <p className="text-sm font-mono font-medium text-gray-700">{emp.loginId}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors text-indigo-300">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
