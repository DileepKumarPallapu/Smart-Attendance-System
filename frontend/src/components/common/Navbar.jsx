import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import VelTechLogo from './VelTechLogo';
import { Sun, Moon, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center space-x-3">
        <VelTechLogo className="w-10 h-10" showText={true} />
        <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-bold rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 uppercase tracking-wider border border-red-200 dark:border-red-800">
          {user?.role || 'Portal'}
        </span>
      </div>

      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Notifications dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-50">
              <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-3 flex items-center justify-between">
                <span>Notifications</span>
                <span className="text-xs text-red-600 dark:text-red-400 cursor-pointer">Mark read</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-slate-700/50 border border-red-100 dark:border-slate-600">
                  <p className="font-medium text-slate-800 dark:text-slate-200">Attendance Confirmed</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">CS401 Data Structures marked Present at Vel Tech.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                  <p className="font-medium text-slate-800 dark:text-slate-200">Upcoming QR Class</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">CS402 Database session starts at 11:00 AM.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & User Dropdown */}
        <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-800 pl-3 md:pl-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
            alt="Avatar"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-red-500/30"
          />
          <div className="hidden lg:block text-left">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
