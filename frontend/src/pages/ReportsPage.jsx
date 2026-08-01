import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, Search, Calendar, FileSpreadsheet } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import API from '../services/api';

export default function ReportsPage() {
  const [logs, setLogs] = useState([
    { _id: '1', rollNumber: '2026-CSE-001', studentName: 'Rahul Kumar', subjectCode: 'CS401', subjectName: 'Data Structures', className: 'CSE-4A', department: 'Computer Science', date: '2026-08-01', time: '09:15 AM', status: 'Present', markedVia: 'QR' },
    { _id: '2', rollNumber: '2026-CSE-002', studentName: 'Priya Patel', subjectCode: 'CS401', subjectName: 'Data Structures', className: 'CSE-4A', department: 'Computer Science', date: '2026-08-01', time: '09:16 AM', status: 'Present', markedVia: 'QR' },
    { _id: '3', rollNumber: '2026-CSE-003', studentName: 'Aarav Gupta', subjectCode: 'CS401', subjectName: 'Data Structures', className: 'CSE-4A', department: 'Computer Science', date: '2026-08-01', time: '09:30 AM', status: 'Late', markedVia: 'Manual' },
    { _id: '4', rollNumber: '2026-CSE-004', studentName: 'Rohan Sharma', subjectCode: 'CS401', subjectName: 'Data Structures', className: 'CSE-4A', department: 'Computer Science', date: '2026-08-01', time: '09:00 AM', status: 'Absent', markedVia: 'Manual' },
    { _id: '5', rollNumber: '2026-ECE-012', studentName: 'Sneha Reddy', subjectCode: 'EC301', subjectName: 'Signal Processing', className: 'ECE-3B', department: 'Electronics', date: '2026-07-31', time: '11:00 AM', status: 'Present', markedVia: 'QR' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const fetchLogs = async () => {
    try {
      const res = await API.get('/attendance/logs');
      if (res.data.success && res.data.logs.length > 0) {
        setLogs(res.data.logs);
      }
    } catch (e) {
      console.warn('Using cached report data');
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter logic
  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subjectCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDept = !selectedDept || log.department === selectedDept;
    const matchStatus = !selectedStatus || log.status === selectedStatus;
    const matchSubject = !selectedSubject || log.subjectCode === selectedSubject;

    return matchSearch && matchDept && matchStatus && matchSubject;
  });

  // Export to PDF using jsPDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology', 14, 16);
    doc.setFontSize(11);
    doc.text('Smart Attendance Management System - Official Report', 14, 24);
    doc.setFontSize(9);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ['Registration Number', 'Student Name', 'Subject', 'Class', 'Date & Time', 'Status', 'Mode'];
    const tableRows = filteredLogs.map((l) => [
      l.rollNumber || 'VTU29959 - 24UESC0901 - CSE(AIML)',
      l.studentName,
      l.subjectCode,
      l.className,
      `${l.date} ${l.time}`,
      l.status,
      l.markedVia,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 34,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save('attendance_report.pdf');
  };

  // Export to Excel using XLSX
  const exportToExcel = () => {
    const excelData = filteredLogs.map((l) => ({
      'Roll Number': l.rollNumber,
      'Student Name': l.studentName,
      'Subject Code': l.subjectCode,
      'Subject Name': l.subjectName,
      'Class Section': l.className,
      Department: l.department,
      Date: l.date,
      Time: l.time,
      Status: l.status,
      'Verification Mode': l.markedVia,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Records');
    XLSX.writeFile(workbook, 'attendance_report.xlsx');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Attendance Reports & Exports</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search, filter by student/subject/status, and download official PDF & Excel reports
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-auto">
          <button
            onClick={exportToPDF}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-500/20 flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={exportToExcel}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center space-x-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Card */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 dark:border-slate-700">
          <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Search & Filter Criteria</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Name or Roll No..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science & Eng</option>
            <option value="Electronics">Electronics & Comm</option>
            <option value="Mechanical">Mechanical Eng</option>
          </select>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Subjects</option>
            <option value="CS401">CS401 - Data Structures</option>
            <option value="CS402">CS402 - Database Systems</option>
            <option value="EC301">EC301 - Signal Processing</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Present">Present Only</option>
            <option value="Absent">Absent Only</option>
            <option value="Late">Late Only</option>
          </select>
        </div>
      </div>

      {/* Main Results Table */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Showing {filteredLogs.length} Matching Records
          </span>
          <span className="text-xs text-slate-400">Total Database Records: {logs.length}</span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Registration Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">{item.rollNumber}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{item.studentName}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-blue-600 dark:text-blue-400">{item.subjectCode}</span>
                    <span className="block text-[10px] text-slate-400">{item.subjectName}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{item.className}</td>
                  <td className="py-3 px-4">
                    <span>{item.date}</span>
                    <span className="block text-[10px] text-slate-400">{item.time}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        item.status === 'Present'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.status === 'Late'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] font-semibold text-slate-500">{item.markedVia} Code</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
