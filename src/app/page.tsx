import React from 'react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-900 dark:text-white">
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-indigo-500/20">
          D
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Dayflow HRMS</h1>
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mt-1">
          Strict Odoo Hackathon 2026 Architecture & CI/CD Pipeline
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
          Core repository foundation with Prisma ORM, SQLite DB, Custom JWT Authentication, and automated GitHub Actions CI/CD validation.
        </p>
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-left text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">Dev 1</span>
            <span className="text-[11px] text-slate-500">Auth & UI Core</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">Dev 2</span>
            <span className="text-[11px] text-slate-500">Employee Directory</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">Dev 3</span>
            <span className="text-[11px] text-slate-500">Attendance Engine</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">Dev 4</span>
            <span className="text-[11px] text-slate-500">Leave & Payroll</span>
          </div>
        </div>
      </div>
    </main>
  );
}
