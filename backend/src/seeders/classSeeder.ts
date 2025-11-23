import mongoose from 'mongoose';
import '../modules/academics/models/Class';
import '../modules/admin/models/AcademicYear';

const Class = mongoose.model('Class');
const AcademicYear = mongoose.model('AcademicYear');

export async function seedClasses() {
  try {
    await Class.deleteMany({});

    // Get the current academic year
    const currentYear = await AcademicYear.findOne({ isActive: true });
    if (!currentYear) {
      throw new Error('No active academic year found. Please seed academic years first.');
    }

    const classes: any[] = [];
    // create 10 classes across grade levels
    for (let g = 1; g <= 5; g++) {
      classes.push({
        name: `Grade ${g}A`,
        section: 'A',
        gradeLevel: g,
        academicYear: currentYear._id,
        capacity: 30,
        status: 'ACTIVE',
      });
      classes.push({
        name: `Grade ${g}B`,
        section: 'B',
        gradeLevel: g,
        academicYear: currentYear._id,
        capacity: 30,
        status: 'ACTIVE',
      });
    }

    await Class.insertMany(classes);
    console.log('✅ Classes seeded');
  } catch (error) {
    console.error('❌ Error seeding classes:', error);
    throw error;
  }
}