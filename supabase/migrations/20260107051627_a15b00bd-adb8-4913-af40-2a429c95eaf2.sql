-- Fix the overly permissive error_logs policy
-- Drop the existing policy
DROP POLICY IF EXISTS "Anyone can insert error logs" ON public.error_logs;

-- Create a more secure policy - only authenticated users can insert their own logs
CREATE POLICY "Authenticated users can insert error logs" 
ON public.error_logs 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND (user_id IS NULL OR user_id = auth.uid()));