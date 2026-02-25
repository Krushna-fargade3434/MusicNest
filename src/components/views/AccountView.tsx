import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, LogOut, Plus, Music, Calendar, ChevronRight } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { useTrackStore } from '@/stores/trackStore';
import { createUser, getAllUsers } from '@/lib/database';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { User as UserType } from '@/types/music';
import { cn } from '@/lib/utils';

export function AccountView() {
  const { toast } = useToast();
  const { currentUser, users, setCurrentUser, setUsers, addUser, logout } = useUserStore();
  const { localTracks, clearTracks } = useTrackStore();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      const dbUsers = await getAllUsers();
      setUsers(dbUsers);
    };
    loadUsers();
  }, [setUsers]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) return;

    setIsLoading(true);
    try {
      const newUser = await createUser(username.trim(), email.trim());
      addUser(newUser);
      setCurrentUser(newUser);
      setUsername('');
      setEmail('');
      toast({ title: 'Welcome!', description: `Account created for ${newUser.username}` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create account', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchUser = (user: UserType) => {
    setCurrentUser(user);
    clearTracks();
    toast({ title: `Welcome back, ${user.username}!` });
  };

  const handleLogout = () => {
    logout();
    clearTracks();
    toast({ title: 'Logged out', description: 'See you next time!' });
  };

  return (
    <div className="min-h-screen">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-background to-background -z-10 h-[350px]" />

      <div className="px-4 sm:px-6 pb-8 pt-1 max-w-3xl mx-auto">
        {currentUser ? (
          <>
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-center md:items-end gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8"
            >
              <div
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 rounded-full flex items-center justify-center text-4xl sm:text-5xl md:text-6xl font-bold text-white shadow-2xl"
                style={{ backgroundColor: currentUser.avatarColor || 'hsl(270, 91%, 65%)' }}
              >
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] sm:text-xs md:text-sm font-medium mb-0.5 sm:mb-1">Profile</p>
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black mb-1.5 sm:mb-2 md:mb-4">{currentUser.username}</h1>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-1.5 sm:mb-3">{currentUser.email}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                  <span>{localTracks.length} tracks</span>
                  <span>•</span>
                  <span className="hidden sm:inline">Joined {new Date(currentUser.createdAt).toLocaleDateString()}</span>
                  <span className="sm:hidden">Joined {new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <Button onClick={handleLogout} variant="outline" className="rounded-full text-sm sm:text-base touch-manipulation">
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Log Out
              </Button>
            </div>

            {/* Account Switcher */}
            {users.length > 1 && (
              <section className="mb-6 sm:mb-8">
                <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4">Switch Account</h2>
                <div className="bg-card rounded-lg overflow-hidden">
                  {users.filter((u) => u.id !== currentUser.id).map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSwitchUser(user)}
                      className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-secondary/50 active:bg-secondary/70 transition-colors text-left touch-manipulation"
                    >
                      <div
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-lg font-bold text-white"
                        style={{ backgroundColor: user.avatarColor }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{user.username}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          /* Login/Signup View */
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-5 sm:mb-8 shadow-2xl shadow-primary/30">
                <img src="/MUSIC-NEST-LOGO.png" alt="Music Nest" className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-full" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black mb-3 sm:mb-4">MusicNest</h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto px-4">
                Create an account to save your music library and access it anytime
              </p>
            </motion.div>

            {/* Existing Accounts */}
            {users.length > 0 && (
              <section className="mb-6 sm:mb-8">
                <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4">Choose Account</h2>
                <div className="bg-card rounded-lg overflow-hidden">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSwitchUser(user)}
                      className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-secondary/50 active:bg-secondary/70 transition-colors text-left touch-manipulation"
                    >
                      <div
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-lg font-bold text-white"
                        style={{ backgroundColor: user.avatarColor }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{user.username}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Create Account */}
            <section>
              <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4">
                {users.length > 0 ? 'Or create a new account' : 'Get Started'}
              </h2>
              <form onSubmit={handleCreateAccount} className="bg-card rounded-lg p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Username</label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="What should we call you?"
                    className="text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="text-sm sm:text-base"
                    required
                  />
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Note: This is a local-only app. Your data stays on your device.
                </p>
                <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-sm sm:text-base touch-manipulation">
                  {isLoading ? 'Creating...' : 'Create Profile'}
                </Button>
              </form>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
