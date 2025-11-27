# Database Setup Instructions

This guide will help you set up the database schema and insert dummy data for testing.

## Prerequisites

1. A Supabase project with authentication enabled
2. Access to Supabase SQL Editor
3. At least one NGO user account created (you can create this through the signup process)

## Setup Steps

### 1. Create Database Tables

Run the following SQL scripts in order in your Supabase SQL Editor:

```sql
-- Step 1: Create all tables
-- Run: scripts/001_create_tables.sql

-- Step 2: Create triggers
-- Run: scripts/002_create_triggers.sql

-- Step 3: Add college ID field to applications
-- Run: scripts/003_add_college_id_to_applications.sql
```

### 2. Setup Storage Bucket

Run the storage setup script to create the bucket for college ID uploads:

```sql
-- Run: scripts/005_setup_storage.sql
```

This will:
- Create a private storage bucket named `documents`
- Set up policies for users to upload their own college IDs
- Allow NGOs to view college IDs for applications to their opportunities
- Allow admins to view all college IDs

### 3. Create Test NGO User

Before inserting dummy opportunities, you need at least one NGO user:

1. Go to your application signup page
2. Sign up as an NGO user
3. Note the user ID (you can find it in Supabase Auth > Users)

Alternatively, you can create one directly in Supabase:
- Go to Authentication > Users
- Create a new user
- Update the `profiles` table to set `user_type = 'ngo'`

### 4. Insert Dummy Data

After you have at least one NGO user, run:

```sql
-- Run: scripts/004_insert_dummy_data.sql
```

This will insert 8 dummy opportunities with various details:
- Online Tutoring Volunteer
- Campus Environmental Awareness Campaign
- Mental Health Peer Support
- Community Outreach Program
- Web Development Volunteer
- Animal Shelter Volunteer
- Arts Program Assistant
- Emergency Response Volunteer

**Note:** The script will automatically use the first NGO user found in your database. If you have multiple NGOs, you may want to modify the script to specify which NGO should own which opportunities.

## Verification

After setup, verify:

1. **Tables Created**: Check that all tables exist in your Supabase dashboard
2. **Storage Bucket**: Go to Storage > Buckets and verify `documents` bucket exists
3. **Dummy Opportunities**: Go to Table Editor > `opportunities` and verify 8 opportunities were inserted
4. **College ID Field**: Check that `applications` table has `college_id_url` column

## Testing the Application Flow

1. **As a Volunteer:**
   - Sign up or log in as a volunteer
   - Browse opportunities at `/dashboard/opportunities`
   - Click on an opportunity to view details
   - Click "Apply Now"
   - Fill in cover letter (optional)
   - Upload college ID (required)
   - Submit application

2. **As an NGO:**
   - Log in as an NGO
   - View applications at `/dashboard/ngo/opportunities/[id]/applications`
   - You should be able to see uploaded college IDs for verification

## Troubleshooting

### Storage Upload Fails
- Ensure the storage bucket `documents` exists
- Check that storage policies are correctly set up
- Verify file size is under 5MB
- Check file format (JPG, PNG, or PDF)

### No Opportunities Showing
- Verify dummy data was inserted successfully
- Check that opportunities have `status = 'active'`
- Ensure you have at least one NGO user in the database

### College ID Upload Not Working
- Check browser console for errors
- Verify Supabase storage bucket is set up correctly
- Ensure user is authenticated
- Check that storage policies allow uploads

## Next Steps

After setup, you can:
- Create more opportunities through the NGO dashboard
- Test the full application workflow
- Customize opportunity details
- Add more validation rules as needed

