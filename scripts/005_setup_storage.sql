-- Setup Supabase Storage bucket for college ID documents
-- Run this in your Supabase SQL Editor

-- Create storage bucket for documents (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false, -- Private bucket for security
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow authenticated users to upload their own documents
CREATE POLICY "Users can upload their own college IDs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy to allow users to read their own documents
CREATE POLICY "Users can read their own college IDs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy to allow NGOs to read college IDs for applications they manage
CREATE POLICY "NGOs can read college IDs for their opportunities"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.opportunities o ON a.opportunity_id = o.id
    WHERE o.ngo_id = auth.uid()
    AND (storage.foldername(name))[1] = a.volunteer_id::text
  )
);

-- Create storage policy to allow admins to read all documents
CREATE POLICY "Admins can read all college IDs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);

