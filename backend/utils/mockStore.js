const bcrypt = require('bcryptjs');

const adminHash = bcrypt.hashSync('admin123', 10);
const facultyHash = bcrypt.hashSync('faculty123', 10);
const studentHash = bcrypt.hashSync('student123', 10);

const mockStore = {
  users: [
    {
      _id: 'u-admin-1',
      id: 'u-admin-1',
      name: 'System Admin',
      email: 'admin@veltech.edu.in',
      password: adminHash,
      role: 'admin',
      phone: '+91 44 2684 0896',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    },
    {
      _id: 'u-faculty-1',
      id: 'u-faculty-1',
      name: 'Dr. GODLIN JASIL. S.P',
      email: 'godlinjasil@veltech.edu.in',
      password: facultyHash,
      role: 'faculty',
      employeeId: 'TTS4232',
      department: 'Computer Science & Engineering (AIML)',
      phone: '+91 98765 43210',
      avatar: 'veltech_logo.png',
    },
    {
      _id: 'u-student-1',
      id: 'u-student-1',
      name: 'Pallapu Dileep Kumar',
      email: 'dileepkumar@veltech.edu.in',
      password: studentHash,
      role: 'student',
      registrationNumber: 'VTU29962 - 24UECS0805 - CSE(AIML)',
      rollNumber: 'VTU29962 - 24UECS0805 - CSE(AIML)',
      department: 'Computer Science & Engineering (AIML)',
      course: 'B.Tech CSE(AIML)',
      classSection: 'Bucket 29',
      phone: '+91 91234 56790',
      avatar: 'pallapu_dileep_kumar.jpg',
    },
  ],

  departments: [
    { _id: 'd-1', code: 'CSE-AIML', name: 'Computer Science & Eng (AIML)', headOfDept: 'Dr. GODLIN JASIL. S.P', description: 'Vel Tech Artificial Intelligence & Machine Learning' },
    { _id: 'd-2', code: 'ECE', name: 'Electronics & Communication', headOfDept: 'Dr. ANGELINE LYDIA', description: 'Vel Tech Electronics & Signal Processing' },
  ],

  courses: [
    { _id: 'c-1', code: 'BTECH-AIML', name: 'B.Tech CSE (AIML)', department: 'Computer Science & Eng (AIML)', durationYears: 4 },
  ],

  subjects: [
    { _id: 's-1', code: '10210CH104', name: 'Environmental Science and Sustainability', category: 'FOUNDATION', credits: 3, assignedFaculty: 'Dr SATHYA MOORTHI. S', facultyId: 'TTS4102', slot: 'FCR-H1' },
    { _id: 's-2', code: '10211CS129', name: 'Modern Computer Architecture', category: 'PROGRAMME CORE', credits: 3, assignedFaculty: 'Dr. BARKATHULLA. A', facultyId: 'TTS3938', slot: 'S7' },
    { _id: 's-3', code: '10211CS208', name: 'Software Engineering', category: 'PROGRAMME CORE', credits: 3, assignedFaculty: 'Dr. AMU. D', facultyId: 'TTS3994', slot: 'S2-1L12' },
    { _id: 's-4', code: '10211CS227', name: 'Problem Solving and Testing', category: 'PROGRAMME CORE', credits: 3, assignedFaculty: 'Dr. SATHYAMOORTHY. K', facultyId: 'TTS4066', slot: 'S2-2L5L2' },
    { _id: 's-5', code: '10211CS223', name: 'Machine Learning Techniques', category: 'PROGRAMME ELECTIVE', credits: 3, assignedFaculty: 'Dr. GODLIN JASIL. S.P', facultyId: 'TTS4232', slot: 'S6' },
    { _id: 's-6', code: '10212CS217', name: 'Data Science', category: 'PROGRAMME ELECTIVE', credits: 4, assignedFaculty: 'Dr. ANGELINE LYDIA', facultyId: 'TTS3146', slot: 'S5L15' },
    { _id: 's-7', code: '10212CS292', name: 'Applied Programming Skills', category: 'PROGRAMME ELECTIVE', credits: 4, assignedFaculty: 'Dr. KAVIARASAN. S', facultyId: 'TTS4013', slot: 'S1L10' },
    { _id: 's-8', code: '10213GE308', name: 'Professional Communication for Engineers', category: 'OPEN ELECTIVE', credits: 2, assignedFaculty: 'Dr. UMANESAN. R', facultyId: 'TTS3897', slot: 'CSE-OE-TB28-S8' },
    { _id: 's-9', code: '10214CS601', name: 'Minor Project - I', category: 'INDEPENDENT LEARNING', credits: 2, assignedFaculty: 'Dr. KARTHIYAYINI. S', facultyId: 'TTS3843', slot: 'CSE - Minor 1' },
    { _id: 's-10', code: '10216GE903', name: 'Aptitude Skills - I', category: 'PROFESSIONAL PROFICIENCY', credits: 1, assignedFaculty: 'DINESHKUMAR. R', facultyId: 'CDS040', slot: 'CSE T12' },
  ],

  classes: [
    { _id: 'cls-1', name: 'Semester 6 CSE(AIML)', department: 'Computer Science & Eng (AIML)', semester: 6, academicYear: '2026' },
  ],

  attendance: [
    {
      _id: 'att-1',
      studentId: 'u-student-1',
      studentName: 'Shaik Baji Babu',
      rollNumber: 'VTU29959 - 24UECS0901 - CSE(AIML)',
      facultyId: 'TTS4232',
      facultyName: 'Dr. GODLIN JASIL. S.P',
      subjectCode: '10211CS223',
      subjectName: 'Machine Learning Techniques',
      className: 'Semester 6 CSE(AIML)',
      department: 'Computer Science & Eng (AIML)',
      date: '2026-08-01',
      time: '09:15 AM',
      status: 'Present',
      markedVia: 'QR',
      createdAt: new Date().toISOString(),
    },
  ],

  qrSessions: [],

  notifications: [
    {
      _id: 'n-1',
      recipientId: 'u-student-1',
      recipientRole: 'student',
      title: 'Vel Tech Attendance Confirmed',
      message: 'Your attendance for 10211CS223 (Machine Learning Techniques) has been marked Present for Semester 6.',
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
  ],

  activityLogs: [
    {
      _id: 'act-1',
      userName: 'Dr. GODLIN JASIL. S.P',
      userRole: 'faculty',
      action: 'Generated QR Session',
      details: 'Subject: 10211CS223 (Semester 6 CSE-AIML) at Vel Tech University',
      createdAt: new Date().toISOString(),
    },
  ],
};

module.exports = mockStore;
