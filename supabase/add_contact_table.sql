-- Add contact submissions table only
-- Run this if you already have the main schema set up

-- Contact submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT CHECK (status IN ('new', 'in_progress', 'resolved')) DEFAULT 'new',
  notes TEXT
);

-- Enable RLS for contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can view submissions" ON public.contact_submissions;

-- Policy: Anyone can insert contact submissions
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can view submissions (for admin panel)
CREATE POLICY "Authenticated users can view submissions"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);
