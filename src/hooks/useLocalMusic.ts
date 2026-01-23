import React, { useCallback, useRef, useEffect } from 'react';
import { 
  AUDIO_EXTENSIONS, 
  VIDEO_EXTENSIONS, 
  type Track, 
  type StoredFile 
} from '@/types/music';
import { 
  db, 
  saveFile, 
  saveTrack, 
  getFilesByUser, 
  getTracksByUser,
  fileExists,
  trackExistsByTitle,
} from '@/lib/database';
import { useUserStore } from '@/stores/userStore';
import { useTrackStore } from '@/stores/trackStore';
import { useToast } from '@/hooks/use-toast';

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get file extension
function getExtension(filename: string): string {
  return filename.slice(filename.lastIndexOf('.')).toLowerCase();
}

// Check if file is audio or video
function getFileType(filename: string): 'audio' | 'video' | null {
  const ext = getExtension(filename);
  if (AUDIO_EXTENSIONS.includes(ext)) return 'audio';
  if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
  // Treat .mp5 as video (MP4 variant)
  if (ext === '.mp5') return 'video';
  return null;
}

// Parse filename for metadata
function parseFilename(filename: string): { title: string; artist: string } {
  // Remove extension
  const nameWithoutExt = filename.slice(0, filename.lastIndexOf('.'));
  
  // Try to split by common delimiters
  const delimiters = [' - ', ' – ', '_-_'];
  for (const delimiter of delimiters) {
    if (nameWithoutExt.includes(delimiter)) {
      const parts = nameWithoutExt.split(delimiter);
      return {
        artist: parts[0].trim(),
        title: parts.slice(1).join(delimiter).trim(),
      };
    }
  }
  
  return {
    title: nameWithoutExt.trim(),
    artist: 'Unknown Artist',
  };
}

// Extract metadata from media element
async function extractMetadata(
  blob: Blob,
  isVideo: boolean
): Promise<{ duration: number }> {
  return new Promise((resolve) => {
    const element = isVideo 
      ? document.createElement('video') 
      : document.createElement('audio');
    
    const url = URL.createObjectURL(blob);
    element.src = url;
    
    element.addEventListener('loadedmetadata', () => {
      const duration = element.duration;
      URL.revokeObjectURL(url);
      resolve({ duration: isNaN(duration) ? 0 : duration });
    });
    
    element.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      resolve({ duration: 0 });
    });
    
    // Timeout fallback
    setTimeout(() => {
      URL.revokeObjectURL(url);
      resolve({ duration: 0 });
    }, 5000);
  });
}

export function useLocalMusic() {
  const { toast } = useToast();
  const currentUser = useUserStore((state) => state.currentUser);
  const { localTracks, addTracks, setLocalTracks } = useTrackStore();
  const inputRef = useRef<HTMLInputElement>(null);

  // Load tracks from database on mount
  const loadTracksFromDB = useCallback(async () => {
    if (!currentUser?.id) return;
    
    try {
      const dbTracks = await getTracksByUser(currentUser.id);
      const files = await getFilesByUser(currentUser.id);
      
      // Recreate blob URLs for existing files
      const tracksWithUrls = await Promise.all(
        dbTracks.map(async (track) => {
          const file = files.find((f) => f.id === track.fileId);
          if (file?.blob) {
            return {
              ...track,
              blobUrl: URL.createObjectURL(file.blob),
            };
          }
          return track;
        })
      );
      
      setLocalTracks(tracksWithUrls);
    } catch (error) {
      console.error('Failed to load tracks from DB:', error);
    }
  }, [currentUser?.id, setLocalTracks]);

  // Import files
  const importFiles = useCallback(async (files: FileList | File[]) => {
    if (!currentUser?.id) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to import music.',
        variant: 'destructive',
      });
      return;
    }

    const fileArray = Array.from(files);
    const newTracks: Track[] = [];
    let skipped = 0;
    let added = 0;

    for (const file of fileArray) {
      const fileType = getFileType(file.name);
      if (!fileType) {
        skipped++;
        continue;
      }

      // Check for duplicates
      const exists = await fileExists(file.name, currentUser.id);
      const titleExists = await trackExistsByTitle(
        parseFilename(file.name).title,
        currentUser.id
      );

      if (exists || titleExists) {
        skipped++;
        continue;
      }

      try {
        // Read file as blob
        const blob = new Blob([await file.arrayBuffer()], { type: file.type });
        
        // Save file to database
        const storedFile: StoredFile = {
          path: file.name,
          name: file.name,
          type: fileType,
          mimeType: file.type || (fileType === 'video' ? 'video/mp4' : 'audio/mpeg'),
          size: file.size,
          userId: currentUser.id,
          blob,
          createdAt: new Date(),
        };
        
        const fileId = await saveFile(storedFile);
        
        // Extract metadata
        const { duration } = await extractMetadata(blob, fileType === 'video');
        const { title, artist } = parseFilename(file.name);
        
        // Create track
        const track: Track = {
          id: generateId(),
          title,
          artist,
          album: 'Unknown Album',
          duration,
          fileId,
          userId: currentUser.id,
          blobUrl: URL.createObjectURL(blob),
          isVideo: fileType === 'video',
          addedAt: new Date(),
        };
        
        await saveTrack(track);
        newTracks.push(track);
        added++;
      } catch (error) {
        console.error('Failed to import file:', file.name, error);
        skipped++;
      }
    }

    if (newTracks.length > 0) {
      addTracks(newTracks);
    }

    toast({
      title: 'Import Complete',
      description: `Added ${added} track${added !== 1 ? 's' : ''}${skipped > 0 ? `, skipped ${skipped}` : ''}`,
    });
  }, [currentUser, addTracks, toast]);

  // Open file picker
  const openFilePicker = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  // Handle file input change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      importFiles(e.target.files);
      // Reset input
      e.target.value = '';
    }
  }, [importFiles]);

  // Create hidden input element
  const FileInput = React.useCallback((): React.ReactElement => {
    return React.createElement('input', {
      ref: inputRef,
      type: 'file',
      accept: '.mp3,.wav,.flac,.ogg,.m4a,.aac,.wma,.mp4,.mp5,.mkv,.avi,.webm,.mov,.wmv',
      multiple: true,
      onChange: handleFileChange,
      className: 'hidden',
      style: { display: 'none' }
    });
  }, [handleFileChange]);

  return {
    tracks: localTracks,
    importFiles,
    openFilePicker,
    loadTracksFromDB,
    FileInput,
  };
}
