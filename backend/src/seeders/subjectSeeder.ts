import mongoose from 'mongoose';
import '../modules/academics/models/Subject';

const Subject = mongoose.model('Subject');

export async function seedSubjects() {
  try {
    await Subject.deleteMany({});

    const base = [
      { name: 'Mathematics', code: 'MATH101', description: 'Algebra, geometry, arithmetic', credits: 4 },
      { name: 'English', code: 'ENG101', description: 'English language and literature', credits: 3 },
      { name: 'Science', code: 'SCI101', description: 'Physics, chemistry, biology', credits: 4 },
      { name: 'History', code: 'HIST101', description: 'World history and civilization', credits: 3 },
      { name: 'Computer Science', code: 'CS101', description: 'Intro to CS and programming', credits: 4 },
      { name: 'Geography', code: 'GEO101', description: 'Physical and human geography', credits: 3 },
      { name: 'Art', code: 'ART101', description: 'Visual arts and appreciation', credits: 2 },
      { name: 'Music', code: 'MUS101', description: 'Music theory and practice', credits: 2 },
      { name: 'Physical Education', code: 'PE101', description: 'Sports and health', credits: 1 },
      { name: 'Biology', code: 'BIO101', description: 'Study of living organisms', credits: 4 },
    ];

    const subjects = base.map((s, i) => ({
      ...s,
      gradeLevel: (i % 6) + 1,
      isActive: true,
    }));

    await Subject.insertMany(subjects);
    console.log('✅ Subjects seeded');
  } catch (error) {
    console.error('❌ Error seeding subjects:', error);
    throw error;
  }
}