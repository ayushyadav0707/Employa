'use client';

import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { updateMonthlyWage } from '@/app/actions/payroll';

interface AdminPayrollControlProps {
  user: any;
}

export const AdminPayrollControl: React.FC<AdminPayrollControlProps> = ({ user }) => {
  const [salary, setsalary] = useState(user?.salary || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [tempWage, setTempWage] = useState(salary);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (tempWage <= 0) {
      setError('Monthly wage must be a positive number.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await updateMonthlyWage(user.id, tempWage);
      setsalary(tempWage);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the wage.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempWage(salary);
    setIsEditing(false);
    setError(null);
  };

  if (!user || !user.payrollConfig) {
    return (
      <div className="p-6 bg-yellow-50 text-yellow-800 rounded-lg">
        No payroll configuration found for this user.
      </div>
    );
  }

  const { payrollConfig } = user;

  // Live preview: compute all components from tempWage when editing
  const previewWage = isEditing ? tempWage : salary;
  const basic = previewWage * (payrollConfig.basicSalaryPercent / 100);
  const hra = basic * (payrollConfig.hraPercent / 100);
  const standard = basic * (payrollConfig.standardAllowPercent / 100);
  const bonus = basic * (payrollConfig.perfBonusPercent / 100);
  const lta = basic * (payrollConfig.travelAllowPercent / 100);
  const fixed = previewWage - (basic + hra + standard + bonus + lta);
  const pf = basic * (payrollConfig.pfPercent / 100);
  const profTax = payrollConfig.profTax;
  const netPay = previewWage - pf - profTax;

  const fmt = (n: number) =>
    `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Page heading */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 dark:text-zinc-100">
          Payroll Administration
        </h3>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
          Update base wages. All salary components auto-recalculate per the dynamic rules below.
          <br />
          <span className="text-xs text-indigo-500 font-medium">
            SVG Rule: "Salary component values should auto-update when the wage amount changes. The total of all components must not exceed the defined Wage."
          </span>
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Employee Payroll Row */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 dark:text-zinc-100 mb-4">
          Employee Payroll — Base Wage Control
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
            <thead className="bg-gray-50 dark:bg-zinc-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Monthly Base Wage</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Yearly Wage</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white font-mono">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-zinc-300">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">
                  {isEditing ? (
                    <input
                      type="number"
                      min={1}
                      required
                      className="px-3 py-1.5 border border-indigo-400 dark:border-indigo-600 rounded-lg bg-white dark:bg-zinc-950 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40"
                      value={tempWage}
                      onChange={(e) => setTempWage(Number(e.target.value))}
                    />
                  ) : (
                    fmt(salary)
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                  {fmt(previewWage * 12)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button
                        className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition-colors disabled:opacity-60"
                        onClick={handleSave}
                        disabled={isSaving}
                        title="Save"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors disabled:opacity-60"
                        onClick={handleCancel}
                        disabled={isSaving}
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700/50 text-gray-700 dark:text-zinc-300 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 size={12} /> Edit Wage
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Live calculation preview */}
        <div className="mt-6 p-5 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800/30 rounded-xl">
          <h4 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 mb-3">
            {isEditing ? '⚡ Live Preview — Salary Breakdown at ' + fmt(tempWage) : '📊 Current Salary Breakdown'}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            {[
              { label: 'Basic Salary', value: basic, rule: `${payrollConfig.basicSalaryPercent}% of wage` },
              { label: 'HRA', value: hra, rule: `${payrollConfig.hraPercent}% of basic` },
              { label: 'Standard Allowance', value: standard, rule: `${payrollConfig.standardAllowPercent}% of basic` },
              { label: 'Performance Bonus', value: bonus, rule: `${payrollConfig.perfBonusPercent}% of basic` },
              { label: 'LTA', value: lta, rule: `${payrollConfig.travelAllowPercent}% of basic` },
              { label: 'Fixed Allowance', value: fixed, rule: 'Wage − all others' },
            ].map(({ label, value, rule }) => (
              <div key={label} className="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-gray-200 dark:border-zinc-700">
                <p className="text-xs text-gray-500 dark:text-zinc-400">{label}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{fmt(value)}</p>
                <p className="text-xs text-indigo-500 dark:text-indigo-400">{rule}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm pt-3 border-t border-indigo-200 dark:border-indigo-800/30">
            <span className="text-red-600 dark:text-red-400 font-semibold">
              PF Deduction: {fmt(pf)}
            </span>
            <span className="text-red-600 dark:text-red-400 font-semibold">
              Prof. Tax: {fmt(profTax)}
            </span>
            <span className="text-green-700 dark:text-green-400 font-bold ml-auto">
              Net Pay: {fmt(netPay)}
            </span>
          </div>
        </div>

        {/* Dynamic calculation rules reference */}
        <div className="mt-6 p-5 bg-gray-50 dark:bg-zinc-700/30 rounded-xl border border-gray-200 dark:border-zinc-700">
          <h4 className="text-sm font-bold text-gray-800 dark:text-zinc-200 mb-3">
            Dynamic Calculation Rules — {user.name}
          </h4>
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-zinc-400 space-y-1.5">
            <li><strong>Basic Salary:</strong> {payrollConfig.basicSalaryPercent}% of Base Monthly Wage</li>
            <li><strong>House Rent Allowance:</strong> {payrollConfig.hraPercent}% of Basic Salary</li>
            <li><strong>Standard Allowance:</strong> {payrollConfig.standardAllowPercent}% of Basic Salary ≈ ₹4,167/mo</li>
            <li><strong>Performance Bonus:</strong> {payrollConfig.perfBonusPercent}% of Basic Salary</li>
            <li><strong>Leave Travel Allowance:</strong> {payrollConfig.travelAllowPercent}% of Basic Salary</li>
            <li><strong>Fixed Allowance:</strong> <span className="text-indigo-600 dark:text-indigo-400">salary − (Basic + HRA + Standard + Bonus + LTA)</span></li>
            <li><strong>Provident Fund (PF) Deduction:</strong> {payrollConfig.pfPercent}% of Basic Salary (employee share)</li>
            <li><strong>Professional Tax Deduction:</strong> ₹{payrollConfig.profTax.toLocaleString()} flat per month</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
