import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light' | 'system';
export type AccentColor = 'purple' | 'blue' | 'green';

interface SettingsState {
  theme: Theme;
  accentColor: AccentColor;
  isCompactMode: boolean;
  
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  setCompactMode: (isCompact: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      accentColor: 'purple',
      isCompactMode: false,

      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setCompactMode: (isCompactMode) => set({ isCompactMode }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
