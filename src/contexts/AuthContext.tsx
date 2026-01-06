import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGitHub: () => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'codelens_auth';

// Mock user data
const createMockUser = (email: string, name: string): User => ({
  id: `user_${Date.now()}`,
  email,
  name,
  avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(),
  createdAt: new Date().toISOString(),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password.length >= 6) {
      const mockUser = createMockUser(email, email.split('@')[0]);
      setUser(mockUser);
      setIsLoading(false);
      toast({
        title: 'Welcome back!',
        description: `Signed in as ${email}`,
      });
      return true;
    }
    
    setIsLoading(false);
    toast({
      title: 'Login failed',
      description: 'Invalid email or password',
      variant: 'destructive',
    });
    return false;
  };

  const loginWithGitHub = async (): Promise<boolean> => {
    setIsLoading(true);
    // Simulate GitHub OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser = createMockUser('developer@github.com', 'GitHub User');
    setUser(mockUser);
    setIsLoading(false);
    
    toast({
      title: 'GitHub Connected!',
      description: 'Successfully signed in with GitHub',
    });
    return true;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password.length >= 6 && name) {
      const mockUser = createMockUser(email, name);
      setUser(mockUser);
      setIsLoading(false);
      toast({
        title: 'Account created!',
        description: 'Welcome to CodeLens',
      });
      return true;
    }
    
    setIsLoading(false);
    toast({
      title: 'Signup failed',
      description: 'Please check your information',
      variant: 'destructive',
    });
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('codelens_github');
    toast({
      title: 'Signed out',
      description: 'See you next time!',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGitHub,
        signup,
        logout,
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
