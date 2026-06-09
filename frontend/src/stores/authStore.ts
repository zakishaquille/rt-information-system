import { create } from "zustand";
import { apiClient } from "@/api/client";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  fetchUser: async () => {
    try {
      const user = await apiClient.get("user").json<User>();
      set({ user, isAuthenticated: true, isInitialized: true });
    } catch {
      set({ user: null, isAuthenticated: false, isInitialized: true });
    }
  },
}));
