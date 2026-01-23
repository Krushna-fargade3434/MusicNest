import Dexie, { type EntityTable } from 'dexie';
import type { User, StoredFile, Track } from '@/types/music';

// PlayNest Database using Dexie.js (IndexedDB wrapper)
class MusicNestDB extends Dexie {
  users!: EntityTable<User, 'id'>;
  files!: EntityTable<StoredFile, 'id'>;
  tracks!: EntityTable<Track, 'id'>;

  constructor() {
    super('MusicNestDB');
    
    this.version(1).stores({
      users: '++id, username, email, createdAt',
      files: '++id, path, name, type, userId, [path+userId], createdAt',
      tracks: 'id, title, artist, album, fileId, userId, addedAt',
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

export async function deleteTrack(id: string): Promise<void> {
  await db.tracks.delete(id);
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
}
