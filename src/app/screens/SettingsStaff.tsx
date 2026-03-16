import { useState } from 'react';
import { ArrowLeft, Edit2, ChevronRight, Briefcase, BookOpen } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { useLanguage } from '../utils/languageContext';
import { EditProfileModal } from '../components/EditProfileModal';
import { ConfirmClearDataModal } from '../components/ConfirmClearDataModal';
import { LogoutConfirmModal } from '../components/LogoutConfirmModal';
import { StaffBottomNav } from '../components/StaffBottomNav';
import { PrincipalBottomNav } from '../components/PrincipalBottomNav';
import { toast, Toaster } from 'sonner';
import { useNavigate, useLocation } from 'react-router';
import { clearSession } from '../utils/session';

export function SettingsStaff() {
  const [notificationSettings, setNotificationSettings] = useState({
    issueAcknowledged: true,
    statusUpdated: true,
    escalationAlert: true,
    newSystemMessage: false,
  });

  const { language: currentLanguage } = useLanguage();

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    teacherName: 'Ravi Kumar',
    designation: 'Assistant Teacher',
    subject: 'Mathematics',
    schoolId: 'TRWS-WAR-0234',
    schoolName: 'Eturunagaram TRWS',
    contactNumber: '+91 98765 43210',
    whatsappNumber: '+91 98765 43210',
  });

  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false);
  const [isLogoutConfirmModalOpen, setIsLogoutConfirmModalOpen] = useState(false);

  const handleToggleNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleClearOfflineData = () => {
    setIsClearDataModalOpen(true);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogOut = async () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  const handleReportBug = () => {
    console.log('Navigating to bug report...');
    // Logic to navigate to bug report
  };

  const handleViewVersion = () => {
    console.log('Viewing version info...');
    // Logic to show version details
  };

  const handleSaveProfile = (data: {
    teacherName: string;
    designation: string;
    subject: string;
    contactNumber: string;
    whatsappNumber: string;
  }) => {
    setProfileData((prev) => ({ ...prev, ...data }));
    setIsEditProfileModalOpen(false);
    toast.success('Profile updated successfully');
  };

  const handleConfirmClearData = async () => {
    try {
      // Clear IndexedDB
      const databases = await window.indexedDB.databases();
      databases.forEach((db) => {
        if (db.name) {
          window.indexedDB.deleteDatabase(db.name);
        }
      });

      // Clear localStorage (optional - if drafts are stored there)
      localStorage.clear();

      setIsClearDataModalOpen(false);
      toast.success('Offline data cleared successfully');
    } catch (error) {
      console.error('Error clearing offline data:', error);
      toast.error('Failed to clear offline data');
    }
  };

  const handleConfirmLogout = () => {
    handleLogOut();
    setIsLogoutConfirmModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      {/* App Bar - Navy 56px */}
      <div
        className="flex items-center justify-between px-4 bg-[#0D1B2A] sticky top-0 z-20"
        style={{ height: '56px' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="min-w-[48px] min-h-[48px] flex items-center justify-center -ml-3"
          data-i18n="btn_back"
        >
          <ArrowLeft size={24} color="white" />
        </button>
        <h1
          style={{
            fontFamily: 'Noto Sans',
            fontWeight: 600,
            fontSize: '16px',
            color: 'white',
          }}
          data-i18n="scr_settings"
        >
          Profile & Settings
        </h1>
        <LanguageToggle size="compact" />
      </div>

      {/* Body - Scrollable */}
      <main
        className="flex-1 overflow-y-auto pb-[72px]"
        style={{ backgroundColor: '#F9FAFB', padding: '16px' }}
      >
        {/* Profile Card */}
        <div
          className="bg-white mb-6 relative"
          style={{
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
          }}
        >
          {/* Edit Profile Button - Top Right */}
          <button
            onClick={() => setIsEditProfileModalOpen(true)}
            className="absolute top-4 right-4 min-w-[48px] min-h-[48px] flex items-center justify-center transition-all"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '50%',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            data-i18n="btn_edit_profile"
          >
            <Edit2 size={20} color="#F0A500" strokeWidth={2} />
          </button>

          {/* Avatar Circle */}
          <div className="flex items-start gap-4">
            <div
              className="flex-shrink-0 flex items-center justify-center"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#0D1B2A',
                boxShadow: '0 4px 12px rgba(13, 27, 42, 0.2)',
              }}
            >
              <span
                style={{
                  fontFamily: 'Noto Sans',
                  fontWeight: 700,
                  fontSize: '22px',
                  color: 'white',
                  letterSpacing: '1px',
                }}
              >
                {profileData.teacherName
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean)
                  .map((w) => w[0].toUpperCase())
                  .slice(0, 2)
                  .join('')}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              {/* Teacher Name */}
              <h2
                className="mb-1"
                style={{
                  fontFamily: 'Noto Sans',
                  fontWeight: 700,
                  fontSize: '19px',
                  lineHeight: '26px',
                  color: '#0D1B2A',
                }}
              >
                {profileData.teacherName}
              </h2>

              {/* School Name */}
              <p
                className="mb-3"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#6B7280',
                }}
              >
                {profileData.schoolName}
              </p>

              {/* Chips row: Designation + Subject */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#EFF6FF',
                    color: '#1E40AF',
                    fontFamily: 'Noto Sans',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    padding: '5px 12px',
                    border: '1px solid #DBEAFE',
                  }}
                >
                  <Briefcase size={12} strokeWidth={2.5} />
                  {profileData.designation}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#FFF7ED',
                    color: '#C2410C',
                    fontFamily: 'Noto Sans',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    padding: '5px 12px',
                    border: '1px solid #FED7AA',
                  }}
                >
                  <BookOpen size={12} strokeWidth={2.5} />
                  {profileData.subject}
                </span>
              </div>

              {/* School ID */}
              <p
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  color: '#9CA3AF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    color: '#6B7280',
                  }}
                >
                  ID:
                </span>
                {profileData.schoolId}
              </p>
            </div>
          </div>
        </div>

        {/* Group 1 - Notifications */}
        <div className="mb-6">
          <h3
            className="mb-2 px-1"
            style={{
              fontFamily: 'Noto Sans',
              fontWeight: 600,
              fontSize: '12px',
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            NOTIFICATIONS
          </h3>
          <div
            className="bg-white"
            style={{
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            }}
          >
            {/* Issue Acknowledged Toggle */}
            <ToggleRow
              label="Issue Acknowledged"
              i18nKey="toggle_notif_ack"
              isOn={notificationSettings.issueAcknowledged}
              onToggle={() => handleToggleNotification('issueAcknowledged')}
            />
            <Divider />

            {/* Status Updated Toggle */}
            <ToggleRow
              label="Status Updated"
              i18nKey="toggle_notif_status"
              isOn={notificationSettings.statusUpdated}
              onToggle={() => handleToggleNotification('statusUpdated')}
            />
            <Divider />

            {/* Escalation Alert Toggle */}
            <ToggleRow
              label="Escalation Alert"
              i18nKey="toggle_notif_escalation"
              isOn={notificationSettings.escalationAlert}
              onToggle={() => handleToggleNotification('escalationAlert')}
            />
            <Divider />

            {/* New System Message Toggle */}
            <ToggleRow
              label="New System Message"
              i18nKey="toggle_notif_system"
              isOn={notificationSettings.newSystemMessage}
              onToggle={() => handleToggleNotification('newSystemMessage')}
              isLast
            />
          </div>
        </div>

        {/* Group 2 - Language & Display */}
        <div className="mb-6">
          <h3
            className="mb-2 px-1"
            style={{
              fontFamily: 'Noto Sans',
              fontWeight: 600,
              fontSize: '12px',
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            LANGUAGE & DISPLAY
          </h3>
          <div
            className="bg-white"
            style={{
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
              padding: '16px',
            }}
          >
            <p
              className="mb-3"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                color: '#0D1B2A',
                fontWeight: 600,
              }}
              data-i18n="lbl_language"
            >
              Language
            </p>

            {/* Large Language Toggle — 120 × 40 px sliding pill */}
            <div className="flex items-center gap-3">
              <LanguageToggle size="large" />
              <span
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  color: '#6B7280',
                }}
              >
                {currentLanguage === 'en'
                  ? 'English (selected)'
                  : 'తెలుగు (ఎంపిక చేయబడింది)'}
              </span>
            </div>
          </div>
        </div>

        {/* Group 3 - Offline & Sync */}
        <div className="mb-6">
          <h3
            className="mb-2 px-1"
            style={{
              fontFamily: 'Noto Sans',
              fontWeight: 600,
              fontSize: '12px',
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            OFFLINE & SYNC
          </h3>
          <div
            className="bg-white"
            style={{
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
              padding: '16px',
            }}
          >
            {/* Last Synced */}
            <p
              className="mb-3"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '13px',
                color: '#6B7280',
              }}
            >
              Last synced: 5 minutes ago
            </p>

            {/* Clear Offline Data Button */}
            <button
              onClick={handleClearOfflineData}
              style={{
                background: 'none',
                border: 'none',
                color: '#DC2626',
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
              }}
              data-i18n="btn_clear_data"
            >
              Clear Offline Data
            </button>
          </div>
        </div>

        {/* Group 4 - Account */}
        <div className="mb-6">
          <h3
            className="mb-2 px-1"
            style={{
              fontFamily: 'Noto Sans',
              fontWeight: 600,
              fontSize: '12px',
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            ACCOUNT
          </h3>
          <div
            className="bg-white"
            style={{
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
              padding: '16px',
            }}
          >
            {/* Log Out Button */}
            <button
              onClick={handleLogOut}
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: 'white',
                border: '1px solid #DC2626',
                borderRadius: '8px',
                color: '#DC2626',
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              data-i18n="btn_log_out"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Group 5 - About SETU */}
        <div className="mb-6">
          <h3
            className="mb-2 px-1"
            style={{
              fontFamily: 'Noto Sans',
              fontWeight: 600,
              fontSize: '12px',
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            ABOUT SETU
          </h3>
          <div
            className="bg-white"
            style={{
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            }}
          >
            {/* Version Row */}
            <button
              onClick={handleViewVersion}
              className="w-full flex items-center justify-between"
              style={{
                height: '48px',
                padding: '0 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              data-i18n="lbl_version"
            >
              <span
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  color: '#0D1B2A',
                }}
              >
                SETU v1.1
              </span>
              <ChevronRight size={20} color="#6B7280" />
            </button>

            <div
              style={{
                height: '1px',
                backgroundColor: '#E5E7EB',
                margin: '0 16px',
              }}
            />

            {/* Report a Bug Button */}
            <div
              style={{
                padding: '12px 16px',
              }}
            >
              <button
                onClick={handleReportBug}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
                data-i18n="btn_report_bug"
              >
                Report a Bug
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        onSave={handleSaveProfile}
        initialData={profileData}
      />

      {/* Confirm Clear Data Modal */}
      <ConfirmClearDataModal
        isOpen={isClearDataModalOpen}
        onClose={() => setIsClearDataModalOpen(false)}
        onConfirm={handleConfirmClearData}
      />

      {/* Logout Confirm Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutConfirmModalOpen}
        onClose={() => setIsLogoutConfirmModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />

      {/* Toast Notifications */}
      <Toaster position="top-center" />

      {/* Bottom Navigation Bar */}
      {location.pathname.includes('/principal') ? (
        <PrincipalBottomNav />
      ) : (
        <StaffBottomNav />
      )}
    </div>
  );
}

// Toggle Row Component
interface ToggleRowProps {
  label: string;
  i18nKey: string;
  isOn: boolean;
  onToggle: () => void;
  isLast?: boolean;
}

function ToggleRow({ label, i18nKey, isOn, onToggle, isLast }: ToggleRowProps) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        height: '48px',
        padding: '0 16px',
      }}
    >
      <span
        style={{
          fontFamily: 'Noto Sans',
          fontSize: '14px',
          color: '#0D1B2A',
        }}
        data-i18n={i18nKey}
      >
        {label}
      </span>

      {/* Material Switch */}
      <button
        onClick={onToggle}
        className="relative flex-shrink-0"
        style={{
          width: '48px',
          height: '28px',
          borderRadius: '14px',
          backgroundColor: isOn ? '#F0A500' : '#9CA3AF',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '2px',
            left: isOn ? '22px' : '2px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: 'white',
            transition: 'left 0.2s',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        />
      </button>
    </div>
  );
}

// Divider Component
function Divider() {
  return (
    <div
      style={{
        height: '1px',
        backgroundColor: '#E5E7EB',
        margin: '0 16px',
      }}
    />
  );
}
