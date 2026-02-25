import { motion } from 'framer-motion';
import { Play, Music, Clock, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';
import { useTrackStore } from '@/stores/trackStore';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';
import { isSampleTrack } from '@/data/sampleSongs';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

const greetings = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export function HomeView({ onNavigate }: HomeViewProps) {
  const { localTracks } = useTrackStore();
  const { playTrack } = usePlayerStore();
  const { currentUser } = useUserStore();
  
  const recentTracks = [...localTracks]
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, 8);

  const quickPlayItems = recentTracks.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-background -z-10 h-[400px]" />

      <div className="px-4 sm:px-6 pb-8 pt-1">
        {/* Greeting */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-5"
        >
          {greetings()}{currentUser ? `, ${currentUser.username}` : ''}
        </motion.h1>

        {/* Quick Play Grid */}
        {quickPlayItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-5 sm:mb-7"
          >
            {quickPlayItems.map((track, index) => (
              <motion.button
                key={track.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => playTrack(track, localTracks)}
                className="flex items-center bg-white/10 hover:bg-white/20 active:bg-white/15 rounded-lg overflow-hidden group transition-colors touch-manipulation"
                aria-label={`Play ${track.title} by ${track.artist}`}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-14 md:h-14 bg-secondary flex items-center justify-center shrink-0">
                  {track.coverUrl ? (
                    <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                  ) : (
                    <Music className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                  )}
                </div>
                <span className="px-3 font-medium text-xs sm:text-sm truncate flex-1 text-left leading-tight">
                  {track.title}
                </span>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground items-center justify-center mr-2 hidden sm:group-hover:flex shadow-lg shadow-primary/30">
                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Recently Added Section */}
        {recentTracks.length > 0 && (
          <section className="mb-5 sm:mb-7">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base sm:text-lg md:text-xl font-bold hover:underline cursor-pointer">Recently Added</h2>
              <button
                onClick={() => onNavigate('library')}
                className="text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground active:text-primary flex items-center gap-1 touch-manipulation"
              >
                Show all
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2.5 sm:gap-3 md:gap-4">
              {recentTracks.map((track, index) => (
                <motion.button
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.03 }}
                  onClick={() => playTrack(track, localTracks)}
                  className="group p-2.5 sm:p-3 md:p-4 rounded-lg bg-card hover:bg-secondary/80 active:bg-secondary transition-colors text-left touch-manipulation"
                  aria-label={`Play ${track.title}`}
                >
                  <div className="relative aspect-square rounded-md mb-2 sm:mb-2.5 md:mb-3 bg-secondary overflow-hidden shadow-lg">
                    {track.coverUrl ? (
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl shadow-black/40">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5 fill-current" />
                      </div>
                    </div>
                  </div>
                  <p className="font-semibold text-xs sm:text-sm truncate leading-tight">
                    {track.title}
                    {isSampleTrack(track.id) && (
                      <span className="ml-1 text-[8px] sm:text-[9px] px-1 py-0.5 rounded bg-primary/20 text-primary font-semibold">DEMO</span>
                    )}
                  </p>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {localTracks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 sm:py-20"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-5 sm:mb-6">
              <Music className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 px-4">Start your music journey</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto px-4">
              Import your favorite songs and create your personal music collection
            </p>
            <button
              onClick={() => onNavigate('library')}
              className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-primary text-primary-foreground font-semibold active:scale-95 transition-transform shadow-lg shadow-primary/30 touch-manipulation"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              Import Your Music
            </button>
          </motion.div>
        )}

        {/* Stats Cards */}
        {localTracks.length > 0 && (
          <section>
            <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3">Your Stats</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
              {[
                { label: 'Songs', value: localTracks.length, icon: Music, color: 'from-indigo-500 to-purple-600' },
                { label: 'Minutes', value: Math.round(localTracks.reduce((acc, t) => acc + t.duration, 0) / 60), icon: Clock, color: 'from-cyan-500 to-blue-600' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={cn(
                    'p-3 sm:p-4 rounded-xl bg-gradient-to-br text-white shadow-lg',
                    stat.color
                  )}
                >
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1.5 sm:mb-2 opacity-80" />
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs md:text-sm opacity-80">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
