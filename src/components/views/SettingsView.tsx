import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Volume2, 
  Trash2, 
  Info, 
  Heart, 
  Smartphone, 
  Moon, 
  Bell, 
  Shield, 
  Zap,
  ChevronRight,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';
import { useTrackStore } from '@/stores/trackStore';
import { useUserStore } from '@/stores/userStore';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function SettingsView() {
  const { toast } = useToast();
  const { volume, setVolume } = usePlayerStore();
  const { localTracks, clearTracks } = useTrackStore();
  const { currentUser, logout } = useUserStore();

  const [audioQuality, setAudioQuality] = useState('high');
  const [crossfade, setCrossfade] = useState(0);
  const [notifications, setNotifications] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);

  const handleClearLibrary = () => {
    if (confirm('Are you sure you want to clear all tracks from your library? This action cannot be undone.')) {
      clearTracks();
      toast({
        title: 'Library cleared',
        description: 'All tracks have been removed from your library.',
      });
    }
  };

  const handleClearCache = () => {
    toast({
      title: 'Cache cleared',
      description: 'Freeing up space...',
    });
    setTimeout(() => {
      toast({
        title: 'Success',
        description: '245 MB freed',
      });
    }, 1000);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
      toast({
        title: 'Logged out',
        description: 'Come back soon!',
      });
    }
  };

  const Section = ({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) => (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/50 backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden"
    >
      <div className="p-4 border-b border-white/5 flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="p-4 space-y-4">
        {children}
      </div>
    </motion.section>
  );

  const SettingRow = ({ label, description, children }: { label: string, description?: string, children: React.ReactNode }) => (
    <div className="flex items-center justify-between py-1">
      <div className="flex-1 pr-4">
        <p className="font-medium">{label}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="shrink-0">
        {children}
      </div>
    </div>
  );

  return (
    <div className="p-6 pb-32 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      {/* Account Section */}
      {currentUser && (
        <Section title="Account" icon={UserIcon}>
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg"
              style={{ backgroundColor: currentUser.avatarColor || 'hsl(270, 91%, 65%)' }}
            >
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold">{currentUser.username}</h3>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </Button>
          </div>
          <div className="pt-2">
            <Button variant="ghost" className="w-full justify-between" disabled>
              <span>Subscription Plan</span>
              <span className="text-primary font-medium">Free</span>
            </Button>
          </div>
        </Section>
      )}

      {/* Audio Section */}
      <Section title="Audio Quality" icon={Volume2}>
        <SettingRow label="Streaming Quality" description="Higher quality uses more data">
          <select 
            value={audioQuality}
            onChange={(e) => setAudioQuality(e.target.value)}
            className="bg-secondary text-sm rounded-md border-none px-3 py-1 outline-none"
          >
            <option value="low">Low (96kbps)</option>
            <option value="normal">Normal (128kbps)</option>
            <option value="high">High (320kbps)</option>
            <option value="lossless">Lossless</option>
          </select>
        </SettingRow>

        <div className="space-y-3 pt-2">
          <div className="flex justify-between text-sm">
            <span>Crossfade</span>
            <span className="text-muted-foreground">{crossfade}s</span>
          </div>
          <Slider
            value={[crossfade]}
            max={12}
            step={1}
            onValueChange={(val) => setCrossfade(val[0])}
          />
        </div>

        <SettingRow label="Normalize Volume" description="Set the same volume level for all tracks">
          <Switch defaultChecked />
        </SettingRow>
      </Section>

      {/* Playback Section */}
      <Section title="Playback" icon={Zap}>
        <SettingRow label="Autoplay" description="Keep listening to similar songs when your music ends">
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow label="Data Saver" description="Lower audio quality on cellular networks">
          <Switch checked={dataSaver} onCheckedChange={setDataSaver} />
        </SettingRow>
        <SettingRow label="Offline Mode" description="Only play downloaded music">
          <Switch />
        </SettingRow>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        <SettingRow label="Security" description="Alerts about account activity">
          <Switch defaultChecked disabled />
        </SettingRow>
      </Section>

      {/* Storage & Privacy */}
      <Section title="Storage" icon={Smartphone}>
        <div className="space-y-4">
          <SettingRow 
            label="Download Imported Music" 
            description="Keep imported songs available offline for playback without internet"
          >
            <Switch defaultChecked />
          </SettingRow>

          <div className="bg-secondary/50 rounded-full h-2 overflow-hidden flex">
            <div className="bg-primary w-[30%]" />
            <div className="bg-blue-500 w-[15%]" />
            <div className="bg-transparent flex-1" />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex gap-4">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> Audio</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Cache</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-secondary" /> Free</span>
            </div>
            <span>2.4 GB used</span>
          </div>
          
          <Button variant="outline" className="w-full" onClick={handleClearCache}>
            Clear Cache
          </Button>

          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium">Local Library</p>
                <p className="text-sm text-muted-foreground">
                  {localTracks.length} tracks imported
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearLibrary}
              disabled={localTracks.length === 0}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove All Imported Tracks
            </Button>
          </div>
        </div>
      </Section>

      {/* About */}
      <div className="text-center py-8 space-y-4">
        <div className="flex justify-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Heart className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Info className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
          </Button>
        </div>
        <div>
          <p className="font-bold">MusicNest v1.2.0</p>
          <p className="text-sm text-muted-foreground">Made with love for music</p>
        </div>
      </div>
    </div>
  );
}
