import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

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
          
          // Mock successful login for preview
          const mockUser = {
            id: '1',
            email: email.trim().toLowerCase(),
            firstName: 'Demo',
            lastName: 'User',
            subscription: {
              plan: 'pro' as const,
              status: 'active' as const,
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            },
            usage: {
              contentGenerated: 25,
              postsScheduled: 12,
              aiCallsThisMonth: 37,
              lastResetDate: new Date().toISOString()
            },
            preferences: {
              theme: 'system' as const,
              notifications: {
                email: true,
                push: true
              }
            }
          };
          
          const accessToken = 'mock-access-token';
          const refreshToken = 'mock-refresh-token';
          
          set({
            user: mockUser,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          console.log('Login successful');
        } catch (error: any) {
          console.error('Login error:', error);
          const errorMessage = 'Login failed';
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
          
          // Mock successful registration for preview
          const mockUser = {
            id: '1',
            email: userData.email.trim().toLowerCase(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            subscription: {
              plan: 'free' as const,
              status: 'active' as const,
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            },
            usage: {
              contentGenerated: 0,
              postsScheduled: 0,
              aiCallsThisMonth: 0,
              lastResetDate: new Date().toISOString()
            },
            preferences: {
              theme: 'system' as const,
              notifications: {
                email: true,
                push: true
              }
            }
          };
          
          const accessToken = 'mock-access-token';
          const refreshToken = 'mock-refresh-token';
          
          set({
            user: mockUser,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          console.log('Registration successful');
        } catch (error: any) {
          console.error('Registration error:', error);
          const errorMessage = 'Registration failed';
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
        
        // Clear localStorage
        localStorage.removeItem('auth-storage');
      },

      refreshAccessToken: async () => {
        // Mock token refresh for preview
        console.log('Token refresh not needed in preview mode');
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