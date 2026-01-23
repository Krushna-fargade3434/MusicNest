import React from 'react';
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
      "fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent pt-8 pb-2 md:hidden z-40",
      className
    )}>
      <div className="flex items-center justify-around bg-black/60 backdrop-blur-lg mx-2 rounded-2xl py-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all duration-200 min-w-[64px]',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <div className="relative">
                <item.icon className={cn('w-6 h-6', isActive && 'text-primary')} />
              </div>
              <span className={cn(
                'text-[10px] font-medium',
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
