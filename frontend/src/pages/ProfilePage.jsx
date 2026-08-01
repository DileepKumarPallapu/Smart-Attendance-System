import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Phone, Key, Save, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setSuccessMsg('Password updated successfully!');
    setOldPassword('');
    setNewPassword('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Account & Security Profile</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage user identity credentials, role permissions & security settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="glass-card p-6 flex flex-col items-center text-center">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-500/20 mb-4"
          />
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">{user?.name || 'System User'}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{user?.email}</p>

          <div className="mt-4 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs font-extrabold uppercase tracking-wider">
            Role: {user?.role || 'Portal'}
          </div>

          <div className="mt-6 w-full pt-4 border-t border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Department:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{user?.department || 'CSE'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Class / ID:</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{user?.rollNumber || user?.employeeId || 'SYS-001'}</span>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="glass-card p-6 md:col-span-2 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center space-x-2">
            <Key className="w-4 h-4 text-blue-600" />
            <span>Reset Security Password</span>
          </h3>

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handlePasswordReset} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Current Password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Update Password</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
