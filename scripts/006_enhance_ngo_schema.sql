-- Enhanced NGO Registration Schema
-- Run this after the base tables are created

-- Add approval status to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'needs_info'));

-- Add representative details to profiles for NGOs
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS representative_role TEXT,
ADD COLUMN IF NOT EXISTS id_proof_url TEXT,
ADD COLUMN IF NOT EXISTS id_proof_type TEXT;

-- Enhance NGO Details table with all required fields
ALTER TABLE public.ngo_details 
ADD COLUMN IF NOT EXISTS registered_address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS ngo_type TEXT CHECK (ngo_type IN ('Trust', 'Society', 'Section 8 Company', 'Other')),
ADD COLUMN IF NOT EXISTS social_cause_category TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS pan_number TEXT,
ADD COLUMN IF NOT EXISTS pan_document_url TEXT,
ADD COLUMN IF NOT EXISTS registration_certificate_url TEXT,
ADD COLUMN IF NOT EXISTS certificate_12a_url TEXT,
ADD COLUMN IF NOT EXISTS certificate_80g_url TEXT,
ADD COLUMN IF NOT EXISTS fcra_certificate_url TEXT,
ADD COLUMN IF NOT EXISTS gst_certificate_url TEXT,
ADD COLUMN IF NOT EXISTS bank_account_proof_url TEXT,
ADD COLUMN IF NOT EXISTS official_email TEXT,
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- Create NGO verification documents table for better organization
CREATE TABLE IF NOT EXISTS public.ngo_verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ngo_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.ngo_verification_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ngo_documents_select_own"
  ON public.ngo_verification_documents FOR SELECT
  USING (auth.uid() = ngo_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin'
  ));

CREATE POLICY "ngo_documents_insert_own"
  ON public.ngo_verification_documents FOR INSERT
  WITH CHECK (auth.uid() = ngo_id);

-- Add more fields to opportunities table
ALTER TABLE public.opportunities
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS is_remote BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS preferred_skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS minimum_age INTEGER,
ADD COLUMN IF NOT EXISTS languages_required TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS expected_duties TEXT,
ADD COLUMN IF NOT EXISTS impact_statement TEXT,
ADD COLUMN IF NOT EXISTS volunteer_benefits TEXT,
ADD COLUMN IF NOT EXISTS location_photos TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS safety_guidelines TEXT,
ADD COLUMN IF NOT EXISTS point_of_contact_name TEXT,
ADD COLUMN IF NOT EXISTS point_of_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS point_of_contact_email TEXT;

-- Add volunteer hours tracking
CREATE TABLE IF NOT EXISTS public.volunteer_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  volunteer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  ngo_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  hours_worked DECIMAL(4,2) NOT NULL,
  description TEXT,
  verified_by_ngo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.volunteer_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "volunteer_hours_select"
  ON public.volunteer_hours FOR SELECT
  USING (
    auth.uid() = volunteer_id OR 
    auth.uid() = ngo_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
  );

CREATE POLICY "volunteer_hours_insert_ngo"
  ON public.volunteer_hours FOR INSERT
  WITH CHECK (auth.uid() = ngo_id);

CREATE POLICY "volunteer_hours_update_ngo"
  ON public.volunteer_hours FOR UPDATE
  USING (auth.uid() = ngo_id);

-- Add certificates table
CREATE TABLE IF NOT EXISTS public.volunteer_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  volunteer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  ngo_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  certificate_url TEXT NOT NULL,
  issued_date DATE NOT NULL,
  certificate_type TEXT DEFAULT 'completion',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.volunteer_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "certificates_select"
  ON public.volunteer_certificates FOR SELECT
  USING (
    auth.uid() = volunteer_id OR 
    auth.uid() = ngo_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
  );

CREATE POLICY "certificates_insert_ngo"
  ON public.volunteer_certificates FOR INSERT
  WITH CHECK (auth.uid() = ngo_id);

-- Add NGO events/photos table
CREATE TABLE IF NOT EXISTS public.ngo_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ngo_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.ngo_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ngo_events_select"
  ON public.ngo_events FOR SELECT
  USING (TRUE);

CREATE POLICY "ngo_events_insert_own"
  ON public.ngo_events FOR INSERT
  WITH CHECK (auth.uid() = ngo_id);

CREATE POLICY "ngo_events_update_own"
  ON public.ngo_events FOR UPDATE
  USING (auth.uid() = ngo_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_approval_status ON public.profiles(approval_status);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_ngo_details_profile_id ON public.ngo_details(profile_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_hours_volunteer_id ON public.volunteer_hours(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_hours_ngo_id ON public.volunteer_hours(ngo_id);

