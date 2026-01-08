/**
 * React Query hook for AI Code Generation
 */

import { useMutation } from '@tanstack/react-query';
import { apiClient, ApiClientError } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';

export interface CodeGenerationRequest {
  prompt: string;
  template: 'hook' | 'component' | 'api' | 'util' | 'test';
  language: 'typescript' | 'javascript' | 'python' | 'go';
}

export interface CodeGenerationResponse {
  code: string;
}

interface GeneratorApiResponse {
  success: boolean;
  data: CodeGenerationResponse;
}

/**
 * Generate code from prompt
 */
async function generateCode(request: CodeGenerationRequest): Promise<string> {
  try {
    const response = await apiClient.post<GeneratorApiResponse>('/api/v1/generate', request);
    
    if (!response.success || !response.data) {
      throw new Error('Invalid response from server');
    }

    return response.data.code;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new Error('Failed to generate code');
  }
}

/**
 * React Query hook for generating code
 */
export function useAIGenerator() {
  return useMutation({
    mutationFn: generateCode,
    onSuccess: () => {
      toast({
        title: 'Code Generated',
        description: 'AI code has been generated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Generation Failed',
        description: error.message || 'Failed to generate code',
        variant: 'destructive',
      });
    },
  });
}

