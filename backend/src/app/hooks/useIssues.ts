/**
 * useIssues Hook
 * 
 * Manages issue data fetching and state from Supabase
 */

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

/**
 * Generates a SETU ID from a UUID
 * Format: SETU-ABC12345
 */
export function generateSetuId(uuid: string): string {
  // Take first 8 characters of UUID (excluding hyphens) and convert to uppercase
  const cleanUuid = uuid.replace(/-/g, '');
  const shortCode = cleanUuid.substring(0, 8).toUpperCase();
  return `SETU-${shortCode}`;
}

export interface Issue {
  id: string;
  school_id: string;
  reported_by: string; // Changed from created_by to match schema
  category: 'water' | 'electricity' | 'building' | 'safety' | 'finance' | 'other';
  title: string;
  description: string;
  photo_url?: string;
  ai_urgency_score: number; // Changed from urgency_score to match schema
  current_level: 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
  status: 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
  is_endorsed: boolean;
  endorsed_by?: string;
  endorsed_at?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  
  // Computed field - always generated from id using generateSetuId()
  setu_id: string;
  
  // Joined data
  reporter?: { // Changed from creator to reporter
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
  sortBy?: 'created_at' | 'updated_at' | 'ai_urgency_score';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

interface UseIssuesReturn {
  issues: Issue[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch multiple issues with filters
 */
export function useIssues(options: UseIssuesOptions = {}): UseIssuesReturn {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    schoolId,
    userId,
    status,
    category,
    sortBy = 'created_at',
    sortOrder = 'desc',
    limit = 100,
  } = options;

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('issues')
        .select(`
          *,
          reporter:users!reported_by(
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
        query = query.eq('reported_by', userId);
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

      // Add computed setu_id field to each issue
      const issuesWithSetuId = (data || []).map(issue => ({
        ...issue,
        setu_id: generateSetuId(issue.id)
      }));

      setIssues(issuesWithSetuId as Issue[]);
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
  }, [schoolId, userId, status, category, sortBy, sortOrder, limit]);

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

      if (bySetuId) {
        // When searching by SETU ID, fetch all issues and filter client-side
        // This is necessary because SETU ID is computed from UUID
        const { data: allIssues, error: queryError } = await supabase
          .from('issues')
          .select(`
            *,
            reporter:users!reported_by(
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

        if (queryError) throw queryError;

        if (!allIssues || allIssues.length === 0) {
          throw new Error('Issue not found');
        }

        // Filter client-side to find exact match
        const matchedIssue = allIssues.find(issue => {
          const generatedSetuId = generateSetuId(issue.id);
          return generatedSetuId === issueId;
        });

        if (!matchedIssue) {
          throw new Error('Issue not found');
        }

        // Add computed setu_id field
        const issueWithSetuId = {
          ...matchedIssue,
          setu_id: generateSetuId(matchedIssue.id)
        };

        setIssue(issueWithSetuId as Issue);
      } else {
        // Fetch by UUID directly
        const { data, error: queryError } = await supabase
          .from('issues')
          .select(`
            *,
            reporter:users!reported_by(
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
          `)
          .eq('id', issueId)
          .single();

        if (queryError) throw queryError;

        // Add computed setu_id field
        const issueWithSetuId = {
          ...data,
          setu_id: generateSetuId(data.id)
        };

        setIssue(issueWithSetuId as Issue);
      }
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
  reported_by: string; // Changed from created_by to match schema
  category: Issue['category'];
  title: string;
  description: string;
  photo_url?: string;
  ai_urgency_score: number; // Changed from urgency_score to match schema
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

    // Add computed setu_id field
    const issueWithSetuId = {
      ...newIssue,
      setu_id: generateSetuId(newIssue.id)
    };

    return { success: true, issue: issueWithSetuId as Issue };
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
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', issueId);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error('Error updating issue status:', err);
    return {
      success: false,
      error: err instanceof Error ? err : new Error('Failed to update issue status'),
    };
  }
}

/**
 * Helper function to endorse an issue (Principal only)
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

/**
 * Helper function to withdraw endorsement (Principal only)
 */
export async function withdrawEndorsement(
  issueId: string
): Promise<{ success: boolean; error?: Error }> {
  try {
    const { error } = await supabase
      .from('issues')
      .update({
        is_endorsed: false,
        endorsed_by: null,
        endorsed_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', issueId);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error('Error withdrawing endorsement:', err);
    return {
      success: false,
      error: err instanceof Error ? err : new Error('Failed to withdraw endorsement'),
    };
  }
}
