/**
 * Zod validation schemas for API requests
 */

import { z } from 'zod';

/**
 * Code Summary Request Schema
 */
export const codeSummarySchema = z.object({
  code: z.string().min(1, 'Code is required').max(50000, 'Code is too long (max 50,000 characters)'),
  language: z.string().optional(),
});

export type CodeSummaryRequest = z.infer<typeof codeSummarySchema>;

/**
 * Code Generation Request Schema
 */
export const codeGenerationSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(2000, 'Prompt is too long (max 2,000 characters)'),
  template: z.enum(['hook', 'component', 'api', 'util', 'test']),
  language: z.enum(['typescript', 'javascript', 'python', 'go']),
});

export type CodeGenerationRequest = z.infer<typeof codeGenerationSchema>;

/**
 * Code Analysis Request Schema
 */
export const codeAnalysisSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50000, 'Code is too long (max 50,000 characters)'),
  language: z.string().optional(),
  options: z.object({
    checkSecurity: z.boolean().optional(),
    checkPerformance: z.boolean().optional(),
    suggestions: z.boolean().optional(),
  }).optional(),
});

export type CodeAnalysisRequest = z.infer<typeof codeAnalysisSchema>;

/**
 * Validate request body against schema
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: firstError ? `${firstError.path.join('.')}: ${firstError.message}` : 'Validation failed',
      };
    }
    return { success: false, error: 'Invalid request data' };
  }
}

