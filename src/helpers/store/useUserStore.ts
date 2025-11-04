import { create } from "zustand";

interface UserState {
  // For chein logic
  publicKey?: string;
  connected: boolean;
  mint?: string[];
  provider?: any;
  program?: any;

  // User info from server
  username?: string;
  rewards?: string[];
  createdAt?: string;
  lastSeen?: string;
  banned?: boolean;
  banReason?: string;

  // Actions
  updateUser: (userData: Partial<UserState>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  // For chein logic
  publicKey: undefined,
  connected: false,
  mint: [],
  provider: undefined,
  program: undefined,

  // User info from server
  username: undefined,
  rewards: [],
  createdAt: undefined,
  lastSeen: undefined,
  banned: undefined,
  banReason: undefined,

  updateUser: (userData) => set((state) => ({ ...state, ...userData })),
  clearUser: () =>
    set({
      // For chein logic
      publicKey: undefined,
      connected: false,
      mint: new Array<string>(),
      provider: undefined,
      program: undefined,

      // User info from server
      username: undefined,
      rewards: new Array<string>(),
      createdAt: undefined,
      lastSeen: undefined,
      banned: undefined,
      banReason: undefined,
    }),
}));