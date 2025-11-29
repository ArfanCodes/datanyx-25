import { create } from 'zustand';

interface UserState {
  name: string;
  setName: (name: string) => void;
  // Add more user state here as needed
}

export const useUserStore = create<UserState>((set) => ({
  name: 'User',
  setName: (name) => set({ name }),
}));
