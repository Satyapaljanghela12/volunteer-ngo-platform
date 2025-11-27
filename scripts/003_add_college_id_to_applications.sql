-- Add college_id_url field to applications table for student verification
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS college_id_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.applications.college_id_url IS 'URL to uploaded college ID image for student verification';

