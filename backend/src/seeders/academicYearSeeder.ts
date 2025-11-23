import mongoose from 'mongoose';
import '../modules/admin/models/AcademicYear';

const AcademicYear = mongoose.model('AcademicYear');

export async function seedAcademicYear() {
  try {
    await AcademicYear.deleteMany({}); // Clear existing academic years

    const currentYear = new Date().getFullYear();

    // Seed the last 10 academic years (including current)
    const academicYears: any[] = [];
    for (let i = 0; i < 10; i++) {
      const start = currentYear - (9 - i);
      const end = start + 1;
      academicYears.push({
        name: `${start}-${end}`,
        startDate: new Date(start, 8, 1),
        endDate: new Date(end, 7, 31),
        isActive: start === currentYear,
      });
    }

    await AcademicYear.insertMany(academicYears);
    console.log('✅ Academic Years seeded');
  } catch (error) {
    console.error('❌ Error seeding academic years:', error);
    throw error;
  }
}