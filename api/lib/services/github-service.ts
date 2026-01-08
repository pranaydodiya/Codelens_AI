/**
 * GitHub Service Layer using Octokit
 */

import { Octokit } from '@octokit/rest';

export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  email: string | null;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  default_branch: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

/**
 * Create Octokit instance with access token
 */
export function createOctokitClient(accessToken: string): Octokit {
  return new Octokit({
    auth: accessToken,
  });
}

/**
 * Get authenticated user information
 */
export async function getGitHubUser(accessToken: string): Promise<GitHubUser> {
  const octokit = createOctokitClient(accessToken);
  const { data } = await octokit.rest.users.getAuthenticated();
  
  return {
    id: data.id,
    login: data.login,
    name: data.name || null,
    avatar_url: data.avatar_url,
    email: data.email || null,
  };
}

/**
 * Get user's repositories
 */
export async function getUserRepositories(
  accessToken: string,
  options?: {
    type?: 'all' | 'owner' | 'member';
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  }
): Promise<GitHubRepository[]> {
  const octokit = createOctokitClient(accessToken);
  
  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    type: options?.type || 'all',
    sort: options?.sort || 'updated',
    direction: options?.direction || 'desc',
    per_page: options?.per_page || 100,
    page: options?.page || 1,
  });

  return data.map((repo: any) => ({
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description,
    private: repo.private,
    language: repo.language,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    updated_at: repo.updated_at,
    default_branch: repo.default_branch,
    owner: {
      login: repo.owner.login,
      avatar_url: repo.owner.avatar_url,
    },
  }));
}

/**
 * Get repository details
 */
export async function getRepository(
  accessToken: string,
  owner: string,
  repo: string
): Promise<GitHubRepository> {
  const octokit = createOctokitClient(accessToken);
  const { data } = await octokit.rest.repos.get({
    owner,
    repo,
  });

  return {
    id: data.id,
    name: data.name,
    full_name: data.full_name,
    description: data.description,
    private: data.private,
    language: data.language,
    stargazers_count: data.stargazers_count,
    forks_count: data.forks_count,
    updated_at: data.updated_at,
    default_branch: data.default_branch,
    owner: {
      login: data.owner.login,
      avatar_url: data.owner.avatar_url,
    },
  };
}

/**
 * Get repository pull requests
 */
export async function getRepositoryPullRequests(
  accessToken: string,
  owner: string,
  repo: string,
  state: 'open' | 'closed' | 'all' = 'open'
) {
  const octokit = createOctokitClient(accessToken);
  const { data } = await octokit.rest.pulls.list({
    owner,
    repo,
    state,
    per_page: 100,
  });

  return data;
}

/**
 * Get pull request details
 */
export async function getPullRequest(
  accessToken: string,
  owner: string,
  repo: string,
  pullNumber: number
) {
  const octokit = createOctokitClient(accessToken);
  const { data } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: pullNumber,
  });

  return data;
}

/**
 * Get pull request files/diff
 */
export async function getPullRequestFiles(
  accessToken: string,
  owner: string,
  repo: string,
  pullNumber: number
) {
  const octokit = createOctokitClient(accessToken);
  const { data } = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: pullNumber,
  });

  return data;
}

/**
 * Create a comment on a pull request
 */
export async function createPullRequestComment(
  accessToken: string,
  owner: string,
  repo: string,
  pullNumber: number,
  body: string
) {
  const octokit = createOctokitClient(accessToken);
  const { data } = await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: pullNumber,
    body,
  });

  return data;
}

export default {
  createOctokitClient,
  getGitHubUser,
  getUserRepositories,
  getRepository,
  getRepositoryPullRequests,
  getPullRequest,
  getPullRequestFiles,
  createPullRequestComment,
};

