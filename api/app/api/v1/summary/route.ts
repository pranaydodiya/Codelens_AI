/**
 * API Route: POST /api/v1/summary
 * Generate AI-powered code summary
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { validateRequest, codeSummarySchema } from '@/lib/validation';
import { generateCodeSummary } from '@/lib/services/ai-service';
import { checkRateLimit } from '@/lib/rate-limit';
import { storeAIRequest, updateAIRequest } from '@/lib/db';
import { handleApiError, createCorsOptionsResponse, checkRateLimitOrFail, createValidationErrorResponse, createSuccessResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    // Check rate limit
    const rateLimitError = checkRateLimitOrFail(user.userId, 'ai');
    if (rateLimitError) {
      return rateLimitError;
    }

    const rateLimit = checkRateLimit(user.userId, 'ai');

    // Parse and validate request body
    const body = await request.json();
    const validation = validateRequest(codeSummarySchema, body);

    if (!validation.success) {
      return createValidationErrorResponse(validation.error);
    }

    // Store request in database
    const requestId = await storeAIRequest({
      user_id: user.userId,
      request_type: 'summary',
      input_data: {
        code_length: validation.data.code.length,
        language: validation.data.language,
      },
      status: 'pending',
    });

    const startTime = Date.now();

    try {
      // Generate code summary
      const summary = await generateCodeSummary({
        code: validation.data.code,
        language: validation.data.language,
      });

      const responseTime = Date.now() - startTime;

      // Update request in database
      await updateAIRequest(requestId, {
        status: 'completed',
        output_data: summary,
        response_time_ms: responseTime,
      });

      // Return success response with rate limit headers
      return createSuccessResponse(summary, rateLimit);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      // Update request in database with error
      await updateAIRequest(requestId, {
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        response_time_ms: responseTime,
      });

      throw error;
    }
  } catch (error) {
    return handleApiError(error, 'Failed to generate code summary');
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return createCorsOptionsResponse(['POST', 'OPTIONS']);
}

