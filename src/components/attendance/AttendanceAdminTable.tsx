'use client';

import React, { useState } from 'react';
import { AttendanceRecord } from '@/types/attendance';
import { Search, Download, Edit3, Users } from 'lucide-react';
import { AttendanceService } from '@/lib/attendance/attendanceService';
import { AttendanceRegularizeModal } from './AttendanceRegularizeModal';
import { MOCK_EMPLOYEES } from '@/lib/attendance/mockData';

interface AttendanceAdminTableProps {
  records: AttendanceRecord[];
  onRecordUpdated?: () => void;
}

export const AttendanceAdminTable: React.FC<AttendanceAdminTableProps> = ({ records, onRecordUpdated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('');
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  const filteredRecords = records.filter(r => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = r.employeeName?.toLowerCase().includes(q);
      const matchId = r.employeeId.toLowerCase().includes(q);
      if (!matchName && !matchId) return false;
    }
    if (selectedDept !== 'ALL' && r.department !== selectedDept) {
      return false;
    }
    if (selectedStatus !== 'ALL' && r.status !== selectedStatus) {
      return false;
    }
    if (selectedDate && r.date !== selectedDate) {
      return false;
    }
    return true;
  });

  const departments = ['ALL', 'Engineering', 'Design', 'Product', 'Human Resources', 'Marketing'];
  const statuses = ['ALL', 'Present', 'Half-day', 'Absent', 'Leave'];

  const handleExport = () => {
    AttendanceService.exportToCsv(filteredRecords, `dayflow_attendance_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleSaveRegularization = (updated: AttendanceRecord) => {
    AttendanceService.regularizeRecord(updated.id, updated);
    onRecordUpdated?.();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Company-wide Attendance Registry
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time logs, punctuality monitoring, and HR regularization
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 my-5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search name or EMP ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="relative">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept === 'ALL' ? '🏢 All Departments' : dept}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {statuses.map(st => (
              <option key={st} value={st}>
                {st === 'ALL' ? '⚡ All Statuses' : st}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Check In</th>
              <th className="py-3 px-4">Check Out</th>
              <th className="py-3 px-4">Total Hours</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Location / Remarks</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-normal">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  No attendance records found matching filters.
                </td>
              </tr>
            ) : (
              filteredRecords.map((r) => {
                const empMeta = MOCK_EMPLOYEES.find(e => e.id === r.employeeId);
                return (
                  <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center font-bold text-[10px] text-slate-600 dark:text-slate-300 shrink-0">
                          {empMeta?.avatar ? (
                            <img src={empMeta.avatar} alt={r.employeeName} className="w-full h-full object-cover" />
                          ) : (
                            r.employeeId.slice(0, 3)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{r.employeeName || r.employeeId}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{r.employeeId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {r.department || 'General'}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px]">
                      {r.date}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {r.checkIn || '-'}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {r.checkOut || (r.date === '2026-08-22' && r.checkIn ? 'In Progress' : '-')}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {r.totalHours > 0 ? `${r.totalHours} hrs` : '-'}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        r.status === 'Present'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : r.status === 'Half-day'
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : r.status === 'Leave'
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-slate-500 dark:text-slate-400 max-w-xs truncate">
                      {r.remarks || r.location || 'Standard Shift'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setEditingRecord(r)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors cursor-pointer"
                        title="Adjust / Regularize"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AttendanceRegularizeModal
        record={editingRecord}
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        onSave={handleSaveRegularization}
      />
    </div>
  );
};
