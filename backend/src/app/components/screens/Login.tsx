import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { setSession } from '../utils/session';
import { smartLogin } from '../../lib/auth';

const SUPABASE_URL = ;
const SUPABASE_ANON = / ── Diagnostic: raw GoTrue fetch so we can see the real error ──
async function rawGoTrueDiag(email: string, password: string) {
  const lines: string[] = [];
  try {
    lines.push(`→ POST ${SUPABASE_URL}/auth/v1/token?grant_type=password`);
    lines.push(`  email: ${email}`);
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON,
      },
      body: JSON.stringify({ email, password }),
    });
    lines.push(`← HTTP ${res.status} ${res.statusText}`);
    const body = await res.json();
    lines.push(JSON.stringify(body, null, 2));
  } catch (e: any) {
    lines.push(`FETCH ERROR: ${e.message}`);
  }
  return lines.join('\n');
}

export function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Diagnostic state
  const [diagOpen, setDiagOpen] = useState(false);
  const [diagLog, setDiagLog] = useState('');
  const [diagLoading, setDiagLoading] = useState(false);
  const [rawTestEmail, setRawTestEmail] = useState('');
  const [rawTestPassword, setRawTestPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await smartLogin(userId, password);

      if (!result.success || !result.userData) {
        setError(result.error || 'Login failed. Please try again.');
        setLoading(false);
        return;
      }

      const userData = result.userData;

      if (userData.role === 'district_official' || userData.role === 'state_admin' || userData.role === 'super_admin') {
        setError('Please use the RCO/Official login portal.');
        setLoading(false);
        return;
      }

      setSession({
        userId: userData.id,
        role: userData.role,
        schoolId: userData.school_id || '',
        name: userData.full_name,
        email: userData.email,
        uniqueId: userData.unique_id,
      });

      const dest = userData.role === 'principal' ? '/principal/dashboard' : '/staff/my-issues';
      navigate(dest, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) handleLogin();
  };

  const runDiagnostic = async () => {
    setDiagLoading(true);
    setDiagLog('Running diagnostics…\n');

    const log: string[] = [];

    // Step 1 – RPC lookup
    try {
      log.push('━━ Step 1: unique_id → auth email (RPC) ━━');
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_auth_email_from_unique_id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON,
          'Authorization': `Bearer ${SUPABASE_ANON}`,
        },
        body: JSON.stringify({ uid: userId.trim().toUpperCase() || 'TCH001' }),
      });
      const rpcResult = await res.json();
      log.push(`HTTP ${res.status}: ${JSON.stringify(rpcResult)}`);

      // Step 2 – GoTrue raw call with whatever email was returned
      const authEmail = typeof rpcResult === 'string' ? rpcResult : null;
      log.push('');
      log.push('━━ Step 2: raw GoTrue signIn ━━');

      if (authEmail) {
        log.push(await rawGoTrueDiag(authEmail, password || 'Test@123'));
      } else {
        log.push('RPC returned null – trying both email formats directly:');
        log.push('');
        log.push('[format A] STAFF_BCH_001 (old format):');
        log.push(await rawGoTrueDiag('STAFF_BCH_001', 'Test@123'));
        log.push('');
        log.push('[format B] tch001@setu.edu.in (new format):');
        log.push(await rawGoTrueDiag('tch001@setu.edu.in', 'Test@123'));
      }

      // Step 3 – Test a freshly Dashboard-created user (if provided)
      if (rawTestEmail && rawTestPassword) {
        log.push('');
        log.push('━━ Step 3: raw test — Dashboard-created user ━━');
        log.push(await rawGoTrueDiag(rawTestEmail, rawTestPassword));
      }
    } catch (e: any) {
      log.push(`ERROR: ${e.message}`);
    }

    setDiagLog(log.join('\n'));
    setDiagLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] p-4"
    >
      <div
        className="w-full max-w-md bg-white p-8"
        style={{
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1
            style={{
              fontFamily: 'Noto Sans',
              fontWeight: 700,
              fontSize: '32px',
              color: '#0D1B2A',
              marginBottom: '8px',
            }}
          >
            SETU
          </h1>
          <p
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              color: '#6B7280',
            }}
          >
            Smart Escalation & Tracking Utility
          </p>
        </div>

        {/* User ID Input */}
        <div className="mb-4">
          <label
            htmlFor="userId"
            style={{
              display: 'block',
              fontFamily: 'Noto Sans',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0D1B2A',
              marginBottom: '8px',
            }}
          >
            User ID
          </label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="e.g. TCH001 or PRI001"
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              backgroundColor: 'white',
              padding: '0 16px',
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              color: '#0D1B2A',
            }}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label
            htmlFor="password"
            style={{
              display: 'block',
              fontFamily: 'Noto Sans',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0D1B2A',
              marginBottom: '8px',
            }}
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              backgroundColor: 'white',
              padding: '0 16px',
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              color: '#0D1B2A',
            }}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            height: '48px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#0D1B2A',
            color: 'white',
            fontFamily: 'Noto Sans',
            fontSize: '14px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Logging in…' : 'Log In'}
        </button>

        {error && (
          <p
            className="text-center mt-3"
            style={{ fontFamily: 'Noto Sans', fontSize: '13px', color: '#DC2626' }}
          >
            {error}
          </p>
        )}

        <p
          className="text-center mt-4"
          style={{ fontFamily: 'Noto Sans', fontSize: '12px', color: '#9CA3AF' }}
        >
          Enter your User ID (e.g. TCH001 or PRI001) and password.
          <br />Password: Test@123 for all test users.
        </p>

        {/* ── Diagnostic Panel ── */}
        <div className="mt-6 border-t pt-4" style={{ borderColor: '#F3F4F6' }}>
          <button
            onClick={() => { setDiagOpen(o => !o); if (!diagOpen) runDiagnostic(); }}
            style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#6B7280', fontFamily: 'Noto Sans', fontSize: '12px', cursor: 'pointer' }}
          >
            {diagOpen ? '▲ Hide Diagnostics' : '🔍 Run Diagnostics — see raw GoTrue response'}
          </button>

          {diagOpen && (
            <div className="mt-3">
              {diagLoading ? (
                <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6B7280' }}>Running…</p>
              ) : (
                <>
                  <pre
                    style={{
                      backgroundColor: '#0D1B2A',
                      color: '#86EFAC',
                      fontFamily: 'monospace',
                      fontSize: '10px',
                      padding: '12px',
                      borderRadius: '6px',
                      overflowX: 'auto',
                      overflowY: 'auto',
                      maxHeight: '320px',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                    }}
                  >
                    {diagLog || 'No output yet.'}
                  </pre>
                  <button
                    onClick={runDiagnostic}
                    style={{ marginTop: '6px', fontSize: '11px', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    ↺ Re-run
                  </button>
                </>
              )}

              {/* Raw tester — for Dashboard-created users */}
              <div className="mt-3 p-3 rounded" style={{ backgroundColor: '#F9FAFB', border: '1px dashed #E5E7EB' }}>
                <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#6B7280', marginBottom: '6px' }}>
                  🧪 Test any raw email (e.g. a user created via Supabase Dashboard):
                </p>
                <input
                  type="email"
                  placeholder="raw email (e.g. diag@example.com)"
                  value={rawTestEmail}
                  onChange={e => setRawTestEmail(e.target.value)}
                  style={{ width: '100%', height: '30px', borderRadius: '4px', border: '1px solid #E5E7EB', padding: '0 8px', fontFamily: 'monospace', fontSize: '11px', marginBottom: '4px', boxSizing: 'border-box' }}
                />
                <input
                  type="text"
                  placeholder="password"
                  value={rawTestPassword}
                  onChange={e => setRawTestPassword(e.target.value)}
                  style={{ width: '100%', height: '30px', borderRadius: '4px', border: '1px solid #E5E7EB', padding: '0 8px', fontFamily: 'monospace', fontSize: '11px', marginBottom: '6px', boxSizing: 'border-box' }}
                />
                <button
                  onClick={runDiagnostic}
                  style={{ height: '28px', padding: '0 12px', borderRadius: '4px', border: '1px solid #E5E7EB', backgroundColor: '#0D1B2A', color: 'white', fontFamily: 'monospace', fontSize: '10px', cursor: 'pointer' }}
                >
                  Run with these credentials →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Link to RCO Login */}
      <div className="mt-6">
        <button
          onClick={() => navigate('/rco/login')}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'Noto Sans',
            fontSize: '13px',
            color: '#6B7280',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
          data-i18n="lnk_rco_login"
        >
          RCO / Official Login →
        </button>
      </div>
    </motion.div>
  );
}
