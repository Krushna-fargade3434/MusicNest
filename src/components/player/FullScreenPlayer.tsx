import { useEffect, useState } from 'react';
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
  Moon,
  Clock,
  ListMusic,
} from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';
import { usePlaylistStore } from '@/stores/playlistStore';
import { useUserStore } from '@/stores/userStore';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
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
    setSleepTimer,
  } = usePlayerStore();

  const { playlists, addTrackToPlaylist, loadPlaylists } = usePlaylistStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (currentUser && playlists.length === 0) {
      loadPlaylists(currentUser.id);
    }
  }, [currentUser, playlists.length, loadPlaylists]);

  const handleAddToPlaylist = async (playlistId: number) => {
    if (!currentTrack) return;
    await addTrackToPlaylist(playlistId, currentTrack.id);
  };

  const handleSetSleepTimer = (minutes: number) => {
    const duration = minutes * 60 * 1000;
    setSleepTimer(Date.now() + duration);
    toast.success(`Sleep timer set for ${minutes} minutes`);
  };

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
            <div className="flex items-center justify-between p-3 sm:p-4 pt-safe">
              <button
                onClick={onClose}
                className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation"
              >
                <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
              <div className="text-center">
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">Playing from</p>
                <p className="text-xs sm:text-sm font-medium">Your Library</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 -mr-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation">
                    <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#1a1a2e] border-white/10 text-white" align="end">
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer focus:bg-white/10 focus:text-white">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span>Add to Playlist</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="bg-[#1a1a2e] border-white/10 text-white">
                        {playlists.map(playlist => (
                          <DropdownMenuItem 
                            key={playlist.id}
                            onClick={() => playlist.id && handleAddToPlaylist(playlist.id)}
                            className="cursor-pointer focus:bg-white/10 focus:text-white"
                          >
                            <ListMusic className="mr-2 h-4 w-4" />
                            <span>{playlist.name}</span>
                          </DropdownMenuItem>
                        ))}
                        {playlists.length === 0 && (
                          <DropdownMenuItem disabled>
                            <span>No playlists</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuSeparator className="bg-white/10" />

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer focus:bg-white/10 focus:text-white">
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Sleep Timer</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="bg-[#1a1a2e] border-white/10 text-white">
                        {[15, 30, 45, 60].map(mins => (
                          <DropdownMenuItem 
                            key={mins}
                            onClick={() => handleSetSleepTimer(mins)}
                            className="cursor-pointer focus:bg-white/10 focus:text-white"
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            <span>{mins} minutes</span>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem 
                            onClick={() => { setSleepTimer(null); toast.success("Sleep timer turned off"); }}
                            className="cursor-pointer focus:bg-white/10 focus:text-white"
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            <span>Turn off</span>
                          </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Album Art */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-2 sm:py-4">
              <div className="relative w-full max-w-[260px] sm:max-w-[300px] md:max-w-[340px] aspect-square shadow-2xl rounded-lg overflow-hidden">
                {currentTrack?.coverUrl ? (
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack?.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center border border-white/10">
                    <Music className="w-14 h-14 sm:w-18 sm:h-18 md:w-24 md:h-24 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            </div>

            {/* Track Info & Controls */}
            <div className="px-4 sm:px-6 md:px-8 pb-safe pb-6 sm:pb-8 pt-2">
              {/* Track Info */}
              <div className="flex items-start justify-between mb-3 sm:mb-5">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate mb-0.5 sm:mb-1">
                    {currentTrack?.title || 'No track selected'}
                  </h2>
                </div>
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className="p-1.5 sm:p-2 shrink-0 touch-manipulation active:scale-95 transition-transform"
                >
                  <Heart className={cn(
                    'w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-colors',
                    isLiked ? 'text-primary fill-primary' : 'text-muted-foreground'
                  )} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-4 sm:mb-5 md:mb-6">
                <Slider
                  value={[localTime]}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={handleSeekChange}
                  onValueCommit={handleSeekEnd}
                  onPointerDown={handleSeekStart}
                  className="cursor-pointer"
                />
                <div className="flex justify-between mt-1.5 sm:mt-2 text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                  <span>{formatTime(localTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex items-center justify-between mb-5 sm:mb-7 md:mb-8">
                <button
                  onClick={toggleShuffle}
                  className={cn(
                    'p-2 sm:p-2.5 touch-manipulation active:scale-95 transition-transform',
                    shuffle ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Shuffle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
                <button onClick={previous} className="p-2 sm:p-2.5 touch-manipulation active:scale-95 transition-transform">
                  <SkipBack className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 fill-current" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full bg-foreground text-background flex items-center justify-center active:scale-95 transition-transform shadow-2xl touch-manipulation"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 fill-current" />
                  ) : (
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 fill-current ml-0.5" />
                  )}
                </button>
                <button onClick={next} className="p-2 sm:p-2.5 touch-manipulation active:scale-95 transition-transform">
                  <SkipForward className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 fill-current" />
                </button>
                <button
                  onClick={toggleRepeat}
                  className={cn(
                    'p-2 sm:p-2.5 touch-manipulation active:scale-95 transition-transform',
                    repeat !== 'none' ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {repeat === 'one' ? (
                    <Repeat1 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  ) : (
                    <Repeat className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  )}
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4">
                <button
                  onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
                  className="text-muted-foreground touch-manipulation active:scale-95 transition-transform"
                >
                  {volume === 0 ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
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
