'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

interface LeaveApplicationModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  currentUser?: any;
}

export const LeaveApplicationModal: React.FC<LeaveApplicationModalProps> = ({
  onClose,
  onSubmit,
  isSubmitting,
  currentUser,
}) => {
  const [formData, setFormData] = useState({
    type: 'Paid Time off',
    startDate: '',
    endDate: '',
    reason: '',
    attachmentUrl: '',
  });

  const [allocationDays, setAllocationDays] = useState(0);
  const [isHalfDay, setIsHalfDay] = useState(false);

  // Auto-calculate allocation days
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (end >= start) {
        if (formData.startDate === formData.endDate && isHalfDay) {
          setAllocationDays(0.5);
        } else {
          setAllocationDays(diffDays);
        }
      } else {
        setAllocationDays(0);
      }
    } else {
      setAllocationDays(0);
    }
  }, [formData.startDate, formData.endDate, isHalfDay]);

  // Reset half-day if dates don't match
  useEffect(() => {
    if (formData.startDate !== formData.endDate) {
      setIsHalfDay(false);
    }
  }, [formData.startDate, formData.endDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allocationDays <= 0) {
      alert('End date must be on or after start date.');
      return;
    }
    if (formData.type === 'Sick time off' && !formData.attachmentUrl) {
      alert('Sick leave requires a certificate attachment.');
      return;
    }

    onSubmit({
      ...formData,
      allocationDays,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        attachmentUrl: e.target.files[0].name, // Using actual filename
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-4 border border-gray-100 dark:border-zinc-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-700 pb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Request Time Off
          </h3>
          <button
            className="text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-white"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
              Employee ID
            </label>
            <input
              type="text"
              className="px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-100 dark:bg-zinc-900 text-gray-500 cursor-not-allowed text-sm font-semibold"
              value={currentUser ? `${currentUser.loginId} (${currentUser.name})` : 'Loading...'}
              disabled
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
              Time Off Type
            </label>
            <select
              className="px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-950 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Paid Time off">Paid Time off</option>
              <option value="Sick time off">Sick time off</option>
              <option value="Unpaid Leaves">Unpaid Leaves</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                Start Date
              </label>
              <input
                type="date"
                required
                className="px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-950 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                End Date
              </label>
              <input
                type="date"
                required
                className="px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-950 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
              Allocation (Days)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                disabled
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 text-sm font-semibold"
                value={allocationDays > 0 ? `${allocationDays} Days` : 'Select dates'}
              />
              {formData.startDate && formData.endDate && formData.startDate === formData.endDate && (
                <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    checked={isHalfDay}
                    onChange={(e) => setIsHalfDay(e.target.checked)}
                  />
                  Half Day
                </label>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
              Remarks
            </label>
            <textarea
              className="px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-950 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            ></textarea>
          </div>

          {/* Conditional attachment for Sick time off */}
          {formData.type === 'Sick time off' && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300 flex items-center gap-1">
                For sick leave certificate <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-sm font-medium text-gray-700 dark:text-zinc-300 transition-colors">
                  <Upload size={16} /> Upload Certificate
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.png,.jpg,.jpeg"
                  />
                </label>
                {formData.attachmentUrl ? (
                  <span className="text-xs text-gray-600 dark:text-zinc-400 font-mono truncate max-w-[200px]">
                    {formData.attachmentUrl}
                  </span>
                ) : (
                  <span className="text-xs text-red-500">No file uploaded</span>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-100 dark:border-zinc-700 pt-4 mt-2">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow transition-colors flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
