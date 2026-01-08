/**
 * API Route: GET /api/github/repositories
 * Fetch user's GitHub repositories
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getGitHubConnection } from '@/lib/db-github';
import { getUserRepositories as fetchGitHubRepos } from '@/lib/services/github-service';
import { getUserRepositories as getDbRepos, syncRepositoriesToDatabase } from '@/lib/db-github';

export async function GET(request: NextRequest) {
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

    // Get repositories from database
    const dbRepositories = await getDbRepos(user.userId);

    // Map to frontend format
    const repositories = dbRepositories.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      language: repo.language,
      private: repo.is_private,
      stars: repo.stars,
      forks: repo.forks,
      connected: repo.connected,
      lastPush: repo.last_synced_at 
        ? new Date(repo.last_synced_at).toLocaleDateString()
        : 'Never',
    }));

    return NextResponse.json({
      success: true,
      data: repositories,
    });
  } catch (error) {
    console.error('Repositories API error:', error);

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch repositories',
      },
      { status: 500 }
    );
  }
}

/**
 * API Route: POST /api/github/repositories
 * Sync repositories from GitHub
 */
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
      message: 'Repositories synced successfully',
    });
  } catch (error) {
    console.error('Sync repositories error:', error);

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to sync repositories',
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

