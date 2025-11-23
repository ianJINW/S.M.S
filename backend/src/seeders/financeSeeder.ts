import mongoose from 'mongoose';
import '../modules/finance/models/Invoice';
import '../modules/finance/models/Payment';
import '../modules/students/models/Student';

const Invoice = mongoose.model('Invoice');
const Payment = mongoose.model('Payment');
const Student = mongoose.model('Student');

export async function seedFinance() {
  try {
    await Invoice.deleteMany({});
    await Payment.deleteMany({});

    // Create invoices for multiple students
    const students = await Student.find({}).limit(12);
    if (!students || students.length === 0) {
      throw new Error('No students found. Please seed students first.');
    }

    const invoices: any[] = [];
    const payments: any[] = [];
    for (let i = 0; i < students.length; i++) {
      const s = students[i];
      const total = 500 + (i * 50);
      const invoice = {
        studentId: s._id,
        invoiceNo: `INV-${Date.now()}-${i}`,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        currency: 'USD',
        items: [
          { head: 'Tuition Fee', amount: total - 100 },
          { head: 'Activity Fee', amount: 100 },
        ],
        total,
        balance: total,
        status: 'open',
      };
      invoices.push(invoice);
    }

    const saved = await Invoice.insertMany(invoices);

    // Add payments for half of them
    for (let i = 0; i < saved.length; i++) {
      if (i % 2 === 0) {
        const inv = saved[i];
        const amount = Math.round(inv.total / 2);
        payments.push({
          invoiceId: inv._id,
          method: 'card',
          amount,
          currency: inv.currency,
          txnRef: `TXN-${Date.now()}-${i}`,
          status: 'succeeded',
          receivedAt: new Date(),
          idempotencyKey: `PAY-${Date.now()}-${i}`,
        });
        // adjust invoice
        inv.balance = inv.total - amount;
        inv.status = inv.balance === 0 ? 'paid' : 'partial';
        await inv.save();
      }
    }

    if (payments.length) await Payment.insertMany(payments);

    console.log('✅ Finance data seeded');
  } catch (error) {
    console.error('❌ Error seeding finance data:', error);
    throw error;
  }
}