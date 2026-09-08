'use client';

import React, { useState } from 'react';
import { LeaveApplicationModal } from './LeaveApplicationModal';
import { submitLeaveRequest } from '@/app/actions/leave';

interface EmployeeLeaveViewProps {
  balance: { paidTimeOff: number; sickTimeOff: number };
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800 ">
          My Leave Balance
        </h3>
        <button
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow transition-colors"
          onClick={() => {
            setError(null);
            setIsModalOpen(true);
          }}
        >
          Apply for Leave
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Leave Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white  p-6 rounded-xl border border-gray-200  shadow-sm flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-500 ">
            Paid Time Off
          </span>
          <span className="text-3xl font-bold text-indigo-600 ">
            {balance.paidTimeOff}{' '}
            <span className="text-sm font-normal text-gray-500 ">
              Days Available
            </span>
          </span>
        </div>
        
        <div className="bg-white  p-6 rounded-xl border border-gray-200  shadow-sm flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-500 ">
            Sick Time Off
          </span>
          <span className="text-3xl font-bold text-amber-500 ">
            {balance.sickTimeOff}{' '}
            <span className="text-sm font-normal text-gray-500 ">
              Days Available
            </span>
          </span>
        </div>
      </div>

      {/* Leave History Table */}
      <div className="bg-white  rounded-xl border border-gray-200  shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 ">
          <h4 className="text-lg font-bold text-gray-800  font-sans">
            Leave History
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50 ">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500  uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500  uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500  uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500  uppercase tracking-wider">
                  Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500  uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500  uppercase tracking-wider">
                  Remarks / Admin Comment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white  divide-y divide-gray-200 ">
              {requests.map((req) => (
                <tr key={req.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ">
                    {req.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                    {req.startDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                    {req.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                    {req.allocationDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        req.status === 'Approved'
                          ? 'bg-green-100 text-green-800  '
                          : req.status === 'Rejected'
                          ? 'bg-red-100 text-red-800  '
                          : 'bg-amber-100 text-amber-800  '
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500  max-w-xs truncate">
                    {req.adminComment ? (
                      <span className="text-red-500">{req.adminComment}</span>
                    ) : (
                      req.reason || '-'
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-gray-500 "
                  >
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
