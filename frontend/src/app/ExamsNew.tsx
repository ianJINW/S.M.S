import { useNavigate } from 'react-router-dom';

const ExamsNew: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create Exam</h1>
        <button onClick={() => navigate('/exams')} className="px-3 py-1 border rounded">Back</button>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <p className="text-gray-700">Exam creation UI is not implemented yet. (Placeholder)</p>
      </div>
    </div>
  );
};

export default ExamsNew;
