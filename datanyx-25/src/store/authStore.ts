import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const TOKEN_KEY = '@datanyx_auth_token';
const USER_KEY = '@datanyx_user';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { session, user } = response.data.data;
      const token = session.access_token;

      // Store token and user
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

      // Check if user is admin - bypass onboarding (legacy logic, keep if needed)
      // Or check user.isOnboarded from backend
      if (user.isOnboarded) {
        await AsyncStorage.setItem('@peso_profile_setup_complete', 'true');
      } else {
        await AsyncStorage.setItem('@peso_profile_setup_complete', 'false');
      }

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error.response?.data?.error || 'Login failed';
    }
  },

  signup: async (email: string, password: string, name: string, phone: string) => {
    try {
      const response = await api.post('/auth/signup', {
        email,
        password,
        full_name: name,
        phone_number: phone,
      });

      console.log('Signup Response:', JSON.stringify(response.data, null, 2));
      const { token, user } = response.data.data;

      if (token === undefined || token === null) {
        // If token is missing, it likely means email verification is required
        // We don't log them in automatically
        throw new Error('Please check your email to verify your account.');
      }

      if (!user) {
        throw new Error('User data is missing from response.');
      }

      // Store token and user
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

      // Reset onboarding flag
      await AsyncStorage.setItem('@peso_profile_setup_complete', 'false');

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Signup failed:', error);
      if (error.response?.data) {
        console.error('Backend Error Message:', error.response.data);
      }
      throw error.response?.data?.error || 'Signup failed';
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem('@peso_profile_setup_complete');

      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });

      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const userStr = await AsyncStorage.getItem(USER_KEY);

      if (token && userStr) {
        const user = JSON.parse(userStr);

        // Optional: Validate token with backend /api/profile
        // For now, assume valid if present
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
