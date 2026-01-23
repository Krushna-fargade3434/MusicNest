import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Play, Pause, Music, Clock, MoreHorizontal, Heart } from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';
import { useTrackStore } from '@/stores/trackStore';
import { useLocalMusic } from '@/hooks/useLocalMusic';
import { cn } from '@/lib/utils';

function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function LibraryView() {
  const { localTracks } = useTrackStore();
  const { openFilePicker, FileInput } = useLocalMusic();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  const handlePlayTrack = (track: typeof localTracks[0]) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, localTracks);
    }
  };

  const totalDuration = localTracks.reduce((acc, track) => acc + track.duration, 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="min-h-screen">
      <FileInput />
      
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/40 via-background to-background -z-10 h-[350px]" />

      <div className="px-6 pb-32 pt-2">
        {/* Playlist Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8"
        >
          {/* Playlist Cover */}
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/20">
            <Heart className="w-24 h-24 text-white fill-white" />
          </div>

          {/* Playlist Info */}
          <div className="flex-1">
            <p className="text-sm font-medium mb-2">Playlist</p>
            <h1 className="text-5xl md:text-7xl font-black mb-4">Your Library</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{localTracks.length} songs</span>
              <span>•</span>
              <span>{hours > 0 ? `${hours} hr ` : ''}{minutes} min</span>
            </div>
          </div>
        </motion.div>

        {/* Action Bar */}
        <div className="flex items-center gap-4 mb-6">
          {localTracks.length > 0 && (
            <button
              onClick={() => localTracks[0] && playTrack(localTracks[0], localTracks)}
              className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
            >
              <Play className="w-7 h-7 ml-1 fill-current" />
            </button>
          )}
          <button
            onClick={openFilePicker}
            className="px-6 py-3 rounded-full border border-foreground/20 font-semibold hover:border-foreground hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Songs
          </button>
        </div>

        {/* Track List */}
        {localTracks.length > 0 ? (
          <div className="bg-black/20 rounded-lg overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-[16px_4fr_3fr_minmax(80px,1fr)] gap-4 px-4 py-3 border-b border-white/5 text-sm text-muted-foreground">
              <span className="text-center">#</span>
              <span>Title</span>
              <span className="hidden md:block">Album</span>
              <span className="flex justify-end">
                <Clock className="w-4 h-4" />
              </span>
            </div>

            {/* Track Rows */}
            {localTracks.map((track, index) => {
              const isActive = currentTrack?.id === track.id;
              const isCurrentlyPlaying = isActive && isPlaying;

              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => handlePlayTrack(track)}
                  className={cn(
                    'group grid grid-cols-[16px_4fr_3fr_minmax(80px,1fr)] gap-4 px-4 py-2 items-center cursor-pointer transition-colors',
                    isActive ? 'bg-white/10' : 'hover:bg-white/5'
                  )}
                >
                  {/* Number / Play */}
                  <div className="flex items-center justify-center">
                    <span className={cn(
                      'group-hover:hidden text-sm tabular-nums',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}>
                      {isCurrentlyPlaying ? (
                        <div className="flex gap-0.5 items-end h-4">
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
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </button>
                  </div>

                  {/* Title & Artist */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                      {track.coverUrl ? (
                        <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                      ) : (
                        <Music className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={cn('font-medium truncate', isActive && 'text-primary')}>
                        {track.title}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                    </div>
                  </div>

                  {/* Album */}
                  <p className="hidden md:block text-sm text-muted-foreground truncate hover:underline cursor-pointer">
                    {track.album}
                  </p>

                  {/* Duration & Actions */}
                  <div className="flex items-center justify-end gap-3">
                    <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity">
                      <Heart className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {formatDuration(track.duration)}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
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
    </div>
  );
}
