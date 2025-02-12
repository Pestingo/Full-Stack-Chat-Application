import { create } from 'zustand';
import * as api from '../lib/api';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  signIn: async (email: string, password: string) => {
    const { user } = await api.login(email, password);
    set({ user });
  },
  signUp: async (email: string, password: string) => {
    const { user } = await api.register(email, password);
    set({ user });
  },
  signOut: () => set({ user: null }),
}));