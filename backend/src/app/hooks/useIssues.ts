/**
 * useIssues Hook
 * 
 * Fetches and manages issues/grievances from Supabase
 * Supports filtering by school, user, status, etc.
 */

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export interface Issue {
  id: string;
  setu_id: string;
  school_id: string;
  created_by: string;
  category: 'water' | 'electricity' | 'building' | 'safety' | 'finance' | 'other';
  title: string;
  description: string;
  photo_url?: string;
  urgency_score: number;
  current_level: 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
  status: 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
  is_endorsed: boolean;
  endorsed_by?: string;
  endorsed_at?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  creator?: {
    id: string;
    full_name: string;
    role: string;
  };
  school?: {
    id: string;
    name: string;
    udise_code: string;
    district: string;
  };
}

interface UseIssuesOptions {
  schoolId?: string;
  userId?: string;
  status?: Issue['status'] | Issue['status'][];
  category?: Issue['category'] | Issue['category'][];
  limit?: number;
  sortBy?: 'created_at' | 'urgency_score' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
}

interface UseIssuesReturn {
  issues: Issue[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useIssues(options: UseIssuesOptions = {}): UseIssuesReturn {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    schoolId,
    userId,
    status,
    category,
    limit = 100,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = options;

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('issues')
        .select(`
          *,
          creator:users!created_by(
            id,
            full_name,
            role
          ),
          school:schools(
            id,
            name,
            udise_code,
            district
          )
        `);

      // Apply filters
      if (schoolId) {
        query = query.eq('school_id', schoolId);
      }

      if (userId) {
        query = query.eq('created_by', userId);
      }

      if (status) {
        if (Array.isArray(status)) {
          query = query.in('status', status);
        } else {
          query = query.eq('status', status);
        }
      }

      if (category) {
        if (Array.isArray(category)) {
          query = query.in('category', category);
        } else {
          query = query.eq('category', category);
        }
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply limit
      query = query.limit(limit);

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      setIssues((data || []) as Issue[]);
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch issues'));
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [schoolId, userId, JSON.stringify(status), JSON.stringify(category), limit, sortBy, sortOrder]);

  return {
    issues,
    loading,
    error,
    refetch: fetchIssues,
  };
}

/**
 * Hook to fetch a single issue by ID or SETU ID
 */
export function useIssue(issueId: string, bySetuId = false): {
  issue: Issue | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchIssue = async () => {
    try {
      setLoading(true);
      setError(null);

      const query = supabase
        .from('issues')
        .select(`
          *,
          creator:users!created_by(
            id,
            full_name,
            role,
            phone,
            designation
          ),
          school:schools(
            id,
            name,
            udise_code,
            district
          )
        `);

      const { data, error: queryError } = await (bySetuId 
        ? query.eq('setu_id', issueId).single()
        : query.eq('id', issueId).single());

      if (queryError) throw queryError;

      setIssue(data as Issue);
    } catch (err) {
      console.error('Error fetching issue:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch issue'));
      setIssue(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (issueId) {
      fetchIssue();
    }
  }, [issueId, bySetuId]);

  return {
    issue,
    loading,
    error,
    refetch: fetchIssue,
  };
}

/**
 * Helper function to create a new issue
 */
export async function createIssue(data: {
  school_id: string;
  created_by: string;
  category: Issue['category'];
  title: string;
  description: string;
  photo_url?: string;
  urgency_score: number;
}): Promise<{ success: boolean; issue?: Issue; error?: Error }> {
  try {
    const { data: newIssue, error } = await supabase
      .from('issues')
      .insert({
        ...data,
        current_level: 'L0',
        status: 'open',
        is_endorsed: false,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, issue: newIssue as Issue };
  } catch (err) {
    console.error('Error creating issue:', err);
    return {
      success: false,
      error: err instanceof Error ? err : new Error('Failed to create issue'),
    };
  }
}

/**
 * Helper function to update issue status
 */
export async function updateIssueStatus(
  issueId: string,
  status: Issue['status']
): Promise<{ success: boolean; error?: Error }> {
  try {
    const { error } = await supabase
      .from('issues')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', issueId);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error('Error updating issue status:', err);
    return {
      success: false,
      error: err instanceof Error ? err : new Error('Failed to update status'),
    };
  }
}

/**
 * Helper function to endorse an issue
 */
export async function endorseIssue(
  issueId: string,
  endorsedBy: string
): Promise<{ success: boolean; error?: Error }> {
  try {
    const { error } = await supabase
      .from('issues')
      .update({
        is_endorsed: true,
        endorsed_by: endorsedBy,
        endorsed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', issueId);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error('Error endorsing issue:', err);
    return {
      success: false,
      error: err instanceof Error ? err : new Error('Failed to endorse issue'),
    };
  }
}
