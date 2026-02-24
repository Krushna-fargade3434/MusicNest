// Media file constants
export const AUDIO_EXTENSIONS = [
  '.mp3',
  '.wav',
  '.flac',
  '.ogg',
  '.m4a',
  '.aac',
  '.wma',
] as const;

export const VIDEO_EXTENSIONS = [
  '.mp4',
  '.mp5', // MP4 variant
  '.mkv',
  '.avi',
  '.webm',
  '.mov',
  '.wmv',
] as const;

export const ALL_SUPPORTED_EXTENSIONS = [
  ...AUDIO_EXTENSIONS,
  ...VIDEO_EXTENSIONS,
] as const;

export const FILE_ACCEPT_STRING = ALL_SUPPORTED_EXTENSIONS.join(',');

// Color constants
export const AVATAR_COLORS = [
  'hsl(270, 91%, 65%)', // Purple
  'hsl(280, 100%, 70%)', // Bright Purple
  'hsl(320, 85%, 60%)', // Pink
  'hsl(200, 90%, 60%)', // Blue
  'hsl(150, 80%, 50%)', // Green
  'hsl(30, 90%, 60%)', // Orange
] as const;

// Theme colors
export const ACCENT_COLORS = {
  purple: {
    primary: '270 91% 65%',
    ring: '270 91% 65%',
    accent: '280 100% 70%',
  },
  blue: {
    primary: '217 91% 60%',
    ring: '217 91% 60%',
    accent: '221 83% 53%',
  },
  green: {
    primary: '142 71% 45%',
    ring: '142 71% 45%',
    accent: '142 76% 36%',
  },
} as const;

// Storage keys
export const STORAGE_KEYS = {
  TRACKS: 'playnest-tracks',
  SETTINGS: 'settings-storage',
  USER: 'user-storage',
  PLAYER: 'player-storage',
  PLAYLISTS: 'playlists-storage',
} as const;

// Database name
export const DB_NAME = 'MusicNestDB';
export const DB_VERSION = 2;

// UI constants
export const TOAST_DURATION = 3000;
export const METADATA_TIMEOUT = 5000;
export const SEEK_RESTART_THRESHOLD = 3; // seconds

// Time formatting
export const TIME_FORMAT = {
  HOURS_MINUTES: 'h:mm',
  MINUTES_SECONDS: 'm:ss',
} as const;

// Default values
export const DEFAULT_VOLUME = 0.7;
export const DEFAULT_ARTIST = 'Unknown Artist';
export const DEFAULT_ALBUM = 'Unknown Album';

// Filename parsing delimiters
export const FILENAME_DELIMITERS = [' - ', ' – ', '_-_'] as const;

// Player modes
export const REPEAT_MODES = ['none', 'one', 'all'] as const;
export type RepeatMode = typeof REPEAT_MODES[number];

// Validation
export const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
export const MIN_USERNAME_LENGTH = 2;
export const MAX_USERNAME_LENGTH = 50;
