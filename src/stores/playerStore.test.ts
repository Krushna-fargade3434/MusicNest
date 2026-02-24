import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore } from './playerStore';

describe('PlayerStore', () => {
  beforeEach(() => {
    // Reset store before each test
    usePlayerStore.setState({
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
    });
  });

  it('should have initial state', () => {
    const state = usePlayerStore.getState();
    expect(state.currentTrack).toBeNull();
    expect(state.queue).toEqual([]);
    expect(state.isPlaying).toBe(false);
    expect(state.volume).toBe(0.7);
  });

  it('should toggle play/pause', () => {
    const { togglePlay } = usePlayerStore.getState();
    
    expect(usePlayerStore.getState().isPlaying).toBe(false);
    togglePlay();
    expect(usePlayerStore.getState().isPlaying).toBe(true);
    togglePlay();
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });

  it('should set volume', () => {
    const { setVolume } = usePlayerStore.getState();
    
    setVolume(0.5);
    expect(usePlayerStore.getState().volume).toBe(0.5);
  });

  it('should toggle shuffle', () => {
    const { toggleShuffle } = usePlayerStore.getState();
    
    expect(usePlayerStore.getState().shuffle).toBe(false);
    toggleShuffle();
    expect(usePlayerStore.getState().shuffle).toBe(true);
  });

  it('should cycle through repeat modes', () => {
    const { toggleRepeat } = usePlayerStore.getState();
    
    expect(usePlayerStore.getState().repeat).toBe('none');
    toggleRepeat();
    expect(usePlayerStore.getState().repeat).toBe('one');
    toggleRepeat();
    expect(usePlayerStore.getState().repeat).toBe('all');
    toggleRepeat();
    expect(usePlayerStore.getState().repeat).toBe('none');
  });

  it('should play a track', () => {
    const mockTrack = {
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

    const { playTrack } = usePlayerStore.getState();
    playTrack(mockTrack, [mockTrack]);

    const state = usePlayerStore.getState();
    expect(state.currentTrack).toEqual(mockTrack);
    expect(state.queue).toEqual([mockTrack]);
    expect(state.isPlaying).toBe(true);
  });

  it('should add track to queue', () => {
    const mockTrack = {
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

    const { addToQueue } = usePlayerStore.getState();
    addToQueue(mockTrack);

    expect(usePlayerStore.getState().queue).toHaveLength(1);
    expect(usePlayerStore.getState().queue[0]).toEqual(mockTrack);
  });
});
