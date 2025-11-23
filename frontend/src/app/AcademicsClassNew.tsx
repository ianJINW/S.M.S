import { useNavigate } from 'react-router-dom';

const AcademicsClassNew: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create Class</h1>
        <button onClick={() => navigate('/academics/classes')} className="px-3 py-1 border rounded">Back</button>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <p className="text-gray-700">Class creation form is not implemented yet. (Placeholder)</p>
      </div>
    </div>
  );
};

export default AcademicsClassNew;
