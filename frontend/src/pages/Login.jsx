import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import VelTechLogo from '../components/common/VelTechLogo';
import { Lock, Mail, Shield, UserCheck, GraduationCap, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res?.success) {
      if (res.role === 'admin') navigate('/admin');
      else if (res.role === 'faculty') navigate('/faculty');
      else navigate('/student');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleDemoLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    const res = await login(demoEmail, demoPass);
    if (res?.success) {
      if (res.role === 'admin') navigate('/admin');
      else if (res.role === 'faculty') navigate('/faculty');
      else navigate('/student');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl z-10">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-3">
            <VelTechLogo className="w-16 h-16" showText={false} />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Vel Tech University</h1>
          <p className="text-xs font-semibold text-rose-400 mt-0.5">R&D Institute of Science and Technology</p>
          <p className="text-[11px] text-slate-400 mt-2">Smart Attendance Management Portal</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800 rounded-2xl text-xs text-rose-300 text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Vel Tech Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@veltech.edu.in"
                className="w-full bg-slate-800/80 border border-slate-700 text-white text-sm rounded-2xl pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800/80 border border-slate-700 text-white text-sm rounded-2xl pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-red-500/25 flex items-center justify-center space-x-2 transition-all"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick-Login Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">1-Click Demo Login</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin('admin@veltech.edu.in', 'admin123')}
              className="p-2.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-center text-xs font-semibold text-slate-200 transition-all hover:scale-105"
            >
              <Shield className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => handleDemoLogin('sharma@veltech.edu.in', 'faculty123')}
              className="p-2.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-center text-xs font-semibold text-slate-200 transition-all hover:scale-105"
            >
              <UserCheck className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <span>Faculty</span>
            </button>
            <button
              onClick={() => handleDemoLogin('rahul@veltech.edu.in', 'student123')}
              className="p-2.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-center text-xs font-semibold text-slate-200 transition-all hover:scale-105"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span>Student</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
