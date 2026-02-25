import { motion } from 'framer-motion';
import { Home, ListMusic, Library, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'playlist', label: 'Playlists', icon: ListMusic },
  { id: 'library', label: 'Your Library', icon: Library },
  { id: 'account', label: 'Account', icon: User },
];

export function BottomNav({ activeTab, onTabChange, className }: BottomNavProps) {
  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent pt-6 pb-safe md:hidden z-40",
      className
    )}>
      <div className="flex items-center justify-around bg-black/80 backdrop-blur-xl mx-3 rounded-3xl py-1.5 border border-white/5 shadow-2xl">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-xl transition-all duration-200 min-w-[70px] active:scale-95',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <div className="relative">
                <item.icon className={cn('w-5 h-5', isActive && 'text-primary')} />
              </div>
              <span className={cn(
                'text-[9px] font-medium leading-tight',
                isActive && 'text-primary'
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
