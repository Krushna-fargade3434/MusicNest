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
import { useLocalMusic } from '@/hooks/useLocalMusic';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { cn } from '@/lib/utils';

export function MusicApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const { currentTrack } = usePlayerStore();
  const { currentUser } = useUserStore();
  const { loadTracksFromDB } = useLocalMusic();
  const { seek } = useAudioPlayer();

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
