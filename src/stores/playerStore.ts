import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlayerStore, Track } from '@/types/music';

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      // State
      currentTrack: null,
      queue: [],
      isPlaying: false,
      volume: 0.7,
      currentTime: 0,
      duration: 0,
      shuffle: false,
      repeat: 'none',
      isFullScreen: false,
      sleepTimer: null,

      // Actions
      setCurrentTrack: (track) => set({ currentTrack: track }),
      
      setQueue: (tracks) => set({ queue: tracks }),
      
      addToQueue: (track) => set((state) => ({ 
        queue: [...state.queue, track] 
      })),
      
      play: () => set({ isPlaying: true }),
      
      pause: () => set({ isPlaying: false }),
      
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      
      next: () => {
        const { queue, currentTrack, shuffle, repeat } = get();
        if (!currentTrack || queue.length === 0) return;
        
        const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
        
        if (shuffle) {
          const availableTracks = queue.filter((t) => t.id !== currentTrack.id);
          if (availableTracks.length > 0) {
            const randomTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];
            set({ currentTrack: randomTrack, currentTime: 0 });
          }
        } else {
          let nextIndex = currentIndex + 1;
          
          if (nextIndex >= queue.length) {
            if (repeat === 'all') {
              nextIndex = 0;
            } else {
              return; // End of queue
            }
          }
          
          set({ currentTrack: queue[nextIndex], currentTime: 0 });
        }
      },
      
      previous: () => {
        const { queue, currentTrack, currentTime } = get();
        if (!currentTrack || queue.length === 0) return;
        
        // If more than 3 seconds in, restart current track
        if (currentTime > 3) {
          set({ currentTime: 0 });
          return;
        }
        
        const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
        const prevIndex = currentIndex - 1;
        
        if (prevIndex >= 0) {
          set({ currentTrack: queue[prevIndex], currentTime: 0 });
        } else {
          set({ currentTime: 0 });
        }
      },
      
      setVolume: (volume) => set({ volume }),
      
      setCurrentTime: (time) => set({ currentTime: time }),
      
      setDuration: (duration) => set({ duration }),
      
      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
      
      toggleRepeat: () => set((state) => {
        const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
        const currentIndex = modes.indexOf(state.repeat);
        const nextIndex = (currentIndex + 1) % modes.length;
        return { repeat: modes[nextIndex] };
      }),
      
      toggleFullScreen: () => set((state) => ({ isFullScreen: !state.isFullScreen })),
      
      playTrack: (track, queue) => {
        set({
          currentTrack: track,
          queue: queue || [track],
          isPlaying: true,
          currentTime: 0,
        });
      },

      setSleepTimer: (time) => set({ sleepTimer: time }),
    }),
    {
      name: 'player-storage',
      partialize: (state) => ({
        volume: state.volume,
        shuffle: state.shuffle,
        repeat: state.repeat,
      }),
    }
  )
);
