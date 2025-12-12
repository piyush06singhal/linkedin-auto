-- Add LinkedIn user ID to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS linkedin_user_id TEXT;

-- Add error tracking fields to posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS failed_at TIMESTAMP WITH TIME ZONE;

-- Update status check constraint to include 'failed'
ALTER TABLE public.posts 
DROP CONSTRAINT IF EXISTS posts_status_check;

ALTER TABLE public.posts 
ADD CONSTRAINT posts_status_check 
CHECK (status IN ('draft', 'scheduled', 'published', 'failed'));

-- Create index for failed posts
CREATE INDEX IF NOT EXISTS idx_posts_failed ON public.posts(status, failed_at) 
WHERE status = 'failed';

-- Add profiles table reference (for cron job)
-- Note: This assumes 'users' table is also called 'profiles' or we create a view
CREATE OR REPLACE VIEW public.profiles AS 
SELECT * FROM public.users;
