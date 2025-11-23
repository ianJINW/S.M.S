import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export const Academics = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Academics</h1>
        <p className="text-gray-700 mb-4">Overview of classes, subjects and timetables. Explore our curriculum and offerings.</p>
        <div className="space-x-2">
          <button onClick={() => navigate('/login')} className="px-4 py-2 bg-indigo-600 text-white rounded-md">
            Login to manage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Academics</h1>
      <p className="text-gray-700 mb-4">Manage classes, subjects and timetables here.</p>

      <div className="space-y-3">
        <div>
          <h2 className="font-semibold">Quick actions</h2>
          <div className="mt-2 space-x-2">
            <button className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded">View Classes</button>
            <button className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded">View Subjects</button>
          </div>
        </div>

        {user.role === 'admin' || user.role === 'academic_admin' ? (
          <div>
            <h3 className="font-semibold">Administrative</h3>
            <p className="text-sm text-gray-600">You can create classes, assign teachers, and manage grade levels.</p>
            <div className="mt-2">
              <button className="px-3 py-1 bg-green-600 text-white rounded">Create Class</button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold">Teacher tools</h3>
            <p className="text-sm text-gray-600">View timetables, assign homework and manage students for your classes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Academics;
