import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import '../modules/admin/models/User';

const User = mongoose.model('User');

export async function seedUsers() {
  try {
    await User.deleteMany({}); // Clear existing users

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users: any[] = [];

    // Create core roles
    users.push({
      email: 'admin@school.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
    });

    users.push({
      email: 'finance@school.com',
      password: hashedPassword,
      firstName: 'Finance',
      lastName: 'User',
      role: 'finance',
      isActive: true,
    });

    users.push({
      email: 'academics@school.com',
      password: hashedPassword,
      firstName: 'Academic',
      lastName: 'Admin',
      role: 'academic_admin',
      isActive: true,
    });

    // Create several teachers
    for (let i = 1; i <= 6; i++) {
      users.push({
        email: `teacher${i}@school.com`,
        password: hashedPassword,
        firstName: `Teacher${i}`,
        lastName: 'Staff',
        role: 'teacher',
        isActive: true,
      });
    }

    // Create several parent users (some will be linked to students)
    for (let i = 1; i <= 12; i++) {
      users.push({
        email: `parent${i}@example.com`,
        password: hashedPassword,
        firstName: `Parent${i}`,
        lastName: 'Guardian',
        role: 'parent',
        isActive: true,
      });
    }

    await User.insertMany(users);
    console.log('✅ Users seeded');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}