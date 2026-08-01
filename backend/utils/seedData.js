const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const Notification = require('../models/Notification');
const mockStore = require('./mockStore');

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_attendance';
    console.log(`Connecting to MongoDB at ${mongoURI}...`);
    await mongoose.connect(mongoURI);
    console.log('Connected! Clearing old collections...');

    await User.deleteMany();
    await Department.deleteMany();
    await Course.deleteMany();
    await Subject.deleteMany();
    await Class.deleteMany();
    await Attendance.deleteMany();
    await Notification.deleteMany();

    console.log('Inserting seed users...');
    for (const u of mockStore.users) {
      const newUser = new User(u);
      await newUser.save();
    }

    console.log('Inserting departments, courses, subjects, classes...');
    await Department.insertMany(mockStore.departments);
    await Course.insertMany(mockStore.courses);
    await Subject.insertMany(mockStore.subjects);
    await Class.insertMany(mockStore.classes);
    await Attendance.insertMany(mockStore.attendance);
    await Notification.insertMany(mockStore.notifications);

    console.log('Database Seeding Complete! Seed credentials:');
    console.log('--------------------------------------------------');
    console.log('Admin:    admin@university.edu    / admin123');
    console.log('Faculty:  sharma@university.edu   / faculty123');
    console.log('Student:  rahul@student.edu    / student123');
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error.message);
    process.exit(1);
  }
};

seedDB();
