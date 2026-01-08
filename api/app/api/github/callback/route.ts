/**
 * API Route: GET /api/github/callback
 * Handle GitHub OAuth callback
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { exchangeCodeForToken, validateState } from '@/lib/github-auth';
import { getGitHubUser, getUserRepositories } from '@/lib/services/github-service';
import { upsertGitHubConnection, syncRepositoriesToDatabase } from '@/lib/db-github';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(`${frontendUrl}/integrations?error=${error}`);
    }

    // Validate required parameters
    if (!code) {
      return NextResponse.redirect(`${frontendUrl}/integrations?error=missing_code`);
    }

    // Validate state parameter (CSRF protection)
    const cookieStore = await cookies();
    const storedState = cookieStore.get('github_oauth_state')?.value;
    
    if (!storedState || !state || !validateState(state, storedState)) {
      // Clear invalid state cookie
      cookieStore.delete('github_oauth_state');
      return NextResponse.redirect(`${frontendUrl}/integrations?error=invalid_state`);
    }

    // Clear state cookie after validation
    cookieStore.delete('github_oauth_state');

    // Exchange code for access token
    const accessToken = await exchangeCodeForToken(code);

    // Get GitHub user information
    const githubUser = await getGitHubUser(accessToken);

    // Store GitHub connection in database
    const connectionId = await upsertGitHubConnection(user.userId, {
      access_token: accessToken,
      token_type: 'bearer',
      github_user_id: githubUser.id,
      github_username: githubUser.login,
      github_avatar_url: githubUser.avatar_url,
    });

    // Fetch and sync repositories
    try {
      const repositories = await getUserRepositories(accessToken, {
        type: 'all',
        per_page: 100,
      });

      await syncRepositoriesToDatabase(
        user.userId,
        repositories.map(repo => ({
          github_repo_id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description,
          language: repo.language,
          is_private: repo.private,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
        })),
        connectionId
      );
    } catch (repoError) {
      console.error('Error syncing repositories:', repoError);
      // Continue even if repo sync fails - user can sync manually
    }

    // Redirect to frontend with success
    return NextResponse.redirect(`${frontendUrl}/integrations?success=github_connected`);
  } catch (error) {
    console.error('GitHub callback error:', error);

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
      return NextResponse.redirect(`${frontendUrl}/integrations?error=unauthorized`);
    }

    // Handle other errors
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    return NextResponse.redirect(`${frontendUrl}/integrations?error=callback_failed`);
  }
}

