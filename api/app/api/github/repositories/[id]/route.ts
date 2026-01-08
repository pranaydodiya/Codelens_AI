/**
 * API Route: POST /api/github/repositories/[id]/connect
 * Connect or disconnect a repository
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { updateRepositoryConnection } from '@/lib/db-github';
import { handleApiError, createCorsOptionsResponse, createValidationErrorResponse } from '@/lib/api-utils';

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
      return createValidationErrorResponse('Invalid request. connected must be a boolean');
    }

    // Update repository connection status
    await updateRepositoryConnection(user.userId, params.id, connected);

    return NextResponse.json({
      success: true,
      message: connected ? 'Repository connected' : 'Repository disconnected',
    });
  } catch (error) {
    return handleApiError(error, 'Failed to update repository connection');
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return createCorsOptionsResponse(['POST', 'OPTIONS']);
}

