/**
 * useNotifications Hook
 * 
 * Fetches and manages notifications from Supabase
 */

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: 'issue_acknowledged' | 'status_update' | 'escalation' | 'assignment' | 'system';
  title: string;
  message: string;
  issue_id?: string;
  is_read: boolean;
  created_at: string;
  
  // Joined data
  issue?: {
    id: string;
    setu_id: string;
    title: string;
    status: string;
  };
}

interface UseNotificationsOptions {
  userId?: string;
  unreadOnly?: boolean;
  limit?: number;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    userId,
    unreadOnly = false,
    limit = 50,
  } = options;

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!userId) {
        setNotifications([]);
        setUnreadCount(0);
        setLoading(false);
        return;
      }

      let query = supabase
        .from('notifications')
        .select(`
          *,
          issue:issues(
            id,
            setu_id,
            title,
            status
          )
        `)
        .eq('user_id', userId);

      if (unreadOnly) {
        query = query.eq('is_read', false);
      }

      query = query
        .order('created_at', { ascending: false })
        .limit(limit);

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      setNotifications((data || []) as Notification[]);

      // Count unread
      const { count, error: countError } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (countError) throw countError;

      setUnreadCount(count || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch notifications'));
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Subscribe to real-time updates
    if (userId) {
      const subscription = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          () => {
            fetchNotifications();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [userId, unreadOnly, limit]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}
