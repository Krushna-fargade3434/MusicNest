// Core type definitions for PlayNest

export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  createdAt: Date;
  avatarColor?: string;
}

export interface StoredFile {
  id?: number;
  path: string;
  name: string;
  type: 'audio' | 'video';
  mimeType: string;
  size: number;
  userId: number;
  blob?: Blob;
  createdAt: Date;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  fileId: number;
  userId: number;
  coverUrl?: string;
  blobUrl?: string;
  isVideo: boolean;
  addedAt: Date;
}

export interface Playlist {
  id?: number;
  name: string;
  description?: string;
  userId: number;
  createdAt: Date;
  coverUrl?: string;
  gradient: string;
}

export interface PlaylistTrack {
  id?: number;
  playlistId: number;
  trackId: string;
  addedAt: Date;
}

export interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  isFullScreen: boolean;
  sleepTimer: number | null;
}

export interface PlayerActions {
  setCurrentTrack: (track: Track | null) => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleFullScreen: () => void;
  playTrack: (track: Track, queue?: Track[]) => void;
  setSleepTimer: (time: number | null) => void;
}

export type PlayerStore = PlayerState & PlayerActions;

export interface UserState {
  currentUser: User | null;
  users: User[];
}

export interface UserActions {
  setCurrentUser: (user: User | null) => void;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  logout: () => void;
}

export type UserStore = UserState & UserActions;

// Supported file extensions
export const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.flac', '.ogg', '.m4a', '.aac', '.wma'];
export const VIDEO_EXTENSIONS = ['.mp4', '.mp5', '.mkv', '.avi', '.webm', '.mov', '.wmv'];
export const ALL_EXTENSIONS = [...AUDIO_EXTENSIONS, ...VIDEO_EXTENSIONS];

export const AUDIO_MIME_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/flac',
  'audio/ogg',
  'audio/mp4',
  'audio/aac',
  'audio/x-ms-wma',
];

export const VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/x-matroska',
  'video/avi',
  'video/webm',
  'video/quicktime',
  'video/x-ms-wmv',
];

export const ALL_MIME_TYPES = [...AUDIO_MIME_TYPES, ...VIDEO_MIME_TYPES];
