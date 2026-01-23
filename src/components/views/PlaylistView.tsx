import React from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Heart, Music, MoreVertical } from 'lucide-react';
import { useTrackStore } from '@/stores/trackStore';
import { usePlayerStore } from '@/stores/playerStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function PlaylistView() {
  const { localTracks } = useTrackStore();
  const { playTrack } = usePlayerStore();

  // Mock playlists for now since we don't have a playlist table yet
  const playlists = [
    {
      id: 'liked',
      name: 'Liked Songs',
      count: localTracks.length, // Just using total count as placeholder for now
      cover: null,
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      icon: Heart
    },
    {
      id: 'all',
      name: 'All Songs',
      count: localTracks.length,
      cover: null,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      icon: Music
    }
  ];

  return (
    <div className="min-h-screen px-6 pb-32 pt-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Playlists</h1>
        <Button className="rounded-full">
          <Plus className="w-5 h-5 mr-2" />
          Create Playlist
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists.map((playlist, index) => (
          <motion.div
            key={playlist.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group relative aspect-square bg-card rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border border-white/5"
          >
            {/* Cover/Gradient */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br p-6 flex flex-col justify-end",
              playlist.gradient
            )}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              
              <div className="relative z-10">
                <playlist.icon className="w-8 h-8 text-white mb-2" />
                <h3 className="text-xl font-bold text-white mb-1">{playlist.name}</h3>
                <p className="text-sm text-white/80">{playlist.count} songs</p>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <button 
                  className="w-12 h-12 rounded-full bg-green-500 text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (localTracks.length > 0) {
                      playTrack(localTracks[0], localTracks);
                    }
                  }}
                >
                  <Play className="w-6 h-6 fill-current ml-1" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Create New Placeholder */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="aspect-square bg-card/50 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:bg-card hover:border-white/20 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <span className="font-medium text-muted-foreground group-hover:text-foreground">New Playlist</span>
        </motion.button>
      </div>
    </div>
  );
}
