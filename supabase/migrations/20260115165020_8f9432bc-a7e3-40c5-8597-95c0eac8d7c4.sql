-- Create table to track blog post views
CREATE TABLE public.post_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  referrer TEXT
);

-- Enable RLS
ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert views (for tracking)
CREATE POLICY "Anyone can record views"
ON public.post_views
FOR INSERT
TO public
WITH CHECK (true);

-- Only admins can view analytics
CREATE POLICY "Admins can view analytics"
ON public.post_views
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_post_views_post_id ON public.post_views(post_id);
CREATE INDEX idx_post_views_viewed_at ON public.post_views(viewed_at DESC);

-- Add a view count column to blog_posts for quick access
ALTER TABLE public.blog_posts ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0;

-- Create function to increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.blog_posts 
  SET view_count = view_count + 1 
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$;

-- Create trigger to auto-increment view count
CREATE TRIGGER on_post_view_insert
AFTER INSERT ON public.post_views
FOR EACH ROW
EXECUTE FUNCTION public.increment_view_count();