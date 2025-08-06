import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import api from '../services/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log('Attempting login for:', email);
          
          const response = await api.post('/auth/login', { 
            email: email.trim().toLowerCase(), 
            password 
          });
          
          console.log('Login response:', response.data);
          
          const { user, accessToken, refreshToken } = response.data;
          
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          // Set default authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          
          console.log('Login successful');
        } catch (error: any) {
          console.error('Login error:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Login failed';
          set({ 
            isLoading: false, 
            error: errorMessage,
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null
          });
          throw new Error(errorMessage);
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          console.log('Attempting registration for:', userData.email);
          
          const response = await api.post('/auth/register', {
            ...userData,
            email: userData.email.trim().toLowerCase()
          });
          
          console.log('Registration response:', response.data);
          
          const { user, accessToken, refreshToken } = response.data;
          
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          // Set default authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          
          console.log('Registration successful');
        } catch (error: any) {
          console.error('Registration error:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
          set({ 
            isLoading: false, 
            error: errorMessage,
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null
          });
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        console.log('Logging out...');
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null
        });
        
        // Remove authorization header
        delete api.defaults.headers.common['Authorization'];
        
        // Clear localStorage
        localStorage.removeItem('auth-storage');
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().logout();
          return;
        }

        try {
          console.log('Refreshing access token...');
          const response = await api.post('/auth/refresh', { refreshToken });
          const { accessToken } = response.data;
          
          set({ accessToken });
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          console.log('Token refreshed successfully');
        } catch (error) {
          console.error('Token refresh failed:', error);
          get().logout();
          throw error;
        }
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }));
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);