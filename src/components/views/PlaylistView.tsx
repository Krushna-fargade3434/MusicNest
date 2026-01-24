import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Music, ArrowLeft, Trash2, Check, Search, X, MoreHorizontal } from 'lucide-react';
import { useTrackStore } from '@/stores/trackStore';
import { useLocalMusic } from '@/hooks/useLocalMusic';
import { usePlayerStore } from '@/stores/playerStore';
import { usePlaylistStore } from '@/stores/playlistStore';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription as AlertDesc,
} from '@/components/ui/alert-dialog';
import { Track, Playlist } from '@/types/music';

export function PlaylistView() {
  const { localTracks } = useTrackStore();
  const { loadTracksFromDB } = useLocalMusic();
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore();
  const { 
    playlists, 
    loadPlaylists, 
    createPlaylist, 
    deletePlaylist, 
    currentPlaylistTracks, 
    loadPlaylistTracks,
    addTrackToPlaylist,
    addTracksToPlaylist,
    removeTrackFromPlaylist
  } = usePlaylistStore();
  const { currentUser } = useUserStore();

  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isAddTracksOpen, setIsAddTracksOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTracksToAdd, setSelectedTracksToAdd] = useState<string[]>([]);


  useEffect(() => {
    if (currentUser?.id) {
      loadPlaylists(currentUser.id);
      loadTracksFromDB(); // Ensure tracks are synced with DB
    }
  }, [currentUser, loadPlaylists, loadTracksFromDB]);

  useEffect(() => {
    if (view === 'detail' && selectedPlaylist?.id && typeof selectedPlaylist.id === 'number') {
      loadPlaylistTracks(selectedPlaylist.id);
    }
  }, [view, selectedPlaylist, loadPlaylistTracks]);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim() || !currentUser?.id) return;
    
    await createPlaylist(newPlaylistName, currentUser.id);
    setNewPlaylistName('');
    setIsCreateDialogOpen(false);
  };

  const handleDeletePlaylist = async () => {
    if (selectedPlaylist?.id && typeof selectedPlaylist.id === 'number' && currentUser?.id) {
      await deletePlaylist(selectedPlaylist.id, currentUser.id);
      setView('list');
      setSelectedPlaylist(null);
    }
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setView('detail');
  };

  const handleAddTracks = async () => {
    if (!selectedPlaylist?.id || typeof selectedPlaylist.id !== 'number') return;
    
    console.log('Adding tracks:', selectedTracksToAdd, 'to playlist:', selectedPlaylist.id);
    
    // Attempt to add tracks
    await addTracksToPlaylist(selectedPlaylist.id, selectedTracksToAdd);
    
    // Force a library refresh to ensure we're not seeing stale tracks
    loadTracksFromDB();
    
    setSelectedTracksToAdd([]);
    setIsAddTracksOpen(false);
  };

  const toggleTrackSelection = (trackId: string) => {
    setSelectedTracksToAdd(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const handleSingleAdd = async (trackId: string) => {
    if (!selectedPlaylist?.id || typeof selectedPlaylist.id !== 'number') return;
    
    // Add single track
    await addTrackToPlaylist(selectedPlaylist.id, trackId);
    
    // Refresh to update UI state
    loadTracksFromDB();
  };

  const filteredTracks = localTracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase())
  );



  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {view === 'detail' && selectedPlaylist ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="min-h-screen pb-32"
          >
            {/* Header */}
            <div className={cn(
              "relative h-48 md:h-80 w-full overflow-hidden transition-all duration-300",
              "bg-gradient-to-br",
              selectedPlaylist.gradient || 'from-gray-800 to-gray-900'
            )}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="absolute top-4 left-4 md:top-8 md:left-8 text-white hover:bg-white/20 z-10"
                  onClick={() => setView('list')}
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-4 md:gap-6"
                >
                  <div className="w-24 h-24 md:w-48 md:h-48 bg-white/10 rounded-xl shadow-2xl backdrop-blur-sm flex items-center justify-center shrink-0">
                    <Music className="w-12 h-12 md:w-16 md:h-16 text-white" />
                  </div>
                  <div className="flex-1 text-white min-w-0">
                    <p className="text-xs md:text-sm font-medium opacity-80 mb-1 md:mb-2">Playlist</p>
                    <h1 className="text-2xl md:text-6xl font-bold mb-2 md:mb-4 truncate">{selectedPlaylist.name}</h1>
                    <p className="opacity-80 text-xs md:text-base">
                      {currentPlaylistTracks.length} songs • Created by {currentUser?.username || 'You'}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 md:px-8 py-4 md:py-6 flex items-center gap-3 md:gap-4 border-b border-white/5 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20">
              {currentPlaylistTracks.length > 0 && (
                <Button 
                  className="rounded-full w-12 h-12 md:w-14 md:h-14 p-0 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                  onClick={() => {
                    const tracks = currentPlaylistTracks;
                    if (tracks.length > 0) playTrack(tracks[0], tracks);
                  }}
                >
                  <Play className="w-5 h-5 md:w-6 md:h-6 fill-current ml-1" />
                </Button>
              )}

              {typeof selectedPlaylist.id === 'number' && (
                <>
                  <Dialog open={isAddTracksOpen} onOpenChange={setIsAddTracksOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="rounded-full h-10 md:h-11">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Songs
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full h-full max-w-none rounded-none md:max-w-2xl md:h-[85vh] md:rounded-lg md:m-auto flex flex-col p-0 md:p-6 gap-0 bg-background">
                      <DialogHeader className="px-4 py-4 md:px-0 md:pt-0 border-b md:border-none flex flex-row items-center justify-between">
                        <div className="text-left">
                          <DialogTitle>Add Songs</DialogTitle>
                          <DialogDescription className="hidden md:block">
                            Select songs from your library to add to {selectedPlaylist.name}
                          </DialogDescription>
                        </div>
                        <DialogClose asChild className="md:hidden">
                          <Button variant="ghost" size="icon">
                            <X className="w-5 h-5" />
                          </Button>
                        </DialogClose>
                      </DialogHeader>
                      
                      <div className="flex-1 flex flex-col min-h-0">
                        <div className="px-4 py-3 md:px-0">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              placeholder="Search songs..." 
                              className="pl-9 bg-secondary/50 border-0"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <ScrollArea className="flex-1">
                          <div className="px-4 pb-4 space-y-1">
                            {filteredTracks.map(track => {
                              const tracks = currentPlaylistTracks;
                              const isAlreadyAdded = tracks.some(t => t.id === track.id);
                              const isSelected = selectedTracksToAdd.includes(track.id);
                              
                              return (
                                <div 
                                  key={track.id} 
                                  className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer active:scale-[0.99]",
                                    isSelected ? "bg-primary/10" : "hover:bg-secondary/50",
                                    isAlreadyAdded && "opacity-50 cursor-not-allowed bg-transparent"
                                  )}
                                  onClick={() => !isAlreadyAdded && toggleTrackSelection(track.id)}
                                >
                                  <Checkbox 
                                    id={`track-${track.id}`}
                                    checked={isSelected || isAlreadyAdded}
                                    disabled={isAlreadyAdded}
                                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    onCheckedChange={() => toggleTrackSelection(track.id)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <Label htmlFor={`track-${track.id}`} className="font-medium cursor-pointer block truncate text-base">
                                      {track.title}
                                    </Label>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {Math.floor(track.duration / 60)}:{Math.floor(track.duration % 60).toString().padStart(2, '0')}
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant={isAlreadyAdded ? "ghost" : "secondary"}
                                    className={cn(
                                      "ml-2 h-9 w-9 p-0 rounded-full shrink-0",
                                      isAlreadyAdded && "text-green-500 hover:text-green-600"
                                    )}
                                    disabled={isAlreadyAdded}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSingleAdd(track.id);
                                    }}
                                  >
                                    {isAlreadyAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                  </Button>
                                </div>
                              );
                            })}
                            {filteredTracks.length === 0 && (
                              <div className="text-center py-12 text-muted-foreground">
                                <Music className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No songs found</p>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </div>

                      <div className="p-4 border-t bg-background/95 backdrop-blur md:rounded-b-lg">
                        <Button 
                          className="w-full h-11 text-base font-semibold" 
                          onClick={handleAddTracks} 
                          disabled={selectedTracksToAdd.length === 0}
                        >
                          Add {selectedTracksToAdd.length} Songs
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div className="flex-1" />

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Playlist?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{selectedPlaylist.name}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeletePlaylist} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>

            {/* Track List */}
            <div className="px-4 md:px-8 py-4">
              {(() => {
                const tracks = currentPlaylistTracks;
                return tracks.length > 0 ? (
                  <div className="space-y-1">
                    {tracks.map((track, index) => {
                       const isCurrentTrack = currentTrack?.id === track.id;
                       return (
                        <div 
                          key={track.id}
                          className="group grid grid-cols-[auto_1fr_auto] gap-3 md:gap-4 p-2 md:p-3 rounded-lg hover:bg-white/5 items-center cursor-pointer active:bg-white/10"
                          onClick={() => playTrack(track, tracks)}
                        >
                          <div className="w-6 md:w-8 text-center text-xs md:text-sm text-muted-foreground group-hover:hidden">
                            {index + 1}
                          </div>
                          <div className="hidden group-hover:block w-6 md:w-8 text-center">
                            <Play className="w-3 h-3 md:w-4 md:h-4 fill-current mx-auto" />
                          </div>
                          
                          <div className="min-w-0">
                            <p className={cn("font-medium truncate text-sm md:text-base", isCurrentTrack && "text-primary")}>
                              {track.title}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 md:gap-4">
                            <span className="text-xs md:text-sm text-muted-foreground">
                              {Math.floor(track.duration / 60)}:{Math.floor(track.duration % 60).toString().padStart(2, '0')}
                            </span>
                            {typeof selectedPlaylist.id === 'number' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-100 md:opacity-0 group-hover:opacity-100 h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeTrackFromPlaylist(selectedPlaylist.id as number, track.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                       );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20 text-muted-foreground">
                    <Music className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No songs yet</p>
                    <p className="text-sm opacity-60">Add some music to get the party started!</p>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="min-h-screen px-6 pb-32 pt-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Playlists</h1>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-full">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Playlist
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Playlist</DialogTitle>
                    <DialogDescription>
                      Give your playlist a name to get started.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreatePlaylist}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newPlaylistName}
                          onChange={(e) => setNewPlaylistName(e.target.value)}
                          placeholder="My Awesome Playlist"
                          autoFocus
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={!newPlaylistName.trim()}>
                        Create Playlist
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">


              {/* User Playlists */}
              {playlists.map((playlist, index) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handlePlaylistClick(playlist)}
                  className="group relative aspect-square bg-card rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border border-white/5 active:scale-95"
                >
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br p-4 md:p-6 flex flex-col justify-end",
                    playlist.gradient
                  )}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    <div className="relative z-10">
                      <Music className="w-6 h-6 md:w-8 md:h-8 text-white mb-2" />
                      <h3 className="text-lg md:text-xl font-bold text-white mb-1 truncate">{playlist.name}</h3>
                      <p className="text-xs md:text-sm text-white/80">
                        Playlist
                      </p>
                    </div>
                    
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 border-none text-white">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
