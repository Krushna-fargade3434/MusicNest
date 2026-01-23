import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  ChevronDown,
  Music,
  Heart,
  MoreHorizontal,
  Disc3,
  PlusCircle,
  User,
  Share2,
  Moon,
} from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface FullScreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  onSeek: (time: number) => void;
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function FullScreenPlayer({ isOpen, onClose, onSeek }: FullScreenPlayerProps) {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    shuffle,
    repeat,
    togglePlay,
    previous,
    next,
    setVolume,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();

  const [localTime, setLocalTime] = useState(currentTime);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!isSeeking) {
      setLocalTime(currentTime);
    }
  }, [currentTime, isSeeking]);

  const handleSeekStart = () => setIsSeeking(true);
  const handleSeekChange = (value: number[]) => setLocalTime(value[0]);
  const handleSeekEnd = (value: number[]) => {
    onSeek(value[0]);
    setIsSeeking(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-50 overflow-hidden"
        >
          {/* Background with simple gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] to-black" />

          <div className="relative h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 pt-safe">
              <button
                onClick={onClose}
                className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <ChevronDown className="w-7 h-7" />
              </button>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Playing from</p>
                <p className="text-sm font-medium">Your Library</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors">
                    <MoreHorizontal className="w-6 h-6" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#1a1a2e] border-white/10 text-white" align="end">
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Add to Playlist</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white">
                    <User className="mr-2 h-4 w-4" />
                    <span>View Artist</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white">
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white">
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Sleep Timer</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Album Art */}
            <div className="flex-1 flex items-center justify-center px-8 py-4">
              <div className="relative w-full max-w-[340px] aspect-square shadow-2xl rounded-xl overflow-hidden">
                {currentTrack?.coverUrl ? (
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack?.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center border border-white/10">
                    <Music className="w-24 h-24 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            </div>

            {/* Track Info & Controls */}
            <div className="px-8 pb-8 pt-4">
              {/* Track Info */}
              <div className="flex items-start justify-between mb-6">
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold truncate mb-1">
                    {currentTrack?.title || 'No track selected'}
                  </h2>
                  <p className="text-muted-foreground truncate">
                    {currentTrack?.artist || 'Unknown Artist'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className="p-2 shrink-0"
                >
                  <Heart className={cn(
                    'w-7 h-7 transition-colors',
                    isLiked ? 'text-primary fill-primary' : 'text-muted-foreground'
                  )} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <Slider
                  value={[localTime]}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={handleSeekChange}
                  onValueCommit={handleSeekEnd}
                  onPointerDown={handleSeekStart}
                  className="cursor-pointer"
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{formatTime(localTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={toggleShuffle}
                  className={cn(
                    'p-3',
                    shuffle ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Shuffle className="w-6 h-6" />
                </button>
                <button onClick={previous} className="p-3">
                  <SkipBack className="w-9 h-9 fill-current" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-18 h-18 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 transition-transform p-5"
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10 fill-current" />
                  ) : (
                    <Play className="w-10 h-10 fill-current ml-1" />
                  )}
                </button>
                <button onClick={next} className="p-3">
                  <SkipForward className="w-9 h-9 fill-current" />
                </button>
                <button
                  onClick={toggleRepeat}
                  className={cn(
                    'p-3',
                    repeat !== 'none' ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {repeat === 'one' ? (
                    <Repeat1 className="w-6 h-6" />
                  ) : (
                    <Repeat className="w-6 h-6" />
                  )}
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
                  className="text-muted-foreground"
                >
                  {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(value) => setVolume(value[0] / 100)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
