import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface EditProfileModalRCOProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    officialId: string;
    jurisdiction: string;
    displayName: string;
    contactNumber: string;
    whatsappNumber: string;
    email: string;
  };
  onSave: (updatedProfile: {
    displayName: string;
    contactNumber: string;
    whatsappNumber: string;
    email: string;
  }) => void;
}

export function EditProfileModalRCO({
  isOpen,
  onClose,
  profile,
  onSave,
}: EditProfileModalRCOProps) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [contactNumber, setContactNumber] = useState(profile.contactNumber);
  const [whatsappNumber, setWhatsappNumber] = useState(profile.whatsappNumber);
  const [email, setEmail] = useState(profile.email);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onSave({ displayName, contactNumber, whatsappNumber, email });
    setIsSaving(false);
    onClose();

    // Show success toast
    alert('Profile updated successfully');
  };

  const handleCancel = () => {
    // Reset to original values
    setDisplayName(profile.displayName);
    setContactNumber(profile.contactNumber);
    setWhatsappNumber(profile.whatsappNumber);
    setEmail(profile.email);
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
              width: '540px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] sticky top-0 bg-white z-10">
              <h2
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#0D1B2A',
                }}
                data-i18n="modal_edit_profile_title"
              >
                Edit Profile
              </h2>
              <button
                onClick={handleCancel}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg hover:bg-[#F8F9FA] transition-colors"
                disabled={isSaving}
              >
                <X size={24} color="#6B7280" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Read-Only Section */}
              <div
                className="p-4 rounded-lg"
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
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                  }}
                >
                  Read-Only Information
                </p>
                <div className="space-y-2">
                  <div>
                    <span
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#6B7280',
                      }}
                    >
                      Official ID:{' '}
                    </span>
                    <span
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '13px',
                        color: '#0D1B2A',
                      }}
                    >
                      {profile.officialId}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#6B7280',
                      }}
                    >
                      Jurisdiction:{' '}
                    </span>
                    <span
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '13px',
                        color: '#0D1B2A',
                      }}
                    >
                      {profile.jurisdiction}
                    </span>
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-4">
                {/* Display Name */}
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
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F0A500]"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '14px',
                      color: '#0D1B2A',
                    }}
                    disabled={isSaving}
                  />
                </div>

                {/* Contact Number */}
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
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F0A500]"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '14px',
                      color: '#0D1B2A',
                    }}
                    disabled={isSaving}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                {/* WhatsApp Number */}
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
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F0A500]"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '14px',
                      color: '#0D1B2A',
                    }}
                    disabled={isSaving}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                {/* Email */}
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
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F0A500]"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '14px',
                      color: '#0D1B2A',
                    }}
                    disabled={isSaving}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E7EB] sticky bottom-0 bg-white">
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
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'white',
                  backgroundColor: isSaving ? '#9CA3AF' : '#0D1B2A',
                  height: '48px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                }}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
