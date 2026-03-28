import { useState, useEffect } from 'react';
import { X, Lock, Phone, MessageCircle, User, BookOpen, Briefcase } from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    teacherName: string;
    designation: string;
    subject: string;
    contactNumber: string;
    whatsappNumber: string;
  }) => void;
  initialData: {
    teacherName: string;
    designation: string;
    subject: string;
    schoolId: string;
    schoolName: string;
    contactNumber: string;
    whatsappNumber: string;
  };
}

const DESIGNATIONS = [
  'Headmaster',
  'Headmistress',
  'Assistant Teacher',
  'Senior Assistant Teacher',
  'PET Teacher',
  'Librarian',
  'Warden',
  'Hindi Pandit',
  'Drawing Teacher',
  'Lab Assistant',
  'Night Watchman',
  'Kitchen Staff',
];

const SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'Telugu',
  'Hindi',
  'Social Studies',
  'Physical Education',
  'Library',
  'Drawing & Arts',
  'General',
  'Administration',
];

function getInitials(name: string | undefined): string {
  if (!name || typeof name !== 'string') return '??';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function EditProfileModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EditProfileModalProps) {
  const [teacherName, setTeacherName] = useState(initialData.teacherName);
  const [designation, setDesignation] = useState(initialData.designation);
  const [subject, setSubject] = useState(initialData.subject);
  const [contactNumber, setContactNumber] = useState(initialData.contactNumber);
  const [whatsappNumber, setWhatsappNumber] = useState(initialData.whatsappNumber);
  const [sameAsContact, setSameAsContact] = useState(false);

  // Focus states for enhanced interaction
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTeacherName(initialData.teacherName);
      setDesignation(initialData.designation);
      setSubject(initialData.subject);
      setContactNumber(initialData.contactNumber);
      setWhatsappNumber(initialData.whatsappNumber);
      setSameAsContact(false);
      setFocusedField(null);
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (sameAsContact) setWhatsappNumber(contactNumber);
  }, [sameAsContact, contactNumber]);

  const handleSave = () => {
    onSave({ teacherName, designation, subject, contactNumber, whatsappNumber });
  };

  const handleCancel = () => {
    setTeacherName(initialData.teacherName);
    setDesignation(initialData.designation);
    setSubject(initialData.subject);
    setContactNumber(initialData.contactNumber);
    setWhatsappNumber(initialData.whatsappNumber);
    onClose();
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 100) onClose();
  };

  const previewInitials = getInitials(teacherName);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Scrim with fade */}
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(13, 27, 42, 0.64)',
              zIndex: 9998,
              backdropFilter: 'blur(2px)',
            }}
          />

          {/* Bottom Sheet with spring animation */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            onDragEnd={handleDragEnd}
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#FAFBFC',
              borderRadius: '24px 24px 0 0',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh',
              boxShadow: '0 -8px 32px rgba(13, 27, 42, 0.12), 0 -2px 8px rgba(13, 27, 42, 0.08)',
              touchAction: 'none',
            }}
          >
            {/* Drag Handle */}
            <div
              className="flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing"
              style={{ touchAction: 'none' }}
            >
              <motion.div
                whileHover={{ width: '48px' }}
                transition={{ duration: 0.2 }}
                style={{
                  width: '40px',
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: '#D1D5DB',
                }}
              />
            </div>

            {/* Sheet Header */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: '16px 20px 20px',
                borderBottom: '1px solid #E5E7EB',
                backgroundColor: 'white',
              }}
            >
              {/* Live avatar preview + title */}
              <div className="flex items-center gap-3">
                <motion.div
                  key={previewInitials}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#0D1B2A',
                    boxShadow: '0 2px 8px rgba(13, 27, 42, 0.16)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Noto Sans',
                      fontWeight: 700,
                      fontSize: '16px',
                      color: 'white',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {previewInitials}
                  </span>
                </motion.div>
                <div>
                  <h2
                    style={{
                      fontFamily: 'Noto Sans',
                      fontWeight: 700,
                      fontSize: '18px',
                      lineHeight: '24px',
                      color: '#0D1B2A',
                      margin: 0,
                      marginBottom: '2px',
                    }}
                  >
                    Edit Profile
                  </h2>
                  <p
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      lineHeight: '18px',
                      color: '#6B7280',
                      margin: 0,
                    }}
                  >
                    Update your information
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#E5E7EB' }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="flex items-center justify-center"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#F3F4F6',
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'background-color 0.15s',
                }}
              >
                <X size={18} color="#6B7280" />
              </motion.button>
            </div>

            {/* Scrollable Body */}
            <div
              className="overflow-y-auto"
              style={{ padding: '24px 20px 16px', flex: 1 }}
            >
              {/* ── SECTION 1: Personal Info ── */}
              <div style={{ marginBottom: '32px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '4px',
                      height: '16px',
                      backgroundColor: '#F0A500',
                      borderRadius: '2px',
                    }}
                  />
                  <h3
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#0D1B2A',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      margin: 0,
                    }}
                  >
                    Personal Info
                  </h3>
                </div>

                {/* Teacher Full Name */}
                <div className="mb-5">
                  <label
                    htmlFor="teacherName"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '8px',
                    }}
                  >
                    <User size={14} color="#F0A500" strokeWidth={2.5} />
                    Full Name
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    id="teacherName"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    onFocus={() => setFocusedField('teacherName')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="e.g. Ravi Kumar"
                    style={{
                      width: '100%',
                      height: '52px',
                      borderRadius: '12px',
                      border: focusedField === 'teacherName' ? '2px solid #F0A500' : '1.5px solid #E5E7EB',
                      backgroundColor: 'white',
                      padding: '0 16px',
                      fontFamily: 'Noto Sans',
                      fontSize: '15px',
                      color: '#0D1B2A',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: focusedField === 'teacherName' 
                        ? '0 0 0 4px rgba(240, 165, 0, 0.08)' 
                        : '0 1px 2px rgba(0, 0, 0, 0.04)',
                    }}
                  />
                </div>

                {/* Designation */}
                <div className="mb-5">
                  <label
                    htmlFor="designation"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '8px',
                    }}
                  >
                    <Briefcase size={14} color="#F0A500" strokeWidth={2.5} />
                    Designation
                  </label>
                  <div className="relative">
                    <select
                      id="designation"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      onFocus={() => setFocusedField('designation')}
                      onBlur={() => setFocusedField(null)}
                      style={{
                        width: '100%',
                        height: '52px',
                        borderRadius: '12px',
                        border: focusedField === 'designation' ? '2px solid #F0A500' : '1.5px solid #E5E7EB',
                        backgroundColor: 'white',
                        padding: '0 40px 0 16px',
                        fontFamily: 'Noto Sans',
                        fontSize: '15px',
                        color: '#0D1B2A',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        cursor: 'pointer',
                        boxShadow: focusedField === 'designation' 
                          ? '0 0 0 4px rgba(240, 165, 0, 0.08)' 
                          : '0 1px 2px rgba(0, 0, 0, 0.04)',
                      }}
                    >
                      <option value="" disabled>
                        Select designation
                      </option>
                      {DESIGNATIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <div
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '8px',
                    }}
                  >
                    <BookOpen size={14} color="#F0A500" strokeWidth={2.5} />
                    Subject / Role
                  </label>
                  <div className="relative">
                    <select
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      style={{
                        width: '100%',
                        height: '52px',
                        borderRadius: '12px',
                        border: focusedField === 'subject' ? '2px solid #F0A500' : '1.5px solid #E5E7EB',
                        backgroundColor: 'white',
                        padding: '0 40px 0 16px',
                        fontFamily: 'Noto Sans',
                        fontSize: '15px',
                        color: '#0D1B2A',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        cursor: 'pointer',
                        boxShadow: focusedField === 'subject' 
                          ? '0 0 0 4px rgba(240, 165, 0, 0.08)' 
                          : '0 1px 2px rgba(0, 0, 0, 0.04)',
                      }}
                    >
                      <option value="" disabled>
                        Select subject / role
                      </option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <div
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── SECTION 2: School Info ── */}
              <div style={{ marginBottom: '32px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '4px',
                      height: '16px',
                      backgroundColor: '#9CA3AF',
                      borderRadius: '2px',
                    }}
                  />
                  <h3
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#6B7280',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      margin: 0,
                    }}
                  >
                    School Info
                  </h3>
                </div>

                {/* School ID */}
                <div className="mb-4">
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#6B7280',
                      marginBottom: '8px',
                    }}
                  >
                    <Lock size={14} color="#9CA3AF" strokeWidth={2.5} />
                    School ID
                  </label>
                  <div
                    style={{
                      width: '100%',
                      height: '52px',
                      borderRadius: '12px',
                      border: '1.5px solid #E5E7EB',
                      backgroundColor: '#F9FAFB',
                      padding: '0 16px',
                      fontFamily: 'Noto Sans',
                      fontSize: '15px',
                      color: '#9CA3AF',
                      display: 'flex',
                      alignItems: 'center',
                      boxSizing: 'border-box',
                    }}
                  >
                    {initialData.schoolId}
                  </div>
                </div>

                {/* School Name */}
                <div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#6B7280',
                      marginBottom: '8px',
                    }}
                  >
                    <Lock size={14} color="#9CA3AF" strokeWidth={2.5} />
                    School Name
                  </label>
                  <div
                    style={{
                      width: '100%',
                      minHeight: '52px',
                      borderRadius: '12px',
                      border: '1.5px solid #E5E7EB',
                      backgroundColor: '#F9FAFB',
                      padding: '14px 16px',
                      fontFamily: 'Noto Sans',
                      fontSize: '15px',
                      lineHeight: '22px',
                      color: '#9CA3AF',
                      display: 'flex',
                      alignItems: 'center',
                      boxSizing: 'border-box',
                    }}
                  >
                    {initialData.schoolName}
                  </div>
                </div>
              </div>

              {/* ── SECTION 3: Contact Details ── */}
              <div style={{ marginBottom: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '4px',
                      height: '16px',
                      backgroundColor: '#F0A500',
                      borderRadius: '2px',
                    }}
                  />
                  <h3
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#0D1B2A',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      margin: 0,
                    }}
                  >
                    Contact Details
                  </h3>
                </div>

                {/* Contact Number */}
                <div className="mb-5">
                  <label
                    htmlFor="contactNumber"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '8px',
                    }}
                  >
                    <Phone size={14} color="#F0A500" strokeWidth={2.5} />
                    Contact Number
                  </label>
                  <div className="relative">
                    <span
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontFamily: 'Noto Sans',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#6B7280',
                        pointerEvents: 'none',
                      }}
                    >
                      +91
                    </span>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="tel"
                      id="contactNumber"
                      value={contactNumber.replace(/^\+91\s?/, '')}
                      onChange={(e) => setContactNumber('+91 ' + e.target.value)}
                      onFocus={() => setFocusedField('contactNumber')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="98765 43210"
                      style={{
                        width: '100%',
                        height: '52px',
                        borderRadius: '12px',
                        border: focusedField === 'contactNumber' ? '2px solid #F0A500' : '1.5px solid #E5E7EB',
                        backgroundColor: 'white',
                        padding: '0 16px 0 52px',
                        fontFamily: 'Noto Sans',
                        fontSize: '15px',
                        color: '#0D1B2A',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: focusedField === 'contactNumber' 
                          ? '0 0 0 4px rgba(240, 165, 0, 0.08)' 
                          : '0 1px 2px rgba(0, 0, 0, 0.04)',
                      }}
                    />
                  </div>
                </div>

                {/* WhatsApp Number */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="whatsappNumber"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: 'Noto Sans',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#374151',
                      }}
                    >
                      <MessageCircle size={14} color="#25D366" strokeWidth={2.5} />
                      WhatsApp Number
                    </label>
                    <motion.label
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 cursor-pointer"
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        backgroundColor: sameAsContact ? '#FEF3C7' : 'transparent',
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={sameAsContact}
                        onChange={(e) => setSameAsContact(e.target.checked)}
                        style={{
                          accentColor: '#F0A500',
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer',
                        }}
                      />
                      <span
                        style={{
                          fontFamily: 'Noto Sans',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: sameAsContact ? '#92400E' : '#6B7280',
                          transition: 'color 0.2s',
                        }}
                      >
                        Same as contact
                      </span>
                    </motion.label>
                  </div>
                  <div className="relative">
                    <span
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontFamily: 'Noto Sans',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#6B7280',
                        pointerEvents: 'none',
                      }}
                    >
                      +91
                    </span>
                    <motion.input
                      whileFocus={{ scale: sameAsContact ? 1 : 1.01 }}
                      type="tel"
                      id="whatsappNumber"
                      value={whatsappNumber.replace(/^\+91\s?/, '')}
                      onChange={(e) => {
                        if (!sameAsContact) setWhatsappNumber('+91 ' + e.target.value);
                      }}
                      onFocus={() => !sameAsContact && setFocusedField('whatsappNumber')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="98765 43210"
                      readOnly={sameAsContact}
                      style={{
                        width: '100%',
                        height: '52px',
                        borderRadius: '12px',
                        border: focusedField === 'whatsappNumber' ? '2px solid #F0A500' : '1.5px solid #E5E7EB',
                        backgroundColor: sameAsContact ? '#F9FAFB' : 'white',
                        padding: '0 16px 0 52px',
                        fontFamily: 'Noto Sans',
                        fontSize: '15px',
                        color: sameAsContact ? '#9CA3AF' : '#0D1B2A',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: sameAsContact ? 'not-allowed' : 'text',
                        boxShadow: focusedField === 'whatsappNumber' 
                          ? '0 0 0 4px rgba(240, 165, 0, 0.08)' 
                          : '0 1px 2px rgba(0, 0, 0, 0.04)',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Info note */}
              <div
                style={{
                  backgroundColor: '#F0F9FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  display: 'flex',
                  gap: '10px',
                  marginTop: '16px',
                }}
              >
                <Lock size={14} color="#3B82F6" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '12px',
                    lineHeight: '18px',
                    color: '#1E40AF',
                    margin: 0,
                  }}
                >
                  School ID and Name are managed by district officials and cannot be edited here.
                </p>
              </div>
            </div>

            {/* Footer — sticky action buttons */}
            <div
              style={{
                padding: '16px 20px 28px',
                borderTop: '1px solid #E5E7EB',
                display: 'flex',
                gap: '12px',
                backgroundColor: 'white',
                boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#F3F4F6' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancel}
                style={{
                  flex: 1,
                  height: '52px',
                  borderRadius: '12px',
                  border: '1.5px solid #E5E7EB',
                  backgroundColor: '#FFFFFF',
                  color: '#6B7280',
                  fontFamily: 'Noto Sans',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#0A1621' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                style={{
                  flex: 2,
                  height: '52px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#0D1B2A',
                  color: 'white',
                  fontFamily: 'Noto Sans',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 8px rgba(13, 27, 42, 0.24)',
                }}
              >
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
