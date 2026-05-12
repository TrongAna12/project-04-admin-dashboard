import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types";

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

// Mock user for demo
const mockUser: AuthUser = {
  id: "1",
  email: "admin@example.com",
  name: "Admin User",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
  role: "admin",
  permissions: ["read", "write", "delete"],
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: mockUser,
      isAuthenticated: true,
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-store",
    }
  )
);
