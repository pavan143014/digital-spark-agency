-- Create scheduled_blog_posts table for storing scheduled posts
CREATE TABLE public.scheduled_blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  service_id TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  include_internal_links BOOLEAN DEFAULT true,
  website_url TEXT DEFAULT 'https://psdigital.in',
  custom_instructions TEXT,
  generated_post_id UUID REFERENCES public.blog_posts(id),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.scheduled_blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can view all scheduled posts"
ON public.scheduled_blog_posts
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create scheduled posts"
ON public.scheduled_blog_posts
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update scheduled posts"
ON public.scheduled_blog_posts
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete scheduled posts"
ON public.scheduled_blog_posts
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create index for efficient querying
CREATE INDEX idx_scheduled_posts_status_time ON public.scheduled_blog_posts(status, scheduled_at);
CREATE INDEX idx_scheduled_posts_created_by ON public.scheduled_blog_posts(created_by);