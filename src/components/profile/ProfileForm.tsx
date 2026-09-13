'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Building, DollarSign, FileText, FileSpreadsheet, Lock, ChevronRight, Edit2, CheckCircle2, ChevronDown, Calendar, BedIcon } from 'lucide-react';
import { createEmployee, updateEmployee, resetEmployeePassword } from '@/app/actions/employee';

export default function ProfileForm({ user, isAdmin = false, leaveBalance, isOwnProfile = true }: { 
  user?: any, 
  isAdmin?: boolean,
  leaveBalance?: { paidTimeOff: number; sickTimeOff: number } | null,
  isOwnProfile?: boolean
}) {
  const [isEditing, setIsEditing] = useState(!user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  
  // Advanced sections toggles
  const [showSecurity, setShowSecurity] = useState(false);
  const [showSalary, setShowSalary] = useState(false);
  const [showResume, setShowResume] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Salary State
  const [wage, setWage] = useState(user?.salary || 0);

  // Computed Salary Components
  const basic = wage * 0.5;
  const hra = basic * 0.5;
  const stdAllowance = 4167;
  const perfBonus = wage * 0.0833;
  const lta = wage * 0.08333;
  const pf = basic * 0.12;
  const pt = 200;
  const totalCalculated = basic + hra + stdAllowance + perfBonus + lta;
  const isDeficit = wage > 0 && totalCalculated > wage;
  const fixedAllowance = Math.max(0, wage - totalCalculated);

  async function handleRegeneratePassword() {
    if (!user?.id || !isAdmin) return;
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const res = await resetEmployeePassword(user.id);
      if (res.success) {
        setSuccessMessage(`Temporary password regenerated: ${res.password}`);
      } else {
        setErrorMessage(res.error || 'Failed to regenerate password.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      // Check if this is a security form submission (we can pass a hidden field)
      const formType = formData.get('formType');

      if (formType === 'security') {
        const { changePassword } = await import('@/app/actions/security');
        const res = await changePassword(formData);
        if (res.success) {
          setSuccessMessage('Password changed! Please log in again.');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          setErrorMessage(res.error || 'Password change failed');
        }
        return;
      }

      if (user?.id) {
        // Update
        const res = await updateEmployee(user.id, formData);
        if (res.success) {
          setSuccessMessage('Profile updated successfully!');
          setIsEditing(false);
        } else {
          setErrorMessage(res.error || 'Update failed');
        }
      } else {
        // Create
        const res = await createEmployee(formData);
        if (res.success) {
          const emailMsg = res.emailSent ? 'Email sent!' : 'Email failed.';
          setSuccessMessage(`Employee created! ID: ${res.employee?.loginId} | Pass: ${res.password} | ${emailMsg}`);
          setIsEditing(false);
        } else {
          setErrorMessage(res.error || 'Creation failed');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown';

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto pb-10">
      
      {/* Toast Messages */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg font-medium z-50 animate-in slide-in-from-right">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg font-medium z-50 animate-in slide-in-from-right">
          {errorMessage}
        </div>
      )}

      {/* Main Profile Form wrapper (since we have one big form for the whole profile update) */}
      <div className="flex flex-col gap-6">
      <form id="profile-form" action={handleSubmit} className="hidden">
        <input type="hidden" name="formType" value="profile" />
        <input type="hidden" name="profilePicture" value={profilePicture} />
      </form>
        <input type="hidden" name="formType" value="profile" />
        <input type="hidden" name="profilePicture" value={profilePicture} />
        
        {/* Full-width Profile Header Banner */}
        <div className="w-full bg-[#252525] rounded-[24px] overflow-hidden relative shadow-sm h-[140px] flex items-center px-8 border border-[#252525]">
          {/* Abstract background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#252525] via-[#171717] to-[#252525] opacity-80"></div>
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-primary text-black/20 rounded-full blur-[60px]"></div>
          
          <div className="relative z-10 flex items-center w-full justify-between">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-[88px] h-[88px] rounded-full bg-primary/20 flex items-center justify-center border-4 border-[#252525] shadow-sm relative overflow-hidden group">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-extrabold text-primary">{user?.name?.charAt(0) || 'U'}</span>
                  )}
                  {isEditing && (
                    <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
                {/* Active Indicator */}
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-[#252525] rounded-full"></div>
              </div>
              
              {/* Info */}
              <div>
                <div className="flex items-center gap-4 mb-1">
                  <h2 className="text-[22px] font-bold text-white tracking-tight">{user?.name || 'New Employee'}</h2>
                  {(isAdmin || isOwnProfile) && (
                    isEditing ? (
                      <button 
                        type="submit" form="profile-form"
                        disabled={isSubmitting}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm transition-colors bg-emerald-500 hover:bg-emerald-600 text-white"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> {isSubmitting ? 'Saving...' : 'Save'}
                      </button>
                    ) : (
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsEditing(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm transition-colors bg-white/10 hover:bg-white/20 text-white border border-white/20"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                      </button>
                    )
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
                  <div className="flex items-center text-gray-300">
                    <span className="font-semibold">{user?.jobTitle || 'No Title'}</span>
                    <span className="mx-2 opacity-50">•</span>
                    <span>{user?.department || 'No Dept'}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Briefcase className="w-4 h-4 mr-2 opacity-70" />
                    <span>Employee ID</span>
                    <span className="ml-2 font-bold text-white">{user?.loginId || 'Pending'}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-4 h-4 mr-2 opacity-70" />
                    <span>Member since</span>
                    <span className="ml-2 font-bold text-white">{joinDate}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quote / Extra decorative text on right */}
            <div className="hidden lg:block text-right max-w-xs pl-8 border-l border-white/10">
              <p className="text-[14px] italic font-medium text-white/90 leading-tight">
                "Better processes.<br/>Happier people."
              </p>
              <div className="w-6 h-0.5 bg-primary rounded-full my-2 ml-auto"></div>
              <p className="text-[11px] text-gray-400 font-medium">Building a better workplace together.</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout Below Banner */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT COLUMN */}
          <div className="lg:w-[400px] flex flex-col gap-6 shrink-0">
            
            {/* Contact Information Card */}
            <div className="bg-white rounded-[24px] p-6 border border-border shadow-sm relative">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-[14px] font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Contact Information
                </h3>
                {isEditing && (
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Editing</span>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email Address</p>
                    <p className="text-[13px] font-medium text-gray-900 truncate max-w-[250px]">{user?.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Phone Number</p>
                    <p className="text-[13px] font-medium text-gray-900">{user?.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Address</p>
                    <p className="text-[13px] font-medium text-gray-900 leading-tight pr-4">{user?.address || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Organization</p>
                    <p className="text-[13px] font-medium text-gray-900">Employa HR</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Off Balance Card */}
            {(isAdmin || isOwnProfile) && (
              <div className="bg-white rounded-[24px] p-6 border border-border shadow-sm relative">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-[14px] font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" /> Time Off Balance
                  </h3>
                  <a href="/time-off" className="text-[12px] font-bold text-primary hover:text-primary">View All</a>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#f8f9fc] rounded-xl p-4 border border-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <p className="text-[12px] font-bold text-gray-900">Paid Time Off</p>
                    </div>
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-[24px] font-extrabold text-primary leading-none">{leaveBalance?.paidTimeOff ?? 24}</span>
                      <span className="text-[11px] font-bold text-primary">Days</span>
                    </div>
                    <div className="w-full h-1.5 bg-primary/20 rounded-full overflow-hidden">
                      <div className="h-full bg-primary text-black rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-50">
                    <div className="flex items-center gap-2 mb-2">
                      <BedIcon className="w-4 h-4 text-emerald-600" />
                      <p className="text-[12px] font-bold text-gray-900">Sick Leave</p>
                    </div>
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-[24px] font-extrabold text-emerald-600 leading-none">{leaveBalance?.sickTimeOff ?? 7}</span>
                      <span className="text-[11px] font-bold text-emerald-400">Days</span>
                    </div>
                    <div className="w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>

                <a href="/time-off" className="flex items-center justify-between p-3 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary">
                      <span className="text-[14px] font-bold">i</span>
                    </div>
                    <p className="text-[12px] font-bold text-black group-hover:text-primary">Need to take time off?</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary" />
                </a>
              </div>
            )}


            {/* Advanced Sections Toggles */}
            <div className="flex flex-col gap-3 mt-2">
              
              {/* Security Settings Accordion */}
              {user && (isAdmin || isOwnProfile) && (
                <div className="bg-white rounded-[24px] border border-border shadow-sm overflow-hidden transition-all">
                  <button 
                    type="button"
                    onClick={() => setShowSecurity(!showSecurity)}
                    className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="text-[14px] font-bold text-gray-900">Security Settings</h3>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showSecurity ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showSecurity && (
                    <div className="p-6 border-t border-gray-50 bg-gray-50/30">
                      {isOwnProfile ? (
                        <div className="max-w-md">
                          <h4 className="text-[13px] font-bold text-gray-900 mb-4">Change Password</h4>
                          <form action={handleSubmit} className="space-y-4">
                            <input type="hidden" name="formType" value="security" />
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Current Password</label>
                              <input type="password" name="currentPassword" required className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-[13px] focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-1.5">New Password</label>
                              <input type="password" name="newPassword" required minLength={6} className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-[13px] focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Confirm New Password</label>
                              <input type="password" name="confirmPassword" required minLength={6} className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-[13px] focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <button type="submit" disabled={isSubmitting} className="mt-2 px-6 py-2.5 bg-gray-900 text-white text-[13px] font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-50">
                              Update Password
                            </button>
                          </form>
                        </div>
                      ) : (
                        isAdmin && (
                          <div className="space-y-4">
                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex flex-col items-start">
                              <h4 className="text-[13px] font-bold text-amber-900 mb-1">Regenerate Temporary Password</h4>
                              <p className="text-[12px] text-amber-800 mb-3">Revokes current password and generates a 24-hour temporary one.</p>
                              <button type="button" onClick={handleRegeneratePassword} disabled={isSubmitting} className="px-5 py-2 bg-white text-amber-700 text-[12px] font-bold rounded-lg border border-amber-200 hover:bg-amber-50">
                                Regenerate Password
                              </button>
                            </div>
                            <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex flex-col items-start">
                              <h4 className="text-[13px] font-bold text-red-900 mb-1">Terminate Employee</h4>
                              <p className="text-[12px] text-red-800 mb-3">Revokes access immediately. Historical data is preserved.</p>
                              <button type="button" disabled={isSubmitting} onClick={async () => {
                                if(confirm('Are you sure?')) {
                                  // Termination logic
                                }
                              }} className="px-5 py-2 bg-red-600 text-white text-[12px] font-bold rounded-lg hover:bg-red-700">
                                Terminate Employee
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Resume Accordion */}
              {(isAdmin || isOwnProfile) && (
                <div className="bg-white rounded-[24px] border border-border shadow-sm overflow-hidden transition-all">
                  <button 
                    type="button"
                    onClick={() => setShowResume(!showResume)}
                    className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="text-[14px] font-bold text-gray-900">Documents & Resume</h3>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showResume ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showResume && (
                    <div className="p-6 border-t border-gray-50 bg-gray-50/30">
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-white hover:border-primary transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="text-[14px] font-bold text-gray-900 mb-1">Upload Resume</h4>
                        <p className="text-[12px] font-medium text-gray-500 mb-4">PDF, DOCX up to 5MB</p>
                        <button type="button" className="px-5 py-2 bg-white border border-border rounded-lg text-[12px] font-bold text-gray-700 shadow-sm hover:bg-gray-50">Select File</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Salary Accordion (Admin Only) */}
              {isAdmin && (
                <div className="bg-white rounded-[24px] border border-border shadow-sm overflow-hidden transition-all">
                  <button 
                    type="button"
                    onClick={() => setShowSalary(!showSalary)}
                    className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h3 className="text-[14px] font-bold text-gray-900">Salary Configuration</h3>
                      <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md">Admin</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showSalary ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showSalary && (
                    <div className="p-6 border-t border-gray-50 bg-gray-50/30">
                       <div className="max-w-xs mb-6">
                          <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Base Monthly Wage (₹)</label>
                          <input 
                            type="number" 
                            name="salary" form="profile-form"
                            value={wage}
                            onChange={(e) => setWage(Number(e.target.value))}
                            className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-[14px] font-bold focus:ring-2 focus:ring-primary outline-none" 
                          />
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4 text-[13px]">
                          <div className="bg-white p-4 rounded-xl border border-border">
                             <p className="font-bold text-gray-900 mb-3 border-b border-gray-50 pb-2">Earnings</p>
                             <div className="flex justify-between py-1"><span className="text-gray-500">Basic</span><span className="font-medium">₹{basic.toFixed(0)}</span></div>
                             <div className="flex justify-between py-1"><span className="text-gray-500">HRA</span><span className="font-medium">₹{hra.toFixed(0)}</span></div>
                             <div className="flex justify-between py-1"><span className="text-gray-500">Bonus</span><span className="font-medium">₹{perfBonus.toFixed(0)}</span></div>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-border">
                             <p className="font-bold text-gray-900 mb-3 border-b border-gray-50 pb-2">Deductions & Net</p>
                             <div className="flex justify-between py-1"><span className="text-gray-500">PF</span><span className="font-medium text-red-500">-₹{pf.toFixed(0)}</span></div>
                             <div className="flex justify-between py-1"><span className="text-gray-500">Tax</span><span className="font-medium text-red-500">-₹{pt.toFixed(0)}</span></div>
                             <div className="flex justify-between py-1 mt-2 border-t border-gray-50 pt-2"><span className="font-bold text-gray-900">Take Home</span><span className="font-bold text-emerald-600">₹{(wage - pf - pt).toFixed(0)}</span></div>
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Personal Information */}
            <div className="bg-white rounded-[24px] p-6 border border-border shadow-sm relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[14px] font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Personal Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Full Name</label>
                  <input type="text" name="name" form="profile-form" required disabled={!isEditing || (!isAdmin && user)} defaultValue={user?.name} className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-primary focus:border-primary disabled:text-gray-600 text-gray-900 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Email Address</label>
                  <input type="email" name="email" form="profile-form" required disabled={!isEditing || (!isAdmin && user)} defaultValue={user?.email} className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-primary focus:border-primary disabled:text-gray-600 text-gray-900 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Phone Number</label>
                  <input type="tel" name="phone" form="profile-form" disabled={!isEditing} defaultValue={user?.phone} className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-primary focus:border-primary disabled:text-gray-600 text-gray-900 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Address</label>
                  <input type="text" name="address" form="profile-form" disabled={!isEditing} defaultValue={user?.address} className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-primary focus:border-primary disabled:text-gray-600 text-gray-900 outline-none transition-all" />
                </div>
                {(isAdmin || isOwnProfile) && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1.5">PAN No</label>
                      <input type="text" name="panNo" form="profile-form" disabled={!isEditing} defaultValue={user?.panNo} placeholder="—" className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-primary focus:border-primary disabled:text-gray-600 text-gray-900 outline-none transition-all placeholder:text-gray-400" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1.5">UAN No</label>
                      <input type="text" name="uanNo" form="profile-form" disabled={!isEditing} defaultValue={user?.uanNo} placeholder="—" className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-primary focus:border-primary disabled:text-gray-600 text-gray-900 outline-none transition-all placeholder:text-gray-400" />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-[24px] p-6 border border-border shadow-sm relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[14px] font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" /> Job Details
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Job Title</label>
                  <input type="text" name="jobTitle" form="profile-form" disabled={!isEditing || !isAdmin} defaultValue={user?.jobTitle} className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-primary focus:border-primary disabled:text-gray-600 text-gray-900 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Department</label>
                  <input type="text" name="department" form="profile-form" disabled={!isEditing || !isAdmin} defaultValue={user?.department} className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-primary focus:border-primary disabled:text-gray-600 text-gray-900 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Employee ID</label>
                  <input type="text" disabled defaultValue={user?.loginId || 'Pending'} className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-[13px] font-medium text-gray-600 outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Joining Date</label>
                  <input type="text" disabled defaultValue={joinDate} className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-[13px] font-medium text-gray-600 outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5">Reporting Manager</label>
                  <input type="text" disabled defaultValue="—" className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-[13px] font-medium text-gray-600 outline-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
