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
    <header className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-gradient-to-b from-background/80 via-background/60 to-transparent backdrop-blur-md">
      {/* Mobile Logo & Navigation Arrows */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Logo */}
        <div className="md:hidden flex items-center gap-2">
           <img src="/MUSIC-NEST-LOGO.png" alt="Music Nest" className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full" />
           <span className="text-base sm:text-lg font-bold text-gradient">MusicNest</span>
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
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30"
            title="You're offline - Your saved music is still available"
          >
            <WifiOff className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400" />
            <span className="text-xs font-medium text-amber-400 hidden sm:inline">Offline</span>
          </div>
        )}
        
        <button
          onClick={() => onNavigate('settings')}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 hover:scale-105 transition-all"
        >
          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={() => onNavigate('account')}
          className={cn(
            'flex items-center gap-1.5 sm:gap-2 p-0.5 sm:pr-3 rounded-full bg-black/60 hover:bg-black/80 transition-colors',
            currentUser ? 'pr-2 sm:pr-3' : 'pr-0.5'
          )}
        >
          <div
            className={cn(
              'w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold',
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
              <User className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
          {currentUser && (
            <span className="text-xs sm:text-sm font-medium hidden sm:block truncate max-w-[100px]">
              {currentUser.username}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
