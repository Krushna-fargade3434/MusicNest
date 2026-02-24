import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light' | 'system';
export type AccentColor = 'purple' | 'blue' | 'green';
export type LibraryView = 'grid' | 'list';
export type SortBy = 'title' | 'artist' | 'dateAdded' | 'duration';

interface SettingsState {
  // Appearance
  theme: Theme;
  accentColor: AccentColor;
  isCompactMode: boolean;
  showAnimations: boolean;
  
  // Playback
  autoPlayNext: boolean;
  skipDuration: number; // seconds
  keepScreenAwake: boolean;
  
  // Library
  libraryView: LibraryView;
  sortBy: SortBy;
  showFileExtensions: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  setCompactMode: (isCompact: boolean) => void;
  setShowAnimations: (show: boolean) => void;
  setAutoPlayNext: (autoPlay: boolean) => void;
  setSkipDuration: (duration: number) => void;
  setKeepScreenAwake: (keep: boolean) => void;
  setLibraryView: (view: LibraryView) => void;
  setSortBy: (sort: SortBy) => void;
  setShowFileExtensions: (show: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Appearance defaults
      theme: 'dark',
      accentColor: 'purple',
      isCompactMode: false,
      showAnimations: true,
      
      // Playback defaults
      autoPlayNext: true,
      skipDuration: 10,
      keepScreenAwake: false,
      
      // Library defaults
      libraryView: 'grid',
      sortBy: 'dateAdded',
      showFileExtensions: false,

      // Actions
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setCompactMode: (isCompactMode) => set({ isCompactMode }),
      setShowAnimations: (showAnimations) => set({ showAnimations }),
      setAutoPlayNext: (autoPlayNext) => set({ autoPlayNext }),
      setSkipDuration: (skipDuration) => set({ skipDuration }),
      setKeepScreenAwake: (keepScreenAwake) => set({ keepScreenAwake }),
      setLibraryView: (libraryView) => set({ libraryView }),
      setSortBy: (sortBy) => set({ sortBy }),
      setShowFileExtensions: (showFileExtensions) => set({ showFileExtensions }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
