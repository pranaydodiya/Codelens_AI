/**
 * Database utilities for storing AI requests
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with service role key for backend operations
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export interface AIRequest {
  id?: string;
  user_id: string;
  request_type: 'summary' | 'generate' | 'analyze';
  input_data: Record<string, unknown>;
  output_data?: Record<string, unknown>;
  status: 'pending' | 'completed' | 'failed';
  error_message?: string;
  tokens_used?: number;
  response_time_ms?: number;
  created_at?: string;
  completed_at?: string;
}

/**
 * Store AI request in database
 */
export async function storeAIRequest(request: Omit<AIRequest, 'id' | 'created_at'>): Promise<string> {
  const { data, error } = await supabase
    .from('ai_requests')
    .insert({
      user_id: request.user_id,
      request_type: request.request_type,
      input_data: request.input_data,
      output_data: request.output_data,
      status: request.status,
      error_message: request.error_message,
      tokens_used: request.tokens_used,
      response_time_ms: request.response_time_ms,
      completed_at: request.completed_at,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error storing AI request:', error);
    throw new Error('Failed to store AI request');
  }

  return data.id;
}

/**
 * Update AI request status
 */
export async function updateAIRequest(
  id: string,
  updates: Partial<Pick<AIRequest, 'status' | 'output_data' | 'error_message' | 'tokens_used' | 'response_time_ms' | 'completed_at'>>
): Promise<void> {
  const { error } = await supabase
    .from('ai_requests')
    .update({
      ...updates,
      completed_at: updates.status === 'completed' || updates.status === 'failed' 
        ? new Date().toISOString() 
        : undefined,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating AI request:', error);
    throw new Error('Failed to update AI request');
  }
}

/**
 * Get user's AI request history
 */
export async function getUserAIHistory(
  userId: string,
  requestType?: 'summary' | 'generate' | 'analyze',
  limit = 50,
  offset = 0
): Promise<AIRequest[]> {
  let query = supabase
    .from('ai_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (requestType) {
    query = query.eq('request_type', requestType);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching AI history:', error);
    throw new Error('Failed to fetch AI history');
  }

  return data || [];
}

