import React, { useState, useEffect } from 'react';
import StatCard from '../components/common/StatCard';
import QRGeneratorModal from '../components/faculty/QRGeneratorModal';
import { QrCode, BookOpen, Users, CheckCircle2, XCircle, Clock, Edit3 } from 'lucide-react';
import API from '../services/api';

export default function FacultyDashboard() {
  const [subjects, setSubjects] = useState([
    { _id: 's-1', code: 'CS401', name: 'Data Structures & Algorithms', department: 'Computer Science', credits: 4 },
    { _id: 's-2', code: 'CS402', name: 'Database Management Systems', department: 'Computer Science', credits: 3 },
  ]);

  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [selectedClass, setSelectedClass] = useState('CSE-4A');
  const [students, setStudents] = useState([
    { _id: 'u-1', name: 'Rahul Kumar', rollNumber: '2026-CSE-001', status: 'Present' },
    { _id: 'u-2', name: 'Priya Patel', rollNumber: '2026-CSE-002', status: 'Present' },
    { _id: 'u-3', name: 'Aarav Gupta', rollNumber: '2026-CSE-003', status: 'Late' },
    { _id: 'u-4', name: 'Rohan Sharma', rollNumber: '2026-CSE-004', status: 'Absent' },
  ]);

  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const fetchFacultyData = async () => {
    try {
      const res = await API.get('/faculty/overview');
      if (res.data.success) {
        setSubjects(res.data.assignedSubjects);
        setSelectedSubject(res.data.assignedSubjects[0] || subjects[0]);
      }
    } catch (e) {
      console.warn('Using cached faculty data');
    }
  };

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const toggleStudentStatus = (index) => {
    const updated = [...students];
    const curr = updated[index].status;
    updated[index].status = curr === 'Present' ? 'Absent' : 'Present';
    setStudents(updated);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Faculty Workspace</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate dynamic QR codes for lectures & manage live student attendance
          </p>
        </div>

        {/* Generate QR Code Action */}
        <button
          onClick={() => setIsQRModalOpen(true)}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center space-x-2.5 self-start md:self-auto"
        >
          <QrCode className="w-5 h-5 animate-bounce" />
          <span>Start QR Attendance Session</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Classes" value="3 Lectures" icon={BookOpen} color="blue" />
        <StatCard title="Total Enrolled" value={`${students.length} Students`} icon={Users} color="purple" />
        <StatCard title="Present Today" value={students.filter((s) => s.status === 'Present').length} icon={CheckCircle2} color="emerald" />
        <StatCard title="Absent Today" value={students.filter((s) => s.status === 'Absent').length} icon={XCircle} color="rose" />
      </div>

      {/* Main Workspace Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Assigned Subjects Selection */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Assigned Subjects</h3>
          <div className="space-y-2">
            {subjects.map((sub) => (
              <div
                key={sub.code}
                onClick={() => setSelectedSubject(sub)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                  selectedSubject?.code === sub.code
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-sm'
                    : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">{sub.code}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {sub.credits} Credits
                  </span>
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs mt-1">{sub.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{sub.department}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Select Target Class Section:</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold rounded-xl px-3 py-2"
            >
              <option value="CSE-4A">CSE-4A (Semester 7)</option>
              <option value="CSE-4B">CSE-4B (Semester 7)</option>
              <option value="ECE-3B">ECE-3B (Semester 5)</option>
            </select>
          </div>
        </div>

        {/* Right Column: Live Class Roster & Manual Override */}
        <div className="glass-card p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Attendance Roster: {selectedSubject?.code} - {selectedClass}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live attendance verification & status override</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              {students.filter((s) => s.status === 'Present').length} / {students.length} Present
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Manual Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.map((st, idx) => (
                  <tr key={st.rollNumber} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">{st.rollNumber}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{st.name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          st.status === 'Present'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : st.status === 'Late'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {st.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleStudentStatus(idx)}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-semibold flex items-center space-x-1 ml-auto"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Toggle Status</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* QR Generator Modal Component */}
      <QRGeneratorModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        subjectCode={selectedSubject?.code}
        subjectName={selectedSubject?.name}
        className={selectedClass}
      />
    </div>
  );
}
