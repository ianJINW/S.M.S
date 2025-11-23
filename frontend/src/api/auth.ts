import apiClient from './client';
import { useAuthStore } from '../stores/authStore';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    themePreference?: 'light' | 'dark';
  };
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<{ data: LoginResponse }>('/auth/login', data);
    const result = response.data.data;
    useAuthStore.getState().setAuth(result.user, result.accessToken, result.refreshToken);
    // If server provides a theme preference for the user, apply it immediately
    try {
      const theme = (result.user as any).themePreference as 'light' | 'dark' | undefined;
      if (theme === 'light' || theme === 'dark') {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
      }
    } catch (e) {
      // ignore
    }
    return result;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    useAuthStore.getState().clearAuth();
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await apiClient.post<{ data: { accessToken: string; refreshToken: string } }>('/auth/refresh', {
      refreshToken,
    });
    const result = response.data.data;
    useAuthStore.getState().updateTokens(result.accessToken, result.refreshToken);
    return result;
  },
};


