import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '../api/students';

const StudentProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['student', id],
    queryFn: () => (id ? studentsApi.getById(id) : Promise.reject('No id')),
    enabled: !!id,
  });

  if (isLoading) return <div className="p-6">Loading student...</div>;
  if (error) return <div className="p-6 text-red-600">Could not load student</div>;

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{data?.firstName} {data?.lastName}</h1>
        <div>
          <button onClick={() => navigate('/students')} className="px-3 py-1 mr-2 border rounded">Back</button>
        </div>
      </div>

      <div className="bg-white shadow p-6 rounded">
        <p><strong>Admission:</strong> {data?.admissionNo}</p>
        <p><strong>Class:</strong> {data?.classId?.name || 'Unassigned'}</p>
        <p><strong>Email(s):</strong> {(data?.emails || []).join(', ')}</p>
        <p><strong>Contacts:</strong> {(data?.contacts || []).join(', ')}</p>
      </div>
    </div>
  );
};

export default StudentProfile;
