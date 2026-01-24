import { create } from 'zustand';
import { 
  getPlaylistsByUser, 
  createPlaylist, 
  deletePlaylist, 
  getPlaylistTracks, 
  addTrackToPlaylist, 
  addTracksToPlaylist,
  removeTrackFromPlaylist,
  db
} from '@/lib/database';
import type { Playlist, Track } from '@/types/music';
import { toast } from 'sonner';

interface PlaylistState {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  currentPlaylistTracks: Track[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadPlaylists: (userId: number) => Promise<void>;
  createPlaylist: (name: string, userId: number, description?: string) => Promise<void>;
  deletePlaylist: (id: number, userId: number) => Promise<void>;
  setCurrentPlaylist: (playlist: Playlist | null) => void;
  loadPlaylistTracks: (playlistId: number) => Promise<void>;
  addTrackToPlaylist: (playlistId: number, trackId: string) => Promise<void>;
  addTracksToPlaylist: (playlistId: number, trackIds: string[]) => Promise<void>;
  removeTrackFromPlaylist: (playlistId: number, trackId: string) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  currentPlaylistTracks: [],
  isLoading: false,
  error: null,

  loadPlaylists: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const playlists = await getPlaylistsByUser(userId);
      set({ playlists, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load playlists', isLoading: false });
    }
  },

  createPlaylist: async (name: string, userId: number, description?: string) => {
    set({ isLoading: true, error: null });
    try {
      const gradients = [
        'from-indigo-500 via-purple-500 to-pink-500',
        'from-emerald-500 via-teal-500 to-cyan-500',
        'from-orange-500 via-amber-500 to-yellow-500',
        'from-blue-500 via-cyan-500 to-teal-500',
        'from-rose-500 via-pink-500 to-fuchsia-500',
      ];
      
      const newPlaylist: Playlist = {
        name,
        description,
        userId,
        createdAt: new Date(),
        gradient: gradients[Math.floor(Math.random() * gradients.length)],
      };
      
      await createPlaylist(newPlaylist);
      // Reload playlists
      const playlists = await getPlaylistsByUser(userId);
      set({ playlists, isLoading: false });
      toast.success("Playlist created successfully");
    } catch (error) {
      set({ error: 'Failed to create playlist', isLoading: false });
      toast.error("Failed to create playlist");
    }
  },

  deletePlaylist: async (id: number, userId: number) => {
    try {
      await deletePlaylist(id);
      const playlists = await getPlaylistsByUser(userId);
      set({ playlists });
      if (get().currentPlaylist?.id === id) {
        set({ currentPlaylist: null, currentPlaylistTracks: [] });
      }
      toast.success("Playlist deleted");
    } catch (error) {
      toast.error("Failed to delete playlist");
    }
  },

  setCurrentPlaylist: (playlist) => {
    set({ currentPlaylist: playlist });
    if (playlist?.id) {
      get().loadPlaylistTracks(playlist.id);
    } else {
      set({ currentPlaylistTracks: [] });
    }
  },

  loadPlaylistTracks: async (playlistId: number) => {
    try {
      const tracks = await getPlaylistTracks(playlistId);
      
      // Enrich tracks with blob URLs for playback
      const fileIds = [...new Set(tracks.map(t => t.fileId).filter((id): id is number => id !== undefined))];
      const files = await db.files.bulkGet(fileIds);
      const fileMap = new Map(files.filter(f => f).map(f => [f!.id, f!]));
      
      const tracksWithUrls = tracks.map(track => {
        if (track.fileId && fileMap.has(track.fileId)) {
          const file = fileMap.get(track.fileId)!;
          if (file.blob) {
            return { ...track, blobUrl: URL.createObjectURL(file.blob) };
          }
        }
        return track;
      });

      set({ currentPlaylistTracks: tracksWithUrls });
    } catch (error) {
      console.error("Failed to load playlist tracks", error);
    }
  },

  addTrackToPlaylist: async (playlistId: number, trackId: string) => {
    try {
      await addTrackToPlaylist(playlistId, trackId);
      await get().loadPlaylistTracks(playlistId);
      toast.success("Added to playlist");
    } catch (error) {
      toast.error("Failed to add track");
    }
  },

  addTracksToPlaylist: async (playlistId: number, trackIds: string[]) => {
    try {
      await addTracksToPlaylist(playlistId, trackIds);
      await get().loadPlaylistTracks(playlistId);
      toast.success("Added tracks to playlist");
    } catch (error) {
      toast.error("Failed to add tracks");
    }
  },

  removeTrackFromPlaylist: async (playlistId: number, trackId: string) => {
    try {
      await removeTrackFromPlaylist(playlistId, trackId);
      await get().loadPlaylistTracks(playlistId);
      toast.success("Removed from playlist");
    } catch (error) {
      toast.error("Failed to remove track");
    }
  }
}));
