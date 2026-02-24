import { create } from 'zustand';
import type { Track } from '@/types/music';

interface TrackStore {
  localTracks: Track[];
  setLocalTracks: (tracks: Track[]) => void;
  addTrack: (track: Track) => void;
  addTracks: (tracks: Track[]) => void;
  removeTrack: (id: string) => void;
  updateTrack: (track: Track) => void;
  clearTracks: () => void;
  getTrackById: (id: string) => Track | undefined;
}

export const useTrackStore = create<TrackStore>()(
  (set, get) => ({
    localTracks: [],
    
    setLocalTracks: (tracks) => set({ localTracks: tracks }),
      
      addTrack: (track) => set((state) => {
        // Prevent duplicates
        if (state.localTracks.some((t) => t.id === track.id)) {
          return state;
        }
        return { localTracks: [...state.localTracks, track] };
      }),
      
      addTracks: (tracks) => set((state) => {
        const existingIds = new Set(state.localTracks.map((t) => t.id));
        const newTracks = tracks.filter((t) => !existingIds.has(t.id));
        return { localTracks: [...state.localTracks, ...newTracks] };
      }),
      
      removeTrack: (id) => set((state) => {
        // Cleanup blob URL before removing track
        const track = state.localTracks.find((t) => t.id === id);
        if (track?.blobUrl) {
          URL.revokeObjectURL(track.blobUrl);
        }
        return {
          localTracks: state.localTracks.filter((t) => t.id !== id),
        };
      }),

      updateTrack: (track) => set((state) => ({
        localTracks: state.localTracks.map((t) => t.id === track.id ? track : t),
      })),
      
      clearTracks: () => set((state) => {
        // Cleanup all blob URLs before clearing
        state.localTracks.forEach((track) => {
          if (track.blobUrl) {
            URL.revokeObjectURL(track.blobUrl);
          }
        });
        return { localTracks: [] };
      }),
      
      getTrackById: (id) => get().localTracks.find((t) => t.id === id),
  })
);
