import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import '../modules/students/models/Student';
import '../modules/students/models/Guardian';
import '../modules/academics/models/Class';
import '../modules/admin/models/User';

const Student = mongoose.model('Student');
const Guardian = mongoose.model('Guardian');
const Class = mongoose.model('Class');
const User = mongoose.model('User');

export async function seedStudents() {
  try {
    await Student.deleteMany({});
    await Guardian.deleteMany({});

    // Get available classes
    const classes = await Class.find({ status: 'ACTIVE' });
    if (classes.length === 0) {
      throw new Error('No active classes found. Please seed classes first.');
    }

    // Create students first
    const students = [
      {
        firstName: 'Alice',
        lastName: 'Doe',
        dob: new Date('2018-05-15'),
        gender: 'Female',
        admissionNo: 'ST2025001',
        classId: classes[0]._id,
        emails: ['alice.doe@student.school.com'],
        contacts: ['+1234567892'],
        address: '123 Parent Street', 
        status: 'active'
      },
      {
        firstName: 'Bob',
        lastName: 'Smith',
        dob: new Date('2018-08-22'),
        gender: 'Male',
        admissionNo: 'ST2025002',
        classId: classes[0]._id,
        emails: ['bob.smith@student.school.com'],
        contacts: ['+1234567893'],
        address: '456 Guardian Avenue',
        status: 'active'
      }
    ];

    const savedStudents = await Student.insertMany(students);

    // Create guardians for the students
    const guardians = [
      {
        name: 'John Doe',
        studentId: savedStudents[0]._id,
        relation: 'Father',
        phone: '+1234567890',
        email: 'john.doe@example.com',
        address: {
          street: '123 Parent Street',
          city: 'Example City',
          state: 'EX',
          zipCode: '12345'
        },
        isPrimary: true
      },
      {
        name: 'Jane Smith',
        studentId: savedStudents[1]._id,
        relation: 'Mother',
        phone: '+1234567891',
        email: 'jane.smith@example.com',
        address: {
          street: '456 Guardian Avenue',
          city: 'Example City',
          state: 'EX',
          zipCode: '12345'
        },
        isPrimary: true
      }
    ];

    const insertedGuardians = await Guardian.insertMany(guardians);

    // Create User accounts for students and link them
    const defaultPassword = 'password123';
    const hashed = await bcrypt.hash(defaultPassword, 10);

    type SeededStudent = mongoose.Document & {
      emails?: string[];
      admissionNo?: string;
      firstName?: string;
      lastName?: string;
    };

    for (const s of savedStudents as SeededStudent[]) {
      const email = s.emails && s.emails.length ? s.emails[0] : `${s.admissionNo}@school.local`;
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          email,
          password: hashed,
          firstName: s.firstName,
          lastName: s.lastName,
          role: 'student',
          isActive: true,
        });
      }

      // link user to student
      await Student.findByIdAndUpdate(s._id, { $set: { userId: user._id } });
    }

    // Create User accounts for guardians (parents) and link them
    type SeededGuardian = mongoose.Document & { name?: string; email?: string };
    for (const g of insertedGuardians as SeededGuardian[]) {
      let user = await User.findOne({ email: g.email });
      if (!user) {
        const parts = (g.name || '').split(' ');
        user = await User.create({
          email: g.email,
          password: hashed,
          firstName: parts[0] || 'Parent',
          lastName: parts.slice(1).join(' ') || 'User',
          role: 'parent',
          isActive: true,
        });
      }

      await Guardian.findByIdAndUpdate(g._id, { $set: { userId: user._id } });
    }

    console.log('✅ Students, Guardians and related user accounts seeded');
  } catch (error) {
    console.error('❌ Error seeding students and guardians:', error);
    throw error;
  }
}