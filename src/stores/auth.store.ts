import { queryClient } from "../config";
import { isTokenExpired } from "../utils/jwt";
import type { SessionUser } from "../services";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  user: SessionUser | null;
  token: string | null;
  setSession: (payload: { user: SessionUser; token: string }) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setSession: ({ user, token }) => set({ user, token }),
      logout: () => {
        set({ user: null, token: null });
        queryClient.clear();
      },
      isAuthenticated: () => {
        const { token } = get();
        if (!token) return false;
        return !isTokenExpired(token);
      },
    }),
    {
      name: "auth-session",
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
