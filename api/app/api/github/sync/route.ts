/**
 * API Route: POST /api/github/sync
 * Sync repositories from GitHub
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getGitHubConnection } from '@/lib/db-github';
import { getUserRepositories as fetchGitHubRepos } from '@/lib/services/github-service';
import { syncRepositoriesToDatabase } from '@/lib/db-github';
import { handleApiError, createCorsOptionsResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    // Get GitHub connection
    const connection = await getGitHubConnection(user.userId);

    if (!connection) {
      return NextResponse.json(
        { error: 'GitHub not connected' },
        { status: 404 }
      );
    }

    // Fetch repositories from GitHub
    const githubRepos = await fetchGitHubRepos(connection.access_token, {
      type: 'all',
      per_page: 100,
    });

    // Sync to database
    await syncRepositoriesToDatabase(
      user.userId,
      githubRepos.map(repo => ({
        github_repo_id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        language: repo.language,
        is_private: repo.private,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
      })),
      connection.id
    );

    return NextResponse.json({
      success: true,
      message: `Synced ${githubRepos.length} repositories`,
      data: {
        count: githubRepos.length,
      },
    });
  } catch (error) {
    return handleApiError(error, 'Failed to sync repositories');
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return createCorsOptionsResponse(['POST', 'OPTIONS']);
}

