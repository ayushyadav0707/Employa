'use client';

import React from 'react';
import { Printer } from 'lucide-react';

interface EmployeePayslipProps {
  user: any;
}

// Standard salary breakdown from a flat monthly wage
function calcBreakdown(wage: number) {
  const basic = wage * 0.5;
  const hra = basic * 0.5;
  const standard = 4167;
  const bonus = wage * 0.0833;
  const lta = wage * 0.08333;
  const totalComponents = basic + hra + standard + bonus + lta;
  const fixed = Math.max(0, wage - totalComponents);
  const pf = basic * 0.12;
  const profTax = 200;
  const totalEarnings = basic + hra + standard + bonus + lta + fixed;
  const totalDeductions = pf + profTax;
  const netPay = totalEarnings - totalDeductions;
  return { basic, hra, standard, bonus, lta, fixed, pf, profTax, totalEarnings, totalDeductions, netPay };
}

export const EmployeePayslip: React.FC<EmployeePayslipProps> = ({ user }) => {
  if (!user) {
    return (
      <div className="p-6 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
        No user data found.
      </div>
    );
  }

  const wage = user.salary ?? 50000;
  const breakdown = calcBreakdown(wage);

  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const today = new Date();
  const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const handlePrint = () => window.print();

  return (
    <div className="flex flex-col gap-6">
      {/* Header — hidden on print */}
      <div className="flex justify-between items-center print:hidden">
        <h3 className="text-xl font-bold text-gray-800">
          My Salary Slip ({monthName})
        </h3>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow transition-colors"
        >
          <Printer size={16} /> Print / Save as PDF
        </button>
      </div>

      {/* Printable Payslip */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md max-w-4xl mx-auto w-full print:border-none print:shadow-none print:p-0">

        {/* Company Header */}
        <div className="text-center border-b border-gray-200 pb-6 mb-8">
          <h2 className="text-3xl font-extrabold text-indigo-600 tracking-tight">EMPLOYA</h2>
          <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-widest">Human Resource Management System</p>
          <p className="text-sm text-gray-500 mt-2 font-medium">Payslip for the month of {monthName}</p>

          {/* Employee Info */}
          <div className="grid grid-cols-2 gap-8 text-left mt-8 text-sm">
            <div className="flex flex-col gap-1.5 text-gray-700">
              <p><strong>Employee Name:</strong> {user.name}</p>
              <p><strong>Employee ID:</strong> {user.loginId}</p>
              <p><strong>Department:</strong> {user.department || 'N/A'}</p>
              <p><strong>Designation:</strong> {user.jobTitle || 'N/A'}</p>
            </div>
            <div className="flex flex-col gap-1.5 text-gray-700 text-right">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>PAN:</strong> {user.panNo || 'Not provided'}</p>
              <p><strong>UAN:</strong> {user.uanNo || 'Not provided'}</p>
              <p><strong>Payment Date:</strong> {lastDay} {monthName}</p>
            </div>
          </div>
        </div>

        {/* Earnings & Deductions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">

          {/* Earnings */}
          <div className="bg-gray-50 p-6 rounded-xl flex flex-col gap-3">
            <h4 className="text-md font-bold text-indigo-600 border-b border-gray-200 pb-2">Earnings</h4>
            {[
              { label: 'Basic Salary', value: breakdown.basic, note: '50% of wage' },
              { label: 'House Rent Allowance (HRA)', value: breakdown.hra, note: '50% of basic' },
              { label: 'Standard Allowance', value: breakdown.standard, note: 'Fixed ₹4,167/month' },
              { label: 'Performance Bonus', value: breakdown.bonus, note: '8.33% of wage' },
              { label: 'Leave Travel Allowance', value: breakdown.lta, note: '8.333% of wage' },
              { label: 'Fixed Allowance', value: breakdown.fixed, note: 'Wage − all other components' },
            ].map(({ label, value, note }) => (
              <div key={label} className="flex justify-between text-sm text-gray-700">
                <div>
                  <span>{label}</span>
                  <span className="block text-xs text-gray-400">{note}</span>
                </div>
                <span className="font-semibold">{formatCurrency(value)}</span>
              </div>
            ))}
            <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-3 mt-auto">
              <span>Total Earnings</span>
              <span>{formatCurrency(breakdown.totalEarnings)}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-gray-50 p-6 rounded-xl flex flex-col gap-3">
            <h4 className="text-md font-bold text-red-500 border-b border-gray-200 pb-2">Deductions</h4>
            <div className="flex justify-between text-sm text-gray-700">
              <div>
                <span>Provident Fund (PF)</span>
                <span className="block text-xs text-gray-400">12% of basic — employee contribution</span>
              </div>
              <span className="font-semibold">{formatCurrency(breakdown.pf)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <div>
                <span>Professional Tax</span>
                <span className="block text-xs text-gray-400">Statutory flat deduction</span>
              </div>
              <span className="font-semibold">{formatCurrency(breakdown.profTax)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-3 mt-auto">
              <span>Total Deductions</span>
              <span>{formatCurrency(breakdown.totalDeductions)}</span>
            </div>
          </div>
        </div>

        {/* Net Pay */}
        <div className="text-center mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
          <h3 className="text-2xl font-bold text-green-700">Net Pay: {formatCurrency(breakdown.netPay)}</h3>
          <p className="text-xs text-gray-500 mt-1 font-semibold">
            Amount transferred to account on {lastDay}th {monthName}.
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Gross: {formatCurrency(breakdown.totalEarnings)} &nbsp;|&nbsp; Deductions: {formatCurrency(breakdown.totalDeductions)}
          </p>
        </div>

        {/* Print Footer */}
        <div className="hidden print:flex justify-between text-xs text-gray-400 mt-8 border-t pt-4">
          <span>Generated by Employa HRMS — Confidential</span>
          <span>This is a computer-generated payslip. No signature required.</span>
        </div>
      </div>
    </div>
  );
};
