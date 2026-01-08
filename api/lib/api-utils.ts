/**
 * Shared utilities for API routes to reduce code duplication
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from './rate-limit';

/**
 * Handle API errors consistently across all routes
 */
export function handleApiError(error: unknown, defaultMessage: string): NextResponse {
  console.error('API error:', error);

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
      error: error instanceof Error ? error.message : defaultMessage,
    },
    { status: 500 }
  );
}

/**
 * Create CORS OPTIONS response
 */
export function createCorsOptionsResponse(allowedMethods: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']): NextResponse {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': allowedMethods.join(', '),
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

/**
 * Create rate limit exceeded response
 */
export function createRateLimitResponse(rateLimit: { resetAt: number }): NextResponse {
  return NextResponse.json(
    { error: 'Rate limit exceeded. Please try again later.' },
    { 
      status: 429,
      headers: {
        'X-RateLimit-Limit': '20',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': rateLimit.resetAt.toString(),
      },
    }
  );
}

/**
 * Create success response with rate limit headers
 */
export function createSuccessResponse<T>(
  data: T,
  rateLimit: { remaining: number; resetAt: number }
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    {
      headers: {
        'X-RateLimit-Limit': '20',
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': rateLimit.resetAt.toString(),
      },
    }
  );
}

/**
 * Check rate limit and return error response if exceeded
 */
export function checkRateLimitOrFail(userId: string, type: 'default' | 'ai' = 'ai'): NextResponse | null {
  const rateLimit = checkRateLimit(userId, type);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit);
  }
  return null;
}

/**
 * Create validation error response
 */
export function createValidationErrorResponse(error: string): NextResponse {
  return NextResponse.json(
    { error },
    { status: 400 }
  );
}
