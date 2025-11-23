import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../api/client';
import { useAuthStore } from '../stores/authStore';

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const { data } = useQuery<any>({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await apiClient.get('/auth/me');
      return res.data.data;
    },
  });

  const [theme, setTheme] = useState<'light' | 'dark' | ''>('');

  useEffect(() => {
    if (data && data.themePreference) setTheme(data.themePreference);
    else if (user && (user as any).themePreference) setTheme((user as any).themePreference);
  }, [data, user]);

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiClient.patch('/auth/me', payload);
      return res.data.data;
    },
    onSuccess: (updated) => {
      // persist theme locally
      if (updated.themePreference) {
        localStorage.setItem('theme', updated.themePreference);
        document.documentElement.setAttribute('data-theme', updated.themePreference);
      }
      // update auth store's user data if we have a user
      if (updated && (window as any).__AUTH_STORE_SET__) {
        // fallback: update via setAuth if available
        try {
          const tokens = useAuthStore.getState();
          useAuthStore.getState().setAuth({ ...(tokens.user as any), ...updated }, tokens.accessToken || '', tokens.refreshToken || '');
        } catch (e) {
          // ignore
        }
      }
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Theme preference</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value as any)} className="mt-1 block w-48 rounded-md border-gray-300">
            <option value="">(use system / no preference)</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div>
          <button onClick={() => mutation.mutate({ themePreference: theme || null })} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Save</button>
          {mutation.isError && <div className="text-red-600 mt-2">Failed to save</div>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
