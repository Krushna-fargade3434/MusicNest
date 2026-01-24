import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  ListMusic, 
  Library, 
  Plus,
  Heart,
  Music2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTrackStore } from '@/stores/trackStore';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const mainNavItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'playlist', label: 'Playlists', icon: ListMusic },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { localTracks } = useTrackStore();
  const trackCount = localTracks.length;

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-black/40 z-40 hidden md:flex flex-col gap-2 p-2">
      {/* Main Navigation Card */}
      <div className="bg-card rounded-lg p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <img src="/MUSIC-NEST-LOGO.png" alt="Music Nest" className="w-10 h-10 object-cover rounded-full" />
          <span className="text-xl font-bold text-gradient">MusicNest</span>
        </div>

        {/* Main Nav */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'w-full flex items-center gap-4 px-3 py-3 rounded-md font-medium transition-all duration-200',
                activeTab === item.id
                  ? 'text-foreground bg-transparent'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn(
                'w-6 h-6',
                activeTab === item.id && 'text-foreground'
              )} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Library Card */}
      <div className="flex-1 bg-card rounded-lg flex flex-col overflow-hidden">
        {/* Library Header */}
        <div className="p-4 flex items-center justify-between">
          <button
            onClick={() => onTabChange('library')}
            className={cn(
              'flex items-center gap-3 font-medium transition-colors',
              activeTab === 'library'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Library className="w-6 h-6" />
            <span>Your Library</span>
          </button>
          <button 
            onClick={() => onTabChange('library')}
            className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Library Content */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {trackCount > 0 ? (
            <div className="space-y-1">
              {/* Liked Songs Card */}
              <button
                onClick={() => onTabChange('library')}
                className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-secondary/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium text-sm truncate">Liked Songs</p>
                  <p className="text-xs text-muted-foreground">
                    Playlist • {trackCount} songs
                  </p>
                </div>
              </button>

              {/* Recent Activity */}
              <div className="pt-2">
                <p className="px-2 py-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Recently Added
                </p>
                {localTracks.slice(0, 5).map((track) => (
                  <button
                    key={track.id}
                    onClick={() => onTabChange('library')}
                    className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center shrink-0">
                      <Music2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium text-sm truncate">{track.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="bg-secondary/30 rounded-lg p-4">
                <p className="font-semibold mb-1">Create your first playlist</p>
                <p className="text-sm text-muted-foreground mb-4">
                  It's easy, we'll help you
                </p>
                <button
                  onClick={() => onTabChange('library')}
                  className="px-4 py-2 bg-foreground text-background rounded-full text-sm font-medium hover:scale-105 transition-transform"
                >
                  Add Songs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
