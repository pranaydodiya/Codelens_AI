import { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';
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
  user: {
    id: string;
    email: string;
    fullName: string | null;
    imageUrl: string | null;
  } | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function ClerkAuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { isLoaded: isAuthLoaded } = useClerkAuth();
  const { signOut } = useClerk();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const { logError } = useErrorLogger();

  const isLoading = !isUserLoaded || !isAuthLoaded || isProfileLoading;
  const isAuthenticated = !!isSignedIn && !!clerkUser;

  // Fetch or create user profile from database
  const fetchOrCreateProfile = useCallback(async (userId: string, email: string, fullName: string | null) => {
    try {
      // First try to fetch existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        logError({
          type: 'DATABASE_ERROR',
          message: 'Failed to fetch user profile',
          stack: fetchError.message,
          component: 'ClerkAuthContext',
        });
        return null;
      }

      if (existingProfile) {
        return existingProfile as Profile;
      }

      // Create new profile if doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          email: email,
          full_name: fullName,
          subscription_tier: 'free',
          ai_reviews_limit: 100,
          ai_reviews_used: 0,
          onboarding_completed: false,
          github_connected: false,
        })
        .select()
        .single();

      if (createError) {
        logError({
          type: 'DATABASE_ERROR',
          message: 'Failed to create user profile',
          stack: createError.message,
          component: 'ClerkAuthContext',
        });
        return null;
      }

      return newProfile as Profile;
    } catch (err) {
      logError({
        type: 'UNEXPECTED_ERROR',
        message: 'Unexpected error with profile',
        stack: err instanceof Error ? err.stack : String(err),
        component: 'ClerkAuthContext',
      });
      return null;
    }
  }, [logError]);

  // Sync profile when user changes
  useEffect(() => {
    const syncProfile = async () => {
      if (isSignedIn && clerkUser) {
        setIsProfileLoading(true);
        const email = clerkUser.primaryEmailAddress?.emailAddress || '';
        const fullName = clerkUser.fullName;
        const profileData = await fetchOrCreateProfile(clerkUser.id, email, fullName);
        setProfile(profileData);
        setIsProfileLoading(false);
      } else if (isUserLoaded && !isSignedIn) {
        setProfile(null);
        setIsProfileLoading(false);
      }
    };

    syncProfile();
  }, [isSignedIn, clerkUser, isUserLoaded, fetchOrCreateProfile]);

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    if (clerkUser?.id) {
      const email = clerkUser.primaryEmailAddress?.emailAddress || '';
      const profileData = await fetchOrCreateProfile(clerkUser.id, email, clerkUser.fullName);
      setProfile(profileData);
    }
  }, [clerkUser, fetchOrCreateProfile]);

  // Logout
  const logout = async () => {
    try {
      await signOut();
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
        component: 'ClerkAuthContext.logout',
      });
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<Profile>): Promise<{ success: boolean; error?: string }> => {
    if (!clerkUser?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', clerkUser.id);

      if (error) {
        logError({
          type: 'DATABASE_ERROR',
          message: 'Failed to update profile',
          stack: error.message,
          component: 'ClerkAuthContext.updateProfile',
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

  // Transform Clerk user to our user format
  const user = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    fullName: clerkUser.fullName,
    imageUrl: clerkUser.imageUrl,
  } : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated,
        isLoading,
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
    throw new Error('useAuth must be used within a ClerkAuthProvider');
  }
  return context;
}
