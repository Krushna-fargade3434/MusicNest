import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Heart, Music, ArrowLeft, Trash2, Check, Search } from 'lucide-react';
import { useTrackStore } from '@/stores/trackStore';
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
} from '@/components/ui/alert-dialog';
import { Track, Playlist } from '@/types/music';

type SystemPlaylist = {
  id: string;
  name: string;
  count: number;
  cover: null;
  gradient: string;
  icon: React.ElementType;
  description?: string;
};

type DisplayPlaylist = Playlist | SystemPlaylist;

export function PlaylistView() {
  const { localTracks } = useTrackStore();
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
  const [selectedPlaylist, setSelectedPlaylist] = useState<DisplayPlaylist | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isAddTracksOpen, setIsAddTracksOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTracksToAdd, setSelectedTracksToAdd] = useState<string[]>([]);

  useEffect(() => {
    if (currentUser?.id) {
      loadPlaylists(currentUser.id);
    }
  }, [currentUser, loadPlaylists]);

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

  const handlePlaylistClick = (playlist: DisplayPlaylist) => {
    setSelectedPlaylist(playlist);
    setView('detail');
  };

  const handleAddTracks = async () => {
    if (!selectedPlaylist?.id || typeof selectedPlaylist.id !== 'number') return;
    
    await addTracksToPlaylist(selectedPlaylist.id, selectedTracksToAdd);
    
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

  const filteredTracks = localTracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock "Liked Songs" playlist
  const likedSongsPlaylist = {
    id: 'liked',
    name: 'Liked Songs',
    count: 0, // Todo: Implement liked songs
    cover: null,
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    icon: Heart
  };

  if (view === 'detail' && selectedPlaylist) {
    const isSystemPlaylist = typeof selectedPlaylist.id === 'string';
    const tracks = isSystemPlaylist ? [] : currentPlaylistTracks;

    return (
      <div className="min-h-screen pb-32">
        {/* Header */}
        <div className={cn(
          "relative h-64 md:h-80 w-full overflow-hidden",
          "bg-gradient-to-br",
          selectedPlaylist.gradient || 'from-gray-800 to-gray-900'
        )}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <Button 
              variant="ghost" 
              className="absolute top-8 left-8 text-white hover:bg-white/20"
              onClick={() => setView('list')}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end gap-6"
            >
              <div className="w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-xl shadow-2xl backdrop-blur-sm flex items-center justify-center">
                {'icon' in selectedPlaylist && selectedPlaylist.icon ? (
                  <selectedPlaylist.icon className="w-16 h-16 text-white" />
                ) : (
                  <Music className="w-16 h-16 text-white" />
                )}
              </div>
              <div className="flex-1 text-white">
                <p className="text-sm font-medium opacity-80 mb-2">Playlist</p>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{selectedPlaylist.name}</h1>
                <p className="opacity-80">
                  {tracks.length} songs • Created by {currentUser?.username || 'You'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 py-6 flex items-center gap-4 border-b border-white/5">
          {tracks.length > 0 && (
            <Button 
              className="rounded-full w-14 h-14 p-0 bg-primary hover:bg-primary/90"
              onClick={() => playTrack(tracks[0], tracks)}
            >
              <Play className="w-6 h-6 fill-current ml-1" />
            </Button>
          )}

          {!isSystemPlaylist && (
            <>
              <Dialog open={isAddTracksOpen} onOpenChange={setIsAddTracksOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Songs
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Add Songs to Playlist</DialogTitle>
                    <DialogDescription>
                      Select songs from your library to add to {selectedPlaylist.name}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search songs..." 
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-2">
                        {filteredTracks.map(track => {
                          const isAlreadyAdded = tracks.some(t => t.id === track.id);
                          const isSelected = selectedTracksToAdd.includes(track.id);
                          
                          return (
                            <div 
                              key={track.id} 
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors",
                                isAlreadyAdded && "opacity-50 cursor-not-allowed"
                              )}
                            >
                              <Checkbox 
                                id={`track-${track.id}`}
                                checked={isSelected || isAlreadyAdded}
                                disabled={isAlreadyAdded}
                                onCheckedChange={() => toggleTrackSelection(track.id)}
                              />
                              <div className="flex-1 min-w-0">
                                <Label htmlFor={`track-${track.id}`} className="font-medium cursor-pointer block truncate">
                                  {track.title}
                                </Label>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {Math.floor(track.duration / 60)}:{Math.floor(track.duration % 60).toString().padStart(2, '0')}
                              </span>
                            </div>
                          );
                        })}
                        {filteredTracks.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            No songs found
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddTracksOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddTracks} disabled={selectedTracksToAdd.length === 0}>
                      Add {selectedTracksToAdd.length} Songs
                    </Button>
                  </DialogFooter>
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
        <div className="px-6 md:px-8 py-4">
          {tracks.length > 0 ? (
            <div className="space-y-1">
              {tracks.map((track, index) => {
                 const isCurrentTrack = currentTrack?.id === track.id;
                 return (
                  <div 
                    key={track.id}
                    className="group grid grid-cols-[auto_1fr_auto] gap-4 p-3 rounded-lg hover:bg-white/5 items-center cursor-pointer"
                    onClick={() => playTrack(track, tracks)}
                  >
                    <div className="w-8 text-center text-sm text-muted-foreground group-hover:hidden">
                      {index + 1}
                    </div>
                    <div className="hidden group-hover:block w-8 text-center">
                      <Play className="w-4 h-4 fill-current mx-auto" />
                    </div>
                    
                    <div className="min-w-0">
                      <p className={cn("font-medium truncate", isCurrentTrack && "text-primary")}>
                        {track.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {Math.floor(track.duration / 60)}:{Math.floor(track.duration % 60).toString().padStart(2, '0')}
                      </span>
                      {!isSystemPlaylist && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (typeof selectedPlaylist.id === 'number') {
                              removeTrackFromPlaylist(selectedPlaylist.id, track.id);
                            }
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
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pb-32 pt-8">
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Liked Songs Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => handlePlaylistClick(likedSongsPlaylist)}
          className="group relative aspect-square bg-card rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border border-white/5"
        >
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br p-6 flex flex-col justify-end",
            likedSongsPlaylist.gradient
          )}>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            <div className="relative z-10">
              <Heart className="w-8 h-8 text-white mb-2" />
              <h3 className="text-xl font-bold text-white mb-1">Liked Songs</h3>
              <p className="text-sm text-white/80">0 songs</p>
            </div>
          </div>
        </motion.div>

        {/* User Playlists */}
        {playlists.map((playlist, index) => (
          <motion.div
            key={playlist.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handlePlaylistClick(playlist)}
            className="group relative aspect-square bg-card rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border border-white/5"
          >
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br p-6 flex flex-col justify-end",
              playlist.gradient
            )}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="relative z-10">
                <Music className="w-8 h-8 text-white mb-2" />
                <h3 className="text-xl font-bold text-white mb-1 truncate">{playlist.name}</h3>
                <p className="text-sm text-white/80">
                  {/* We'd need to fetch track counts, but for now just show 'Playlist' */}
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
    </div>
  );
}
