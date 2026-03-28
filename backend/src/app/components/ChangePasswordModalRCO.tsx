import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface ChangePasswordModalRCOProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModalRCO({
  isOpen,
  onClose,
}: ChangePasswordModalRCOProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate password strength
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: '', color: '', width: '0%' };
    if (password.length < 6) return { strength: 'Weak', color: '#EF4444', width: '33%' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 1) return { strength: 'Weak', color: '#EF4444', width: '33%' };
    if (score === 2) return { strength: 'Medium', color: '#F59E0B', width: '66%' };
    return { strength: 'Strong', color: '#10B981', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const handleUpdate = async () => {
    // Validation
    if (!currentPassword) {
      alert('Please enter your current password');
      return;
    }

    if (newPassword.length < 6) {
      alert('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New password and confirmation do not match');
      return;
    }

    setIsUpdating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production, would validate current password with backend
    setIsUpdating(false);
    
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    onClose();

    // Show success toast
    alert('Password updated successfully');
  };

  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg z-50"
            style={{
              width: '480px',
              maxWidth: '90vw',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
              <h2
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#0D1B2A',
                }}
                data-i18n="modal_change_pw_title"
              >
                Change Password
              </h2>
              <button
                onClick={handleCancel}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg hover:bg-[#F8F9FA] transition-colors"
                disabled={isUpdating}
              >
                <X size={24} color="#6B7280" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Current Password */}
              <div>
                <label
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0D1B2A',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F0A500]"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '14px',
                      color: '#0D1B2A',
                    }}
                    disabled={isUpdating}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2"
                    disabled={isUpdating}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} color="#6B7280" />
                    ) : (
                      <Eye size={18} color="#6B7280" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0D1B2A',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F0A500]"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '14px',
                      color: '#0D1B2A',
                    }}
                    disabled={isUpdating}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2"
                    disabled={isUpdating}
                  >
                    {showNewPassword ? (
                      <EyeOff size={18} color="#6B7280" />
                    ) : (
                      <Eye size={18} color="#6B7280" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        style={{
                          fontFamily: 'Noto Sans',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: passwordStrength.color,
                        }}
                      >
                        {passwordStrength.strength}
                      </span>
                    </div>
                    <div
                      className="w-full rounded-full overflow-hidden"
                      style={{
                        height: '4px',
                        backgroundColor: '#E5E7EB',
                      }}
                    >
                      <div
                        style={{
                          width: passwordStrength.width,
                          height: '100%',
                          backgroundColor: passwordStrength.color,
                          transition: 'width 0.3s ease, background-color 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0D1B2A',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F0A500]"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '14px',
                      color: '#0D1B2A',
                    }}
                    disabled={isUpdating}
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2"
                    disabled={isUpdating}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} color="#6B7280" />
                    ) : (
                      <Eye size={18} color="#6B7280" />
                    )}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p
                    className="mt-1"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '12px',
                      color: '#EF4444',
                    }}
                  >
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              <div
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: '#F8F9FA',
                  border: '1px solid #E5E7EB',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#6B7280',
                    marginBottom: '6px',
                  }}
                >
                  Password Requirements:
                </p>
                <ul
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '12px',
                    color: '#6B7280',
                    paddingLeft: '16px',
                    margin: 0,
                  }}
                >
                  <li>At least 8 characters</li>
                  <li>Mix of uppercase and lowercase letters</li>
                  <li>At least one number</li>
                  <li>At least one special character</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E7EB]">
              <button
                onClick={handleCancel}
                className="px-6 py-3 rounded-lg border border-[#E5E7EB] hover:bg-[#F8F9FA] transition-colors"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#6B7280',
                  height: '48px',
                }}
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'white',
                  backgroundColor: isUpdating ? '#9CA3AF' : '#0D1B2A',
                  height: '48px',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                }}
                disabled={isUpdating}
                data-i18n="btn_update_password"
              >
                {isUpdating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
