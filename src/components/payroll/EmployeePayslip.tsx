'use client';

import React from 'react';
import { Printer } from 'lucide-react';

interface EmployeePayslipProps {
  user: any;
}

export const EmployeePayslip: React.FC<EmployeePayslipProps> = ({ user }) => {
  if (!user || !user.payrollConfig) {
    return (
      <div className="p-6 bg-yellow-50 text-yellow-800 rounded-lg">
        No payroll configuration found for this user.
      </div>
    );
  }

  const { salary, payrollConfig } = user;

  // === DYNAMIC SALARY CALCULATION (SVG-accurate) ===
  // Basic = 50% of salary
  const basic = salary * (payrollConfig.basicSalaryPercent / 100);
  // HRA = 50% of Basic (SVG: "HRA provided to employees 50% of the basic salary")
  const hra = basic * (payrollConfig.hraPercent / 100);
  // Standard Allowance = 16.67% of Basic
  const standard = basic * (payrollConfig.standardAllowPercent / 100);
  // Performance Bonus = 8.33% of Basic
  const bonus = basic * (payrollConfig.perfBonusPercent / 100);
  // Leave Travel Allowance = 8.333% of Basic
  const lta = basic * (payrollConfig.travelAllowPercent / 100);
  // Fixed Allowance = salary − (basic + hra + standard + bonus + lta)
  // SVG: "fixed allowance portion of wages is determined after calculating all salary components"
  const fixed = salary - (basic + hra + standard + bonus + lta);

  const totalEarnings = basic + hra + standard + bonus + lta + fixed;

  // Deductions
  // PF = 12% of Basic (Employee contribution)
  const pf = basic * (payrollConfig.pfPercent / 100);
  // Professional Tax = ₹200 flat
  const tax = payrollConfig.profTax;

  const totalDeductions = pf + tax;
  const netPay = totalEarnings - totalDeductions;

  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const today = new Date();
  const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const handlePrint = () => window.print();

  return (
    <div className="flex flex-col gap-6">
      {/* Header — hidden on print */}
      <div className="flex justify-between items-center print:hidden">
        <h3 className="text-xl font-bold text-gray-800 dark:text-zinc-100">
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
      <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-md max-w-4xl mx-auto w-full print:border-none print:shadow-none print:p-0 print:mx-0">

        {/* Company Header */}
        <div className="text-center border-b border-gray-200 dark:border-zinc-700 pb-6 mb-8">
          <h2 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
            DAYFLOW CORP
          </h2>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5 uppercase tracking-widest">
            Every workday, perfectly aligned.
          </p>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2 font-medium">
            Payslip for the month of {monthName}
          </p>

          {/* Employee Info */}
          <div className="grid grid-cols-2 gap-8 text-left mt-8 text-sm">
            <div className="flex flex-col gap-1.5 text-gray-700 dark:text-zinc-300">
              <p><strong>Employee Name:</strong> {user.name}</p>
              <p><strong>Employee ID:</strong> {user.id}</p>
              <p><strong>Department:</strong> {user.department}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="flex flex-col gap-1.5 text-gray-700 dark:text-zinc-300 text-right">
              <p><strong>Bank Name:</strong> State Bank of India</p>
              <p><strong>Account No:</strong> XXXXXX1234</p>
              <p><strong>PAN:</strong> ABCDE1234F</p>
              <p><strong>UAN No:</strong> 100123456789</p>
            </div>
          </div>
        </div>

        {/* Earnings & Deductions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">

          {/* Earnings */}
          <div className="bg-gray-50 dark:bg-zinc-700/30 p-6 rounded-xl flex flex-col gap-3">
            <h4 className="text-md font-bold text-indigo-600 dark:text-indigo-400 border-b border-gray-200 dark:border-zinc-700 pb-2">
              Earnings
            </h4>

            {[
              { label: 'Basic Salary', value: basic, note: `${payrollConfig.basicSalaryPercent}% of wage` },
              { label: 'House Rent Allowance (HRA)', value: hra, note: `${payrollConfig.hraPercent}% of basic` },
              { label: 'Standard Allowance', value: standard, note: `${payrollConfig.standardAllowPercent}% of basic` },
              { label: 'Performance Bonus', value: bonus, note: `${payrollConfig.perfBonusPercent}% of basic` },
              { label: 'Leave Travel Allowance', value: lta, note: `${payrollConfig.travelAllowPercent}% of basic` },
              { label: 'Fixed Allowance', value: fixed, note: 'Wage − all other components' },
            ].map(({ label, value, note }) => (
              <div key={label} className="flex justify-between text-sm text-gray-700 dark:text-zinc-300">
                <div>
                  <span>{label}</span>
                  <span className="block text-xs text-gray-400 dark:text-zinc-500">{note}</span>
                </div>
                <span className="font-semibold">{formatCurrency(value)}</span>
              </div>
            ))}

            <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-zinc-700 pt-3 mt-auto">
              <span>Total Earnings</span>
              <span>{formatCurrency(totalEarnings)}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-gray-50 dark:bg-zinc-700/30 p-6 rounded-xl flex flex-col gap-3">
            <h4 className="text-md font-bold text-red-500 dark:text-red-400 border-b border-gray-200 dark:border-zinc-700 pb-2">
              Deductions
            </h4>

            <div className="flex justify-between text-sm text-gray-700 dark:text-zinc-300">
              <div>
                <span>Provident Fund (PF)</span>
                <span className="block text-xs text-gray-400 dark:text-zinc-500">{payrollConfig.pfPercent}% of basic — employee contribution</span>
              </div>
              <span className="font-semibold">{formatCurrency(pf)}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-700 dark:text-zinc-300">
              <div>
                <span>Professional Tax</span>
                <span className="block text-xs text-gray-400 dark:text-zinc-500">Statutory flat deduction</span>
              </div>
              <span className="font-semibold">{formatCurrency(tax)}</span>
            </div>

            <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-zinc-700 pt-3 mt-auto">
              <span>Total Deductions</span>
              <span>{formatCurrency(totalDeductions)}</span>
            </div>
          </div>
        </div>

        {/* Net Pay */}
        <div className="text-center mt-8 p-6 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-xl">
          <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">
            Net Pay: {formatCurrency(netPay)}
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 font-semibold">
            Amount transferred to account on {lastDay}th {monthName}.
          </p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
            Gross: {formatCurrency(totalEarnings)} &nbsp;|&nbsp; Deductions: {formatCurrency(totalDeductions)}
          </p>
        </div>

        {/* Print Footer */}
        <div className="hidden print:flex justify-between text-xs text-gray-400 mt-8 border-t pt-4">
          <span>Generated by Dayflow HRMS — Confidential</span>
          <span>This is a computer-generated payslip. No signature required.</span>
        </div>
      </div>
    </div>
  );
};
