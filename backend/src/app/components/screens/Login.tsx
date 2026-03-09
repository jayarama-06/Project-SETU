import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { setSession } from '../utils/session';

export function Login() {
  const [schoolId, setSchoolId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!schoolId.trim() || !password.trim()) {
      setError('Please enter your School ID and password.');
      return;
    }
    setError('');

    // Mock login — determine role by prefix (ADMIN → admin, else staff)
    const role = schoolId.toUpperCase().startsWith('ADMIN') ? 'admin' : 'staff';
    setSession({
      userId: 'USR-' + schoolId,
      role,
      schoolId: schoolId.toUpperCase(),
      name: role === 'admin' ? 'District Official' : 'School Staff',
    });

    const dest = role === 'admin' ? '/admin/dashboard' : '/staff/my-issues';
    navigate(dest, { replace: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
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

        {/* School ID Input */}
        <div className="mb-4">
          <label
            htmlFor="schoolId"
            style={{
              display: 'block',
              fontFamily: 'Noto Sans',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0D1B2A',
              marginBottom: '8px',
            }}
          >
            School ID
          </label>
          <input
            type="text"
            id="schoolId"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            placeholder="Enter your School ID"
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
            cursor: 'pointer',
          }}
        >
          Log In
        </button>

        {error && (
          <p
            className="text-center mt-3"
            style={{ fontFamily: 'Noto Sans', fontSize: '13px', color: '#DC2626' }}
          >
            {error}
          </p>
        )}

        {/* Hint */}
        <p
          className="text-center mt-4"
          style={{ fontFamily: 'Noto Sans', fontSize: '12px', color: '#9CA3AF' }}
        >
          Use any School ID + password to sign in (demo).
          <br />Prefix with "ADMIN" for the admin dashboard.
        </p>
      </div>
    </motion.div>
  );
}
