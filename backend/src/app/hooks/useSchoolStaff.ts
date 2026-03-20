/**
 * useSchoolStaff Hook
 * 
 * Fetches staff members from a school
 */

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: 'school_staff' | 'principal';
  designation: string | null;
  subject: string | null;
  is_active: boolean;
}

interface UseSchoolStaffOptions {
  schoolId?: string;
  includeInactive?: boolean;
}

interface UseSchoolStaffReturn {
  staff: StaffMember[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useSchoolStaff(options: UseSchoolStaffOptions = {}): UseSchoolStaffReturn {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    schoolId,
    includeInactive = false,
  } = options;

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!schoolId) {
        setStaff([]);
        setLoading(false);
        return;
      }

      let query = supabase
        .from('users')
        .select('id, full_name, email, phone, role, designation, subject, is_active')
        .eq('school_id', schoolId)
        .in('role', ['school_staff', 'principal']);

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      query = query.order('full_name');

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      setStaff((data || []) as StaffMember[]);
    } catch (err) {
      console.error('Error fetching school staff:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch staff'));
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [schoolId, includeInactive]);

  return {
    staff,
    loading,
    error,
    refetch: fetchStaff,
  };
}
