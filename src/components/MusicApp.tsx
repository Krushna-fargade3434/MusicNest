import { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { MiniPlayer } from '@/components/player/MiniPlayer';
import { FullScreenPlayer } from '@/components/player/FullScreenPlayer';
import { usePlayerStore } from '@/stores/playerStore';
import { useUserStore } from '@/stores/userStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useTrackStore } from '@/stores/trackStore';
import { useLocalMusic } from '@/hooks/useLocalMusic';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { cn } from '@/lib/utils';
import { ACCENT_COLORS } from '@/constants';
import { getSampleSongs } from '@/data/sampleSongs';

// Lazy load views for better performance
const HomeView = lazy(() => import('@/components/views/HomeView').then(m => ({ default: m.HomeView })));
const LibraryView = lazy(() => import('@/components/views/LibraryView').then(m => ({ default: m.LibraryView })));
const PlaylistView = lazy(() => import('@/components/views/PlaylistView').then(m => ({ default: m.PlaylistView })));
const AccountView = lazy(() => import('@/components/views/AccountView').then(m => ({ default: m.AccountView })));
const SettingsView = lazy(() => import('@/components/views/SettingsView').then(m => ({ default: m.SettingsView })));

// Loading component
function ViewLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <img src="/MUSIC-NEST-LOGO.png" alt="Music Nest" className="w-16 h-16 object-cover rounded-full" />
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function MusicApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const { currentTrack } = usePlayerStore();
  const { currentUser } = useUserStore();
  const { theme, accentColor } = useSettingsStore();
  const { localTracks, addTracks } = useTrackStore();
  const { loadTracksFromDB } = useLocalMusic();
  const { seek } = useAudioPlayer();

  // Apply Theme and Accent Color
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    const setStyle = (name: string, value: string) => root.style.setProperty(name, value);
    
    const colors = ACCENT_COLORS[accentColor];
    if (colors) {
      setStyle('--primary', colors.primary);
      setStyle('--ring', colors.ring);
      setStyle('--accent', colors.accent);
    }
  }, [theme, accentColor]);

  // Load tracks from DB when user changes
  useEffect(() => {
    if (currentUser) {
      loadTracksFromDB();
    }
  }, [currentUser, loadTracksFromDB]);

  // Load sample songs when user has no tracks (first time experience)
  useEffect(() => {
    if (currentUser && localTracks.length === 0) {
      const timeoutId = setTimeout(() => {
        if (localTracks.length === 0) {
          const sampleTracks = getSampleSongs(currentUser.id!);
          addTracks(sampleTracks);
          console.log('✨ Loaded sample songs for demo');
        }
      }, 1000); // Wait 1 second after user login to check if they have tracks
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentUser, localTracks.length, addTracks]);

  // Redirect to account if not logged in
  useEffect(() => {
    if (!currentUser && activeTab !== 'account') {
      setActiveTab('account');
    }
  }, [currentUser, activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView onNavigate={setActiveTab} />;
      case 'playlist':
        return <PlaylistView />;
      case 'library':
        return <LibraryView />;
      case 'account':
        return <AccountView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar (Desktop) */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen transition-all duration-300',
          'md:ml-[280px]',
          currentTrack ? 'pb-[140px] md:pb-24' : 'pb-20 md:pb-0'
        )}
      >
        {/* Header */}
        <Header onNavigate={setActiveTab} />

        {/* Page Content with Suspense */}
        <AnimatePresence mode="wait">
          <Suspense fallback={<ViewLoader />} key={activeTab}>
            {renderContent()}
          </Suspense>
        </AnimatePresence>
      </main>

      {/* Mini Player */}
      <AnimatePresence>
        {currentTrack && !isFullScreenOpen && (
          <MiniPlayer 
            onClick={() => setIsFullScreenOpen(true)} 
            onSeek={seek}
            className="bottom-[68px] md:bottom-0"
          />
        )}
      </AnimatePresence>

      {/* Full Screen Player */}
      <FullScreenPlayer
        isOpen={isFullScreenOpen}
        onClose={() => setIsFullScreenOpen(false)}
        onSeek={seek}
      />

      {/* Bottom Navigation (Mobile) */}
      {!isFullScreenOpen && (
        <BottomNav 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          className="z-40" 
        />
      )}
    </div>
  );
}
