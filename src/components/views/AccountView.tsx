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

      <div className="px-6 pb-32 pt-2 max-w-3xl mx-auto">
        {currentUser ? (
          <>
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8"
            >
              <div
                className="w-40 h-40 md:w-56 md:h-56 rounded-full flex items-center justify-center text-7xl font-bold text-white shadow-2xl"
                style={{ backgroundColor: currentUser.avatarColor || 'hsl(270, 91%, 65%)' }}
              >
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm font-medium mb-2">Profile</p>
                <h1 className="text-5xl md:text-7xl font-black mb-4">{currentUser.username}</h1>
                <p className="text-xl text-muted-foreground mb-4">{currentUser.email}</p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                  <span>{localTracks.length} tracks</span>
                  <span>•</span>
                  <span>Joined {new Date(currentUser.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-8">
              <Button onClick={handleLogout} variant="outline" className="rounded-full">
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>

            {/* Account Switcher */}
            {users.length > 1 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">Switch Account</h2>
                <div className="bg-card rounded-lg overflow-hidden">
                  {users.filter((u) => u.id !== currentUser.id).map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSwitchUser(user)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors text-left"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                        style={{ backgroundColor: user.avatarColor }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
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
              className="text-center py-16"
            >
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/30">
                <img src="/MUSIC-NEST-LOGO.png" alt="Music Nest" className="w-20 h-20 object-cover rounded-full" />
              </div>
              <h1 className="text-4xl font-black mb-4">MusicNest</h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Create an account to save your music library and access it anytime
              </p>
            </motion.div>

            {/* Existing Accounts */}
            {users.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">Choose Account</h2>
                <div className="bg-card rounded-lg overflow-hidden">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSwitchUser(user)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors text-left"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                        style={{ backgroundColor: user.avatarColor }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Create Account */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                {users.length > 0 ? 'Or create a new account' : 'Get Started'}
              </h2>
              <form onSubmit={handleCreateAccount} className="bg-card rounded-lg p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="What should we call you?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Note: This is a local-only app. Your data stays on your device.
                </p>
                <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
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
