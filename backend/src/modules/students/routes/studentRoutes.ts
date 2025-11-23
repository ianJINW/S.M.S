import { Router } from 'express';
import { z } from 'zod';
import Student from '../models/Student';
import Guardian from '../models/Guardian';
import Grade from '../../exams/models/Grade';
import Attendance from '../../attendance/models/Attendance';
import Invoice from '../../finance/models/Invoice';
import { authenticate, authorize } from '../../../middlewares/auth';
import { asyncHandler } from '../../../utils/errors';
import { AuthRequest, StudentStatus, PaginatedResponse } from '../../../types';
import { AppError } from '../../../utils/errors';

const router = Router();

const createStudentSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dob: z.string().transform((str) => new Date(str)),
  gender: z.string(),
  admissionNo: z.string(),
  emails: z.array(z.string().email()).optional(),
  contacts: z.array(z.string()).optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  classId: z.string().optional(),
  medical: z.object({
    notes: z.string().optional(),
    allergies: z.array(z.string()).optional(),
  }).optional(),
});

const updateStudentSchema = createStudentSchema.partial();

const createGuardianSchema = z.object({
  name: z.string().min(1),
  relation: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional(),
  isPrimary: z.boolean().default(false),
});

// Get all students with pagination
router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 20;
  const q = req.query.q as string;
  const classId = req.query.classId as string;
  const status = req.query.status as string;

  const query: any = { deletedAt: null };

  // Get the current student's grades
  router.get('/me/grades', authenticate, asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.user && (req.user as any)._id ? (req.user as any)._id : (req.user as any).id;
    const student = await Student.findOne({ userId, deletedAt: null });
    if (!student) throw new AppError(404, 'NOT_FOUND', 'Student not found for current user');

    const grades = await Grade.find({ studentId: student._id }).populate('subjectId', 'name').populate('examId', 'name').sort({ createdAt: -1 });
    res.json({ data: grades });
  }));

  // Get the current student's attendance
  router.get('/me/attendance', authenticate, asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.user && (req.user as any)._id ? (req.user as any)._id : (req.user as any).id;
    const student = await Student.findOne({ userId, deletedAt: null });
    if (!student) throw new AppError(404, 'NOT_FOUND', 'Student not found for current user');

    const records = await Attendance.find({ studentId: student._id }).sort({ date: -1 });
    res.json({ data: records });
  }));

  // Get the current student's invoices
  router.get('/me/invoices', authenticate, asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.user && (req.user as any)._id ? (req.user as any)._id : (req.user as any).id;
    const student = await Student.findOne({ userId, deletedAt: null });
    if (!student) throw new AppError(404, 'NOT_FOUND', 'Student not found for current user');

    const invoices = await Invoice.find({ studentId: student._id }).sort({ dueDate: -1 });
    res.json({ data: invoices });
  }));
  if (q) {
    query.$or = [
      { firstName: { $regex: q, $options: 'i' } },
      { lastName: { $regex: q, $options: 'i' } },
      { admissionNo: { $regex: q, $options: 'i' } },
    ];
  }
  if (classId) query.classId = classId;
  if (status) query.status = status;

  const total = await Student.countDocuments(query);
  const students = await Student.find(query)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .populate('classId', 'name gradeLevel')
    .populate('userId', 'email firstName lastName')
    .sort({ createdAt: -1 });

  const response: PaginatedResponse<any> = {
    data: students,
    meta: {
      page,
      pageSize,
      total,
      pageCount: Math.ceil(total / pageSize),
    },
  };

  res.json(response);
}));

// Get single student
// Get current authenticated student's profile
router.get('/me', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user && (req.user as any)._id ? (req.user as any)._id : (req.user as any).id;
  const student = await Student.findOne({ userId, deletedAt: null }).populate('classId', 'name gradeLevel').populate('userId', 'email firstName lastName');

  if (!student) {
    throw new AppError(404, 'NOT_FOUND', 'Student not found for current user');
  }

  res.json({ data: student });
}));

// Get single student by id
router.get('/:id', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const student = await Student.findOne({ _id: req.params.id, deletedAt: null })
    .populate('classId', 'name gradeLevel')
    .populate('userId', 'email firstName lastName');
  
  if (!student) {
    throw new AppError(404, 'NOT_FOUND', 'Student not found');
  }

  res.json({ data: student });
}));

// Create student
router.post('/', authenticate, authorize('admin', 'academic_admin'), asyncHandler(async (req, res) => {
  const data = createStudentSchema.parse(req.body);
  
  const existing = await Student.findOne({ admissionNo: data.admissionNo });
  if (existing) {
    throw new AppError(409, 'DUPLICATE_ADMISSION_NO', 'Student with this admission number already exists');
  }

  const student = new Student({ ...data, status: StudentStatus.ACTIVE });
  await student.save();
  
  res.status(201).json({ data: student });
}));

// Update student
router.patch('/:id', authenticate, authorize('admin', 'academic_admin'), asyncHandler(async (req: AuthRequest, res: any) => {
  const data = updateStudentSchema.parse(req.body);
  const student = await Student.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    { $set: data },
    { new: true }
  );

  if (!student) {
    throw new AppError(404, 'NOT_FOUND', 'Student not found');
  }

  res.json({ data: student });
}));

// Delete student (soft delete)
router.delete('/:id', authenticate, authorize('admin'), asyncHandler(async (req: AuthRequest, res: any) => {
  const student = await Student.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    { $set: { deletedAt: new Date(), status: StudentStatus.ARCHIVED } },
    { new: true }
  );

  if (!student) {
    throw new AppError(404, 'NOT_FOUND', 'Student not found');
  }

  res.json({ data: { success: true } });
}));

// Get guardians for a student
router.get('/:id/guardians', authenticate, asyncHandler(async (req: AuthRequest, res: any) => {
  const guardians = await Guardian.find({ studentId: req.params.id });
  res.json({ data: guardians });
}));

// Get guardians for the currently authenticated parent user
router.get('/guardians/me', authenticate, asyncHandler(async (req: AuthRequest, res: any) => {
  const userId = req.user && (req.user as any)._id ? (req.user as any)._id : (req.user as any).id;
  const guardians = await Guardian.find({ userId }).populate('studentId', 'firstName lastName admissionNo');
  res.json({ data: guardians });
}));

// Get grades for a student
router.get('/:id/grades', authenticate, asyncHandler(async (req: AuthRequest, res: any) => {
  const grades = await Grade.find({ studentId: req.params.id })
    .populate('subjectId', 'name')
    .populate('examId', 'name')
    .sort({ createdAt: -1 });

  res.json({ data: grades });
}));

// Get attendance for a student
router.get('/:id/attendance', authenticate, asyncHandler(async (req: AuthRequest, res: any) => {
  const records = await Attendance.find({ studentId: req.params.id })
    .sort({ date: -1 });

  res.json({ data: records });
}));

// Get invoices for a student
router.get('/:id/invoices', authenticate, asyncHandler(async (req: AuthRequest, res: any) => {
  const invoices = await Invoice.find({ studentId: req.params.id }).sort({ dueDate: -1 });
  res.json({ data: invoices });
}));

// Add guardian
router.post('/:id/guardians', authenticate, authorize('admin', 'academic_admin'), asyncHandler(async (req: AuthRequest, res: any) => {
  const data = createGuardianSchema.parse(req.body);
  
  // If setting as primary, unset other primary guardians
  if (data.isPrimary) {
    await Guardian.updateMany(
      { studentId: req.params.id, isPrimary: true },
      { $set: { isPrimary: false } }
    );
  }

  const guardian = new Guardian({ ...data, studentId: req.params.id });
  await guardian.save();
  
  res.status(201).json({ data: guardian });
}));

// Update guardian
router.patch('/:id/guardians/:guardianId', authenticate, authorize('admin', 'academic_admin', 'parent'), asyncHandler(async (req: AuthRequest, res: any) => {
  const data = createGuardianSchema.partial().parse(req.body);

  // If parent user is editing, ensure they own this guardian record
  if (req.user && req.user.role === 'parent') {
    const g = await Guardian.findById(req.params.guardianId);
    if (!g) throw new AppError(404, 'NOT_FOUND', 'Guardian not found');
    if (g.userId && g.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Cannot modify other guardian records' } });
    }
  }
  
  if (data.isPrimary) {
    await Guardian.updateMany(
      { studentId: req.params.id, isPrimary: true, _id: { $ne: req.params.guardianId } },
      { $set: { isPrimary: false } }
    );
  }

  const guardian = await Guardian.findOneAndUpdate(
    { _id: req.params.guardianId, studentId: req.params.id },
    { $set: data },
    { new: true }
  );

  if (!guardian) {
    throw new AppError(404, 'NOT_FOUND', 'Guardian not found');
  }

  res.json({ data: guardian });
}));

export default router;


