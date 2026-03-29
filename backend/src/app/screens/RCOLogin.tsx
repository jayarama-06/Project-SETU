import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { setSession } from '../utils/session';
import { LanguageToggle } from '../components/LanguageToggle';
import { smartLogin } from '../../lib/auth';

export function RCOLogin() {
  const [userId, setUserId] = useState(''); // Changed from 'email' to 'userId' for clarity
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Use smart login - handles both RCO001 and RCO_HYD_001 formats
      const result = await smartLogin(userId, password);

      if (!result.success || !result.userData) {
        setError(result.error || 'Login failed. Please try again.');
        setLoading(false);
        return;
      }

      const userData = result.userData;

      // Check if user is RCO/admin (not school staff)
      if (userData.role === 'school_staff' || userData.role === 'principal') {
        setError('Please use the School Staff login portal.');
        setLoading(false);
        return;
      }

      // Set session
      setSession({
        userId: userData.id,
        role: 'rco', // Normalize to 'rco' for routing
        schoolId: userData.district || '',
        name: userData.full_name,
        email: userData.email,
        actualRole: userData.role, // Store actual role for permissions
        uniqueId: userData.unique_id, // Store unique_id for display
      });

      // Navigate to RCO dashboard
      navigate('/rco/dashboard', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) handleLogin();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col items-center justify-center bg-[#0D1B2A] p-4"
    >
      {/* Main Login Card */}
      <div
        className="w-full bg-white p-8 relative"
        style={{
          maxWidth: '400px',
          borderRadius: '8px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* SETU Wordmark + Official Portal Subtitle */}
        <div className="text-center mb-8">
          <h1
            style={{
              fontFamily: 'Noto Sans',
              fontWeight: 700,
              fontSize: '32px',
              color: '#0D1B2A',
              marginBottom: '4px',
            }}
          >
            SETU
          </h1>
          <p
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              fontWeight: 600,
              color: '#6B7280',
            }}
            data-i18n="lbl_official_portal"
          >
            Official Portal
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
            data-i18n="lbl_user_id"
          >
            User ID
          </label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="e.g. RCO001 or ADM001"
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

        {/* Password Input with Eye Toggle */}
        <div className="mb-2">
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
            data-i18n="lbl_password"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
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
                padding: '0 48px 0 16px',
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                color: '#0D1B2A',
              }}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff size={20} color="#6B7280" />
              ) : (
                <Eye size={20} color="#6B7280" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="mb-6 text-right">
          <button
            onClick={() => {
              /* Show forgot password modal */
            }}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'Noto Sans',
              fontSize: '13px',
              color: '#F0A500',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            data-i18n="lnk_forgot_password"
          >
            Forgot Password?
          </button>
        </div>

        {/* Log In Button */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            height: '56px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#0D1B2A',
            color: 'white',
            fontFamily: 'Noto Sans',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          data-i18n="btn_log_in"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        {error && (
          <p
            className="text-center mt-3"
            style={{ fontFamily: 'Noto Sans', fontSize: '13px', color: '#DC2626' }}
          >
            {error}
          </p>
        )}

        {/* Language Toggle - Bottom Right of Card */}
        <div className="absolute bottom-6 right-6">
          <LanguageToggle size="compact" />
        </div>
      </div>

      {/* Authorised Personnel Only Caption */}
      <p
        className="mt-6 text-center"
        style={{
          fontFamily: 'Noto Sans',
          fontSize: '11px',
          fontStyle: 'italic',
          color: '#6B7280',
        }}
        data-i18n="lbl_authorised_only"
      >
        Authorised Personnel Only
      </p>

      {/* Support Link */}
      <div className="mt-8">
        <button
          onClick={() => {
            /* Show support modal */
          }}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'Noto Sans',
            fontSize: '13px',
            color: '#9CA3AF',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
          data-i18n="lnk_support"
        >
          Need help? Contact Support
        </button>
      </div>

      {/* Demo Hint */}
      <p
        className="mt-6 text-center"
        style={{ fontFamily: 'Noto Sans', fontSize: '12px', color: '#9CA3AF' }}
      >
        Enter your User ID (e.g. RCO001, ADM001) and password.
        <br />
        Password: Test@123 for all test users.
      </p>

      {/* Link to Staff/Principal Login */}
      <div className="mt-4">
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'Noto Sans',
            fontSize: '13px',
            color: '#9CA3AF',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
          data-i18n="lnk_staff_login"
        >
          Staff/Principal Login →
        </button>
      </div>
    </motion.div>
  );
}