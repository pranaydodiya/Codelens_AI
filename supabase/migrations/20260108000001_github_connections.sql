-- Create github_connections table for storing OAuth tokens
CREATE TABLE IF NOT EXISTS public.github_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  token_type TEXT DEFAULT 'bearer',
  scope TEXT,
  github_user_id INTEGER NOT NULL,
  github_username TEXT NOT NULL,
  github_avatar_url TEXT,
  connected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_synced_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id),
  UNIQUE(github_user_id)
);

-- Create index for faster lookups
CREATE INDEX idx_github_connections_user_id ON public.github_connections(user_id);
CREATE INDEX idx_github_connections_github_user_id ON public.github_connections(github_user_id);

-- Enable Row Level Security
ALTER TABLE public.github_connections ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own GitHub connection" 
ON public.github_connections 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own GitHub connection" 
ON public.github_connections 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own GitHub connection" 
ON public.github_connections 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own GitHub connection" 
ON public.github_connections 
FOR DELETE 
USING (auth.uid() = user_id);

-- Update connected_repositories to link to github_connections
ALTER TABLE public.connected_repositories 
ADD COLUMN IF NOT EXISTS github_repo_id BIGINT,
ADD COLUMN IF NOT EXISTS github_connection_id UUID REFERENCES public.github_connections(id) ON DELETE CASCADE;

-- Create index for github_repo_id
CREATE INDEX IF NOT EXISTS idx_connected_repos_github_repo_id ON public.connected_repositories(github_repo_id);

