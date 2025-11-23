import mongoose from 'mongoose';
import '../modules/exams/models/Grade';
import '../modules/students/models/Student';
import '../modules/academics/models/Subject';
import '../modules/exams/models/Exam';
import '../modules/admin/models/User';

const Grade = mongoose.model('Grade');
const Student = mongoose.model('Student');
const Subject = mongoose.model('Subject');
const Exam = mongoose.model('Exam');
const User = mongoose.model('User');

export async function seedGrades() {
  try {
    await Grade.deleteMany({});

    const students = await Student.find({}).limit(12);
    const subject = await Subject.findOne({});
    const exam = await Exam.findOne({});
    const recorder = await User.findOne({ role: 'teacher' });

    if (!students.length || !subject || !exam || !recorder) {
      console.log('⚠️  Skipping grades seeding — missing students/subject/exam/teacher');
      return;
    }

    const grades = students.map((s, i) => ({
      studentId: s._id,
      subjectId: subject._id,
      examId: exam._id,
      score: 50 + (i * 5) % 50,
      maxScore: 100,
      grade: i % 2 === 0 ? 'B' : 'A',
      remarks: 'Auto-seeded grade',
      recordedBy: recorder._id,
    }));

    await Grade.insertMany(grades);
    console.log('✅ Grades seeded');
  } catch (error) {
    console.error('❌ Error seeding grades:', error);
    throw error;
  }
}
