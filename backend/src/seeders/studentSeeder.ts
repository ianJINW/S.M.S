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

    // Create 12 students programmatically (at least 10)
    const students: any[] = [];
    const startYear = 2016;
    for (let i = 1; i <= 12; i++) {
      const first = `Student${i}`;
      const last = `Family${Math.ceil(i / 2)}`;
      const admissionNo = `ST2025${String(i).padStart(3, '0')}`;
      const dob = new Date(startYear + (i % 6), (i % 12), (i % 28) + 1);
      const cls = classes[i % classes.length];

      students.push({
        firstName: first,
        lastName: last,
        dob,
        gender: i % 2 === 0 ? 'Male' : 'Female',
        admissionNo,
        classId: cls._id,
        emails: [`${first.toLowerCase()}.${last.toLowerCase()}@student.school.com`],
        contacts: [`+10000000${100 + i}`],
        address: `Street ${i}`,
        status: 'active',
      });
    }

    const savedStudents = await Student.insertMany(students);

    // Create guardians for each student
    const guardians: any[] = [];
    for (let i = 0; i < savedStudents.length; i++) {
      const s = savedStudents[i];
      guardians.push({
        name: `${s.firstName}Parent`,
        studentId: s._id,
        relation: 'Parent',
        phone: `+20000000${100 + i}`,
        email: `parent${i + 1}@example.com`,
        address: {
          street: s.address || `Street ${i + 1}`,
          city: 'Example City',
          state: 'EX',
          zipCode: '12345',
        },
        isPrimary: true,
      });
    }

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