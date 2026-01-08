-- Create ai_requests table for storing all AI operations (summary, generation, analysis)
CREATE TABLE IF NOT EXISTS public.ai_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('summary', 'generate', 'analyze')),
  input_data JSONB NOT NULL,
  output_data JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  error_message TEXT,
  tokens_used INTEGER,
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Create index for faster queries
CREATE INDEX idx_ai_requests_user_id ON public.ai_requests(user_id);
CREATE INDEX idx_ai_requests_type ON public.ai_requests(request_type);
CREATE INDEX idx_ai_requests_created_at ON public.ai_requests(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.ai_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own AI requests" 
ON public.ai_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI requests" 
ON public.ai_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI requests" 
ON public.ai_requests 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ai_requests_updated_at
BEFORE UPDATE ON public.ai_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get user's AI request history
CREATE OR REPLACE FUNCTION public.get_user_ai_history(
  p_user_id UUID,
  p_request_type TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  request_type TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  response_time_ms INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ar.id,
    ar.request_type,
    ar.status,
    ar.created_at,
    ar.completed_at,
    ar.response_time_ms
  FROM public.ai_requests ar
  WHERE ar.user_id = p_user_id
    AND (p_request_type IS NULL OR ar.request_type = p_request_type)
  ORDER BY ar.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

