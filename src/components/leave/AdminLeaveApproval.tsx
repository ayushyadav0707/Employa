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
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800 dark:text-zinc-100">
          Leave Requests Queue
        </h3>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-sm border transition-colors ${
              filter === 'Pending'
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-50'
            }`}
            onClick={() => setFilter('Pending')}
          >
            Pending Only
          </button>
          <button
            className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-sm border transition-colors ${
              filter === 'All'
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-50'
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

      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
            <thead className="bg-gray-50 dark:bg-zinc-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  Attachment
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
              {filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      John Doe
                    </div>
                    <div className="text-xs text-gray-500 dark:text-zinc-400">
                      {req.userId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-550 dark:text-zinc-300">
                    {req.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-300">
                    {req.startDate} to {req.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-550 dark:text-zinc-300">
                    {req.allocationDays}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-zinc-400 max-w-xs truncate">
                    {req.reason || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-550 dark:text-zinc-300">
                    {req.attachmentUrl ? (
                      <span className="text-indigo-600 dark:text-indigo-400 font-mono text-xs underline cursor-pointer">
                        {req.attachmentUrl}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        req.status === 'Approved'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : req.status === 'Rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {req.status === 'Pending' ? (
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold shadow transition-colors"
                          onClick={() => handleAction(req.id, 'Approved')}
                        >
                          Approve
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold shadow transition-colors"
                          onClick={() => handleAction(req.id, 'Rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-zinc-500 font-medium">
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
                    className="px-6 py-10 text-center text-sm text-gray-500 dark:text-zinc-400"
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
