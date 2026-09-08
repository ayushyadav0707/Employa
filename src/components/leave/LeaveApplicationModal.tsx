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
    mobileNumber: '',
    reason: '',
    attachmentUrl: '',
  });

  const [allocationDays, setAllocationDays] = useState(0);
  const [dayPortion, setDayPortion] = useState<'Full day' | 'First half' | 'Second half'>('Full day');

  // Calculate min date: 10 days in the past
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 10);
  const minDateString = `${minDate.getFullYear()}-${String(minDate.getMonth() + 1).padStart(2, '0')}-${String(minDate.getDate()).padStart(2, '0')}`;

  // Auto-calculate allocation days
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (end >= start) {
        if (formData.startDate === formData.endDate && dayPortion !== 'Full day') {
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
  }, [formData.startDate, formData.endDate, dayPortion]);

  // Reset day portion if dates don't match
  useEffect(() => {
    if (formData.startDate !== formData.endDate) {
      setDayPortion('Full day');
    }
  }, [formData.startDate, formData.endDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (end < start) {
      alert('End date must be on or after start date.');
      return;
    }

    if (formData.type === 'Sick time off' && allocationDays > 2) {
      alert('Sick leave cannot be applied for more than 2 days at a time.');
      return;
    }

    let finalReason = formData.reason;
    if (formData.startDate === formData.endDate && dayPortion !== 'Full day') {
      finalReason = `[${dayPortion}] ` + finalReason;
    }
    if (formData.mobileNumber) {
      finalReason = finalReason ? `${finalReason} | Contact: ${formData.mobileNumber}` : `Contact: ${formData.mobileNumber}`;
    }

    onSubmit({
      ...formData,
      reason: finalReason,
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
      <div className="bg-white  rounded-xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-4 border border-gray-100  max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-100  pb-3">
          <h3 className="text-lg font-bold text-gray-900 ">
            Request Time Off
          </h3>
          <button
            className="text-gray-500 hover:text-gray-700  "
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 ">
              Employee ID
            </label>
            <input
              type="text"
              className="px-3 py-2 border border-gray-200  rounded-lg bg-gray-100  text-gray-500 cursor-not-allowed text-sm font-semibold"
              value={currentUser ? `${currentUser.loginId} (${currentUser.name})` : 'Loading...'}
              disabled
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 ">
              Time Off Type
            </label>
            <select
              className="px-3 py-2 border border-gray-200  rounded-lg bg-white  text-gray-800  text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              <label className="text-sm font-semibold text-gray-700 ">
                Start Date
              </label>
              <input
                type="date"
                required
                min={minDateString}
                className="px-3 py-2 border border-gray-200  rounded-lg bg-white  text-gray-800  text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 ">
                End Date
              </label>
              <input
                type="date"
                required
                min={minDateString}
                className="px-3 py-2 border border-gray-200  rounded-lg bg-white  text-gray-800  text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 ">
              Allocation (Days)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                disabled
                className="flex-1 px-3 py-2 border border-gray-200  rounded-lg bg-gray-50  text-gray-600  text-sm font-semibold"
                value={allocationDays > 0 ? `${allocationDays} Days` : 'Select dates'}
              />
              {formData.startDate && formData.endDate && formData.startDate === formData.endDate && (
                <select
                  className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={dayPortion}
                  onChange={(e) => setDayPortion(e.target.value as any)}
                >
                  <option value="Full day">Full day</option>
                  <option value="First half">First half</option>
                  <option value="Second half">Second half</option>
                </select>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 ">
              Mobile Number
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              pattern="[0-9]{10}"
              title="Please enter exactly 10 digits"
              className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.mobileNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, ''); // Allow only numbers
                setFormData({ ...formData, mobileNumber: val });
              }}
              placeholder="1234567890"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 ">
              Reason
            </label>
            <textarea
              className="px-3 py-2 border border-gray-200  rounded-lg bg-white  text-gray-800  text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            ></textarea>
          </div>



          <div className="flex justify-end gap-3 border-t border-gray-100  pt-4 mt-2">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300  text-gray-700  rounded-lg text-sm hover:bg-gray-50  transition-colors"
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
