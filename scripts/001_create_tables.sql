-- Create volunteer NGO platform database schema

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('volunteer', 'ngo', 'admin')), -- volunteer, ngo, admin
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  bio TEXT,
  avatar_url TEXT,
  skills TEXT[] DEFAULT '{}', -- Array of skills for volunteers
  causes TEXT[] DEFAULT '{}', -- Array of causes for NGOs
  location TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_select_public"
  ON public.profiles FOR SELECT
  USING (TRUE);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- NGO Details table
CREATE TABLE IF NOT EXISTS public.ngo_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  registration_number TEXT,
  website TEXT,
  founded_year INTEGER,
  mission TEXT,
  active_volunteers INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.ngo_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ngo_details_select"
  ON public.ngo_details FOR SELECT
  USING (TRUE);

CREATE POLICY "ngo_details_insert_own"
  ON public.ngo_details FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "ngo_details_update_own"
  ON public.ngo_details FOR UPDATE
  USING (auth.uid() = profile_id);

-- Volunteer Opportunities table
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ngo_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  cause_area TEXT,
  required_skills TEXT[],
  commitment_level TEXT CHECK (commitment_level IN ('flexible', 'part-time', 'full-time')),
  time_commitment_hours INTEGER, -- Hours per week
  start_date DATE,
  end_date DATE,
  spots_available INTEGER DEFAULT 1,
  spots_filled INTEGER DEFAULT 0,
  image_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'filled', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "opportunities_select"
  ON public.opportunities FOR SELECT
  USING (status = 'active' OR auth.uid() = ngo_id);

CREATE POLICY "opportunities_insert_own_ngo"
  ON public.opportunities FOR INSERT
  WITH CHECK (auth.uid() = ngo_id);

CREATE POLICY "opportunities_update_own_ngo"
  ON public.opportunities FOR UPDATE
  USING (auth.uid() = ngo_id);

CREATE POLICY "opportunities_delete_own_ngo"
  ON public.opportunities FOR DELETE
  USING (auth.uid() = ngo_id);

-- Applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  volunteer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  cover_letter TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "applications_select_own"
  ON public.applications FOR SELECT
  USING (auth.uid() = volunteer_id OR auth.uid() IN (
    SELECT ngo_id FROM public.opportunities WHERE id = opportunity_id
  ));

CREATE POLICY "applications_insert_own"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = volunteer_id);

CREATE POLICY "applications_update_ngo"
  ON public.applications FOR UPDATE
  USING (auth.uid() IN (
    SELECT ngo_id FROM public.opportunities WHERE id = opportunity_id
  ));

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_select_own"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "messages_insert_own"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewed_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select"
  ON public.reviews FOR SELECT
  USING (TRUE);

CREATE POLICY "reviews_insert_own"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "reviews_update_own"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = reviewer_id);

-- Admin Actions table (for moderation)
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  target_id UUID,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_actions_select_admin"
  ON public.admin_actions FOR SELECT
  USING (auth.uid() = admin_id);

-- Impact Statistics table
CREATE TABLE IF NOT EXISTS public.impact_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  ngo_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  hours_contributed INTEGER DEFAULT 0,
  lives_impacted INTEGER DEFAULT 0,
  projects_completed INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.impact_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "impact_stats_select"
  ON public.impact_stats FOR SELECT
  USING (TRUE);

CREATE POLICY "impact_stats_update_ngo"
  ON public.impact_stats FOR UPDATE
  USING (auth.uid() = ngo_id);
