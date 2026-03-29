/**
 * SETU Login Diagnostic Screen
 * Helps debug UUID sync issues — accessible at /diagnostic
 * Remove this route in production!
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface CheckResult {
  label: string;
  status: 'pass' | 'fail' | 'warn' | 'loading';
  detail: string;
  fix?: string;
}

export default function LoginDiagnostic() {
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [running, setRunning] = useState(false);
  const [testId, setTestId] = useState('TCH001');
  const [testPassword, setTestPassword] = useState('Test@123');
  const [loginResult, setLoginResult] = useState<string | null>(null);

  async function runDiagnostics() {
    setRunning(true);
    setChecks([]);
    const results: CheckResult[] = [];

    // ── CHECK 1: Supabase connection ──────────────────────────────
    try {
      const { error } = await supabase.from('users').select('count').limit(1);
      results.push({
        label: 'Supabase Connection',
        status: error ? 'fail' : 'pass',
        detail: error ? `Error: ${error.message}` : 'Connected successfully',
        fix: error ? 'Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env' : undefined,
      });
    } catch (e: any) {
      results.push({ label: 'Supabase Connection', status: 'fail', detail: e.message, fix: 'Check .env keys' });
    }
    setChecks([...results]);

    // ── CHECK 2: get_auth_email_from_unique_id function ──────────
    try {
      const { data, error } = await supabase.rpc('get_auth_email_from_unique_id', { uid: testId });
      if (error) {
        results.push({
          label: `RPC: get_auth_email_from_unique_id('${testId}')`,
          status: 'fail',
          detail: error.message,
          fix: 'Run /supabase/FINAL_DEFINITIVE_FIX.sql in Supabase SQL Editor',
        });
      } else if (!data) {
        results.push({
          label: `RPC: get_auth_email_from_unique_id('${testId}')`,
          status: 'warn',
          detail: `Returned NULL — ${testId} has no unique_id mapping in public.users`,
          fix: 'Run /supabase/FINAL_DEFINITIVE_FIX.sql — Part: ENSURE unique_id mappings',
        });
      } else {
        results.push({
          label: `RPC: get_auth_email_from_unique_id('${testId}')`,
          status: 'pass',
          detail: `Maps to auth email: "${data}"`,
        });
      }
    } catch (e: any) {
      results.push({ label: 'RPC: get_auth_email_from_unique_id', status: 'fail', detail: e.message });
    }
    setChecks([...results]);

    // ── CHECK 3: Auth user exists ────────────────────────────────
    // We can test this by trying to sign in
    let authEmail: string | null = null;
    try {
      const { data } = await supabase.rpc('get_auth_email_from_unique_id', { uid: testId });
      authEmail = data;
    } catch { /* handled above */ }

    if (authEmail) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: testPassword,
        });
        if (authError) {
          results.push({
            label: `Auth Sign-In (${authEmail})`,
            status: 'fail',
            detail: authError.message,
            fix: authError.message.includes('Invalid') 
              ? 'Wrong password, OR the auth user doesn\'t exist. Create it via Supabase Dashboard → Authentication → Users'
              : `Error code: ${authError.status}`,
          });
        } else if (authData.user) {
          results.push({
            label: `Auth Sign-In (${authEmail})`,
            status: 'pass',
            detail: `auth.users UUID: ${authData.user.id}`,
          });

          // ── CHECK 4: UUID sync ────────────────────────────────
          const authUUID = authData.user.id;
          const { data: publicUser, error: publicError } = await supabase
            .from('users')
            .select('id, email, unique_id, role')
            .eq('email', authEmail)
            .single();

          if (publicError || !publicUser) {
            results.push({
              label: 'public.users row for this auth user',
              status: 'fail',
              detail: publicError?.message || 'No row found with this email in public.users',
              fix: 'Run /supabase/FINAL_DEFINITIVE_FIX.sql OR /supabase/create_users_with_ids.sql',
            });
          } else {
            const uuidMatch = publicUser.id === authUUID;
            results.push({
              label: 'UUID Sync: auth.users ↔ public.users',
              status: uuidMatch ? 'pass' : 'warn',
              detail: uuidMatch
                ? `✅ UUIDs match: ${authUUID}`
                : `❌ MISMATCH!\n  auth.users.id:   ${authUUID}\n  public.users.id: ${publicUser.id}`,
              fix: uuidMatch ? undefined : 'Run /supabase/FINAL_DEFINITIVE_FIX.sql (Approach C handles this)',
            });

            // ── CHECK 5: get_my_user_profile RPC ─────────────────
            const { data: profile, error: profileError } = await supabase.rpc('get_my_user_profile');
            if (profileError) {
              results.push({
                label: 'RPC: get_my_user_profile()',
                status: 'fail',
                detail: profileError.message,
                fix: 'Run /supabase/FINAL_DEFINITIVE_FIX.sql — Approach A creates this function',
              });
            } else {
              const row = Array.isArray(profile) ? profile[0] : profile;
              results.push({
                label: 'RPC: get_my_user_profile()',
                status: row ? 'pass' : 'warn',
                detail: row
                  ? `✅ Got profile: ${row.full_name} (${row.role})`
                  : 'Returned empty — SECURITY DEFINER function exists but no matching email in public.users',
                fix: row ? undefined : 'Check public.users has email = ' + authEmail,
              });
            }

            // ── CHECK 6: RLS policy simulation ───────────────────
            const { data: rlsTest, error: rlsError } = await supabase
              .from('users')
              .select('id, email, unique_id')
              .eq('email', authEmail)
              .single();

            results.push({
              label: 'RLS: SELECT from users (email match)',
              status: rlsError ? 'fail' : 'pass',
              detail: rlsError
                ? `Blocked by RLS: ${rlsError.message}`
                : `✅ Can read own row (email-based policy works)`,
              fix: rlsError ? 'Run /supabase/FINAL_DEFINITIVE_FIX.sql — Approach B fixes RLS policies' : undefined,
            });
          }

          // Sign out after testing
          await supabase.auth.signOut();
        }
      } catch (e: any) {
        results.push({ label: 'Auth Sign-In', status: 'fail', detail: e.message });
      }
    }
    setChecks([...results]);

    // ── OVERALL SUMMARY ──────────────────────────────────────────
    const failures = results.filter(r => r.status === 'fail').length;
    const warnings = results.filter(r => r.status === 'warn').length;
    if (failures === 0 && warnings === 0) {
      results.push({
        label: '🎉 OVERALL STATUS',
        status: 'pass',
        detail: 'All checks passed! Login should work now.',
      });
    } else {
      results.push({
        label: '⚠️ OVERALL STATUS',
        status: failures > 0 ? 'fail' : 'warn',
        detail: `${failures} failure(s), ${warnings} warning(s). Run /supabase/FINAL_DEFINITIVE_FIX.sql to fix all issues.`,
        fix: 'Copy /supabase/FINAL_DEFINITIVE_FIX.sql → Supabase SQL Editor → Run',
      });
    }
    setChecks([...results]);
    setRunning(false);
  }

  async function testFullLogin() {
    setLoginResult('Testing...');
    try {
      const { loginWithUniqueId } = await import('../../lib/auth');
      const result = await loginWithUniqueId(testId, testPassword);
      if (result.success) {
        setLoginResult(`✅ SUCCESS! Logged in as: ${result.userData?.full_name} (${result.userData?.role})`);
        await supabase.auth.signOut();
      } else {
        setLoginResult(`❌ FAILED: ${result.error}`);
      }
    } catch (e: any) {
      setLoginResult(`❌ Exception: ${e.message}`);
    }
  }

  const statusIcon = (s: CheckResult['status']) =>
    ({ pass: '✅', fail: '❌', warn: '⚠️', loading: '⏳' }[s]);

  const statusBg = (s: CheckResult['status']) =>
    ({ pass: 'bg-green-50 border-green-200', fail: 'bg-red-50 border-red-200', warn: 'bg-yellow-50 border-yellow-200', loading: 'bg-gray-50 border-gray-200' }[s]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-6 mb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">🔍</div>
            <div>
              <h1 className="text-gray-900">SETU Login Diagnostics</h1>
              <p className="text-sm text-gray-500">Diagnoses UUID sync & RLS issues</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            ⚠️ <strong>Remove this page before production.</strong> Route: <code>/diagnostic</code>
          </div>
        </div>

        {/* Test Credentials */}
        <div className="bg-white rounded-2xl shadow p-6 mb-4">
          <h2 className="text-sm text-gray-500 mb-3">Test Credentials</h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Unique ID</label>
              <input
                value={testId}
                onChange={e => setTestId(e.target.value.toUpperCase())}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono"
                placeholder="TCH001"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Password</label>
              <input
                value={testPassword}
                onChange={e => setTestPassword(e.target.value)}
                type="password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-3">
            <button
              onClick={runDiagnostics}
              disabled={running}
              className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm disabled:opacity-50"
            >
              {running ? '⏳ Running checks...' : '🔍 Run Diagnostics'}
            </button>
            <button
              onClick={testFullLogin}
              className="flex-1 bg-green-600 text-white rounded-lg px-4 py-2 text-sm"
            >
              🔑 Full Login Test
            </button>
          </div>
          {loginResult && (
            <div className={`mt-3 p-3 rounded-lg text-sm font-mono whitespace-pre-wrap ${loginResult.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {loginResult}
            </div>
          )}
        </div>

        {/* Check Results */}
        {checks.length > 0 && (
          <div className="space-y-3">
            {checks.map((check, i) => (
              <div key={i} className={`bg-white rounded-2xl shadow border p-4 ${statusBg(check.status)}`}>
                <div className="flex items-start gap-2">
                  <span className="text-lg leading-none mt-0.5">{statusIcon(check.status)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">{check.label}</p>
                    <p className="text-xs text-gray-600 mt-0.5 font-mono whitespace-pre-wrap break-all">{check.detail}</p>
                    {check.fix && (
                      <div className="mt-2 p-2 bg-white bg-opacity-70 rounded-lg">
                        <p className="text-xs text-blue-700">
                          <strong>Fix:</strong> {check.fix}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Root Cause Explanation */}
        <div className="bg-white rounded-2xl shadow p-6 mt-4">
          <h2 className="text-gray-800 mb-4">Why This Happens (Root Cause)</h2>
          <div className="space-y-4 text-sm text-gray-600">
            {[
              {
                step: '1', color: 'blue',
                title: 'seed.sql runs first',
                desc: 'Inserts rows into public.users with hardcoded UUIDs (e.g. 650e8400-...)'
              },
              {
                step: '2', color: 'purple',
                title: 'Auth users created separately',
                desc: 'Supabase assigns NEW random UUIDs to auth.users (e.g. 9f2a3b1c-...). These never match the hardcoded ones from seed.sql.'
              },
              {
                step: '3', color: 'orange',
                title: 'RLS policy blocks Step 3',
                desc: 'auth.uid() returns the auth.users UUID. RLS policy USING (auth.uid() = id) checks public.users.id. Different UUID → 0 rows → "Database error querying schema"'
              },
              {
                step: '4', color: 'red',
                title: 'FIX_UUID_SYNC.sql also fails',
                desc: 'UPDATE public.users SET id = ... fails because issues, notifications, audit_log all have FK constraints referencing users.id with no CASCADE update rule.'
              },
              {
                step: '✅', color: 'green',
                title: 'FINAL_DEFINITIVE_FIX.sql solves all 3',
                desc: 'A) SECURITY DEFINER function bypasses RLS  B) RLS now uses auth.email()=email  C) CASCADE FK constraints allow UUID sync'
              },
            ].map(({ step, color, title, desc }) => (
              <div key={step} className="flex gap-3">
                <div className={`w-6 h-6 rounded-full bg-${color}-100 text-${color}-700 flex items-center justify-center flex-shrink-0 text-xs`}>
                  {step}
                </div>
                <div>
                  <p className="text-gray-800">{title}</p>
                  <p className="text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow p-6 mt-4 text-white">
          <h2 className="mb-3">The One Script That Fixes Everything</h2>
          <div className="bg-white bg-opacity-10 rounded-xl p-3 font-mono text-sm mb-4">
            /supabase/FINAL_DEFINITIVE_FIX.sql
          </div>
          <ol className="space-y-2 text-sm text-blue-100">
            <li>1. Open Supabase Dashboard → SQL Editor</li>
            <li>2. Copy contents of FINAL_DEFINITIVE_FIX.sql</li>
            <li>3. Paste and click Run</li>
            <li>4. Return here and click "Run Diagnostics"</li>
            <li>5. All checks should show ✅</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
