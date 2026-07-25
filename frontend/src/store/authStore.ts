import { create } from 'zustand';

interface AuthStore {
  user: { name: string; email: string } | null;
  isGmailConnected: boolean;
  setGmailConnected: (connected: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: { name: 'Executive User', email: 'user@example.com' },
  isGmailConnected: true,
  setGmailConnected: (isGmailConnected) => set({ isGmailConnected }),
}));
