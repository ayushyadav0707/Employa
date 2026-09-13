'use client';

import React, { useState } from 'react';
import { LeaveApplicationModal } from './LeaveApplicationModal';
import { submitLeaveRequest, cancelLeaveRequest } from '@/app/actions/leave';
import { Calendar, Plus, MoreHorizontal, Lightbulb, ExternalLink, ChevronRight, Activity, Briefcase, UserCheck } from 'lucide-react';
import { BedIcon } from 'lucide-react'; // Bed icon for sick leave

interface EmployeeLeaveViewProps {
  balance: { annual: number; sick: number; casual: number; earned: number };
  requests: any[];
  userId: string;
  currentUser?: any;
}

export const EmployeeLeaveView: React.FC<EmployeeLeaveViewProps> = ({
  balance,
  requests,
  userId,
  currentUser,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'policies'>('history');
  
  // Filters
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [yearFilter, setYearFilter] = useState('2026'); // Hardcoded 2026 per mockup or dynamic

  const handleApply = async (newRequest: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await submitLeaveRequest({
        userId,
        ...newRequest,
      });
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this leave request?')) return;
    try {
      await cancelLeaveRequest(id);
      setActiveDropdown(null);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel request.');
    }
  };

  const filteredRequests = requests.filter(req => {
    if (typeFilter !== 'All Types' && req.type !== typeFilter) return false;
    if (yearFilter !== 'All Years' && req.startDate && !req.startDate.startsWith(yearFilter)) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4 pb-6" onClick={() => setActiveDropdown(null)}>
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2 mb-2">
        <div>
          <h1 className="text-[24px] font-extrabold text-gray-900 leading-tight">
            Time Off Management
          </h1>
          <p className="text-[13px] font-medium text-gray-500 mt-1">Plan your time off and keep track of your leaves.</p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black hover:bg-primary-hover text-sm font-bold rounded-xl shadow-sm transition-colors"
          onClick={() => {
            setError(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> Apply for Leave
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {/* Leave Balance Summary (4 cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
        {/* Annual Leave */}
        <div className="bg-white p-5 rounded-[20px] border border-border shadow-sm flex flex-col relative overflow-hidden group hover:border-primary transition-colors cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <h4 className="text-[28px] font-extrabold text-gray-900 mb-1">{balance.annual}</h4>
          <p className="text-[12px] font-bold text-gray-500">Annual Leave</p>
          <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
        </div>
        
        {/* Sick Leave */}
        <div className="bg-white p-5 rounded-[20px] border border-border shadow-sm flex flex-col relative overflow-hidden group hover:border-primary transition-colors cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <h4 className="text-[28px] font-extrabold text-gray-900 mb-1">{balance.sick}</h4>
          <p className="text-[12px] font-bold text-gray-500">Sick Leave</p>
          <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Casual Leave */}
        <div className="bg-white p-5 rounded-[20px] border border-border shadow-sm flex flex-col relative overflow-hidden group hover:border-primary transition-colors cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <h4 className="text-[28px] font-extrabold text-gray-900 mb-1">{balance.casual}</h4>
          <p className="text-[12px] font-bold text-gray-500">Casual Leave</p>
          <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Earned Leave */}
        <div className="bg-white p-5 rounded-[20px] border border-border shadow-sm flex flex-col relative overflow-hidden group hover:border-primary transition-colors cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <div className="w-10 h-10 rounded-full bg-[#FFF9E8] flex items-center justify-center mb-3">
            <UserCheck className="w-5 h-5 text-primary" />
          </div>
          <h4 className="text-[28px] font-extrabold text-gray-900 mb-1">{balance.earned}</h4>
          <p className="text-[12px] font-bold text-gray-500">Earned Leave</p>
          <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Leave History Section */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 flex flex-col min-h-[300px]">
        {/* Tabs & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-b border-gray-50 gap-4">
          <div className="flex gap-6 border-b-2 border-transparent w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('history')}
              className={`pb-4 -mb-[18px] text-[14px] font-bold transition-colors border-b-2 ${activeTab === 'history' ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-gray-700'}`}
            >
              Leave History
            </button>
            <button 
              onClick={() => setActiveTab('policies')}
              className={`pb-4 -mb-[18px] text-[14px] font-bold transition-colors border-b-2 ${activeTab === 'policies' ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-gray-700'}`}
            >
              Leave Policies
            </button>
          </div>
          
          {activeTab === 'history' && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select 
                value={typeFilter} 
                onChange={e => setTypeFilter(e.target.value)}
                className="bg-white border border-gray-200 text-gray-700 text-[13px] font-bold rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none w-full sm:w-auto"
              >
                <option value="All Types">All Types</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Earned Leave">Earned Leave</option>
              </select>
              <select 
                value={yearFilter} 
                onChange={e => setYearFilter(e.target.value)}
                className="bg-white border border-gray-200 text-gray-700 text-[13px] font-bold rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none w-full sm:w-auto"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="All Years">All Years</option>
              </select>
            </div>
          )}
        </div>

        {/* Content */}
        {activeTab === 'history' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="px-6 py-4">TYPE</th>
                  <th className="px-6 py-4">START DATE</th>
                  <th className="px-6 py-4">END DATE</th>
                  <th className="px-6 py-4">DAYS</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4">REMARKS / ADMIN COMMENT</th>
                  <th className="px-6 py-4 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRequests.map((req) => {
                  
                  let statusBg = "bg-amber-50";
                  let statusText = "text-amber-600";
                  if (req.status === 'Approved') { statusBg = "bg-green-50"; statusText = "text-green-600"; }
                  if (req.status === 'Rejected') { statusBg = "bg-red-50"; statusText = "text-red-600"; }

                  let Icon = Calendar;
                  let iconBg = "bg-primary/10";
                  let iconColor = "text-primary";
                  if (req.type === 'Sick Leave') {
                    Icon = Activity;
                    iconBg = "bg-orange-50";
                    iconColor = "text-orange-500";
                  }
                  if (req.type === 'Casual Leave') {
                    Icon = Briefcase;
                  }
                  if (req.type === 'Earned Leave') {
                    Icon = UserCheck;
                  }

                  return (
                    <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
                            <Icon className={`w-4 h-4 ${iconColor}`} />
                          </div>
                          <span className="font-bold text-gray-900 text-[13px]">{req.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] font-semibold text-gray-600">{req.startDate}</td>
                      <td className="px-6 py-4 text-[13px] font-semibold text-gray-600">{req.endDate}</td>
                      <td className="px-6 py-4 text-[13px] font-bold text-gray-900">{req.allocationDays}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-[11px] font-bold rounded-full ${statusBg} ${statusText}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-[250px] truncate text-[13px] font-medium text-gray-500">
                          {req.adminComment ? (
                            <span className="text-red-500">{req.adminComment}</span>
                          ) : (
                            req.reason || '-'
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center relative">
                        {req.status === 'Pending' ? (
                          <div className="relative inline-block">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(activeDropdown === req.id ? null : req.id);
                              }}
                              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-sm"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            {activeDropdown === req.id && (
                              <div className="absolute right-0 mt-2 w-36 rounded-xl shadow-lg bg-white border border-gray-100 py-1.5 z-50">
                                <button
                                  onClick={() => handleCancel(req.id)}
                                  className="block w-full text-left px-4 py-2 text-[13px] font-bold text-red-600 hover:bg-gray-50"
                                >
                                  Cancel Request
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-8 h-8 mx-auto" /> // placeholder for alignment
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                       <p className="text-sm font-bold text-gray-400">No leave requests found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center flex flex-col items-center justify-center h-full min-h-[200px]">
            <p className="text-sm font-bold text-gray-500 mb-2">Leave policies are currently managed externally.</p>
            <p className="text-xs font-medium text-gray-400">Please contact HR or check the employee handbook for detailed policy documents.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <LeaveApplicationModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleApply}
          isSubmitting={isSubmitting}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};
