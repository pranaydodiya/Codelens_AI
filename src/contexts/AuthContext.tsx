import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useErrorLogger } from '@/hooks/useErrorLogger';

// Profile type from database
interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  github_username: string | null;
  github_connected: boolean;
  github_connected_at: string | null;
  onboarding_completed: boolean;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  ai_reviews_used: number;
  ai_reviews_limit: number;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { logError } = useErrorLogger();

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        logError({
          type: 'DATABASE_ERROR',
          message: 'Failed to fetch user profile',
          stack: error.message,
          component: 'AuthContext',
        });
        return null;
      }

      return data as Profile | null;
    } catch (err) {
      logError({
        type: 'UNEXPECTED_ERROR',
        message: 'Unexpected error fetching profile',
        stack: err instanceof Error ? err.stack : String(err),
        component: 'AuthContext',
      });
      return null;
    }
  }, [logError]);

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  }, [user?.id, fetchProfile]);

  // Set up auth state listener on mount
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Defer profile fetch to avoid deadlock
        if (currentSession?.user) {
          setTimeout(() => {
            fetchProfile(currentSession.user.id).then(setProfile);
          }, 0);
        } else {
          setProfile(null);
        }

        if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);

      if (existingSession?.user) {
        fetchProfile(existingSession.user.id).then((profileData) => {
          setProfile(profileData);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // Login with email/password
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        let friendlyMessage = 'Login failed. Please try again.';
        
        if (error.message.includes('Invalid login credentials')) {
          friendlyMessage = 'Invalid email or password. Please check your credentials.';
        } else if (error.message.includes('Email not confirmed')) {
          friendlyMessage = 'Please verify your email address before logging in.';
        } else if (error.message.includes('Too many requests')) {
          friendlyMessage = 'Too many login attempts. Please wait a moment and try again.';
        }

        toast({
          title: 'Login Failed',
          description: friendlyMessage,
          variant: 'destructive',
        });

        return { success: false, error: friendlyMessage };
      }

      if (data.user) {
        toast({
          title: 'Welcome back!',
          description: `Signed in as ${data.user.email}`,
        });
        return { success: true };
      }

      return { success: false, error: 'Unexpected error during login' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      
      logError({
        type: 'AUTH_ERROR',
        message: 'Login exception',
        stack: err instanceof Error ? err.stack : String(err),
        component: 'AuthContext.login',
      });

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Signup with email/password
  const signup = async (email: string, password: string, fullName: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        let friendlyMessage = 'Signup failed. Please try again.';
        
        if (error.message.includes('already registered')) {
          friendlyMessage = 'This email is already registered. Please login instead.';
        } else if (error.message.includes('Password')) {
          friendlyMessage = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('valid email')) {
          friendlyMessage = 'Please enter a valid email address.';
        }

        toast({
          title: 'Signup Failed',
          description: friendlyMessage,
          variant: 'destructive',
        });

        return { success: false, error: friendlyMessage };
      }

      if (data.user) {
        toast({
          title: 'Account created!',
          description: 'Welcome to CodeLens. You are now signed in.',
        });
        return { success: true };
      }

      return { success: false, error: 'Unexpected error during signup' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      
      logError({
        type: 'AUTH_ERROR',
        message: 'Signup exception',
        stack: err instanceof Error ? err.stack : String(err),
        component: 'AuthContext.signup',
      });

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        logError({
          type: 'AUTH_ERROR',
          message: 'Logout failed',
          stack: error.message,
          component: 'AuthContext.logout',
        });
      }

      setUser(null);
      setSession(null);
      setProfile(null);

      toast({
        title: 'Signed out',
        description: 'See you next time!',
      });
    } catch (err) {
      logError({
        type: 'AUTH_ERROR',
        message: 'Logout exception',
        stack: err instanceof Error ? err.stack : String(err),
        component: 'AuthContext.logout',
      });
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<Profile>): Promise<{ success: boolean; error?: string }> => {
    if (!user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        logError({
          type: 'DATABASE_ERROR',
          message: 'Failed to update profile',
          stack: error.message,
          component: 'AuthContext.updateProfile',
        });
        return { success: false, error: error.message };
      }

      await refreshProfile();
      
      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved.',
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      return { success: false, error: errorMessage };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAuthenticated: !!user && !!session,
        isLoading,
        login,
        signup,
        logout,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
