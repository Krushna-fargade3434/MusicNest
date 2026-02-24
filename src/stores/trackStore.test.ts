import { describe, it, expect, beforeEach } from 'vitest';
import { useTrackStore } from './trackStore';
import type { Track } from '@/types/music';

describe('TrackStore', () => {
  const mockTrack: Track = {
    id: '1',
    title: 'Test Song',
    artist: 'Test Artist',
    album: 'Test Album',
    duration: 180,
    fileId: 1,
    userId: 1,
    isVideo: false,
    addedAt: new Date(),
  };

  beforeEach(() => {
    // Reset store
    useTrackStore.setState({ localTracks: [] });
  });

  it('should have empty initial state', () => {
    const state = useTrackStore.getState();
    expect(state.localTracks).toEqual([]);
  });

  it('should add a track', () => {
    const { addTrack } = useTrackStore.getState();
    addTrack(mockTrack);

    expect(useTrackStore.getState().localTracks).toHaveLength(1);
    expect(useTrackStore.getState().localTracks[0]).toEqual(mockTrack);
  });

  it('should not add duplicate tracks', () => {
    const { addTrack } = useTrackStore.getState();
    addTrack(mockTrack);
    addTrack(mockTrack); // Try to add again

    expect(useTrackStore.getState().localTracks).toHaveLength(1);
  });

  it('should add multiple tracks', () => {
    const mockTrack2: Track = {
      ...mockTrack,
      id: '2',
      title: 'Another Song',
    };

    const { addTracks } = useTrackStore.getState();
    addTracks([mockTrack, mockTrack2]);

    expect(useTrackStore.getState().localTracks).toHaveLength(2);
  });

  it('should remove a track', () => {
    const { addTrack, removeTrack } = useTrackStore.getState();
    addTrack(mockTrack);
    
    expect(useTrackStore.getState().localTracks).toHaveLength(1);
    
    removeTrack(mockTrack.id);
    expect(useTrackStore.getState().localTracks).toHaveLength(0);
  });

  it('should update a track', () => {
    const { addTrack, updateTrack } = useTrackStore.getState();
    addTrack(mockTrack);

    const updatedTrack = { ...mockTrack, title: 'Updated Title' };
    updateTrack(updatedTrack);

    const track = useTrackStore.getState().localTracks[0];
    expect(track.title).toBe('Updated Title');
  });

  it('should clear all tracks', () => {
    const { addTracks, clearTracks } = useTrackStore.getState();
    addTracks([mockTrack, { ...mockTrack, id: '2' }]);

    expect(useTrackStore.getState().localTracks).toHaveLength(2);
    
    clearTracks();
    expect(useTrackStore.getState().localTracks).toHaveLength(0);
  });

  it('should get track by id', () => {
    const { addTrack, getTrackById } = useTrackStore.getState();
    addTrack(mockTrack);

    const foundTrack = getTrackById(mockTrack.id);
    expect(foundTrack).toEqual(mockTrack);

    const notFound = getTrackById('nonexistent');
    expect(notFound).toBeUndefined();
  });
});
