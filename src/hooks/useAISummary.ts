/**
 * React Query hook for AI Code Summary
 */

import { useMutation } from '@tanstack/react-query';
import { apiClient, ApiClientError } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';

export interface CodeSummaryRequest {
  code: string;
  language?: string;
}

export interface CodeSummaryResponse {
  title: string;
  overview: string;
  keyComponents: string[];
  complexity: 'Low' | 'Medium' | 'High';
  linesOfCode: number;
  functions: number;
  dependencies: string[];
  securityNotes: string[];
}

interface SummaryApiResponse {
  success: boolean;
  data: CodeSummaryResponse;
}

/**
 * Generate AI code summary
 */
async function generateSummary(request: CodeSummaryRequest): Promise<CodeSummaryResponse> {
  try {
    const response = await apiClient.post<SummaryApiResponse>('/api/v1/summary', request);
    
    if (!response.success || !response.data) {
      throw new Error('Invalid response from server');
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new Error('Failed to generate code summary');
  }
}

/**
 * React Query hook for generating code summaries
 */
export function useAISummary() {
  return useMutation({
    mutationFn: generateSummary,
    onSuccess: () => {
      toast({
        title: 'Summary Generated',
        description: 'AI code summary has been generated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Generation Failed',
        description: error.message || 'Failed to generate code summary',
        variant: 'destructive',
      });
    },
  });
}

