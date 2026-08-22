'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Building, DollarSign, FileText, FileSpreadsheet, Lock } from 'lucide-react';
import { createEmployee, updateEmployee } from '@/app/actions/employee';

export default function ProfileForm({ user, isAdmin = false }: { user?: any, isAdmin?: boolean }) {
  const [isEditing, setIsEditing] = useState(!user);
  const [activeTab, setActiveTab] = useState<'private' | 'resume' | 'salary'>('private');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Salary State (mocking wage for reactive calculation)
  const [wage, setWage] = useState(user?.salary || 0);

  // Computed Salary Components
  const basic = wage * 0.5;
  const hra = basic * 0.5;
  const stdAllowance = 4167;
  const perfBonus = wage * 0.0833;
  const lta = wage * 0.08333;
  const pf = basic * 0.12;
  const pt = 200;
  const fixedAllowance = wage - (basic + hra + stdAllowance + perfBonus + lta);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setSuccessMessage('');
    try {
      if (user?.id) {
        // Update
        const res = await updateEmployee(user.id, formData);
        if (res.success) {
          setSuccessMessage('Profile updated successfully!');
          setIsEditing(false);
        }
      } else {
        // Create
        const res = await createEmployee(formData);
        if (res.success) {
          setSuccessMessage(`Employee created! ID: ${res.employee?.employeeId} | Password: ${res.password}`);
          setIsEditing(false);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-5xl relative">
      {successMessage && (
        <div className="absolute top-0 left-0 w-full bg-green-500 text-white text-center py-2 text-sm font-medium z-10 animate-in slide-in-from-top">
          {successMessage}
        </div>
      )}
      <div className="p-6 sm:p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/30 gap-4">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl border-2 border-white shadow-sm overflow-hidden">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0) || 'U'
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name || 'New Employee'}</h2>
            <p className="text-sm text-gray-500">{user?.jobTitle || 'No Title'} • {user?.department || 'No Department'}</p>
            {user?.employeeId && <span className="inline-block mt-1 px-2.5 py-0.5 bg-gray-100 text-xs font-medium text-gray-600 rounded-full">ID: {user.employeeId}</span>}
            {!user && <span className="inline-block mt-1 px-2.5 py-0.5 bg-amber-100 text-xs font-medium text-amber-800 rounded-full">ID & Password will be auto-generated</span>}
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-gray-100/50 p-1 rounded-lg">
          <button 
            type="button"
            onClick={() => setActiveTab('private')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'private' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Private Info
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('resume')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'resume' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Resume
          </button>
          {isAdmin && (
            <button 
              type="button"
              onClick={() => setActiveTab('salary')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'salary' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Salary Info
            </button>
          )}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <form action={handleSubmit} className="space-y-8">
          
          {/* PRIVATE INFO TAB */}
          {activeTab === 'private' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center">
                  <User className="w-4 h-4 mr-2" /> Personal Information
                </h3>
                <button 
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit Info'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" name="name" disabled={!isEditing || (!isAdmin && user)} defaultValue={user?.name} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" name="email" disabled={!isEditing || (!isAdmin && user)} defaultValue={user?.email} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" name="phone" disabled={!isEditing} defaultValue={user?.phone} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" name="address" disabled={!isEditing} defaultValue={user?.address} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN No</label>
                  <input type="text" name="panNo" disabled={!isEditing} defaultValue={user?.panNo} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UAN No</label>
                  <input type="text" name="uanNo" disabled={!isEditing} defaultValue={user?.uanNo} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 bg-white" />
                </div>
              </div>

              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mt-8 mb-6 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" /> Job Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input type="text" name="jobTitle" disabled={!isEditing || !isAdmin} defaultValue={user?.jobTitle} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input type="text" name="department" disabled={!isEditing || !isAdmin} defaultValue={user?.department} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 text-gray-900 bg-white" />
                </div>
              </div>
            </div>
          )}

          {/* RESUME TAB */}
          {activeTab === 'resume' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center">
                  <FileText className="w-4 h-4 mr-2" /> Documents & Resume
                </h3>
              </div>
              
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-gray-900 font-medium">Upload Resume</h4>
                <p className="text-sm text-gray-500 mb-4">PDF, DOCX up to 5MB</p>
                <button type="button" className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Select File</button>
              </div>
            </div>
          )}

          {/* SALARY INFO TAB (Admin Only) */}
          {activeTab === 'salary' && isAdmin && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" /> Salary Structure Configuration
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <Lock className="w-3 h-3 mr-1" /> Admin Only
                </span>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-8">
                <label className="block text-sm font-medium text-indigo-900 mb-2">Base Wage (Fixed wage)</label>
                <div className="relative max-w-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <input 
                    type="number" 
                    name="salary"
                    value={wage}
                    onChange={(e) => setWage(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 border border-indigo-200 rounded-lg text-lg font-bold text-indigo-900 focus:ring-indigo-500 focus:border-indigo-500 bg-white" 
                  />
                </div>
                <p className="text-xs text-indigo-600 mt-2">Adjusting this wage will automatically recalculate all components below based on fixed percentages.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Additions */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Salary Components (Earnings)</h4>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Basic</p>
                      <p className="text-xs text-gray-500">50% of Wage</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">₹{basic.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">House Rent Allowance (HRA)</p>
                      <p className="text-xs text-gray-500">50% of Basic</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">₹{hra.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Standard Allowance</p>
                      <p className="text-xs text-gray-500">Fixed Amount</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">₹{stdAllowance.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Performance Bonus</p>
                      <p className="text-xs text-gray-500">8.33% of Wage</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">₹{perfBonus.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Leave Travel Allowance (LTA)</p>
                      <p className="text-xs text-gray-500">8.333% of Wage</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">₹{lta.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Fixed Allowance</p>
                      <p className="text-xs text-gray-500">Remaining Amount (Wage - Total)</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">₹{fixedAllowance.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                    <p className="text-sm font-bold text-gray-900">Total Earnings</p>
                    <p className="text-sm font-bold text-gray-900">₹{wage.toFixed(2)}</p>
                  </div>
                </div>

                {/* Deductions */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Tax Deductions</h4>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Provident Fund (PF) Contribution</p>
                      <p className="text-xs text-gray-500">Employer 12% of Basic</p>
                    </div>
                    <p className="text-sm font-semibold text-red-600">-₹{pf.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Professional Tax</p>
                      <p className="text-xs text-gray-500">Deducted from Gross Salary</p>
                    </div>
                    <p className="text-sm font-semibold text-red-600">-₹{pt.toFixed(2)}</p>
                  </div>
                  
                  <div className="mt-8 pt-8">
                    <div className="flex justify-between items-center bg-indigo-600 text-white p-4 rounded-xl shadow-sm">
                      <p className="text-sm font-medium text-indigo-100">Net Take Home Pay</p>
                      <p className="text-xl font-bold text-white">₹{(wage - (pf + pt)).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isEditing && activeTab === 'private' && (
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
              <button 
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm"
              >
                Save Profile Changes
              </button>
            </div>
          )}
          {activeTab === 'salary' && isAdmin && (
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
              <button 
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm"
              >
                Update Salary Configurations
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
