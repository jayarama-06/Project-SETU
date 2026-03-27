/**
 * SETU Supabase Connection Test Utility
 * Run this to verify your backend is properly configured
 */

import { supabase, isSupabaseConfigured } from './supabase';

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: any;
  error?: any;
}

/**
 * Test 1: Check if environment variables are set
 */
async function testEnvironmentVariables(): Promise<ConnectionTestResult> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      message: '❌ Environment variables not set',
      details: {
        help: 'Create .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY',
        example: 'See .env.example for template'
      }
    };
  }

  return {
    success: true,
    message: '✅ Environment variables configured',
  };
}

/**
 * Test 2: Check database connection
 */
async function testDatabaseConnection(): Promise<ConnectionTestResult> {
  try {
    const { data, error } = await supabase
      .from('escalation_config')
      .select('count')
      .limit(1);

    if (error) {
      return {
        success: false,
        message: '❌ Database connection failed',
        error: error.message,
        details: {
          help: 'Check if schema.sql has been deployed to Supabase',
          code: error.code
        }
      };
    }

    return {
      success: true,
      message: '✅ Database connection working',
    };
  } catch (error: any) {
    return {
      success: false,
      message: '❌ Database connection error',
      error: error.message,
    };
  }
}

/**
 * Test 3: Check if tables exist
 */
async function testTablesExist(): Promise<ConnectionTestResult> {
  const requiredTables = [
    'schools',
    'users',
    'issues',
    'issue_audit_log',
    'notifications',
    'bypass_reports',
    'escalation_config'
  ];

  const missingTables: string[] = [];

  for (const table of requiredTables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('count')
        .limit(1);

      if (error) {
        missingTables.push(table);
      }
    } catch (error) {
      missingTables.push(table);
    }
  }

  if (missingTables.length > 0) {
    return {
      success: false,
      message: `❌ Missing tables: ${missingTables.join(', ')}`,
      details: {
        help: 'Deploy schema.sql via Supabase SQL Editor',
        missingTables
      }
    };
  }

  return {
    success: true,
    message: `✅ All ${requiredTables.length} tables exist`,
  };
}

/**
 * Test 4: Check RLS policies
 */
async function testRLSPolicies(): Promise<ConnectionTestResult> {
  try {
    // Try to query issues table (should work even if empty, thanks to RLS)
    const { error } = await supabase
      .from('issues')
      .select('id')
      .limit(1);

    if (error && error.message.includes('RLS')) {
      return {
        success: false,
        message: '⚠️ RLS policies may not be configured',
        details: {
          help: 'Deploy rls_policies.sql via Supabase SQL Editor',
          note: 'Or you may not be authenticated yet'
        }
      };
    }

    return {
      success: true,
      message: '✅ RLS policies configured',
    };
  } catch (error: any) {
    return {
      success: false,
      message: '❌ RLS test failed',
      error: error.message,
    };
  }
}

/**
 * Test 5: Check storage bucket
 */
async function testStorageBucket(): Promise<ConnectionTestResult> {
  try {
    const { data, error } = await supabase
      .storage
      .getBucket('issue-attachments');

    if (error) {
      return {
        success: false,
        message: '❌ Storage bucket not found',
        details: {
          help: 'Create "issue-attachments" bucket in Supabase Dashboard → Storage',
          error: error.message
        }
      };
    }

    return {
      success: true,
      message: '✅ Storage bucket configured',
      details: {
        bucketId: data.id,
        public: data.public
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: '❌ Storage test failed',
      error: error.message,
    };
  }
}

/**
 * Test 6: Check authentication
 */
async function testAuthentication(): Promise<ConnectionTestResult> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error && error.message !== 'Auth session missing!') {
      return {
        success: false,
        message: '❌ Authentication error',
        error: error.message,
      };
    }

    if (!user) {
      return {
        success: true,
        message: '⚠️ Not authenticated (this is ok for testing)',
        details: {
          note: 'Create a test user to fully test authentication'
        }
      };
    }

    return {
      success: true,
      message: '✅ Authenticated successfully',
      details: {
        userId: user.id,
        email: user.email
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: '❌ Authentication test failed',
      error: error.message,
    };
  }
}

/**
 * Run all connection tests
 */
export async function runAllTests(): Promise<{
  allPassed: boolean;
  results: Record<string, ConnectionTestResult>;
}> {
  console.log('🔍 Running SETU Backend Connection Tests...\n');

  const results: Record<string, ConnectionTestResult> = {};

  // Test 1: Environment
  console.log('Test 1: Environment Variables');
  results.environment = await testEnvironmentVariables();
  console.log(results.environment.message);
  if (results.environment.details) console.log(results.environment.details);
  console.log('');

  // Test 2: Database Connection
  console.log('Test 2: Database Connection');
  results.connection = await testDatabaseConnection();
  console.log(results.connection.message);
  if (results.connection.error) console.error(results.connection.error);
  if (results.connection.details) console.log(results.connection.details);
  console.log('');

  // Test 3: Tables
  console.log('Test 3: Database Tables');
  results.tables = await testTablesExist();
  console.log(results.tables.message);
  if (results.tables.details) console.log(results.tables.details);
  console.log('');

  // Test 4: RLS
  console.log('Test 4: Row Level Security');
  results.rls = await testRLSPolicies();
  console.log(results.rls.message);
  if (results.rls.details) console.log(results.rls.details);
  console.log('');

  // Test 5: Storage
  console.log('Test 5: Storage Bucket');
  results.storage = await testStorageBucket();
  console.log(results.storage.message);
  if (results.storage.details) console.log(results.storage.details);
  console.log('');

  // Test 6: Auth
  console.log('Test 6: Authentication');
  results.auth = await testAuthentication();
  console.log(results.auth.message);
  if (results.auth.details) console.log(results.auth.details);
  console.log('');

  // Summary
  const allPassed = Object.values(results).every(r => r.success);
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (allPassed) {
    console.log('✅ ALL TESTS PASSED!');
    console.log('Your SETU backend is properly configured.');
  } else {
    console.log('⚠️ SOME TESTS FAILED');
    console.log('Check the results above and follow the help instructions.');
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  return { allPassed, results };
}

/**
 * Quick test function for console
 * Usage: Open browser console and run: testSupabaseConnection()
 */
export async function testSupabaseConnection() {
  const { allPassed, results } = await runAllTests();
  return {
    status: allPassed ? 'SUCCESS' : 'FAILED',
    results
  };
}

// Make it available in browser console for debugging
if (typeof window !== 'undefined') {
  (window as any).testSupabaseConnection = testSupabaseConnection;
}
