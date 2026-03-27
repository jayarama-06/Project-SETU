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

    if (!trimmedId || !trimmedPassword) {
      return { success: false, error: 'Please enter your User ID and password.' };
    }

    // Step 1: Map unique_id to auth email (e.g., TCH001 → STAFF_BCH_001)
    const { data: authEmail, error: lookupError } = await supabase.rpc(
      'get_auth_email_from_unique_id',
      { uid: trimmedId }
    );

    if (lookupError || !authEmail) {
      console.error('Unique ID lookup error:', lookupError);
      return { success: false, error: 'Invalid User ID. Please check and try again.' };
    }

    // Step 2: Authenticate with Supabase using the auth email
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: trimmedPassword,
    });

    if (authError) {
      console.error('Auth error:', authError);
      return { 
        success: false, 
        error: authError.message === 'Invalid login credentials' 
          ? 'Invalid password. Please try again.' 
          : authError.message 
      };
    }

    if (!authData.user) {
      return { success: false, error: 'Login failed. Please try again.' };
    }

    // Step 3: Fetch user details from users table
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

    const { data: userData } = await supabase
      .from('users')
      .select('id, unique_id, full_name, email, role, school_id, district, designation')
      .eq('id', user.id)
      .single();

    return userData as UserData | null;
  } catch (err) {
    console.error('Get current user error:', err);
    return null;
  }
}
