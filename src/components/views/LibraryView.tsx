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

      <div className="px-3 sm:px-6 pb-32 pt-2">
        {/* Playlist Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-end gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          {/* Playlist Cover */}
          <div className="flex md:flex w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 items-center justify-center shadow-2xl shadow-purple-500/20">
            <Heart className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white fill-white" />
          </div>

          {/* Playlist Info */}
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">Playlist</p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-2 sm:mb-4">Your Library</h1>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{sortedTracks.length} songs</span>
              <span>•</span>
              <span>{hours > 0 ? `${hours} hr ` : ''}{minutes} min</span>
            </div>
          </div>
        </motion.div>

        {/* Action Bar */}
        <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          {sortedTracks.length > 0 && (
            <button
              onClick={() => sortedTracks[0] && playTrack(sortedTracks[0], sortedTracks)}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
              aria-label="Play all tracks"
            >
              <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-1 fill-current" />
            </button>
          )}
          <button
            onClick={openFilePicker}
            className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-full border border-foreground/20 font-semibold hover:border-foreground hover:scale-105 transition-all flex items-center gap-2"
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
            <div className="grid grid-cols-[16px_4fr_minmax(50px,80px)_32px] sm:grid-cols-[20px_4fr_minmax(60px,80px)_40px] gap-1.5 sm:gap-2 md:gap-4 px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-b border-white/5 text-xs sm:text-sm text-muted-foreground">
              <span className="text-center">#</span>
              <span>Title</span>
              <span className="flex justify-end">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
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
                    "grid grid-cols-[16px_4fr_minmax(50px,80px)_32px] sm:grid-cols-[20px_4fr_minmax(60px,80px)_40px] gap-1.5 sm:gap-2 md:gap-4 px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-b border-white/5 items-center hover:bg-white/5 transition-colors cursor-pointer group",
                    isActive && "bg-white/10"
                  )}
                >
                  {/* Number / Play */}
                  <div className="flex items-center justify-center">
                    <span className={cn(
                      'group-hover:hidden text-[10px] sm:text-xs md:text-sm tabular-nums',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}>
                      {isCurrentlyPlaying ? (
                        <div className="flex gap-0.5 items-end h-3 sm:h-4">
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
                        <Pause className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                      ) : (
                        <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                      )}
                    </button>
                  </div>

                  {/* Title & Artist */}
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                      {track.coverUrl ? (
                        <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                      ) : (
                        <Music className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        'font-medium truncate text-[11px] sm:text-xs md:text-sm leading-tight',
                         isActive && 'text-primary'
                      )}>
                        {track.title}
                        {showFileExtensions && track.fileName && (
                          <span className="hidden sm:inline text-[10px] sm:text-xs text-muted-foreground ml-1">• {getFileExtension(track.fileName)}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center justify-end gap-1 sm:gap-3">
                    <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground tabular-nums">
                      {formatDuration(track.duration)}
                    </span>
                  </div>

                  {/* Menu */}
                  <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
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
