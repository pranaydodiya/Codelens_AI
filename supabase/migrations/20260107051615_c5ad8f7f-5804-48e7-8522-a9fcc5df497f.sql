-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  github_username TEXT,
  github_connected BOOLEAN DEFAULT false,
  github_connected_at TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT false,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  ai_reviews_used INTEGER DEFAULT 0,
  ai_reviews_limit INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create connected_repositories table
CREATE TABLE public.connected_repositories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  description TEXT,
  language TEXT,
  is_private BOOLEAN DEFAULT false,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  last_synced_at TIMESTAMPTZ,
  github_repo_id TEXT,
  connected BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, full_name)
);

ALTER TABLE public.connected_repositories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own repositories" 
ON public.connected_repositories FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own repositories" 
ON public.connected_repositories FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own repositories" 
ON public.connected_repositories FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own repositories" 
ON public.connected_repositories FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_repositories_updated_at
BEFORE UPDATE ON public.connected_repositories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create ai_reviews table for tracking reviews
CREATE TABLE public.ai_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  repository_id UUID REFERENCES public.connected_repositories(id) ON DELETE SET NULL,
  pr_title TEXT NOT NULL,
  pr_number INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  ai_score INTEGER CHECK (ai_score >= 0 AND ai_score <= 100),
  issues_found INTEGER DEFAULT 0,
  suggestions_count INTEGER DEFAULT 0,
  review_summary TEXT,
  review_data JSONB,
  review_time_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.ai_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reviews" 
ON public.ai_reviews FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reviews" 
ON public.ai_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON public.ai_reviews FOR UPDATE USING (auth.uid() = user_id);

-- Create error_logs table for observability
CREATE TABLE public.error_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  component_name TEXT,
  page_url TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Only allow inserts for error logging (no read access for security)
CREATE POLICY "Anyone can insert error logs" 
ON public.error_logs FOR INSERT WITH CHECK (true);

-- Admins would need a separate policy to read logs