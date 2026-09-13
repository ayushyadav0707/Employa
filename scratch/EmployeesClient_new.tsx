'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, MoreVertical } from 'lucide-react';

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
  const router = useRouter();

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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
          <p className="text-gray-500">Manage your team members and their account permissions here.</p>
        </div>
        <Link 
          href="/employees/new" 
          className="flex items-center px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary-hover transition-colors shadow-sm font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Link>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-border overflow-hidden p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, ID, department..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <div className="text-sm font-bold text-gray-400 ml-4 whitespace-nowrap">
            {filtered.length} / {employees.length} EMPLOYEES
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr>
                <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Employee</th>
                <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">ID</th>
                <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Department</th>
                <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400 font-medium">
                    {search ? `No employees found matching "${search}".` : 'No employees found. Add one to get started.'}
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr 
                    key={emp.id}
                    onClick={() => router.push(`/profile/${emp.id}`)}
                    className="group cursor-pointer hover:bg-[#FFF9E8]/50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-black font-bold text-sm shrink-0 overflow-hidden">
                          {emp.profilePicture ? (
                            <img src={emp.profilePicture} alt={emp.name} className="w-full h-full object-cover" />
                          ) : (
                            emp.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <h4 className="text-[14px] font-bold text-gray-900 group-hover:text-black transition-colors">{emp.name}</h4>
                          <p className="text-[12px] font-medium text-gray-400">{emp.jobTitle || 'Employee'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                        {emp.loginId}
                      </span>
                    </td>
                    <td className="py-4">
                      {emp.department ? (
                        <span className="inline-block bg-gray-100 text-gray-700 font-bold uppercase text-[10px] px-3 py-1 rounded-full">
                          {emp.department}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">-</span>
                      )}
                    </td>
                    <td className="py-4 text-right pr-4">
                      <button 
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-400 group-hover:text-gray-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Action menu logic would go here
                        }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
