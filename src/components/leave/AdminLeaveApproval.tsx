'use client';

import React, { useState } from 'react';
import { updateLeaveRequestStatus } from '@/app/actions/leave';

interface AdminLeaveApprovalProps {
  requests: any[];
}

export const AdminLeaveApproval: React.FC<AdminLeaveApprovalProps> = ({
  requests,
}) => {
  const [filter, setFilter] = useState<'All' | 'Pending'>('Pending');
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (id: string, status: 'Approved' | 'Rejected') => {
    let comment = '';
    if (status === 'Rejected') {
      const reason = prompt('Please provide a reason for rejection:');
      if (reason === null) return; // User cancelled prompt
      if (reason.trim() === '') {
        alert('Rejection reason is required.');
        return;
      }
      comment = reason;
    }

    setError(null);
    try {
      await updateLeaveRequestStatus(id, status, comment);
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the request.');
    }
  };

  const filteredRequests = requests.filter(
    (req) => filter === 'All' || req.status === 'Pending'
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-[24px] font-extrabold text-gray-900 leading-tight">
          Leave Requests Queue
        </h3>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-sm border transition-colors ${
              filter === 'Pending'
                ? 'bg-primary text-black border-primary'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setFilter('Pending')}
          >
            Pending Only
          </button>
          <button
            className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-sm border transition-colors ${
              filter === 'All'
                ? 'bg-primary text-black border-primary'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setFilter('All')}
          >
            All Requests
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-[24px] border border-border shadow-sm overflow-hidden p-2">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Days
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Attachment
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {req.user?.name ?? req.userId}
                    </div>
                    <div className="text-[11px] font-medium text-gray-400 mt-0.5 uppercase tracking-wider">
                      {req.user?.loginId ?? req.userId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                    {req.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                    {req.startDate} to {req.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                    {req.allocationDays}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium max-w-xs truncate" title={req.reason}>
                    {req.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {req.attachmentUrl ? (
                      <a
                        href={req.attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline font-bold"
                      >
                        View
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        req.status === 'Approved'
                          ? 'bg-green-50 text-success border-green-100'
                          : req.status === 'Rejected'
                          ? 'bg-red-50 text-danger border-red-100'
                          : 'bg-primary/10 text-primary border-primary/20'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {req.status === 'Pending' ? (
                      <div className="flex gap-2">
                        <button
                          className="px-4 py-1.5 bg-success hover:bg-success/90 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                          onClick={() => handleAction(req.id, 'Approved')}
                        >
                          Approve
                        </button>
                        <button
                          className="px-4 py-1.5 bg-danger hover:bg-danger/90 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                          onClick={() => handleAction(req.id, 'Rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">
                        {req.adminComment ? `Rejected: "${req.adminComment}"` : 'Approved'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-10 text-center text-sm text-gray-500 "
                  >
                    No pending leave requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
