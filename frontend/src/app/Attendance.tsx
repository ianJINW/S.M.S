import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export const AttendancePage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Attendance</h1>
        <p className="text-gray-700 mb-4">Public attendance summaries are available. Sign in to mark attendance.</p>
        <button onClick={() => navigate('/login')} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Login</button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Attendance</h1>
      <p className="text-gray-700 mb-4">Mark and review attendance for your classes.</p>
    </div>
  );
};

export default AttendancePage;
