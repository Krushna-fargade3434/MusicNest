import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Volume2, 
  Info, 
  Heart, 
  Moon, 
  Bell, 
  Shield, 
  Zap,
  ChevronRight,
  LogOut,
  User as UserIcon,
  Palette,
  Layout,
  Sun,
  Monitor,
  Check
} from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';
import { useUserStore } from '@/stores/userStore';
import { useSettingsStore, Theme, AccentColor } from '@/stores/settingsStore';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function SettingsView() {
  const { toast } = useToast();
  const { volume, setVolume } = usePlayerStore();
  const { currentUser, logout } = useUserStore();
  const { 
    theme, 
    accentColor, 
    isCompactMode, 
    setTheme, 
    setAccentColor, 
    setCompactMode 
  } = useSettingsStore();

  const [audioQuality, setAudioQuality] = useState('high');
  const [crossfade, setCrossfade] = useState(0);
  const [dataSaver, setDataSaver] = useState(false);

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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-4 sm:gap-0">
      <div className="flex-1 pr-4">
        <p className="font-medium">{label}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="shrink-0">
        {children}
      </div>
    </div>
  );

  const ThemeOption = ({ value, label, icon: Icon }: { value: Theme, label: string, icon: React.ElementType }) => (
    <button
      onClick={() => setTheme(value)}
      className={cn(
        "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all flex-1",
        theme === value 
          ? "bg-primary/10 border-primary text-primary" 
          : "bg-secondary/50 border-transparent hover:bg-secondary hover:border-white/10"
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  const AccentOption = ({ value, color, label }: { value: AccentColor, color: string, label: string }) => (
    <button
      onClick={() => setAccentColor(value)}
      className={cn(
        "flex items-center gap-3 p-2 pr-4 rounded-lg border transition-all flex-1",
        accentColor === value 
          ? "bg-secondary border-primary/50" 
          : "bg-secondary/30 border-transparent hover:bg-secondary/50"
      )}
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: color }}>
        {accentColor === value && <Check className="w-4 h-4 text-white" />}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
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

      {/* Appearance Section */}
      <Section title="Appearance" icon={Palette}>
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-3">Theme</p>
            <div className="flex gap-2">
              <ThemeOption value="dark" label="Dark" icon={Moon} />
              <ThemeOption value="light" label="Light" icon={Sun} />
              <ThemeOption value="system" label="Auto" icon={Monitor} />
            </div>
          </div>
          
          <div className="pt-2">
            <p className="font-medium mb-3">Accent Color</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <AccentOption value="purple" color="hsl(270, 91%, 65%)" label="Purple" />
              <AccentOption value="blue" color="hsl(217, 91%, 60%)" label="Blue" />
              <AccentOption value="green" color="hsl(142, 71%, 45%)" label="Green" />
            </div>
          </div>

          <div className="pt-2">
             <SettingRow 
              label="Compact Player Mode" 
              description="Smaller player bar for more screen space"
            >
              <Switch checked={isCompactMode} onCheckedChange={setCompactMode} />
            </SettingRow>
          </div>
        </div>
      </Section>

      {/* Audio Section */}
      <Section title="Audio Quality" icon={Volume2}>
        <SettingRow label="Streaming Quality" description="Higher quality uses more data">
          <select 
            value={audioQuality}
            onChange={(e) => setAudioQuality(e.target.value)}
            className="bg-secondary text-sm rounded-md border-none px-3 py-1 outline-none w-full sm:w-auto mt-2 sm:mt-0"
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
