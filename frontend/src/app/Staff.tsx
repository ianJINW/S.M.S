import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export const Staff = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Staff</h1>
        <p className="text-gray-700 mb-4">Meet our teachers and staff. Sign in to manage staff details.</p>
        <button onClick={() => navigate('/login')} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Login</button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Staff</h1>
      <p className="text-gray-700 mb-4">Manage staff records, assignments and roles.</p>
    </div>
  );
};

export default Staff;
