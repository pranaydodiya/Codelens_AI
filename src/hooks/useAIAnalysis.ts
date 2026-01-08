/**
 * React Query hook for AI Code Analysis
 */

import { useMutation } from '@tanstack/react-query';
import { apiClient, ApiClientError } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';

export interface CodeAnalysisRequest {
  code: string;
  language?: string;
  options?: {
    checkSecurity?: boolean;
    checkPerformance?: boolean;
    suggestions?: boolean;
  };
}

export interface CodeIssue {
  severity: 'error' | 'warning' | 'suggestion' | 'info';
  message: string;
  line?: number;
  file?: string;
  suggestion?: string;
}

export interface CodeAnalysisResponse {
  score: number;
  summary: string;
  issues: CodeIssue[];
  suggestions: string[];
}

interface AnalysisApiResponse {
  success: boolean;
  data: {
    review: CodeAnalysisResponse;
  };
}

/**
 * Analyze code for issues
 */
async function analyzeCode(request: CodeAnalysisRequest): Promise<CodeAnalysisResponse> {
  try {
    const response = await apiClient.post<AnalysisApiResponse>('/api/v1/analyze', request);
    
    if (!response.success || !response.data?.review) {
      throw new Error('Invalid response from server');
    }

    return response.data.review;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new Error('Failed to analyze code');
  }
}

/**
 * React Query hook for analyzing code
 */
export function useAIAnalysis() {
  return useMutation({
    mutationFn: analyzeCode,
    onSuccess: () => {
      toast({
        title: 'Analysis Complete',
        description: 'Code analysis has been completed successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Analysis Failed',
        description: error.message || 'Failed to analyze code',
        variant: 'destructive',
      });
    },
  });
}

