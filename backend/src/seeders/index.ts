import { connect, disconnect } from 'mongoose';
import { config } from '../config';
import { seedUsers } from './userSeeder';
import { seedAcademicYear } from './academicYearSeeder';
import { seedSubjects } from './subjectSeeder';
import { seedClasses } from './classSeeder';
import { seedStudents } from './studentSeeder';
import { seedAttendance } from './attendanceSeeder';
import { seedExams } from './examSeeder';
import { seedGrades } from './gradeSeeder';
import { seedFinance } from './financeSeeder';

async function seedAll() {
  try {
    // Connect to database
    await connect(config.mongo.uri);
    console.log('Connected to MongoDB for seeding');

    // Run seeders in sequence
    console.log('🌱 Starting database seeding...');
    
    // Base data
    await seedAcademicYear();
    await seedUsers();
    
    // Academic structure
    await seedSubjects();
    await seedClasses();
    
    // Users and related data
    await seedStudents();
    await seedAttendance();
    
    // Academic data
    await seedExams();
    await seedGrades();
    
    // Financial data
    await seedFinance();

    console.log('✅ All seed data inserted successfully');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await disconnect();
  }
}

seedAll();