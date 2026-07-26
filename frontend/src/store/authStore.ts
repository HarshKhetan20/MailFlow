import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  name: string;
  email: string;
  photoURL?: string | null;
}

interface AuthStore {
  user: UserProfile | null;
  isGmailConnected: boolean;
  accessToken: string | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setGmailConnected: (connected: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => {
  // Listen to Supabase Auth state changes automatically
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      const user = session.user;
      set({
        user: {
          name: user.user_metadata?.full_name || user.user_metadata?.name || 'Executive User',
          email: user.email || '',
          photoURL: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        },
        accessToken: session.provider_token || session.access_token || null,
        isGmailConnected: true,
      });
    } else {
      set({
        user: null,
        accessToken: null,
        isGmailConnected: false,
      });
    }
  });

  return {
    user: null,
    isGmailConnected: false,
    accessToken: null,
    isLoading: false,

    signInWithGoogle: async () => {
      set({ isLoading: true });
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            scopes: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
            redirectTo: window.location.origin,
          },
        });
        if (error) {
          console.error('Supabase Google Sign-In error:', error);
          set({ isLoading: false });
        }
      } catch (err) {
        console.error('Supabase Google Sign-In error:', err);
        set({ isLoading: false });
      }
    },

    signOut: async () => {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Sign-out error:', err);
      }
      set({
        user: null,
        accessToken: null,
        isGmailConnected: false,
      });
    },

    setGmailConnected: (isGmailConnected) => set({ isGmailConnected }),
  };
});
