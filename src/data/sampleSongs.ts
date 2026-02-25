import type { Track } from '@/types/music';

/**
 * Sample songs for demo purposes
 * These are placeholder tracks that show users what the app looks like with music
 */
export const SAMPLE_SONGS: Omit<Track, 'fileId' | 'userId' | 'blobUrl'>[] = [
  {
    id: 'sample-1',
    title: 'Chill Vibes',
    artist: 'Lo-Fi Beats',
    album: 'Relaxing Melodies',
    duration: 183, // 3:03
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80',
    isVideo: false,
    addedAt: new Date('2024-01-15'),
  },
  {
    id: 'sample-2',
    title: 'Summer Nights',
    artist: 'Indie Wave',
    album: 'Coastal Dreams',
    duration: 234, // 3:54
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80',
    isVideo: false,
    addedAt: new Date('2024-01-16'),
  },
  {
    id: 'sample-3',
    title: 'Morning Coffee',
    artist: 'Jazz Collective',
    album: 'Café Sessions',
    duration: 267, // 4:27
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80',
    isVideo: false,
    addedAt: new Date('2024-01-17'),
  },
  {
    id: 'sample-4',
    title: 'Electric Dreams',
    artist: 'Synthwave Collective',
    album: 'Neon Nights',
    duration: 195, // 3:15
    coverUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&q=80',
    isVideo: false,
    addedAt: new Date('2024-01-18'),
  },
  {
    id: 'sample-5',
    title: 'Urban Rhythm',
    artist: 'Street Beats',
    album: 'City Lights',
    duration: 211, // 3:31
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80',
    isVideo: false,
    addedAt: new Date('2024-01-19'),
  },
  {
    id: 'sample-6',
    title: 'Midnight Drive',
    artist: 'Retrowave',
    album: 'Highway Dreams',
    duration: 248, // 4:08
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80',
    isVideo: false,
    addedAt: new Date('2024-01-20'),
  },
  {
    id: 'sample-7',
    title: 'Sunrise Meditation',
    artist: 'Ambient Sounds',
    album: 'Inner Peace',
    duration: 312, // 5:12
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80',
    isVideo: false,
    addedAt: new Date('2024-01-21'),
  },
  {
    id: 'sample-8',
    title: 'Study Focus',
    artist: 'Ambient Piano',
    album: 'Concentration',
    duration: 189, // 3:09
    coverUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&q=80',
    isVideo: false,
    addedAt: new Date('2024-01-22'),
  },
];

/**
 * Get sample songs as full Track objects
 * Note: These are demo tracks and won't actually play audio
 * Users can still import their own music files
 */
export function getSampleSongs(userId: number): Track[] {
  return SAMPLE_SONGS.map(song => ({
    ...song,
    fileId: 0, // Demo track, no actual file
    userId,
  }));
}

/**
 * Check if a track is a sample/demo track
 */
export function isSampleTrack(trackId: string): boolean {
  return trackId.startsWith('sample-');
}
