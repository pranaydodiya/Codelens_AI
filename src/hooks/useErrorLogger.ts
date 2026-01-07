import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

interface ErrorLogEntry {
  type: string;
  message: string;
  stack?: string;
  component?: string;
  metadata?: Json;
}

/**
 * Hook for logging errors to the database for observability
 * This provides centralized error tracking without external dependencies
 */
export function useErrorLogger() {
  const logError = useCallback(async (entry: ErrorLogEntry) => {
    // Always log to console in development
    if (import.meta.env.DEV) {
      console.error('[ErrorLogger]', entry);
    }

    try {
      // Get current user if available
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('error_logs').insert([{
        user_id: user?.id ?? null,
        error_type: entry.type,
        error_message: entry.message,
        error_stack: entry.stack ?? null,
        component_name: entry.component ?? null,
        page_url: typeof window !== 'undefined' ? window.location.href : null,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        metadata: entry.metadata ?? null,
      }]);
    } catch (err) {
      // Fail silently in production, log in dev
      if (import.meta.env.DEV) {
        console.error('[ErrorLogger] Failed to log error:', err);
      }
    }
  }, []);

  return { logError };
}

/**
 * Standalone function for logging errors outside of React components
 * Useful for error boundaries and global error handlers
 */
export async function logErrorToDatabase(entry: ErrorLogEntry): Promise<void> {
  if (import.meta.env.DEV) {
    console.error('[ErrorLogger]', entry);
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('error_logs').insert([{
      user_id: user?.id ?? null,
      error_type: entry.type,
      error_message: entry.message,
      error_stack: entry.stack ?? null,
      component_name: entry.component ?? null,
      page_url: typeof window !== 'undefined' ? window.location.href : null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      metadata: entry.metadata ?? null,
    }]);
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('[ErrorLogger] Failed to log error:', err);
    }
  }
}
