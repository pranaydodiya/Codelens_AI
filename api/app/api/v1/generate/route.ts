/**
 * API Route: POST /api/v1/generate
 * Generate code from natural language prompt
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { validateRequest, codeGenerationSchema } from '@/lib/validation';
import { generateCode } from '@/lib/services/ai-service';
import { checkRateLimit } from '@/lib/rate-limit';
import { storeAIRequest, updateAIRequest } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    // Check rate limit
    const rateLimit = checkRateLimit(user.userId, 'ai');
    if (!rateLimit.allowed) {
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

    // Parse and validate request body
    const body = await request.json();
    const validation = validateRequest(codeGenerationSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Store request in database
    const requestId = await storeAIRequest({
      user_id: user.userId,
      request_type: 'generate',
      input_data: {
        prompt: validation.data.prompt,
        template: validation.data.template,
        language: validation.data.language,
      },
      status: 'pending',
    });

    const startTime = Date.now();

    try {
      // Generate code
      const generatedCode = await generateCode({
        prompt: validation.data.prompt,
        template: validation.data.template,
        language: validation.data.language,
      });

      const responseTime = Date.now() - startTime;

      // Update request in database
      await updateAIRequest(requestId, {
        status: 'completed',
        output_data: { code: generatedCode },
        response_time_ms: responseTime,
      });

      // Return success response with rate limit headers
      return NextResponse.json({
        success: true,
        data: {
          code: generatedCode,
        },
      }, {
        headers: {
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetAt.toString(),
        },
      });
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
    console.error('Generate API error:', error);

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
        error: error instanceof Error ? error.message : 'Failed to generate code',
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

