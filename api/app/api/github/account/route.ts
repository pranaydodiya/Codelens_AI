/**
 * API Route: GET /api/github/account
 * Get connected GitHub account information
 * 
 * DELETE /api/github/account
 * Disconnect GitHub account
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getGitHubConnection, deleteGitHubConnection } from '@/lib/db-github';
import { getGitHubUser } from '@/lib/services/github-service';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    // Get GitHub connection from database
    const connection = await getGitHubConnection(user.userId);

    if (!connection) {
      return NextResponse.json(
        { error: 'GitHub not connected' },
        { status: 404 }
      );
    }

    // Fetch fresh user info from GitHub
    try {
      const githubUser = await getGitHubUser(connection.access_token);

      return NextResponse.json({
        success: true,
        data: {
          username: githubUser.login,
          name: githubUser.name,
          avatar: githubUser.avatar_url,
          connectedAt: connection.connected_at,
          lastSyncedAt: connection.last_synced_at,
        },
      });
    } catch (error) {
      // Token might be invalid, return stored info
      return NextResponse.json({
        success: true,
        data: {
          username: connection.github_username,
          name: null,
          avatar: connection.github_avatar_url,
          connectedAt: connection.connected_at,
          lastSyncedAt: connection.last_synced_at,
        },
      });
    }
  } catch (error) {
    console.error('GitHub account API error:', error);

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
        error: error instanceof Error ? error.message : 'Failed to fetch GitHub account',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    // Delete GitHub connection
    await deleteGitHubConnection(user.userId);

    return NextResponse.json({
      success: true,
      message: 'GitHub account disconnected',
    });
  } catch (error) {
    console.error('GitHub disconnect error:', error);

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
        error: error instanceof Error ? error.message : 'Failed to disconnect GitHub account',
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
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
