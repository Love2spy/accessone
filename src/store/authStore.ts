import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials, RegisterData } from '../types/auth';
import { login as apiLogin, register as apiRegister } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: async (credentials) => {
        try {
          const { user, token } = await apiLogin(credentials);
          set({ 
            user,
            isAuthenticated: true,
            token
          });
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      register: async (data) => {
        try {
          const { user, token } = await apiRegister(data);
          set({ 
            user,
            isAuthenticated: true,
            token
          });
        } catch (error) {
          console.error('Registration failed:', error);
          throw error;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false,
          token: null
        });
        // Clear all persisted store data
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);