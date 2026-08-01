import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, QrCode, FileText, UserCheck, Settings, Users, BookOpen, Layers, Camera } from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role || 'student';

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/reports', label: 'Attendance Reports', icon: FileText },
    { to: '/profile', label: 'User Management', icon: Users },
  ];

  const facultyLinks = [
    { to: '/faculty', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/reports', label: 'Subject Reports', icon: FileText },
    { to: '/profile', label: 'Profile Settings', icon: Settings },
  ];

  const studentLinks = [
    { to: '/student', label: 'My Dashboard', icon: LayoutDashboard },
    { to: '/reports', label: 'Attendance Log', icon: FileText },
    { to: '/profile', label: 'Student Profile', icon: Settings },
  ];

  const navItems = role === 'admin' ? adminLinks : role === 'faculty' ? facultyLinks : studentLinks;

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-1">
        <p className="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Navigation</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/60 rounded-xl border border-blue-100 dark:border-slate-700 text-xs">
          <p className="font-semibold text-blue-900 dark:text-blue-300">Role Active: {role.toUpperCase()}</p>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Smart Attendance v2.4 (JWT Protected)</p>
        </div>
      </div>
    </aside>
  );
}
