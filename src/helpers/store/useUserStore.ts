import { create } from "zustand";

interface UserState {
  publicKey?: string;
  connected: boolean;
  mint?: string[];
  provider?: any;
  program?: any;
  updateUser: (userData: Partial<UserState>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  publicKey: undefined,
  connected: false,
  mint: [],
  provider: undefined,
  program: undefined,

  updateUser: (userData) => set((state) => ({ ...state, ...userData })),
  clearUser: () =>
    set({
      publicKey: undefined,
      connected: false,
      mint: new Array<string>(),
      provider: undefined,
      program: undefined,
    }),
}));