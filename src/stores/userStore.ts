import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserStore, User } from '@/types/music';

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      // State
      currentUser: null,
      users: [],

      // Actions
      setCurrentUser: (user) => set({ currentUser: user }),
      
      setUsers: (users) => set({ users }),
      
      addUser: (user) => set((state) => ({ 
        users: [...state.users, user] 
      })),
      
      logout: () => set({ currentUser: null }),
    }),
    {
      name: 'playnest-user',
      partialize: (state) => ({
        currentUser: state.currentUser,
      }),
    }
  )
);
