import mongoose from 'mongoose';
import '../modules/exams/models/Exam';
import '../modules/exams/models/Question';
import '../modules/academics/models/Subject';
import '../modules/academics/models/Class';

const Exam = mongoose.model('Exam');
const Question = mongoose.model('Question');
const Subject = mongoose.model('Subject');
const Class = mongoose.model('Class');

export async function seedExams() {
  try {
    await Exam.deleteMany({});
    await Question.deleteMany({});

    // Get a subject and class
    const subject = await Subject.findOne({ code: 'MATH101' });
    const class1 = await Class.findOne({ name: 'Grade 1A' });

    if (!subject || !class1) {
      throw new Error('Required subject or class not found. Please seed subjects and classes first.');
    }

    // Create a set of questions and exams across several subjects and classes
    const teachers = await mongoose.model('User').find({ role: 'teacher' }).limit(6);
    if (!teachers || teachers.length === 0) {
      throw new Error('Teacher user not found. Please seed users first.');
    }

    // create a few exams with questions
    const examsToCreate: any[] = [];
    const subjCount = await Subject.countDocuments();
    const classCount = await Class.countDocuments();
    for (let i = 0; i < 8; i++) {
      const subj = await Subject.findOne().skip(i % Math.max(1, subjCount));
      const cls = await Class.findOne().skip(i % Math.max(1, classCount));
      if (!subj || !cls) continue;

      const q1 = {
        type: 'mcq',
        prompt: `Sample question ${i + 1}a`,
        choices: ['A', 'B', 'C', 'D'],
        correctAnswers: ['A'],
        points: 1,
        subjectId: subj._id,
      };
      const q2 = {
        type: 'short',
        prompt: `Sample question ${i + 1}b`,
        choices: [],
        correctAnswers: [],
        points: 2,
        subjectId: subj._id,
      };

      const savedQuestions = await Question.insertMany([q1, q2]);

      const teacher = teachers[i % teachers.length];

      examsToCreate.push({
        createdBy: teacher._id,
        name: `${subj.name} Test ${i + 1}`,
        subjectId: subj._id,
        classId: cls._id,
        date: new Date(Date.now() + i * 86400000),
        durationMin: 45,
        sections: [
          { name: 'Section 1', questionIds: savedQuestions.map((q: any) => q._id) },
        ],
        settings: { negativeMarking: false, proctoring: false, allowReview: true },
        status: 'published',
      });
    }

    if (examsToCreate.length) await Exam.insertMany(examsToCreate);
    console.log('✅ Exams and Questions seeded');
  } catch (error) {
    console.error('❌ Error seeding exams and questions:', error);
    throw error;
  }
}