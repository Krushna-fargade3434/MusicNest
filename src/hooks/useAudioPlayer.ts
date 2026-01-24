import { useRef, useEffect, useCallback } from 'react';
import { usePlayerStore } from '@/stores/playerStore';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    repeat,
    sleepTimer,
    setCurrentTime,
    setDuration,
    next,
    pause,
    setSleepTimer,
  } = usePlayerStore();

  // Get the active media element
  const getMediaElement = useCallback(() => {
    if (currentTrack?.isVideo) {
      return videoRef.current;
    }
    return audioRef.current;
  }, [currentTrack?.isVideo]);

  // Initialize audio/video elements
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
    }
    if (!videoRef.current) {
      videoRef.current = document.createElement('video');
      videoRef.current.preload = 'metadata';
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
    };
  }, []);

  // Handle track change
  useEffect(() => {
    const audio = audioRef.current;
    const video = videoRef.current;
    
    if (!currentTrack?.blobUrl) {
      if (audio) audio.src = '';
      if (video) video.src = '';
      return;
    }

    const element = currentTrack.isVideo ? video : audio;
    const otherElement = currentTrack.isVideo ? audio : video;
    
    if (element) {
      // Pause the other element
      if (otherElement) {
        otherElement.pause();
        otherElement.src = '';
      }
      
      element.src = currentTrack.blobUrl;
      element.load();
      
      if (isPlaying) {
        element.play().catch((error) => {
          console.error('Playback failed:', error);
          if (error.name === 'NotAllowedError') {
            pause();
          }
        });
      }
    }
  }, [currentTrack?.id, currentTrack?.blobUrl, currentTrack?.isVideo]);

  // Handle play/pause
  useEffect(() => {
    const element = getMediaElement();
    if (!element || !currentTrack?.blobUrl) return;

    if (isPlaying) {
      element.play().catch((error) => {
        console.error('Playback failed:', error);
        pause();
      });
    } else {
      element.pause();
    }
  }, [isPlaying, getMediaElement, currentTrack?.blobUrl, pause]);

  // Handle volume change
  useEffect(() => {
    const audio = audioRef.current;
    const video = videoRef.current;
    
    if (audio) audio.volume = volume;
    if (video) video.volume = volume;
  }, [volume]);

  // Setup event listeners
  useEffect(() => {
    const audio = audioRef.current;
    const video = videoRef.current;
    
    const handleTimeUpdate = () => {
      const element = getMediaElement();
      if (element) {
        setCurrentTime(element.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      const element = getMediaElement();
      if (element) {
        setDuration(element.duration);
      }
    };

    const handleEnded = () => {
      if (repeat === 'one') {
        const element = getMediaElement();
        if (element) {
          element.currentTime = 0;
          element.play();
        }
      } else {
        next();
      }
    };

    const addListeners = (el: HTMLMediaElement) => {
      el.addEventListener('timeupdate', handleTimeUpdate);
      el.addEventListener('loadedmetadata', handleLoadedMetadata);
      el.addEventListener('ended', handleEnded);
    };

    const removeListeners = (el: HTMLMediaElement) => {
      el.removeEventListener('timeupdate', handleTimeUpdate);
      el.removeEventListener('loadedmetadata', handleLoadedMetadata);
      el.removeEventListener('ended', handleEnded);
    };

    if (audio) addListeners(audio);
    if (video) addListeners(video);

    return () => {
      if (audio) removeListeners(audio);
      if (video) removeListeners(video);
    };
  }, [getMediaElement, repeat, next, setCurrentTime, setDuration]);

  // Sleep Timer
  useEffect(() => {
    if (!sleepTimer) return;

    const interval = setInterval(() => {
      if (Date.now() >= sleepTimer) {
        pause();
        setSleepTimer(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimer, pause, setSleepTimer]);

  // Seek function
  const seek = useCallback((time: number) => {
    const element = getMediaElement();
    if (element) {
      element.currentTime = time;
      setCurrentTime(time);
    }
  }, [getMediaElement, setCurrentTime]);

  return {
    audioRef,
    videoRef,
    seek,
  };
}
