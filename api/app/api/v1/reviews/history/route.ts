/**
 * API Route: GET /api/v1/reviews/history
 * Get review history for authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getUserAIHistory } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const requestType = searchParams.get('type') as 'summary' | 'generate' | 'analyze' | null;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

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
    console.error('History API error:', error);

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
        error: error instanceof Error ? error.message : 'Failed to fetch review history',
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

