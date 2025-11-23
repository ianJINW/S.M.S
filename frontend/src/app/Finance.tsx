import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export const Finance = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Finance</h1>
        <p className="text-gray-700 mb-4">View invoices and make payments. You'll need to sign in to see personal invoices.</p>
        <button onClick={() => navigate('/login')} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Login</button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Finance</h1>
      <p className="text-gray-700 mb-4">Invoices, payments and financial reports.</p>

      {user.role === 'finance' || user.role === 'admin' ? (
        <div>
          <h3 className="font-semibold">Finance Dashboard</h3>
          <p className="text-sm text-gray-600">Create invoices, process payments and run reports.</p>
          <div className="mt-2">
            <button className="px-3 py-1 bg-green-600 text-white rounded-md">Create Invoice</button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="font-semibold">Your invoices</h3>
          <p className="text-sm text-gray-600">View and pay invoices associated with your account.</p>
          <div className="mt-2">
            <button className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded">View Invoices</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
