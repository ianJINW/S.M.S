import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export const Exams = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Exams</h1>
        <p className="text-gray-700 mb-4">Browse upcoming exams and study guides. Sign in to take exams or see results.</p>
        <div className="space-x-2">
          <button onClick={() => navigate('/login')} className="px-4 py-2 bg-indigo-600 text-white rounded-md">
            Login to continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Exams</h1>
      <p className="text-gray-700 mb-4">Create and manage exams, questions and submissions.</p>

      <div className="space-y-3">
        <div>
          <button onClick={() => navigate('/exams/published')} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded">View Published Exams</button>
        </div>

        {(user.role === 'teacher' || user.role === 'admin' || user.role === 'academic_admin') && (
          <div>
            <h3 className="font-semibold">Instructor actions</h3>
            <div className="mt-2 space-x-2">
              <button onClick={() => navigate('/exams/new')} className="px-3 py-1 bg-green-600 text-white rounded">Create Exam</button>
              <button onClick={() => navigate('/exams/publish')} className="px-3 py-1 bg-yellow-500 text-white rounded">Publish Exam</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exams;
