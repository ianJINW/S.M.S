import React, { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { useAuthStore } from '../stores/authStore';

const ParentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [guardians, setGuardians] = useState<any[]>([]);
  const [student, setStudent] = useState<any | null>(null);
  const [grades, setGrades] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const gRes = await apiClient.get('/students/guardians/me');
        const g = gRes.data.data || [];
        setGuardians(g);

        if (g.length > 0) {
          const sid = g[0].studentId?._id || g[0].studentId;
          const [pRes, grRes, aRes, iRes] = await Promise.all([
            apiClient.get(`/students/${sid}`),
            apiClient.get(`/students/${sid}/grades`),
            apiClient.get(`/students/${sid}/attendance`),
            apiClient.get(`/students/${sid}/invoices`),
          ]);

          setStudent(pRes.data.data);
          setGrades(grRes.data.data || []);
          setAttendance(aRes.data.data || []);
          setInvoices(iRes.data.data || []);
        }
      } catch (e) {
        console.error('Error fetching parent/student data', e);
      }
    };

    if (user && user.role === 'parent') fetch();
  }, [user]);

  if (!user) return <div className="p-6">Please login to view your dashboard.</div>;
  if (user.role !== 'parent') return <div className="p-6">This dashboard is for parent users only.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Parent Dashboard</h1>

      <section className="mb-4">
        <h2 className="text-lg font-semibold">Linked Students</h2>
        {guardians.length === 0 ? <p>No linked students found.</p> : (
          <ul className="list-disc ml-6">
            {guardians.map((g) => (
              <li key={g._id}>{g.studentId?.firstName} {g.studentId?.lastName} — {g.relation}</li>
            ))}
          </ul>
        )}
      </section>

      {student && (
        <div>
          <h2 className="text-xl font-semibold">{student.firstName} {student.lastName}</h2>
          <p>Admission: {student.admissionNo} — Class: {student.classId?.name || '—'}</p>

          <section className="mt-4">
            <h3 className="font-semibold">Recent Grades</h3>
            {grades.length === 0 ? <p>No grades available.</p> : (
              <ul className="list-disc ml-6">
                {grades.map((g) => (
                  <li key={g._id}>{g.subjectId?.name || 'Subject'} — {g.score}/{g.maxScore} ({g.grade})</li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-4">
            <h3 className="font-semibold">Attendance</h3>
            {attendance.length === 0 ? <p>No attendance records.</p> : (
              <ul className="list-disc ml-6">
                {attendance.map((a) => (
                  <li key={a._id}>{new Date(a.date).toLocaleDateString()} — {a.status}</li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-4">
            <h3 className="font-semibold">Invoices</h3>
            {invoices.length === 0 ? <p>No invoices.</p> : (
              <ul className="list-disc ml-6">
                {invoices.map((inv) => (
                  <li key={inv._id}>{inv.invoiceNo} — {inv.total} ({inv.status})</li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
