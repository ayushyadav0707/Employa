import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search, MoreVertical, Edit2 } from "lucide-react";

export default async function EmployeesPage() {
  const employees = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
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
          <div className="relative w-full max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="text-sm text-gray-500">
            {employees.length} total employees
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {employees.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500">
              No employees found. Add one to get started.
            </div>
          ) : (
            employees.map((emp) => {
              // Mocking status logic for demonstration. In real app, join with Attendance/Leave tables.
              const mockStatuses = ['present', 'absent', 'leave'];
              const status = mockStatuses[emp.id.length % 3]; // Deterministic mock

              return (
                <Link 
                  href={`/profile/${emp.id}`} 
                  key={emp.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col items-center hover:shadow-md hover:border-indigo-200 transition-all group relative cursor-pointer"
                >
                  {/* Status Indicator */}
                  <div className="absolute top-4 right-4" title={`Status: ${status}`}>
                    {status === 'present' && <span className="text-[10px] leading-none">🟢</span>}
                    {status === 'leave' && <span className="text-[12px] leading-none">✈️</span>}
                    {status === 'absent' && <span className="text-[10px] leading-none">🟡</span>}
                  </div>

                  {/* Profile Picture */}
                  <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl mb-4 group-hover:scale-105 transition-transform overflow-hidden shadow-sm">
                    {emp.profilePicture ? (
                      <img src={emp.profilePicture} alt={emp.name} className="h-full w-full object-cover" />
                    ) : (
                      emp.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  
                  {/* Basic Info */}
                  <h3 className="text-lg font-semibold text-gray-900 text-center">{emp.name}</h3>
                  <p className="text-sm text-gray-500 mb-1">{emp.jobTitle || 'Employee'}</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 w-full text-center space-y-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">ID</p>
                    <p className="text-sm font-medium text-gray-700">{emp.employeeId}</p>
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
