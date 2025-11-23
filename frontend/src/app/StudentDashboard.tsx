import React, { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { useAuthStore } from '../stores/authStore';

const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [grades, setGrades] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const p = await apiClient.get('/students/me');
        setProfile(p.data.data);

        const [gRes, aRes, iRes] = await Promise.all([
          apiClient.get('/students/me/grades'),
          apiClient.get('/students/me/attendance'),
          apiClient.get('/students/me/invoices'),
        ]);

        setGrades(gRes.data.data || []);
        setAttendance(aRes.data.data || []);
        setInvoices(iRes.data.data || []);
      } catch (e) {
        console.error('Error fetching student data', e);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'student') fetch();
  }, [user]);

  if (!user) return <div className="p-6">Please login to view your dashboard.</div>;
  if (user.role !== 'student') return <div className="p-6">This dashboard is for student users only.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      {loading && <p>Loading...</p>}
      {profile && (
        <div className="mb-4">
          <p><strong>{profile.firstName} {profile.lastName}</strong> — Admission: {profile.admissionNo}</p>
          <p>Class: {profile.classId?.name || '—'}</p>
        </div>
      )}

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Recent Grades</h2>
        {grades.length === 0 ? <p>No grades available.</p> : (
          <ul className="list-disc ml-6">
            {grades.map((g) => (
              <li key={g._id}>{g.subjectId?.name || 'Subject'} — {g.score}/{g.maxScore} ({g.grade})</li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Attendance</h2>
        {attendance.length === 0 ? <p>No attendance records.</p> : (
          <ul className="list-disc ml-6">
            {attendance.map((a) => (
              <li key={a._id}>{new Date(a.date).toLocaleDateString()} — {a.status}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold">Invoices</h2>
        {invoices.length === 0 ? <p>No invoices.</p> : (
          <ul className="list-disc ml-6">
            {invoices.map((inv) => (
              <li key={inv._id}>{inv.invoiceNo} — {inv.total} ({inv.status})</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;
