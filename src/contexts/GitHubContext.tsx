import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

interface Repository {
  id: string;
  name: string;
  fullName: string;
  private: boolean;
  language: string;
  lastPush: string;
  connected: boolean;
  stars: number;
  forks: number;
  description: string;
}

interface GitHubAccount {
  username: string;
  name: string;
  avatar: string;
  connectedAt: string;
}

interface GitHubContextType {
  isConnected: boolean;
  isLoading: boolean;
  account: GitHubAccount | null;
  repositories: Repository[];
  connect: () => Promise<boolean>;
  disconnect: () => void;
  toggleRepository: (repoId: string) => void;
  syncRepositories: () => Promise<void>;
  getConnectedRepos: () => Repository[];
}

const GitHubContext = createContext<GitHubContextType | null>(null);

const STORAGE_KEY = 'codelens_github';

// Mock repositories data
const mockRepositories: Repository[] = [
  { 
    id: '1', 
    name: 'frontend-app', 
    fullName: 'developer/frontend-app', 
    private: false, 
    language: 'TypeScript', 
    lastPush: '2 hours ago', 
    connected: true,
    stars: 234,
    forks: 45,
    description: 'Modern React frontend application with TypeScript'
  },
  { 
    id: '2', 
    name: 'backend-api', 
    fullName: 'developer/backend-api', 
    private: true, 
    language: 'Python', 
    lastPush: '5 hours ago', 
    connected: true,
    stars: 89,
    forks: 12,
    description: 'FastAPI backend with PostgreSQL'
  },
  { 
    id: '3', 
    name: 'mobile-app', 
    fullName: 'developer/mobile-app', 
    private: false, 
    language: 'React Native', 
    lastPush: '1 day ago', 
    connected: false,
    stars: 156,
    forks: 23,
    description: 'Cross-platform mobile application'
  },
  { 
    id: '4', 
    name: 'data-pipeline', 
    fullName: 'developer/data-pipeline', 
    private: true, 
    language: 'Go', 
    lastPush: '3 days ago', 
    connected: false,
    stars: 45,
    forks: 8,
    description: 'ETL data processing pipeline'
  },
  { 
    id: '5', 
    name: 'ml-models', 
    fullName: 'developer/ml-models', 
    private: false, 
    language: 'Python', 
    lastPush: '1 week ago', 
    connected: true,
    stars: 678,
    forks: 156,
    description: 'Machine learning model training and serving'
  },
  { 
    id: '6', 
    name: 'design-system', 
    fullName: 'developer/design-system', 
    private: false, 
    language: 'TypeScript', 
    lastPush: '30 minutes ago', 
    connected: false,
    stars: 445,
    forks: 67,
    description: 'Shared component library and design tokens'
  },
];

const mockAccount: GitHubAccount = {
  username: 'developer',
  name: 'John Developer',
  avatar: 'JD',
  connectedAt: new Date().toISOString(),
};

export function GitHubProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<GitHubAccount | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>(mockRepositories);

  // Load state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setIsConnected(parsed.isConnected);
        setAccount(parsed.account);
        setRepositories(parsed.repositories);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Persist state to localStorage
  useEffect(() => {
    if (isConnected) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        isConnected,
        account,
        repositories,
      }));
    }
  }, [isConnected, account, repositories]);

  const connect = async (): Promise<boolean> => {
    setIsLoading(true);
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsConnected(true);
    setAccount(mockAccount);
    setIsLoading(false);
    
    toast({
      title: 'GitHub Connected!',
      description: `Connected as @${mockAccount.username}`,
    });
    return true;
  };

  const disconnect = () => {
    setIsConnected(false);
    setAccount(null);
    setRepositories(mockRepositories.map(r => ({ ...r, connected: false })));
    localStorage.removeItem(STORAGE_KEY);
    
    toast({
      title: 'GitHub Disconnected',
      description: 'Your GitHub account has been disconnected.',
    });
  };

  const toggleRepository = (repoId: string) => {
    setRepositories(prev => {
      const updated = prev.map(repo =>
        repo.id === repoId ? { ...repo, connected: !repo.connected } : repo
      );
      return updated;
    });
    
    const repo = repositories.find(r => r.id === repoId);
    if (repo) {
      toast({
        title: repo.connected ? 'Repository Disconnected' : 'Repository Connected',
        description: `${repo.fullName} has been ${repo.connected ? 'removed from' : 'added to'} CodeLens.`,
      });
    }
  };

  const syncRepositories = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    toast({
      title: 'Repositories Synced',
      description: 'All repositories have been synchronized.',
    });
  };

  const getConnectedRepos = () => repositories.filter(r => r.connected);

  return (
    <GitHubContext.Provider
      value={{
        isConnected,
        isLoading,
        account,
        repositories,
        connect,
        disconnect,
        toggleRepository,
        syncRepositories,
        getConnectedRepos,
      }}
    >
      {children}
    </GitHubContext.Provider>
  );
}

export function useGitHub() {
  const context = useContext(GitHubContext);
  if (!context) {
    throw new Error('useGitHub must be used within a GitHubProvider');
  }
  return context;
}
