-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- SETU - Fix ALL Test Users
-- 
-- Nuclear option: Ensures all 13 test users are properly set up
-- Run this if multiple users aren't working
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 1: Ensure all schools exist
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSERT INTO schools (id, name, udise_code, district, region, principal_name, contact_phone, student_count, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'TS Tribal Welfare Residential School - Hyderabad', 'TS-HYD-2024-001', 'Hyderabad', 'North Telangana', 'Dr. Ramesh Kumar', '+91-9876543210', 450, NOW() - INTERVAL '6 months'),
  ('22222222-2222-2222-2222-222222222222', 'TS Tribal Welfare Residential School - Warangal', 'TS-WGL-2024-002', 'Warangal', 'North Telangana', 'Mrs. Lakshmi Reddy', '+91-9876543211', 380, NOW() - INTERVAL '4 months'),
  ('33333333-3333-3333-3333-333333333333', 'TS Tribal Welfare Residential School - Adilabad', 'TS-ADB-2024-003', 'Adilabad', 'North Telangana', 'Mr. Srinivas Rao', '+91-9876543212', 320, NOW() - INTERVAL '8 months')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  principal_name = EXCLUDED.principal_name,
  contact_phone = EXCLUDED.contact_phone,
  student_count = EXCLUDED.student_count;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 2: Create/Update ALL Auth Users
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- School Staff
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token, aud, role) VALUES
  ('a1111111-1111-1111-1111-111111111112', '00000000-0000-0000-0000-000000000000', 'ravi.hyderabad@setu.test', crypt('Test@123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Ravi Teja"}', NOW(), NOW(), '', '', '', '', 'authenticated', 'authenticated'),
  ('a1111111-1111-1111-1111-111111111113', '00000000-0000-0000-0000-000000000000', 'priya.hyderabad@setu.test', crypt('Test@123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Priya Sharma"}', NOW(), NOW(), '', '', '', '', 'authenticated', 'authenticated'),
  ('a2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'suresh.warangal@setu.test', crypt('Test@123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Suresh Babu"}', NOW(), NOW(), '', '', '', '', 'authenticated', 'authenticated'),
  ('a2222222-2222-2222-2222-222222222223', '00000000-0000-0000-0000-000000000000', 'kavitha.warangal@setu.test', crypt('Test@123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Kavitha Naidu"}', NOW(), NOW(), '', '', '', '', 'authenticated', 'authenticated'),
  ('a3333333-3333-3333-3333-333333333332', '00000000-0000-0000-0000-000000000000', 'venkat.adilabad@setu.test', crypt('Test@123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Venkat Reddy"}', NOW(), NOW(), '', '', '', '', 'authenticated', 'authenticated')
ON CONFLICT (id) DO UPDATE SET
  encrypted_password = crypt('Test@123', gen_salt('bf')),
  email_confirmed_at = NOW(),
  updated_at = NOW();

-- Principals
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token, aud, role) VALUES
  ('a1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'principal.hyderabad@setu.test', crypt('Test@123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Ramesh Kumar"}', NOW(), NOW(), '', '', '', '', 'authenticated', 'authenticated'),
  ('a2222222-2222-2222-2222-222222222221', '00000000-0000-0000-0000-000000000000', 'principal.warangal@setu.test', crypt('Test@123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Mrs. Lakshmi Reddy"}', NOW(), NOW(), '', '', '', '', 'authenticated', 'authenticated'),
  ('a3333333-3333-3333-3333-333333333331', '00000000-0000-0000-0000-000000000000', 'principal.adilabad@setu.test', crypt('Test@123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Mr. Srinivas Rao"}', NOW(), NOW(), '', '', '', '', 'authenticated', 'authenticated')
ON CONFLICT (id) DO UPDATE SET
  encrypted_password = crypt('Test@123', gen_salt('bf')),
  email_confirmed_at = NOW(),
  updated_at = NOW();

-- RCOs
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token, aud, role) VALUES
  ('b0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'rco.north@setu.test', crypt('Test@123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Vijay Kumar"}', NOW(), NOW(), '', '', '', '', 'authenticated', 'authenticated'),
  ('b0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'rco.south@setu.test', crypt('Test@123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Mrs. Sunitha Devi"}', NOW(), NOW(), '', '', '', '', 'authenticated', 'authenticated')
ON CONFLICT (id) DO UPDATE SET
  encrypted_password = crypt('Test@123', gen_salt('bf')),
  email_confirmed_at = NOW(),
  updated_at = NOW();

-- Super Admin
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token, aud, role) VALUES
  ('c0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'admin@setu.test', crypt('Test@123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Admin - Telangana TWREI"}', NOW(), NOW(), '', '', '', '', 'authenticated', 'authenticated')
ON CONFLICT (id) DO UPDATE SET
  encrypted_password = crypt('Test@123', gen_salt('bf')),
  email_confirmed_at = NOW(),
  updated_at = NOW();

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 3: Create/Update ALL User Profiles
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- School Staff
INSERT INTO users (id, school_id, role, full_name, email, phone, language_pref, is_active, created_at) VALUES
  ('a1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'school_staff', 'Ravi Teja', 'ravi.hyderabad@setu.test', '+91-9876543213', 'te', true, NOW() - INTERVAL '5 months'),
  ('a1111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 'school_staff', 'Priya Sharma', 'priya.hyderabad@setu.test', '+91-9876543214', 'en', true, NOW() - INTERVAL '4 months'),
  ('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'school_staff', 'Suresh Babu', 'suresh.warangal@setu.test', '+91-9876543215', 'te', true, NOW() - INTERVAL '3 months'),
  ('a2222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222', 'school_staff', 'Kavitha Naidu', 'kavitha.warangal@setu.test', '+91-9876543216', 'en', true, NOW() - INTERVAL '2 months'),
  ('a3333333-3333-3333-3333-333333333332', '33333333-3333-3333-3333-333333333333', 'school_staff', 'Venkat Reddy', 'venkat.adilabad@setu.test', '+91-9876543217', 'te', true, NOW() - INTERVAL '7 months')
ON CONFLICT (id) DO UPDATE SET
  school_id = EXCLUDED.school_id,
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  language_pref = EXCLUDED.language_pref,
  is_active = true;

-- Principals
INSERT INTO users (id, school_id, role, full_name, email, phone, language_pref, is_active, created_at) VALUES
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'principal', 'Dr. Ramesh Kumar', 'principal.hyderabad@setu.test', '+91-9876543210', 'en', true, NOW() - INTERVAL '6 months'),
  ('a2222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'principal', 'Mrs. Lakshmi Reddy', 'principal.warangal@setu.test', '+91-9876543211', 'te', true, NOW() - INTERVAL '4 months'),
  ('a3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'principal', 'Mr. Srinivas Rao', 'principal.adilabad@setu.test', '+91-9876543212', 'en', true, NOW() - INTERVAL '8 months')
ON CONFLICT (id) DO UPDATE SET
  school_id = EXCLUDED.school_id,
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  language_pref = EXCLUDED.language_pref,
  is_active = true;

-- RCOs
INSERT INTO users (id, school_id, role, full_name, email, phone, district, language_pref, is_active, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000001', NULL, 'district_official', 'Dr. Vijay Kumar (RCO)', 'rco.north@setu.test', '+91-9876543220', 'Hyderabad,Warangal,Adilabad', 'en', true, NOW() - INTERVAL '1 year'),
  ('b0000000-0000-0000-0000-000000000002', NULL, 'district_official', 'Mrs. Sunitha Devi (RCO)', 'rco.south@setu.test', '+91-9876543221', 'Nalgonda,Khammam,Mahbubnagar', 'te', true, NOW() - INTERVAL '1 year')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  district = EXCLUDED.district,
  language_pref = EXCLUDED.language_pref,
  is_active = true;

-- Super Admin
INSERT INTO users (id, school_id, role, full_name, email, phone, language_pref, is_active, created_at) VALUES
  ('c0000000-0000-0000-0000-000000000001', NULL, 'super_admin', 'Admin - Telangana TWREI', 'admin@setu.test', '+91-9876543299', 'en', true, NOW() - INTERVAL '2 years')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  language_pref = EXCLUDED.language_pref,
  is_active = true;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- VERIFICATION
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
  '✅ ALL TEST USERS' as status,
  u.email,
  u.full_name,
  u.role,
  s.name as school,
  CASE 
    WHEN a.email_confirmed_at IS NOT NULL THEN '✅'
    ELSE '❌'
  END as email_confirmed,
  CASE 
    WHEN u.is_active THEN '✅'
    ELSE '❌'
  END as is_active
FROM users u
JOIN auth.users a ON u.id = a.id
LEFT JOIN schools s ON u.school_id = s.id
WHERE u.email LIKE '%@setu.test'
ORDER BY u.role, u.email;

-- Count summary
SELECT 
  'SUMMARY' as info,
  COUNT(*) as total_users,
  COUNT(CASE WHEN role = 'school_staff' THEN 1 END) as staff_count,
  COUNT(CASE WHEN role = 'principal' THEN 1 END) as principal_count,
  COUNT(CASE WHEN role = 'district_official' THEN 1 END) as rco_count,
  COUNT(CASE WHEN role = 'super_admin' THEN 1 END) as admin_count
FROM users
WHERE email LIKE '%@setu.test';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ All 13 test users are now ready!';
  RAISE NOTICE '';
  RAISE NOTICE 'Try logging in with ANY of these:';
  RAISE NOTICE '  • suresh.warangal@setu.test';
  RAISE NOTICE '  • ravi.hyderabad@setu.test';
  RAISE NOTICE '  • principal.hyderabad@setu.test';
  RAISE NOTICE '  • rco.north@setu.test';
  RAISE NOTICE '  • admin@setu.test';
  RAISE NOTICE '';
  RAISE NOTICE 'Password for ALL: Test@123';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;
