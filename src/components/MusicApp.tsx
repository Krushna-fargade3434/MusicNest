import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { MiniPlayer } from '@/components/player/MiniPlayer';
import { FullScreenPlayer } from '@/components/player/FullScreenPlayer';
import { HomeView } from '@/components/views/HomeView';
import { LibraryView } from '@/components/views/LibraryView';
import { PlaylistView } from '@/components/views/PlaylistView';
import { AccountView } from '@/components/views/AccountView';
import { SettingsView } from '@/components/views/SettingsView';
import { usePlayerStore } from '@/stores/playerStore';
import { useUserStore } from '@/stores/userStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useLocalMusic } from '@/hooks/useLocalMusic';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { cn } from '@/lib/utils';

export function MusicApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const { currentTrack } = usePlayerStore();
  const { currentUser } = useUserStore();
  const { theme, accentColor } = useSettingsStore();
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
    
    if (accentColor === 'purple') {
      setStyle('--primary', '270 91% 65%');
      setStyle('--ring', '270 91% 65%');
      setStyle('--accent', '280 100% 70%');
    } else if (accentColor === 'blue') {
      setStyle('--primary', '217 91% 60%');
      setStyle('--ring', '217 91% 60%');
      setStyle('--accent', '221 83% 53%');
    } else if (accentColor === 'green') {
      setStyle('--primary', '142 71% 45%');
      setStyle('--ring', '142 71% 45%');
      setStyle('--accent', '142 76% 36%');
    }
  }, [theme, accentColor]);

  // Load tracks from DB when user changes
  useEffect(() => {
    if (currentUser) {
      loadTracksFromDB();
    }
  }, [currentUser, loadTracksFromDB]);

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
          currentTrack ? 'pb-40 md:pb-24' : 'pb-20 md:pb-0'
        )}
      >
        {/* Header */}
        <Header onNavigate={setActiveTab} />

        {/* Page Content */}
        <AnimatePresence mode="wait">
          <div key={activeTab}>
            {renderContent()}
          </div>
        </AnimatePresence>
      </main>

      {/* Mini Player */}
      <AnimatePresence>
        {currentTrack && !isFullScreenOpen && (
          <MiniPlayer 
            onClick={() => setIsFullScreenOpen(true)} 
            onSeek={seek}
            className="bottom-[80px] md:bottom-0"
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
