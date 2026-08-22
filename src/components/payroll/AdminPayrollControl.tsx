'use client';

import React, { useState } from 'react';
import { Edit2, Save, X, User } from 'lucide-react';
import { updateMonthlyWage } from '@/app/actions/payroll';

interface PayrollUser {
  id: string;
  name: string;
  loginId: string;
  jobTitle: string | null;
  department: string | null;
  salary: number | null;
}

interface AdminPayrollControlProps {
  user: any;
  allUsers?: PayrollUser[] | null;
}

// Salary breakdown calculated from flat wage
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
  const netPay = wage - pf - profTax;
  return { basic, hra, standard, bonus, lta, fixed, pf, profTax, netPay };
}

const fmt = (n: number) =>
  `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function EmployeePayrollRow({ emp }: { emp: PayrollUser }) {
  const [salary, setSalary] = useState(emp.salary ?? 50000);
  const [isEditing, setIsEditing] = useState(false);
  const [tempWage, setTempWage] = useState(salary);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const handleSave = async () => {
    if (tempWage <= 0) { setError('Monthly wage must be a positive number.'); return; }
    setIsSaving(true); setError(null);
    try {
      await updateMonthlyWage(emp.id, tempWage);
      setSalary(tempWage);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update wage.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => { setTempWage(salary); setIsEditing(false); setError(null); };
  const breakdown = calcBreakdown(isEditing ? tempWage : salary);

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold text-gray-700">{emp.loginId}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm mr-3">
              {emp.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{emp.name}</div>
              <div className="text-xs text-gray-500">{emp.department || 'No Dept'}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
          {isEditing ? (
            <input
              type="number" min={1} required
              className="px-3 py-1.5 border border-indigo-400 rounded-lg bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40"
              value={tempWage}
              onChange={(e) => setTempWage(Number(e.target.value))}
            />
          ) : ( fmt(salary) )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fmt((isEditing ? tempWage : salary) * 12)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">{fmt(breakdown.netPay)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          {isEditing ? (
            <div className="flex gap-2">
              <button className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition-colors disabled:opacity-60" onClick={handleSave} disabled={isSaving} title="Save">
                <Save size={14} />
              </button>
              <button className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors" onClick={handleCancel} disabled={isSaving} title="Cancel">
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold shadow-sm transition-colors" onClick={() => setIsEditing(true)}>
                <Edit2 size={12} /> Edit
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors" onClick={() => setShowBreakdown(!showBreakdown)}>
                {showBreakdown ? 'Hide' : 'View'} Breakdown
              </button>
            </div>
          )}
        </td>
      </tr>
      {error && (
        <tr>
          <td colSpan={6} className="px-6 py-2">
            <div className="text-red-600 text-xs font-medium bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>
          </td>
        </tr>
      )}
      {showBreakdown && !isEditing && (
        <tr className="bg-indigo-50/50">
          <td colSpan={6} className="px-6 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              {[
                { label: 'Basic (50%)', value: breakdown.basic },
                { label: 'HRA (50% of basic)', value: breakdown.hra },
                { label: 'Standard Allowance', value: breakdown.standard },
                { label: 'Performance Bonus', value: breakdown.bonus },
                { label: 'LTA', value: breakdown.lta },
                { label: 'Fixed Allowance', value: breakdown.fixed },
                { label: 'PF Deduction (−)', value: breakdown.pf, neg: true },
                { label: 'Prof. Tax (−)', value: breakdown.profTax, neg: true },
              ].map(({ label, value, neg }) => (
                <div key={label} className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className={`text-sm font-bold ${neg ? 'text-red-600' : 'text-gray-900'}`}>{neg ? '−' : ''}{fmt(value as number)}</p>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export const AdminPayrollControl: React.FC<AdminPayrollControlProps> = ({ user, allUsers }) => {
  const users = allUsers ?? (user ? [user] : []);

  if (users.length === 0) {
    return (
      <div className="p-6 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
        No employees found in the system.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800">Payroll Administration</h3>
        <p className="text-sm text-gray-500 mt-1">
          Update base wages for all employees. Salary components (Basic, HRA, PF, etc.) auto-recalculate from each employee's monthly wage.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" />
            All Employees — {users.length} total
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Monthly Wage</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Annual Wage</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Net Take-home</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(emp => <EmployeePayrollRow key={emp.id} emp={emp} />)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary calculation rules reference */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h4 className="text-sm font-bold text-gray-800 mb-3">Standard Salary Calculation Rules (Applied to All Employees)</h4>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1.5">
          <li><strong>Basic Salary:</strong> 50% of Base Monthly Wage</li>
          <li><strong>HRA:</strong> 50% of Basic Salary</li>
          <li><strong>Standard Allowance:</strong> ₹4,167 fixed/month</li>
          <li><strong>Performance Bonus:</strong> 8.33% of Wage</li>
          <li><strong>LTA:</strong> 8.333% of Wage</li>
          <li><strong>Fixed Allowance:</strong> Wage − (Basic + HRA + Standard + Bonus + LTA)</li>
          <li><strong>PF Deduction:</strong> 12% of Basic (employee share)</li>
          <li><strong>Professional Tax:</strong> ₹200 flat/month</li>
        </ul>
      </div>
    </div>
  );
};
