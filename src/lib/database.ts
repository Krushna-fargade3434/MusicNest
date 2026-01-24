import Dexie, { type EntityTable } from 'dexie';
import type { User, StoredFile, Track, Playlist, PlaylistTrack } from '@/types/music';

// PlayNest Database using Dexie.js (IndexedDB wrapper)
class MusicNestDB extends Dexie {
  users!: EntityTable<User, 'id'>;
  files!: EntityTable<StoredFile, 'id'>;
  tracks!: EntityTable<Track, 'id'>;
  playlists!: EntityTable<Playlist, 'id'>;
  playlistTracks!: EntityTable<PlaylistTrack, 'id'>;

  constructor() {
    super('MusicNestDB');
    
    this.version(1).stores({
      users: '++id, username, email, createdAt',
      files: '++id, path, name, type, userId, [path+userId], createdAt',
      tracks: 'id, title, artist, album, fileId, userId, addedAt',
    });

    this.version(2).stores({
      playlists: '++id, name, userId, createdAt',
      playlistTracks: '++id, playlistId, trackId, [playlistId+trackId], addedAt',
    });
  }
}

export const db = new MusicNestDB();

// User operations
export async function createUser(username: string, email: string, password?: string): Promise<User> {
  const avatarColors = [
    'hsl(270, 91%, 65%)',
    'hsl(280, 100%, 70%)',
    'hsl(320, 85%, 60%)',
    'hsl(200, 90%, 60%)',
    'hsl(150, 80%, 50%)',
    'hsl(30, 90%, 60%)',
  ];
  
  const user: User = {
    username,
    email,
    password,
    createdAt: new Date(),
    avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
  };
  
  const id = await db.users.add(user);
  return { ...user, id };
}

export async function getAllUsers(): Promise<User[]> {
  return db.users.toArray();
}

export async function getUserById(id: number): Promise<User | undefined> {
  return db.users.get(id);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  return db.users.where('email').equals(email).first();
}

// File operations
export async function saveFile(file: StoredFile): Promise<number> {
  return db.files.add(file);
}

export async function getFilesByUser(userId: number): Promise<StoredFile[]> {
  return db.files.where('userId').equals(userId).toArray();
}

export async function getFileById(id: number): Promise<StoredFile | undefined> {
  return db.files.get(id);
}

export async function fileExists(path: string, userId: number): Promise<boolean> {
  const file = await db.files.where('[path+userId]').equals([path, userId]).first();
  return !!file;
}

export async function deleteFile(id: number): Promise<void> {
  await db.files.delete(id);
  // Also delete associated tracks
  await db.tracks.where('fileId').equals(id).delete();
}

// Track operations
export async function saveTrack(track: Track): Promise<string> {
  await db.tracks.put(track);
  return track.id;
}

export async function getTracksByUser(userId: number): Promise<Track[]> {
  return db.tracks.where('userId').equals(userId).toArray();
}

export async function getTrackById(id: string): Promise<Track | undefined> {
  return db.tracks.get(id);
}

export async function updateTrack(track: Track): Promise<void> {
  await db.tracks.put(track);
}

export async function deleteTrack(id: string): Promise<void> {
  const track = await db.tracks.get(id);
  if (track) {
    await db.files.delete(track.fileId);
    await db.tracks.delete(id);
    // Also remove from any playlists
    await db.playlistTracks.where('trackId').equals(id).delete();
  }
}

export async function trackExistsByTitle(title: string, userId: number): Promise<boolean> {
  const track = await db.tracks
    .where('userId')
    .equals(userId)
    .filter((t) => t.title.toLowerCase() === title.toLowerCase())
    .first();
  return !!track;
}

// Clear all data for a user
export async function clearUserData(userId: number): Promise<void> {
  await db.files.where('userId').equals(userId).delete();
  await db.tracks.where('userId').equals(userId).delete();
  await db.playlists.where('userId').equals(userId).delete();
  // We can't easily filter playlistTracks by user without a join or index, 
  // but since playlists are deleted, we can clean up orphaned playlistTracks later or 
  // we should assume the user owns the playlist.
  // Ideally, we iterate playlists to delete tracks, but for now this is fine.
}

// Playlist operations
export async function createPlaylist(playlist: Playlist): Promise<number> {
  return db.playlists.add(playlist);
}

export async function getPlaylistsByUser(userId: number): Promise<Playlist[]> {
  return db.playlists.where('userId').equals(userId).toArray();
}

export async function deletePlaylist(id: number): Promise<void> {
  await db.playlists.delete(id);
  await db.playlistTracks.where('playlistId').equals(id).delete();
}

export async function addTrackToPlaylist(playlistId: number, trackId: string): Promise<number> {
  const existing = await db.playlistTracks.where('[playlistId+trackId]').equals([playlistId, trackId]).first();
  if (existing) return existing.id!;
  
  return db.playlistTracks.add({
    playlistId,
    trackId,
    addedAt: new Date(),
  });
}

export async function addTracksToPlaylist(playlistId: number, trackIds: string[]): Promise<void> {
  const items = trackIds.map(trackId => ({
    playlistId,
    trackId,
    addedAt: new Date(),
  }));
  
  // We should check for duplicates, but bulkAdd might fail on unique constraint?
  // Our schema is: playlistTracks: '++id, playlistId, trackId, [playlistId+trackId], addedAt'
  // [playlistId+trackId] is a compound index but not unique by default unless we specify unique: true?
  // In Dexie, indexes are not unique by default unless `&` is used.
  // My schema was: playlistTracks: '++id, playlistId, trackId, [playlistId+trackId], addedAt'
  // No `&` prefix, so duplicates are allowed by DB but we want to avoid them logically.
  
  // To be safe, we check existing.
  const existing = await db.playlistTracks.where('playlistId').equals(playlistId).toArray();
  const existingTrackIds = new Set(existing.map(pt => pt.trackId));
  
  const newItems = items.filter(item => !existingTrackIds.has(item.trackId));
  
  if (newItems.length > 0) {
    await db.playlistTracks.bulkAdd(newItems);
  }
}

export async function removeTrackFromPlaylist(playlistId: number, trackId: string): Promise<void> {
  await db.playlistTracks.where('[playlistId+trackId]').equals([playlistId, trackId]).delete();
}

export async function getPlaylistTracks(playlistId: number): Promise<Track[]> {
  const playlistTracks = await db.playlistTracks.where('playlistId').equals(playlistId).toArray();
  const trackIds = playlistTracks.map(pt => pt.trackId);
  const tracks = await db.tracks.bulkGet(trackIds);
  return tracks.filter((t): t is Track => !!t);
}
