/**
 * API Route: GET /api/v1/reviews/history
 * Get review history for authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getUserAIHistory } from '@/lib/db';
import { handleApiError, createCorsOptionsResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const requestType = searchParams.get('type') as 'summary' | 'generate' | 'analyze' | null;
    const limit = Number.parseInt(searchParams.get('limit') || '50', 10);
    const offset = Number.parseInt(searchParams.get('offset') || '0', 10);

    // Fetch history from database
    const history = await getUserAIHistory(
      user.userId,
      requestType || undefined,
      limit,
      offset
    );

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch review history');
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return createCorsOptionsResponse(['GET', 'OPTIONS']);
}

