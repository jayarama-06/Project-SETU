/**
 * useCurrentUser Hook
 * 
 * Fetches and manages the current authenticated user's profile data
 * from Supabase, syncing with auth session
 */

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export interface UserProfile {
  id: string;
  school_id: string | null;
  role: 'school_staff' | 'principal' | 'district_official' | 'super_admin';
  full_name: string;
  email: string;
  phone: string | null;
  district: string | null;
  designation: string | null;
  subject: string | null;
  language_pref: 'en' | 'te';
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined data
  school?: {
    id: string;
    name: string;
    udise_code: string;
    district: string;
  } | null;
}

interface UseCurrentUserReturn {
  user: UserProfile | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useCurrentUser(): UseCurrentUserReturn {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current auth session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session) {
        throw new Error('No active session');
      }

      // Fetch user profile with school data
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select(`
          *,
          school:schools(
            id,
            name,
            udise_code,
            district
          )
        `)
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;

      if (!profile) {
        throw new Error('User profile not found');
      }

      setUser(profile as UserProfile);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUser();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}

/**
 * Helper function to update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<UserProfile, 'full_name' | 'phone' | 'designation' | 'subject' | 'language_pref'>>
): Promise<{ success: boolean; error?: Error }> {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error('Error updating user profile:', err);
    return {
      success: false,
      error: err instanceof Error ? err : new Error('Failed to update profile'),
    };
  }
}
