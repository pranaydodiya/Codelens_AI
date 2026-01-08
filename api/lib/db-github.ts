/**
 * Database utilities for GitHub integration
 */

import { supabase } from './db';

export interface GitHubConnection {
  id: string;
  user_id: string;
  access_token: string;
  token_type: string;
  scope: string | null;
  github_user_id: number;
  github_username: string;
  github_avatar_url: string | null;
  connected_at: string;
  last_synced_at: string | null;
  expires_at: string | null;
}

export interface ConnectedRepository {
  id: string;
  user_id: string;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  is_private: boolean;
  stars: number;
  forks: number;
  last_synced_at: string | null;
  github_repo_id: number | null;
  connected: boolean;
  github_connection_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Store or update GitHub connection
 */
export async function upsertGitHubConnection(
  userId: string,
  connectionData: {
    access_token: string;
    token_type?: string;
    scope?: string;
    github_user_id: number;
    github_username: string;
    github_avatar_url?: string;
    expires_at?: string;
  }
): Promise<string> {
  const { data, error } = await supabase
    .from('github_connections')
    .upsert({
      user_id: userId,
      access_token: connectionData.access_token,
      token_type: connectionData.token_type || 'bearer',
      scope: connectionData.scope || null,
      github_user_id: connectionData.github_user_id,
      github_username: connectionData.github_username,
      github_avatar_url: connectionData.github_avatar_url || null,
      expires_at: connectionData.expires_at || null,
      last_synced_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id',
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error storing GitHub connection:', error);
    throw new Error('Failed to store GitHub connection');
  }

  return data.id;
}

/**
 * Get GitHub connection for user
 */
export async function getGitHubConnection(userId: string): Promise<GitHubConnection | null> {
  const { data, error } = await supabase
    .from('github_connections')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No connection found
    }
    console.error('Error fetching GitHub connection:', error);
    throw new Error('Failed to fetch GitHub connection');
  }

  return data as GitHubConnection;
}

/**
 * Delete GitHub connection
 */
export async function deleteGitHubConnection(userId: string): Promise<void> {
  const { error } = await supabase
    .from('github_connections')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting GitHub connection:', error);
    throw new Error('Failed to delete GitHub connection');
  }
}

/**
 * Sync repositories to database
 */
export async function syncRepositoriesToDatabase(
  userId: string,
  repositories: Array<{
    github_repo_id: number;
    name: string;
    full_name: string;
    description: string | null;
    language: string | null;
    is_private: boolean;
    stars: number;
    forks: number;
  }>,
  githubConnectionId: string
): Promise<void> {
  // Upsert repositories
  const repoData = repositories.map(repo => ({
    user_id: userId,
    github_repo_id: repo.github_repo_id,
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description,
    language: repo.language,
    is_private: repo.is_private,
    stars: repo.stars,
    forks: repo.forks,
    github_connection_id: githubConnectionId,
    last_synced_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('connected_repositories')
    .upsert(repoData, {
      onConflict: 'user_id,full_name',
      ignoreDuplicates: false,
    });

  if (error) {
    console.error('Error syncing repositories:', error);
    throw new Error('Failed to sync repositories');
  }
}

/**
 * Get user's connected repositories
 */
export async function getUserRepositories(userId: string): Promise<ConnectedRepository[]> {
  const { data, error } = await supabase
    .from('connected_repositories')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching repositories:', error);
    throw new Error('Failed to fetch repositories');
  }

  return (data || []) as ConnectedRepository[];
}

/**
 * Connect/disconnect a repository
 */
export async function updateRepositoryConnection(
  userId: string,
  repositoryId: string,
  connected: boolean
): Promise<void> {
  const { error } = await supabase
    .from('connected_repositories')
    .update({ connected })
    .eq('id', repositoryId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating repository connection:', error);
    throw new Error('Failed to update repository connection');
  }
}

/**
 * Update repository sync timestamp
 */
export async function updateRepositorySyncTime(
  userId: string,
  repositoryId: string
): Promise<void> {
  const { error } = await supabase
    .from('connected_repositories')
    .update({ last_synced_at: new Date().toISOString() })
    .eq('id', repositoryId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating repository sync time:', error);
    throw new Error('Failed to update repository sync time');
  }
}

