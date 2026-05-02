import { LoginResponse, User, UserInfo } from '@/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AuthStore = {
  user: User | null;
  accessToken: string;
  userInfo: UserInfo | null;
  login: (response: LoginResponse) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setUserInfo: (info: UserInfo) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: '',
      userInfo: null,

      login: (response) =>
        set({
          accessToken: response.access_token,
          userInfo: response.username, // maps to UserInfo
        }),

      logout: () =>
        set({
          user: null,
          accessToken: '',
          userInfo: null,
        }),

      setUser: (user) => set({ user }),
      setUserInfo: (info) => set({ userInfo: info }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
