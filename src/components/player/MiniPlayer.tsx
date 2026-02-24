import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, Maximize2, ListMusic } from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface MiniPlayerProps {
  onClick: () => void;
  onSeek: (time: number) => void;
  className?: string;
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function MiniPlayer({ onClick, onSeek, className }: MiniPlayerProps) {
  const { 
    currentTrack, 
    isPlaying, 
    volume,
    currentTime,
    duration,
    togglePlay, 
    previous,
    next,
    setVolume,
  } = usePlayerStore();
  const { isCompactMode } = useSettingsStore();

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      onClick={onClick}
      className={cn(
        "fixed bottom-0 left-0 right-0 md:left-[280px] z-50 bg-gradient-to-r from-[#181818] via-[#282828] to-[#181818] border-t border-white/5 cursor-pointer",
        className
      )}
    >
      {/* Progress bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 group cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          onSeek(percent * duration);
        }}
      >
        <div 
          className="h-full bg-primary group-hover:bg-primary transition-colors"
          style={{ width: `${progress}%` }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      <div className={cn(
        "grid grid-cols-3 items-center gap-4 px-4",
        isCompactMode ? "py-2" : "py-3 pt-4"
      )}>
        {/* Left: Track Info */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            className={cn(
              "rounded-md bg-secondary flex items-center justify-center shrink-0 overflow-hidden group relative",
              isCompactMode ? "w-10 h-10" : "w-14 h-14"
            )}
          >
            {currentTrack.coverUrl ? (
              <img 
                src={currentTrack.coverUrl} 
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Music className="w-6 h-6 text-muted-foreground" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </button>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate hover:underline">
              {currentTrack.title}
            </p>
          </div>
        </div>


        {/* Center: Playback Controls */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => { e.stopPropagation(); previous(); }}
              className="text-muted-foreground hover:text-foreground transition-colors p-2"
              aria-label="Previous track"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 transition-transform"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="text-muted-foreground hover:text-foreground transition-colors p-2"
              aria-label="Next track"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>
          
          {/* Time Display - Desktop */}
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>
            <span>/</span>
            <span className="w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume & Queue */}
        <div className="flex items-center justify-end gap-3">
          <button 
            onClick={(e) => e.stopPropagation()}
            className="hidden md:flex text-muted-foreground hover:text-foreground transition-colors"
          >
            <ListMusic className="w-5 h-5" />
          </button>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setVolume(volume === 0 ? 0.7 : 0); }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={volume === 0 ? 'Unmute' : 'Mute'}
            >
              {volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <div className="w-24" onClick={(e) => e.stopPropagation()}>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0] / 100)}
                className="cursor-pointer"
              />
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
