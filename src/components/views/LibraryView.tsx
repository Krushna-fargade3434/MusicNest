import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Play, Pause, Music, Clock, MoreHorizontal, Heart, Pencil, Trash2 } from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';
import { useTrackStore } from '@/stores/trackStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useLocalMusic } from '@/hooks/useLocalMusic';
import { updateTrack as dbUpdateTrack, deleteTrack as dbDeleteTrack } from '@/lib/database';
import { cn } from '@/lib/utils';
import type { Track } from '@/types/music';
import { isSampleTrack } from '@/data/sampleSongs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function LibraryView() {
  const { localTracks, updateTrack, removeTrack } = useTrackStore();
  const { openFilePicker, FileInput } = useLocalMusic();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const { sortBy, showFileExtensions, libraryView, showAnimations } = useSettingsStore();

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [trackToRename, setTrackToRename] = useState<Track | null>(null);
  const [newName, setNewName] = useState("");

  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [trackToDelete, setTrackToDelete] = useState<Track | null>(null);

  // Sort tracks based on settings
  const sortedTracks = useMemo(() => {
    const tracks = [...localTracks];
    
    switch (sortBy) {
      case 'title':
        return tracks.sort((a, b) => a.title.localeCompare(b.title));
      case 'artist':
        return tracks.sort((a, b) => (a.artist || '').localeCompare(b.artist || ''));
      case 'duration':
        return tracks.sort((a, b) => b.duration - a.duration);
      case 'dateAdded':
      default:
        return tracks.sort((a, b) => 
          new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        );
    }
  }, [localTracks, sortBy]);

  // Get file extension helper
  const getFileExtension = (filename: string) => {
    const ext = filename.split('.').pop()?.toUpperCase();
    return ext || '';
  };

  const handleRename = async () => {
    if (trackToRename && newName.trim()) {
      const updatedTrack = { ...trackToRename, title: newName.trim() };
      await dbUpdateTrack(updatedTrack);
      updateTrack(updatedTrack);
      setRenameDialogOpen(false);
      setTrackToRename(null);
    }
  };

  const handleDelete = async () => {
    if (trackToDelete) {
      await dbDeleteTrack(trackToDelete.id);
      removeTrack(trackToDelete.id);
      setDeleteAlertOpen(false);
      setTrackToDelete(null);
    }
  };

  const openRenameDialog = (track: typeof localTracks[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setTrackToRename(track);
    setNewName(track.title);
    setRenameDialogOpen(true);
  };

  const openDeleteAlert = (track: typeof localTracks[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setTrackToDelete(track);
    setDeleteAlertOpen(true);
  };

  const handlePlayTrack = (track: typeof localTracks[0]) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, localTracks);
    }
  };

  const totalDuration = sortedTracks.reduce((acc, track) => acc + track.duration, 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="min-h-screen">
      <FileInput />
      
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/40 via-background to-background -z-10 h-[350px]" />

      <div className="px-4 sm:px-6 pb-8 pt-1">
        {/* Playlist Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-end gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8"
        >
          {/* Playlist Cover */}
          <div className="flex md:flex w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 items-center justify-center shadow-2xl shadow-purple-500/20">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white fill-white" />
          </div>

          {/* Playlist Info */}
          <div className="flex-1">
            <p className="text-[10px] sm:text-xs md:text-sm font-medium mb-0.5 sm:mb-1">Playlist</p>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black mb-1.5 sm:mb-2 md:mb-4">Your Library</h1>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{sortedTracks.length} songs</span>
              <span>•</span>
              <span>{hours > 0 ? `${hours} hr ` : ''}{minutes} min</span>
            </div>
          </div>
        </motion.div>

        {/* Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
          {sortedTracks.length > 0 && (
            <button
              onClick={() => sortedTracks[0] && playTrack(sortedTracks[0], sortedTracks)}
              className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center active:scale-95 hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 touch-manipulation"
              aria-label="Play all tracks"
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ml-0.5 fill-current" />
            </button>
          )}
          <button
            onClick={openFilePicker}
            className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base rounded-full border border-foreground/20 font-semibold hover:border-foreground active:scale-95 transition-all flex items-center gap-1.5 sm:gap-2 touch-manipulation"
            aria-label="Add songs to library"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Add Songs</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Track List */}
        {sortedTracks.length > 0 ? (
          <div className="bg-black/20 rounded-lg overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-[16px_1fr_40px_28px] sm:grid-cols-[20px_1fr_60px_36px] gap-1.5 sm:gap-2 md:gap-4 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 border-b border-white/5 text-[10px] sm:text-xs md:text-sm text-muted-foreground">
              <span className="text-center">#</span>
              <span>Title</span>
              <span className="flex justify-end">
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              </span>
              <span></span>
            </div>

            {/* Track Rows */}
            {sortedTracks.map((track, index) => {
              const isActive = currentTrack?.id === track.id;
              const isCurrentlyPlaying = isActive && isPlaying;

              return (
                <motion.div
                  key={track.id}
                  initial={showAnimations ? { opacity: 0, x: -20 } : false}
                  animate={showAnimations ? { opacity: 1, x: 0 } : false}
                  transition={showAnimations ? { delay: index * 0.05 } : undefined}
                  onClick={() => handlePlayTrack(track)}
                  className={cn(
                    "grid grid-cols-[16px_1fr_40px_28px] sm:grid-cols-[20px_1fr_60px_36px] gap-1.5 sm:gap-2 md:gap-4 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 border-b border-white/5 items-center hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer group touch-manipulation",
                    isActive && "bg-white/10"
                  )}
                >
                  {/* Number / Play */}
                  <div className="flex items-center justify-center">
                    <span className={cn(
                      'group-hover:hidden text-[10px] sm:text-xs tabular-nums',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}>
                      {isCurrentlyPlaying ? (
                        <div className="flex gap-0.5 items-end h-3 sm:h-3.5">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ height: ['40%', '100%', '40%'] }}
                              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                              className="w-0.5 bg-primary rounded-full"
                            />
                          ))}
                        </div>
                      ) : (
                        index + 1
                      )}
                    </span>
                    <button className="hidden group-hover:block">
                      {isCurrentlyPlaying ? (
                        <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 fill-current" />
                      ) : (
                        <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 fill-current" />
                      )}
                    </button>
                  </div>

                  {/* Title & Artist */}
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                      {track.coverUrl ? (
                        <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                      ) : (
                        <Music className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        'font-medium truncate text-[11px] sm:text-xs md:text-sm leading-tight',
                         isActive && 'text-primary'
                      )}>
                        {track.title}
                        {isSampleTrack(track.id) && (
                          <span className="ml-1.5 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-semibold">DEMO</span>
                        )}
                        {showFileExtensions && track.fileName && (
                          <span className="hidden sm:inline text-[10px] text-muted-foreground ml-1">• {getFileExtension(track.fileName)}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center justify-end">
                    <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground tabular-nums">
                      {formatDuration(track.duration)}
                    </span>
                  </div>

                  {/* Menu */}
                  <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                    {!isSampleTrack(track.id) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity touch-manipulation">
                            <MoreHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 bg-popover/95 backdrop-blur-sm">
                          <DropdownMenuItem onClick={(e) => openRenameDialog(track, e)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => openDeleteAlert(track, e)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-black/20 rounded-lg"
          >
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <Music className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Songs you add will appear here</h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Import MP3, MP4, WAV, FLAC, and other audio files
            </p>
            <button
              onClick={openFilePicker}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-semibold hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5" />
              Import Your Music
            </button>
          </motion.div>
        )}
      </div>

      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Track</DialogTitle>
            <DialogDescription>
              Enter a new title for this track.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Title
              </Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRename}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the track from your library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
