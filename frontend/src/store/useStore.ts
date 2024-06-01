import { create } from "zustand";
import { persist } from "zustand/middleware";

import { User } from "@/api/models/auth-model";

interface AuthStore {
  user?: User;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      setUser: (user: User) => set(() => ({ user })),
      clearUser: () => set(() => ({ user: undefined })),
    }),
    { name: "store" }
  )
);
