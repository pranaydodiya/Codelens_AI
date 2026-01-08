/**
 * API Route: GET /api/github/auth
 * Initiate GitHub OAuth flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { generateState, getGitHubAuthUrl } from '@/lib/github-auth';
import { cookies } from 'next/headers';
import { handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    // Generate state for CSRF protection
    const state = generateState();

    // Store state in HTTP-only cookie for security
    // This will be validated in the callback
    const cookieStore = await cookies();
    cookieStore.set('github_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    // Generate GitHub OAuth URL
    const authUrl = getGitHubAuthUrl(state, ['repo', 'read:user']);

    // Redirect to GitHub
    return NextResponse.redirect(authUrl);
  } catch (error) {
    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Handle other errors - redirect to frontend with error
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    return NextResponse.redirect(`${frontendUrl}/integrations?error=github_auth_failed`);
  }
}

