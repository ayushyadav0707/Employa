'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Building, DollarSign, FileText, FileSpreadsheet, Lock } from 'lucide-react';
import { createEmployee, updateEmployee } from '@/app/actions/employee';

export default function ProfileForm({ user, isAdmin = false, leaveBalance }: { 
  user?: any, 
  isAdmin?: boolean,
  leaveBalance?: { paidTimeOff: number; sickTimeOff: number } | null
}) {
  const [isEditing, setIsEditing] = useState(!user);
  const [activeTab, setActiveTab] = useState<'private' | 'resume' | 'salary'>('private');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert to base64 for local storage without a dedicated blob server
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
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
  
  // Calculate total additions before fixed allowance
  const totalCalculated = basic + hra + stdAllowance + perfBonus + lta;
  const isDeficit = wage > 0 && totalCalculated > wage;
  const fixedAllowance = Math.max(0, wage - totalCalculated);

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
          setSuccessMessage(`Employee created! ID: ${res.employee?.loginId} | Password: ${res.password}`);
          setIsEditing(false);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg font-medium z-50 animate-in slide-in-from-right">
          {successMessage}
        </div>
      )}
      
      {/* Profile Sidebar */}
      <div className="lg:w-1/3 space-y-6">
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-8 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-500 to-purple-600"></div>
          
          <div className="h-32 w-32 rounded-full bg-white p-1 shadow-md relative z-10 mt-6 mb-5">
            <div className="h-full w-full rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-4xl overflow-hidden relative group">
              {profilePicture ? (
                <img src={profilePicture} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
              {isEditing && (
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-semibold">Upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-center">{user?.name || 'New Employee'}</h2>
          <p className="text-sm font-medium text-indigo-600 mt-1 mb-4">{user?.jobTitle || 'No Title'} • {user?.department || 'No Dept'}</p>
          
          {user?.loginId && (
            <div className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl text-center w-full mb-6">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Employee ID</p>
              <p className="text-sm font-mono font-bold text-gray-700">{user.loginId}</p>
            </div>
          )}
          
          {!user && (
            <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl text-center w-full mb-6">
              <p className="text-xs font-medium text-amber-800">ID & Password will be auto-generated</p>
            </div>
          )}

          <div className="w-full space-y-4 pt-6 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-3 text-gray-400" />
              <span className="truncate">{user?.email || 'No email provided'}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-3 text-gray-400" />
              <span>{user?.phone || 'No phone provided'}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-3 text-gray-400" />
              <span className="truncate">{user?.address || 'No address provided'}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Building className="w-4 h-4 mr-3 text-gray-400" />
              <span>Employa HR</span>
            </div>
          </div>
        </div>

        {/* Time Off Tracker Widget */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-5 flex items-center">
            Time Off Balance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-end p-4 bg-indigo-50/50 rounded-xl border border-indigo-50">
              <div>
                <p className="text-xs font-semibold text-indigo-900 uppercase tracking-wider mb-1">Paid Time Off</p>
                <div className="flex items-baseline">
                  <span className="text-2xl font-black text-indigo-600">{leaveBalance?.paidTimeOff ?? 24}</span>
                  <span className="text-xs font-medium text-indigo-400 ml-1">Days</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-end p-4 bg-emerald-50/50 rounded-xl border border-emerald-50">
              <div>
                <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-1">Sick Leave</p>
                <div className="flex items-baseline">
                  <span className="text-2xl font-black text-emerald-600">{leaveBalance?.sickTimeOff ?? 7}</span>
                  <span className="text-xs font-medium text-emerald-400 ml-1">Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:w-2/3">
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden h-full">
          
          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-6 pt-6 gap-6 bg-gray-50/30">
            <button 
              type="button"
              onClick={() => setActiveTab('private')}
              className={`pb-4 text-sm font-bold tracking-tight transition-all relative ${activeTab === 'private' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Private Info
              {activeTab === 'private' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('resume')}
              className={`pb-4 text-sm font-bold tracking-tight transition-all relative ${activeTab === 'resume' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Resume
              {activeTab === 'resume' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
            </button>
            {isAdmin && (
              <button 
                type="button"
                onClick={() => setActiveTab('salary')}
                className={`pb-4 text-sm font-bold tracking-tight transition-all relative ${activeTab === 'salary' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Salary Info
                {activeTab === 'salary' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
              </button>
            )}
          </div>

          <div className="p-8">
            <form action={handleSubmit} className="space-y-8">
              <input type="hidden" name="profilePicture" value={profilePicture} />
              
              {/* PRIVATE INFO TAB */}
              {activeTab === 'private' && (
                <div className="animate-in fade-in duration-500">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center">
                      <User className="w-5 h-5 mr-2 text-indigo-500" /> Personal Information
                    </h3>
                    <button 
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isEditing ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                    >
                      {isEditing ? 'Cancel Editing' : 'Edit Information'}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                      <input type="text" name="name" disabled={!isEditing || (!isAdmin && user)} defaultValue={user?.name} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 bg-white transition-shadow outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input type="email" name="email" disabled={!isEditing || (!isAdmin && user)} defaultValue={user?.email} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 bg-white transition-shadow outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                      <input type="tel" name="phone" disabled={!isEditing} defaultValue={user?.phone} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 bg-white transition-shadow outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Address</label>
                      <input type="text" name="address" disabled={!isEditing} defaultValue={user?.address} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 bg-white transition-shadow outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">PAN No</label>
                      <input type="text" name="panNo" disabled={!isEditing} defaultValue={user?.panNo} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 bg-white transition-shadow outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">UAN No</label>
                      <input type="text" name="uanNo" disabled={!isEditing} defaultValue={user?.uanNo} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 bg-white transition-shadow outline-none" />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center mb-6">
                      <Briefcase className="w-5 h-5 mr-2 text-indigo-500" /> Job Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Job Title</label>
                        <input type="text" name="jobTitle" disabled={!isEditing || !isAdmin} defaultValue={user?.jobTitle} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 bg-white transition-shadow outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Department</label>
                        <input type="text" name="department" disabled={!isEditing || !isAdmin} defaultValue={user?.department} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 bg-white transition-shadow outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* RESUME TAB */}
              {activeTab === 'resume' && (
                <div className="animate-in fade-in duration-500">
                   <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-indigo-500" /> Documents & Resume
                    </h3>
                  </div>
                  
                  <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-12 text-center bg-indigo-50/30 hover:bg-indigo-50/50 transition-colors group cursor-pointer">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <FileText className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h4 className="text-gray-900 font-bold text-lg tracking-tight mb-1">Upload Resume</h4>
                    <p className="text-sm text-gray-500 mb-6">PDF, DOCX up to 5MB</p>
                    <button type="button" className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-indigo-300 shadow-sm transition-all">Select File</button>
                  </div>
                </div>
              )}

              {/* SALARY INFO TAB (Admin Only) */}
              {activeTab === 'salary' && isAdmin && (
                <div className="animate-in fade-in duration-500">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-indigo-500" /> Salary Structure Configuration
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      <Lock className="w-3.5 h-3.5 mr-1.5" /> Admin Only Access
                    </span>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <FileSpreadsheet className="w-32 h-32 text-indigo-900" />
                    </div>
                    <div className="relative z-10">
                      <label className="block text-sm font-bold text-indigo-900 uppercase tracking-widest mb-3">Base Monthly Wage (Fixed wage)</label>
                      <div className="relative max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-gray-500 font-medium text-lg">₹</span>
                        </div>
                        <input 
                          type="number" 
                          name="salary"
                          value={wage}
                          onChange={(e) => setWage(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 border border-indigo-200 rounded-xl text-xl font-black text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm outline-none transition-shadow" 
                        />
                      </div>
                      <p className="text-sm font-medium text-indigo-600 mt-3">Adjusting this base wage automatically recalculates all percentage-based components below.</p>
                      
                      {isDeficit && (
                        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start text-amber-800">
                          <div className="mr-3 mt-0.5">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                            </span>
                          </div>
                          <div>
                            <h5 className="text-sm font-bold tracking-tight">Wage Too Low</h5>
                            <p className="text-xs mt-1 font-medium">The entered wage is insufficient to cover the standard fixed components (like Standard Allowance ₹4167). Fixed Allowance is clamped to ₹0.00.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Additions */}
                    <div className="space-y-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <h4 className="font-bold text-gray-900 tracking-tight border-b border-gray-100 pb-3 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Earnings
                      </h4>
                      
                      <div className="flex justify-between items-center py-2">
                        <div>
                          <p className="text-sm font-bold text-gray-800">Basic Salary</p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">50% of Wage</p>
                        </div>
                        <p className="text-base font-bold text-gray-900">₹{basic.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <div>
                          <p className="text-sm font-bold text-gray-800">House Rent Allowance (HRA)</p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">50% of Basic</p>
                        </div>
                        <p className="text-base font-bold text-gray-900">₹{hra.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <div>
                          <p className="text-sm font-bold text-gray-800">Standard Allowance</p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">Fixed Amount</p>
                        </div>
                        <p className="text-base font-bold text-gray-900">₹{stdAllowance.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <div>
                          <p className="text-sm font-bold text-gray-800">Performance Bonus</p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">8.33% of Wage</p>
                        </div>
                        <p className="text-base font-bold text-gray-900">₹{perfBonus.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <div>
                          <p className="text-sm font-bold text-gray-800">Leave Travel Allowance (LTA)</p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">8.333% of Wage</p>
                        </div>
                        <p className="text-base font-bold text-gray-900">₹{lta.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-200">
                        <div>
                          <p className="text-sm font-bold text-gray-800">Fixed Allowance</p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">Remainder</p>
                        </div>
                        <p className="text-base font-bold text-gray-900">₹{fixedAllowance.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2">
                        <p className="text-sm font-black text-gray-900 uppercase tracking-wider">Gross Earnings</p>
                        <p className="text-lg font-black text-gray-900">₹{wage.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div className="space-y-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                      <h4 className="font-bold text-gray-900 tracking-tight border-b border-gray-100 pb-3 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> Deductions
                      </h4>
                      
                      <div className="flex justify-between items-center py-2">
                        <div>
                          <p className="text-sm font-bold text-gray-800">Provident Fund (PF)</p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">12% of Basic</p>
                        </div>
                        <p className="text-base font-bold text-red-600">-₹{pf.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <div>
                          <p className="text-sm font-bold text-gray-800">Professional Tax</p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">Fixed deduction</p>
                        </div>
                        <p className="text-base font-bold text-red-600">-₹{pt.toFixed(2)}</p>
                      </div>
                      
                      <div className="mt-auto pt-8">
                        <div className="flex flex-col bg-gray-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-16 translate-x-8"></div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 relative z-10">Net Take Home Pay</p>
                          <p className="text-3xl font-black text-white relative z-10">₹{(wage - (pf + pt)).toFixed(2)}</p>
                          <p className="text-xs text-gray-400 mt-2 relative z-10">Transferred to bank account monthly</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isEditing && activeTab === 'private' && (
                <div className="flex justify-end pt-8 border-t border-gray-100">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              )}
              {activeTab === 'salary' && isAdmin && (
                <div className="flex justify-end pt-8 border-t border-gray-100">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Update Salary Configuration'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
