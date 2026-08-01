import React, { useState, useEffect } from 'react';
import StatCard from '../components/common/StatCard';
import { Users, UserCheck, Building2, BookOpen, CheckCircle, TrendingUp, Plus, Trash2, ShieldCheck, Activity } from 'lucide-react';
import API from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 142,
    totalFaculty: 18,
    totalDepartments: 3,
    totalSubjects: 8,
    todayAttendance: 128,
    totalAttendance: 1240,
    attendanceRate: 90,
  });

  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Department Form modal
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptHead, setNewDeptHead] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await API.get('/admin/stats');
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      const deptsRes = await API.get('/admin/departments');
      if (deptsRes.data.success) setDepartments(deptsRes.data.departments);

      const subRes = await API.get('/admin/subjects');
      if (subRes.data.success) setSubjects(subRes.data.subjects);

      const usersRes = await API.get('/admin/users');
      if (usersRes.data.success) setUsers(usersRes.data.users);
    } catch (err) {
      console.warn('Using cached mock admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAddDept = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/admin/departments', {
        code: newDeptCode,
        name: newDeptName,
        headOfDept: newDeptHead || 'Unassigned',
      });
      if (res.data.success) {
        setDepartments([...departments, res.data.department]);
        setShowDeptModal(false);
        setNewDeptCode('');
        setNewDeptName('');
        setNewDeptHead('');
      }
    } catch (err) {
      alert('Could not create department');
    }
  };

  const handleDeleteDept = async (id) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      await API.delete(`/admin/departments/${id}`);
      setDepartments(departments.filter((d) => d._id !== id));
    } catch (e) {
      setDepartments(departments.filter((d) => d._id !== id));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Admin Master Dashboard</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            System Stats, Department Structure, Subject Assignment & User Governance
          </p>
        </div>
        <button
          onClick={() => setShowDeptModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center space-x-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={stats.totalStudents} icon={Users} color="blue" trend="+12% this term" />
        <StatCard title="Total Faculty" value={stats.totalFaculty} icon={UserCheck} color="emerald" trend="Active" />
        <StatCard title="Departments" value={stats.totalDepartments} icon={Building2} color="purple" />
        <StatCard title="Today's Attendance" value={`${stats.attendanceRate}%`} icon={TrendingUp} color="amber" subtext={`${stats.todayAttendance} marked today`} />
      </div>

      {/* Main Tabs Navigation */}
      <div className="glass-card p-6">
        <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-700 pb-4">
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'departments'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Departments ({departments.length})
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'subjects'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Subjects ({subjects.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            User Roster ({users.length})
          </button>
        </div>

        {/* Tab Content: Departments */}
        {activeTab === 'departments' && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Department Name</th>
                  <th className="py-3 px-4">Head of Department</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {departments.map((dept) => (
                  <tr key={dept._id || dept.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-blue-600 dark:text-blue-400">{dept.code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{dept.name}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{dept.headOfDept}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteDept(dept._id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Content: Subjects */}
        {activeTab === 'subjects' && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Subject Code</th>
                  <th className="py-3 px-4">Subject Title</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Credits</th>
                  <th className="py-3 px-4">Assigned Faculty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {subjects.map((sub) => (
                  <tr key={sub._id || sub.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-purple-600 dark:text-purple-400">{sub.code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{sub.name}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{sub.department}</td>
                    <td className="py-3 px-4 font-bold">{sub.credits}</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">{sub.assignedFaculty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Content: Users */}
        {activeTab === 'users' && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department / Class</th>
                  <th className="py-3 px-4">ID / Roll No</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u._id || u.email} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <img src={u.avatar} className="w-7 h-7 rounded-full object-cover" alt="avatar" />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{u.name}</p>
                        <p className="text-[10px] text-slate-400">{u.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 capitalize font-bold">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'faculty' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{u.department || u.classSection || 'N/A'}</td>
                    <td className="py-3 px-4 font-mono font-semibold">{u.rollNumber || u.employeeId || 'ADMIN-00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Department Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Create New Department</h3>
            <form onSubmit={handleAddDept} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Department Code (e.g. CSE)</label>
                <input
                  type="text"
                  required
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Department Full Name</label>
                <input
                  type="text"
                  required
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Head of Department (HOD)</label>
                <input
                  type="text"
                  value={newDeptHead}
                  onChange={(e) => setNewDeptHead(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-md">
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
