/**
 * SETU Authentication Utilities
 * Handles unique ID-based authentication with Supabase
 */

import { supabase } from './supabase';

// Type definitions
export interface LoginResult {
  success: boolean;
  error?: string;
  userData?: UserData;
}

export interface UserData {
  id: string;
  unique_id: string;
  full_name: string;
  email: string;
  role: string;
  school_id: string | null;
  district: string | null;
  designation: string;
}

// ── Raw GoTrue fetch helper ────────────────────────────────────────────────
// Used as a fallback when supabase.auth.signInWithPassword returns 500.
// Bypasses the supabase-js client entirely to rule out any client-side
// interference, and captures the error_id from GoTrue's JSON body.
async function rawGoTrueSignIn(
  email: string,
  password: string
): Promise<{ session: any | null; errorBody: any | null }> {
  const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL || 
  const supabaseAnonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    'try {
    const res = await fetch(
      `${supabaseUrl}/auth/v1/token?grant_type=password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const body = await res.json();
    if (res.ok && body.access_token) {
      return { session: body, errorBody: null };
    }
    return { session: null, errorBody: body };
  } catch (fetchErr) {
    return { session: null, errorBody: { message: String(fetchErr) } };
  }
}

/**
 * Login with Unique ID (TCH001, PRI001, RCO001, etc.)
 * Maps unique_id → auth email → authenticate → fetch user details
 */
export async function loginWithUniqueId(
  uniqueId: string,
  password: string
): Promise<LoginResult> {
  try {
    const trimmedId = uniqueId.trim().toUpperCase();
    const trimmedPassword = password.trim();

    console.log('🔐 [AUTH] Starting login with unique ID:', trimmedId);

    if (!trimmedId || !trimmedPassword) {
      return { success: false, error: 'Please enter your User ID and password.' };
    }

    // Step 1: Map unique_id to auth email (e.g., TCH001 → STAFF_BCH_001)
    console.log('📞 [AUTH] Step 1: Calling get_auth_email_from_unique_id RPC...');
    const { data: authEmail, error: lookupError } = await supabase.rpc(
      'get_auth_email_from_unique_id',
      { uid: trimmedId }
    );

    console.log('📨 [AUTH] RPC Response:', { authEmail, error: lookupError });

    if (lookupError) {
      console.error('❌ [AUTH] Unique ID lookup RPC error:', lookupError);
      console.error('Full error object:', JSON.stringify(lookupError, null, 2));
      
      // Check if function doesn't exist
      if (lookupError.message?.includes('function') || lookupError.message?.includes('does not exist')) {
        console.error('⚠️  [AUTH] Function get_auth_email_from_unique_id does not exist!');
        console.error('Run this script: /supabase/FIX_NOW_FINAL.sql');
        return { 
          success: false, 
          error: 'System not configured. Please run database setup scripts.' 
        };
      }
      
      // Check permission errors
      if (lookupError.message?.includes('permission') || lookupError.code === '42501') {
        console.error('⚠️  [AUTH] Permission denied! Function exists but anon role cannot execute it.');
        console.error('Run: GRANT EXECUTE ON FUNCTION get_auth_email_from_unique_id(TEXT) TO anon;');
        return { 
          success: false, 
          error: 'Permission denied. Please contact administrator.' 
        };
      }
      
      return { success: false, error: 'Database error. Please try again.' };
    }
    
    if (!authEmail) {
      console.error('❌ [AUTH] Unique ID lookup returned NULL for:', trimmedId);
      console.error('');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('🔍 TROUBLESHOOTING STEPS:');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('');
      console.error('1️⃣  Check if unique_id column exists and has data:');
      console.error('   Run: SELECT unique_id, email FROM users WHERE email = \'STAFF_BCH_001\';');
      console.error('');
      console.error('2️⃣  If NULL or column missing, run fix script:');
      console.error('   Script: /supabase/FIX_NOW_FINAL.sql');
      console.error('');
      console.error('3️⃣  Test function manually in Supabase:');
      console.error('   Query: SELECT get_auth_email_from_unique_id(\'TCH001\');');
      console.error('   Expected: STAFF_BCH_001');
      console.error('');
      console.error('4️⃣  Check sync between auth.users and public.users:');
      console.error('   Run: /supabase/CHECK_SYNC.sql');
      console.error('');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      return { 
        success: false, 
        error: `User ID "${trimmedId}" not found. Please check your ID or contact administrator.` 
      };
    }

    console.log('✅ [AUTH] Unique ID mapped successfully:', trimmedId, '→', authEmail);

    // Step 2: Authenticate with Supabase using the auth email
    console.log('🔑 [AUTH] Step 2: Authenticating with Supabase...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: trimmedPassword,
    });

    if (authError) {
      console.error('❌ [AUTH] Step 2 FAILED — signInWithPassword error:', authError.message);
      console.error('  code:', authError.status, '| hint:', (authError as any).hint ?? 'none');

      // ── Raw-fetch fallback (HTTP 500 only) ─────────────────────────────
      // supabase.auth.signInWithPassword wraps GoTrue's POST /auth/v1/token.
      // If the JS client is somehow at fault, the raw fetch will succeed
      // and we can manually set the session from the response.
      if (authError.status === 500 || authError.message?.includes('Database error')) {
        console.warn('⚠️  [AUTH] Trying raw GoTrue fetch as fallback...');
        const { session: rawSession, errorBody } = await rawGoTrueSignIn(authEmail, trimmedPassword);

        if (rawSession) {
          // Raw fetch worked — set the session in supabase-js manually
          console.log('✅ [AUTH] Raw fetch succeeded — restoring session...');
          await supabase.auth.setSession({
            access_token:  rawSession.access_token,
            refresh_token: rawSession.refresh_token,
          });
          // Continue to Step 3 by recursing without re-doing Step 1
          const { data: profileRows } = await supabase.rpc('get_my_user_profile');
          const userData = Array.isArray(profileRows) ? profileRows[0] : profileRows;
          if (userData) {
            console.log('🎉 [AUTH] Login via raw-fetch fallback succeeded!');
            return { success: true, userData: userData as UserData };
          }
        }

        // Both paths failed — log the GoTrue error_id for Supabase support
        console.error('❌ [AUTH] Raw fetch also failed. GoTrue error body:', errorBody);
        console.error('');
        console.error('══════════════════════════════════════════════════════════');
        console.error('🚨 PERSISTENT HTTP 500 — NEXT STEPS:');
        console.error('');
        console.error('1. Run FINAL_NUCLEAR_RECREATE.sql in SQL Editor');
        console.error('   → Deletes & re-inserts auth.users with ALL required fields');
        console.error('');
        console.error('2. If still failing, open Supabase Dashboard:');
        console.error('   Authentication → Hooks → check for a broken hook');
        console.error('');
        console.error('3. Contact Supabase support with:');
        console.error('   Project ref: zdhbncdnsbdvkcyomvax');
        if (errorBody?.error_id) {
          console.error('   Error ID:', errorBody.error_id);
        }
        console.error('══════════════════════════════════════════════════════════');
      }

      console.error('');
      console.error('  ─── Likely causes ────────────────────────────────────');
      if (authError.message === 'Invalid login credentials') {
        console.error('  → Wrong password OR user does not exist in auth.users');
        console.error('  → Run: FINAL_NUCLEAR_RECREATE.sql (re-creates from scratch)');
      } else if (authError.message?.includes('Database error')) {
        console.error('  → A trigger or hook on auth.users is crashing');
        console.error('  → Run: FINAL_NUCLEAR_RECREATE.sql');
        console.error('  → Check: Dashboard → Authentication → Hooks');
      } else if (authError.message?.includes('Email not confirmed')) {
        console.error('  → email_confirmed_at is NULL for this auth.users row');
        console.error('  → Run: FINAL_NUCLEAR_RECREATE.sql');
      }
      console.error('  ──────────────────────────────────────────────────────');

      return {
        success: false,
        error: authError.message === 'Invalid login credentials'
          ? 'Invalid password. Please try again.'
          : `Sign-in failed: ${authError.message}`,
      };
    }

    if (!authData.user) {
      console.error('❌ [AUTH] No user object returned from auth');
      return { success: false, error: 'Login failed. Please try again.' };
    }

    console.log('✅ [AUTH] Authentication successful, user ID:', authData.user.id);

    // Step 3: Fetch user profile via SECURITY DEFINER function
    // ─────────────────────────────────────────────────────────
    // IMPORTANT: We do NOT query users table directly here because:
    //   - auth.users.id ≠ public.users.id (UUID mismatch from seeding)
    //   - RLS policy USING (auth.uid() = id) blocks the query → 0 rows → 404
    //
    // SOLUTION: Call get_my_user_profile() which is SECURITY DEFINER.
    //   - It runs as DB owner, bypasses RLS entirely
    //   - Uses auth.email() from JWT (always correct after signInWithPassword)
    //   - Works regardless of whether UUIDs are synced or not
    // ─────────────────────────────────────────────────────────
    console.log('👤 [AUTH] Step 3: Fetching user profile via RPC (bypasses RLS)...');
    const { data: profileRows, error: profileError } = await supabase
      .rpc('get_my_user_profile');

    if (profileError) {
      console.error('❌ [AUTH] RPC get_my_user_profile failed:', profileError);
      console.error('Full error:', JSON.stringify(profileError, null, 2));
      
      // Fallback: try direct query by email (works if RLS uses email check)
      console.log('⚠️  [AUTH] Falling back to direct email query...');
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('users')
        .select('id, unique_id, full_name, email, role, school_id, district, designation')
        .eq('email', authData.user.email)
        .single();

      if (fallbackError || !fallbackData) {
        console.error('❌ [AUTH] Fallback also failed:', fallbackError);
        console.error('RUN: /supabase/FINAL_DEFINITIVE_FIX.sql in Supabase SQL Editor');
        return { success: false, error: 'User profile not found. Please run FINAL_DEFINITIVE_FIX.sql and try again.' };
      }

      console.log('✅ [AUTH] Fallback succeeded:', fallbackData.full_name);
      return { success: true, userData: fallbackData as UserData };
    }

    // get_my_user_profile() returns an array (RETURNS TABLE), grab first row
    const userData = Array.isArray(profileRows) ? profileRows[0] : profileRows;

    if (!userData) {
      console.error('❌ [AUTH] get_my_user_profile returned empty result');
      console.error('This means no public.users row has email =', authData.user.email);
      console.error('Check: SELECT * FROM users WHERE email =', `'${authData.user.email}';`);
      return { success: false, error: `User profile not found for ${authData.user.email}. Contact administrator.` };
    }

    console.log('✅ [AUTH] User profile loaded:', userData.full_name, '/', userData.role);
    console.log('🎉 [AUTH] Login completed successfully!');

    return { 
      success: true, 
      userData: userData as UserData 
    };
  } catch (err) {
    console.error('❌ [AUTH] Unexpected login error:', err);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

/**
 * Login with legacy auth email (STAFF_BCH_001, RCO_HYD_001, etc.)
 * Fallback for direct email login
 */
export async function loginWithAuthEmail(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return { success: false, error: 'Please enter your User ID and password.' };
    }

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: trimmedPassword,
    });

    if (authError) {
      console.error('Auth error:', authError);
      return { success: false, error: 'Invalid credentials. Please try again.' };
    }

    if (!authData.user) {
      return { success: false, error: 'Login failed. Please try again.' };
    }

    // Fetch user details from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, unique_id, full_name, email, role, school_id, district, designation')
      .eq('id', authData.user.id)
      .single();

    if (userError || !userData) {
      console.error('User profile error:', userError);
      return { success: false, error: 'User profile not found. Please contact administrator.' };
    }

    return { 
      success: true, 
      userData: userData as UserData 
    };
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

/**
 * Smart login - tries unique_id first, falls back to auth email
 * Detects format automatically
 */
export async function smartLogin(
  identifier: string,
  password: string
): Promise<LoginResult> {
  const trimmedId = identifier.trim().toUpperCase();

  // Simple format detection:
  // - Unique IDs: TCH001, PRI001, RCO001, ADM001 (3 letters + 3 digits)
  // - Auth emails: STAFF_BCH_001, RCO_HYD_001, etc. (contains underscore)
  
  const isSimpleId = /^[A-Z]{3}\d{3,4}$/.test(trimmedId); // TCH001, PRI001 format
  const isAuthEmail = trimmedId.includes('_'); // STAFF_BCH_001 format

  if (isSimpleId) {
    // Try unique_id login
    return await loginWithUniqueId(trimmedId, password);
  } else if (isAuthEmail) {
    // Try auth email login
    return await loginWithAuthEmail(trimmedId, password);
  } else {
    // Try unique_id first, then fall back to auth email
    const result = await loginWithUniqueId(trimmedId, password);
    if (!result.success) {
      return await loginWithAuthEmail(trimmedId, password);
    }
    return result;
  }
}

/**
 * Sign out
 */
export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Get current session
 */
export async function getCurrentUser(): Promise<UserData | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // Try the SECURITY DEFINER RPC first (handles UUID mismatch)
    const { data: profileRows, error: rpcError } = await supabase
      .rpc('get_my_user_profile');

    if (!rpcError && profileRows) {
      const profile = Array.isArray(profileRows) ? profileRows[0] : profileRows;
      if (profile) return profile as UserData;
    }

    // Fallback: query by email (works with updated RLS policies)
    const { data: userData } = await supabase
      .from('users')
      .select('id, unique_id, full_name, email, role, school_id, district, designation')
      .eq('email', user.email)
      .single();

    return userData as UserData | null;
  } catch (err) {
    console.error('Get current user error:', err);
    return null;
  }
}
