import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiClientError } from '@/lib/api-client';

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

// API response types
interface GitHubAccountResponse {
  success: boolean;
  data: {
    username: string;
    name: string | null;
    avatar: string;
    connectedAt: string;
    lastSyncedAt: string | null;
  };
}

interface RepositoriesResponse {
  success: boolean;
  data: Repository[];
}

export function GitHubProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const GITHUB_OAUTH_URL = import.meta.env.VITE_GITHUB_OAUTH_URL || 'http://localhost:3000/api/github/auth';

  // Fetch GitHub account info
  const { data: accountData, isLoading: isLoadingAccount } = useQuery<GitHubAccountResponse>({
    queryKey: ['github-account'],
    queryFn: () => apiClient.get('/api/github/account'),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Fetch repositories
  const { data: reposData, isLoading: isLoadingRepos, refetch: refetchRepos } = useQuery<RepositoriesResponse>({
    queryKey: ['github-repositories'],
    queryFn: () => apiClient.get('/api/github/repositories'),
    enabled: !!accountData?.success, // Only fetch if account is connected
    retry: false,
  });

  // Sync repositories mutation
  const syncMutation = useMutation({
    mutationFn: () => apiClient.post('/api/github/sync'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-repositories'] });
      toast({
        title: 'Repositories Synced',
        description: 'All repositories have been synchronized.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Sync Failed',
        description: error.message || 'Failed to sync repositories',
        variant: 'destructive',
      });
    },
  });

  // Connect repository mutation
  const connectRepoMutation = useMutation({
    mutationFn: ({ repoId, connected }: { repoId: string; connected: boolean }) =>
      apiClient.post(`/api/github/repositories/${repoId}/connect`, { connected }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-repositories'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Operation Failed',
        description: error.message || 'Failed to update repository connection',
        variant: 'destructive',
      });
    },
  });

  const isConnected = !!accountData?.success;
  const isLoading = isLoadingAccount || isLoadingRepos;
  const account: GitHubAccount | null = accountData?.success
    ? {
        username: accountData.data.username,
        name: accountData.data.name || accountData.data.username,
        avatar: accountData.data.avatar,
        connectedAt: accountData.data.connectedAt,
      }
    : null;
  const repositories: Repository[] = reposData?.success ? reposData.data : [];

  const connect = useCallback(async (): Promise<boolean> => {
    // Redirect to GitHub OAuth
    window.location.href = GITHUB_OAUTH_URL;
    return true;
  }, [GITHUB_OAUTH_URL]);

  const disconnect = useCallback(async () => {
    try {
      await apiClient.delete('/api/github/account');
      queryClient.setQueryData(['github-account'], null);
      queryClient.setQueryData(['github-repositories'], { success: true, data: [] });
      
      toast({
        title: 'GitHub Disconnected',
        description: 'Your GitHub account has been disconnected.',
      });
    } catch (error) {
      toast({
        title: 'Disconnect Failed',
        description: error instanceof Error ? error.message : 'Failed to disconnect GitHub',
        variant: 'destructive',
      });
    }
  }, [queryClient]);

  const toggleRepository = useCallback((repoId: string) => {
    const repo = repositories.find(r => r.id === repoId);
    if (!repo) return;

    const newConnected = !repo.connected;
    connectRepoMutation.mutate(
      { repoId, connected: newConnected },
      {
        onSuccess: () => {
          toast({
            title: newConnected ? 'Repository Connected' : 'Repository Disconnected',
            description: `${repo.fullName} has been ${newConnected ? 'added to' : 'removed from'} CodeLens.`,
          });
        },
      }
    );
  }, [repositories, connectRepoMutation]);

  const syncRepositories = useCallback(async () => {
    syncMutation.mutate();
  }, [syncMutation]);

  const getConnectedRepos = useCallback(() => {
    return repositories.filter(r => r.connected);
  }, [repositories]);

  // Check for OAuth callback success/error
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');

    if (success === 'github_connected') {
      queryClient.invalidateQueries({ queryKey: ['github-account'] });
      queryClient.invalidateQueries({ queryKey: ['github-repositories'] });
      toast({
        title: 'GitHub Connected!',
        description: 'Your GitHub account has been connected successfully.',
      });
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (error) {
      toast({
        title: 'GitHub Connection Failed',
        description: error === 'access_denied' 
          ? 'GitHub authorization was cancelled.'
          : 'Failed to connect GitHub account.',
        variant: 'destructive',
      });
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [queryClient]);

  return (
    <GitHubContext.Provider
      value={{
        isConnected,
        isLoading: isLoading || syncMutation.isPending || connectRepoMutation.isPending,
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
