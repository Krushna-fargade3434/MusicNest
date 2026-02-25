import { ChevronLeft, ChevronRight, User, Settings, WifiOff } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onNavigate: (tab: string) => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

export function Header({ onNavigate, canGoBack = false, canGoForward = false }: HeaderProps) {
  const { currentUser } = useUserStore();
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-4 bg-gradient-to-b from-background/90 via-background/70 to-transparent backdrop-blur-xl">
      {/* Mobile Logo & Navigation Arrows */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Logo */}
        <div className="md:hidden flex items-center gap-2">
           <img src="/MUSIC-NEST-LOGO.png" alt="Music Nest" className="w-7 h-7 sm:w-9 sm:h-9 object-cover rounded-full" />
           <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">MusicNest</span>
        </div>

        {/* Navigation Arrows (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <button
            disabled={!canGoBack}
            className={cn(
              'w-8 h-8 rounded-full bg-black/60 flex items-center justify-center transition-opacity',
              canGoBack ? 'opacity-100 hover:bg-black/80' : 'opacity-50 cursor-not-allowed'
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            disabled={!canGoForward}
            className={cn(
              'w-8 h-8 rounded-full bg-black/60 flex items-center justify-center transition-opacity',
              canGoForward ? 'opacity-100 hover:bg-black/80' : 'opacity-50 cursor-not-allowed'
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Offline Indicator */}
        {!isOnline && (
          <div 
            className="flex items-center gap-1 px-1.5 py-1 sm:px-2.5 sm:py-1 rounded-full bg-amber-500/20 border border-amber-500/30"
            title="You're offline - Your saved music is still available"
          >
            <WifiOff className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
            <span className="text-[10px] sm:text-xs font-medium text-amber-400 hidden sm:inline">Offline</span>
          </div>
        )}
        
        <button
          onClick={() => onNavigate('settings')}
          className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 active:scale-95 transition-all touch-manipulation"
        >
          <Settings className="w-4 h-4" />
        </button>
        <button
          onClick={() => onNavigate('account')}
          className={cn(
            'flex items-center gap-1.5 p-0.5 sm:pr-2.5 rounded-full bg-black/60 hover:bg-black/80 active:scale-95 transition-all touch-manipulation',
            currentUser ? 'pr-1.5 sm:pr-2.5' : 'pr-0.5'
          )}
        >
          <div
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
              currentUser
                ? 'text-white'
                : 'bg-secondary'
            )}
            style={{ 
              backgroundColor: currentUser?.avatarColor || undefined 
            }}
          >
            {currentUser ? (
              currentUser.username.charAt(0).toUpperCase()
            ) : (
              <User className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </div>
          {currentUser && (
            <span className="text-xs font-medium hidden sm:inline truncate max-w-[80px]">
              {currentUser.username}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
