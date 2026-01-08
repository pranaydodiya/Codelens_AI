/**
 * API Route: POST /api/github/repositories/[id]/connect
 * Connect or disconnect a repository
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { updateRepositoryConnection } from '@/lib/db-github';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const user = await requireAuth();

    const body = await request.json();
    const { connected } = body;

    if (typeof connected !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request. connected must be a boolean' },
        { status: 400 }
      );
    }

    // Update repository connection status
    await updateRepositoryConnection(user.userId, params.id, connected);

    return NextResponse.json({
      success: true,
      message: connected ? 'Repository connected' : 'Repository disconnected',
    });
  } catch (error) {
    console.error('Repository connection error:', error);

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
        error: error instanceof Error ? error.message : 'Failed to update repository connection',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

