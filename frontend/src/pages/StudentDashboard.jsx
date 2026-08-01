import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/common/StatCard';
import QRScannerModal from '../components/student/QRScannerModal';
import { Camera, CheckCircle2, Clock, Calendar, Award, BookOpen, Bell } from 'lucide-react';
import API from '../services/api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [currentSemester, setCurrentSemester] = useState('Semester 6');
  const [dashboardData, setDashboardData] = useState({
    stats: { totalLectures: 40, presentCount: 37, absentCount: 3, percentage: 92.5 },
    subjectStats: [
      { code: 'AI601', name: 'Deep Learning & Artificial Intelligence', attended: 15, total: 16, percentage: 93.7 },
      { code: 'CS401', name: 'Advanced Neural Networks', attended: 12, total: 13, percentage: 92.3 },
      { code: 'AI602', name: 'Natural Language Processing', attended: 10, total: 11, percentage: 90.9 },
    ],
    recentAttendance: [
      { _id: 'a1', date: '2026-08-01', time: '09:15 AM', subjectCode: 'AI601', subjectName: 'Deep Learning & AI', status: 'Present', markedVia: 'QR' },
      { _id: 'a2', date: '2026-07-31', time: '11:00 AM', subjectCode: 'CS401', subjectName: 'Neural Networks', status: 'Present', markedVia: 'QR' },
      { _id: 'a3', date: '2026-07-30', time: '02:00 PM', subjectCode: 'AI602', subjectName: 'NLP', status: 'Present', markedVia: 'QR' },
    ],
  });

  const fetchStudentData = async () => {
    try {
      const res = await API.get('/student/dashboard');
      if (res.data.success) {
        setDashboardData(res.data);
      }
    } catch (e) {
      console.warn('Using cached student data');
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Scan Action Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 text-white border border-red-900/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={user?.avatar || 'shaik_baji_babu.jpg'}
              alt="Shaik Baji Babu"
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-red-500/40 shadow-lg"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold tracking-tight">{user?.name || 'Shaik Baji Babu'}</h1>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  Verified Student
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Registration Number: <span className="font-mono font-bold text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/30">VTU29959 - 24UECS0901 - CSE(AIML)</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Department: <span className="font-semibold text-slate-200">Computer Science & Engineering (AIML)</span> | Vel Tech University
              </p>
            </div>
          </div>

          {/* Primary Action Button: Launch QR Camera Scanner */}
          <button
            onClick={() => setIsScannerOpen(true)}
            className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2.5 transition-all transform hover:scale-105 active:scale-95"
          >
            <Camera className="w-5 h-5 text-white animate-pulse" />
            <span>Scan Lecture QR Code</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Overall Attendance" value={`${dashboardData.stats.percentage}%`} icon={Award} color="emerald" trend="Eligible for Exams" />
        <StatCard title="Total Lectures" value={dashboardData.stats.totalLectures} icon={BookOpen} color="blue" />
        <StatCard title="Classes Attended" value={dashboardData.stats.presentCount} icon={CheckCircle2} color="purple" />

        {/* Dynamic Semester Selector (Set to Semester 6) */}
        <div className="glass-card p-5">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
            <span>Academic Semester</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Active
            </span>
          </div>
          <div className="mt-2">
            <select
              value={currentSemester}
              onChange={(e) => setCurrentSemester(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-amber-500 dark:text-amber-300 font-extrabold text-base rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
              <option value="Semester 3">Semester 3</option>
              <option value="Semester 4">Semester 4</option>
              <option value="Semester 5">Semester 5</option>
              <option value="Semester 6">Semester 6</option>
              <option value="Semester 7">Semester 7</option>
              <option value="Semester 8">Semester 8</option>
            </select>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Current Term: {currentSemester}</p>
        </div>
      </div>

      {/* Main Grid: Subject Breakdown & Recent Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject-wise Attendance Percentage Cards */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Subject Attendance</h3>
          <div className="space-y-3">
            {dashboardData.subjectStats.map((sub) => (
              <div key={sub.code} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-extrabold text-red-600 dark:text-red-400">{sub.code}</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-100">{sub.percentage}%</span>
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 truncate">{sub.name}</p>
                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      sub.percentage >= 85 ? 'bg-emerald-500' : sub.percentage >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${sub.percentage}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 text-right">
                  {sub.attended} / {sub.total} classes attended
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Attendance Logs Table */}
        <div className="glass-card p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              My Attendance History ({currentSemester})
            </h3>
            <span className="text-xs text-slate-400 font-mono">Registration No: VTU29959 - 24UECS0901 - CSE(AIML)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Registration Number</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dashboardData.recentAttendance.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{log.date}</p>
                      <p className="text-[10px] text-slate-400">{log.time}</p>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-500 dark:text-amber-300">
                      VTU29959 - 24UECS0901 - CSE(AIML)
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-red-600 dark:text-red-400">{log.subjectCode}</p>
                      <p className="text-[10px] text-slate-500 truncate">{log.subjectName}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-800">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] font-bold text-slate-500">{log.markedVia} Verified ✓</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Scanner Modal Component */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSuccess={() => {
          fetchStudentData();
        }}
      />
    </div>
  );
}
