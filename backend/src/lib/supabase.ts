/**
 * SETU Supabase Client Configuration
 * Initializes and exports Supabase client for frontend use
 */

import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
// For production: Use environment variables via .env.local
// For Figma Make demo: Hardcoded values are acceptable
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR KEY'

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co');

// Log configuration status
if (isSupabaseConfigured) {
  console.log('✅ Supabase client initialized successfully');
  console.log(`📍 Connected to: ${supabaseUrl}`);
} else {
  console.warn('⚠️ Running in mock data mode - Supabase not configured');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage, // Use localStorage for session persistence
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
