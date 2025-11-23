import mongoose from 'mongoose';
import '../modules/attendance/models/Attendance';
import '../modules/students/models/Student';
import '../modules/academics/models/Class';
import '../modules/admin/models/User';

const Attendance = mongoose.model('Attendance');
const Student = mongoose.model('Student');
const ClassModel = mongoose.model('Class');
const User = mongoose.model('User');

export async function seedAttendance() {
  try {
    await Attendance.deleteMany({});

    // find some students and a teacher
    const students = await Student.find({}).limit(6);
    const classDoc = await ClassModel.findOne({});
    const teacher = await User.findOne({ role: 'teacher' });

    if (!students || students.length === 0 || !classDoc || !teacher) {
      console.log('⚠️  Skipping attendance seeding — missing students/classes/teacher');
      return;
    }

    const today = new Date();
    const records = students.map((s, i) => ({
      studentId: s._id,
      classId: classDoc._id,
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - (i % 3)),
      status: i % 3 === 0 ? 'P' : 'A',
      method: 'manual',
      recordedBy: teacher._id,
      note: i % 3 === 0 ? 'Present' : 'Absent',
    }));

    await Attendance.insertMany(records);
    console.log('✅ Attendance seeded');
  } catch (error) {
    console.error('❌ Error seeding attendance:', error);
    throw error;
  }
}
