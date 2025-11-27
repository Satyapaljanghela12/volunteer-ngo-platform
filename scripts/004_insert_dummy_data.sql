-- Insert dummy data for testing
-- Note: This script assumes you have at least one NGO user in auth.users
-- You may need to adjust the ngo_id values based on your actual user IDs

-- First, let's create some dummy NGO profiles (you'll need to replace these with actual user IDs from auth.users)
-- For demonstration, we'll use placeholder UUIDs. In production, use actual user IDs.

-- Insert dummy opportunities
-- Note: Replace 'YOUR_NGO_USER_ID_1', 'YOUR_NGO_USER_ID_2', etc. with actual NGO user IDs from your auth.users table

INSERT INTO public.opportunities (
  id,
  ngo_id,
  title,
  description,
  location,
  cause_area,
  required_skills,
  commitment_level,
  time_commitment_hours,
  start_date,
  end_date,
  spots_available,
  spots_filled,
  status,
  created_at
) VALUES
-- Opportunity 1: Education Tutoring
(
  gen_random_uuid(),
  (SELECT id FROM public.profiles WHERE user_type = 'ngo' LIMIT 1),
  'Online Tutoring Volunteer for Underprivileged Students',
  'Join our team to provide free online tutoring to students from underprivileged backgrounds. Help students in subjects like Mathematics, Science, and English. This is a great opportunity for college students to give back to the community while gaining teaching experience.

Requirements:
- Currently enrolled in college/university
- Strong academic background
- Good communication skills
- Patience and empathy
- Reliable internet connection

You will be matched with students based on your expertise and availability. Sessions can be conducted via video calls at mutually convenient times.',
  'Remote',
  'Education',
  ARRAY['Teaching', 'Communication', 'Patience', 'Subject Expertise'],
  'flexible',
  5,
  CURRENT_DATE + INTERVAL '7 days',
  CURRENT_DATE + INTERVAL '90 days',
  10,
  0,
  'active',
  CURRENT_TIMESTAMP
),

-- Opportunity 2: Environmental Conservation
(
  gen_random_uuid(),
  (SELECT id FROM public.profiles WHERE user_type = 'ngo' LIMIT 1),
  'Campus Environmental Awareness Campaign Coordinator',
  'Lead environmental awareness campaigns on college campuses. Organize events, workshops, and initiatives to promote sustainability and environmental conservation among students.

Key Responsibilities:
- Plan and execute campus events
- Coordinate with student groups
- Create educational content
- Track campaign impact
- Engage with student community

This role is perfect for students passionate about the environment who want to make a real impact on their campus. College ID verification required to ensure you are a current student.',
  'Multiple Campuses',
  'Environment',
  ARRAY['Event Planning', 'Leadership', 'Public Speaking', 'Social Media'],
  'part-time',
  8,
  CURRENT_DATE + INTERVAL '14 days',
  CURRENT_DATE + INTERVAL '120 days',
  5,
  0,
  'active',
  CURRENT_TIMESTAMP
),

-- Opportunity 3: Healthcare Support
(
  gen_random_uuid(),
  (SELECT id FROM public.profiles WHERE user_type = 'ngo' LIMIT 1),
  'Mental Health Peer Support Volunteer',
  'Provide peer support to fellow students experiencing mental health challenges. This role requires empathy, active listening skills, and a commitment to supporting others.

Responsibilities:
- Conduct one-on-one peer support sessions
- Organize mental health awareness workshops
- Maintain confidentiality
- Refer to professional services when needed
- Document interactions (anonymized)

Note: This opportunity is exclusively for current college students. College ID upload is mandatory for verification purposes.',
  'Remote / On-Campus',
  'Healthcare',
  ARRAY['Active Listening', 'Empathy', 'Communication', 'Psychology Background'],
  'flexible',
  6,
  CURRENT_DATE + INTERVAL '10 days',
  CURRENT_DATE + INTERVAL '180 days',
  8,
  0,
  'active',
  CURRENT_TIMESTAMP
),

-- Opportunity 4: Community Development
(
  gen_random_uuid(),
  (SELECT id FROM public.profiles WHERE user_type = 'ngo' LIMIT 1),
  'Community Outreach Program Assistant',
  'Assist in organizing community outreach programs in underserved areas. Help with event planning, logistics, and direct community engagement.

What you''ll do:
- Assist in planning community events
- Help with logistics and setup
- Engage directly with community members
- Collect feedback and data
- Support program evaluation

This opportunity is open to college students who want to gain hands-on experience in community development. Must be currently enrolled (college ID required).',
  'Urban Areas',
  'Community Development',
  ARRAY['Community Engagement', 'Event Planning', 'Logistics', 'Communication'],
  'part-time',
  10,
  CURRENT_DATE + INTERVAL '21 days',
  CURRENT_DATE + INTERVAL '150 days',
  6,
  0,
  'active',
  CURRENT_TIMESTAMP
),

-- Opportunity 5: Technology for Good
(
  gen_random_uuid(),
  (SELECT id FROM public.profiles WHERE user_type = 'ngo' LIMIT 1),
  'Web Development Volunteer for Non-Profit Websites',
  'Use your coding skills to help non-profits build and maintain their websites. Work on real projects that make a difference.

Projects include:
- Website design and development
- Content management system setup
- SEO optimization
- Mobile responsiveness
- Maintenance and updates

Perfect for computer science or IT students looking to build their portfolio while helping good causes. College enrollment verification required.',
  'Remote',
  'Education',
  ARRAY['Web Development', 'HTML/CSS', 'JavaScript', 'WordPress', 'Problem Solving'],
  'flexible',
  8,
  CURRENT_DATE + INTERVAL '5 days',
  CURRENT_DATE + INTERVAL '200 days',
  12,
  0,
  'active',
  CURRENT_TIMESTAMP
),

-- Opportunity 6: Animal Welfare
(
  gen_random_uuid(),
  (SELECT id FROM public.profiles WHERE user_type = 'ngo' LIMIT 1),
  'Animal Shelter Volunteer Coordinator',
  'Help coordinate volunteer activities at our animal shelter. Assist with animal care, adoption events, and volunteer management.

Duties include:
- Coordinate volunteer schedules
- Assist with animal care (feeding, walking, cleaning)
- Help organize adoption events
- Maintain volunteer records
- Support fundraising activities

This role is ideal for students who love animals and want to make a difference. Must be a current student (college ID upload required for verification).',
  'Local Animal Shelter',
  'Animal Welfare',
  ARRAY['Animal Care', 'Organization', 'Communication', 'Compassion'],
  'part-time',
  6,
  CURRENT_DATE + INTERVAL '30 days',
  CURRENT_DATE + INTERVAL '365 days',
  4,
  0,
  'active',
  CURRENT_TIMESTAMP
),

-- Opportunity 7: Arts & Culture
(
  gen_random_uuid(),
  (SELECT id FROM public.profiles WHERE user_type = 'ngo' LIMIT 1),
  'Arts Program Assistant for Youth',
  'Help organize and run arts programs for underprivileged youth. Assist with workshops, exhibitions, and creative activities.

Your role:
- Assist in planning arts workshops
- Help during workshop sessions
- Support youth participants
- Organize exhibitions
- Document program activities

Great for students studying arts, education, or social work. College student verification required.',
  'Community Centers',
  'Arts & Culture',
  ARRAY['Arts', 'Teaching', 'Creativity', 'Youth Engagement'],
  'flexible',
  5,
  CURRENT_DATE + INTERVAL '15 days',
  CURRENT_DATE + INTERVAL '100 days',
  7,
  0,
  'active',
  CURRENT_TIMESTAMP
),

-- Opportunity 8: Disaster Relief
(
  gen_random_uuid(),
  (SELECT id FROM public.profiles WHERE user_type = 'ngo' LIMIT 1),
  'Emergency Response Volunteer Trainee',
  'Train to become part of our emergency response team. Learn disaster preparedness, first aid, and emergency coordination skills.

Training includes:
- First aid and CPR certification
- Disaster response protocols
- Emergency communication
- Resource coordination
- Community preparedness

This program is designed for college students interested in emergency management and public safety. Enrollment verification mandatory.',
  'Training Centers',
  'Disaster Relief',
  ARRAY['First Aid', 'Crisis Management', 'Communication', 'Teamwork'],
  'part-time',
  12,
  CURRENT_DATE + INTERVAL '20 days',
  CURRENT_DATE + INTERVAL '180 days',
  15,
  0,
  'active',
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

-- Note: If you don't have any NGO users yet, you'll need to create them first.
-- You can create a test NGO user through the signup process, then run this script.

