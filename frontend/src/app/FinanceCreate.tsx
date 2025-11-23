import { useNavigate } from 'react-router-dom';

const FinanceCreate: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create Invoice</h1>
        <button onClick={() => navigate('/finance')} className="px-3 py-1 border rounded">Back</button>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <p className="text-gray-700">Invoice creation is not implemented yet. (Placeholder)</p>
      </div>
    </div>
  );
};

export default FinanceCreate;
