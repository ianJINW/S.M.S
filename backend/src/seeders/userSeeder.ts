import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import '../modules/admin/models/User';

const User = mongoose.model('User');

export async function seedUsers() {
  try {
    await User.deleteMany({}); // Clear existing users

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        email: 'admin@school.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
      },
      {
        email: 'teacher@school.com',
        password: hashedPassword,
        firstName: 'Teacher',
        lastName: 'User',
        role: 'teacher',
        isActive: true,
      },
      {
        email: 'finance@school.com',
        password: hashedPassword,
        firstName: 'Finance',
        lastName: 'User',
        role: 'finance',
        isActive: true,
      },
      {
        email: 'academics@school.com',
        password: hashedPassword,
        firstName: 'Academic',
        lastName: 'Admin',
        role: 'academic_admin',
        isActive: true,
      },
      {
        email: 'parent@school.com',
        password: hashedPassword,
        firstName: 'Parent',
        lastName: 'User',
        role: 'parent',
        isActive: true,
      },
    ];

    await User.insertMany(users);
    console.log('✅ Users seeded');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}