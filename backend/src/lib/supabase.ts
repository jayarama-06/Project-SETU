/**
 * SETU Supabase Client Configuration
 * Singleton pattern — prevents "Multiple GoTrueClient instances" HMR warning.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase Configuration
const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     || '
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||
// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://placeholder.supabase.co'
);

// ── Singleton guard ────────────────────────────────────────────────────────
// Vite HMR re-executes modules on save, which re-runs createClient and
// triggers the "Multiple GoTrueClient instances" console warning.
// Storing the client on globalThis prevents duplicate creation.
const GLOBAL_KEY = '__setu_supabase_client__';

declare global {
  interface Window {
    [GLOBAL_KEY]: SupabaseClient;
  }
}

function getSupabaseClient(): SupabaseClient {
  if (typeof window !== 'undefined' && window[GLOBAL_KEY]) {
    return window[GLOBAL_KEY];
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken:  true,
      persistSession:    true,
      detectSessionInUrl: true,
      storage:           window.localStorage,
      // Force implicit flow — avoids the PKCE flow_state table.
      // supabase-js ≥ v2.64 defaults to 'pkce' in browsers, which
      // requires auth.flow_state to be fully migrated on the server.
      flowType: 'implicit',
    },
    realtime: {
      params: { eventsPerSecond: 10 },
    },
  });

  if (typeof window !== 'undefined') {
    window[GLOBAL_KEY] = client;
  }

  if (isSupabaseConfigured) {
    console.log('✅ Supabase client initialised');
    console.log(`📍 Connected to: ${supabaseUrl}`);
  } else {
    console.warn('⚠️  Running in mock-data mode — Supabase not configured');
  }

  return client;
}

export const supabase = getSupabaseClient();
