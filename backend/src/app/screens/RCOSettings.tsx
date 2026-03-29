import { useState } from 'react';
import { Menu, AlertCircle } from 'lucide-react';
import { useLanguage } from '../utils/languageContext';
import { LanguageToggle } from '../components/LanguageToggle';
import { RCOSidebar } from '../components/RCOSidebar';
import { EditProfileModalRCO } from '../components/EditProfileModalRCO';
import { ChangePasswordModalRCO } from '../components/ChangePasswordModalRCO';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export function RCOSettings() {
  const { language } = useLanguage();
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  const navigate = useNavigate();

  // Profile data
  const [profile, setProfile] = useState({
    officialId: 'RCO-ADL-2024-001',
    displayName: 'Dr. Ramesh Kumar',
    role: 'Regional Coordination Officer',
    jurisdiction: 'District: Adilabad, Telangana',
    contactNumber: '+91 98765 43210',
    whatsappNumber: '+91 98765 43210',
    email: 'ramesh.kumar@tgtwreis.in',
  });

  // Notification toggles for RCO-specific types
  const [notificationToggles, setNotificationToggles] = useState({
    newIssues: true,
    escalations: true,
    endorsements: true,
    disputes: true,
    assignments: true,
    resolutionUpdates: true,
    schoolAlerts: true,
    systemUpdates: false,
  });

  const handleToggleNotification = (key: keyof typeof notificationToggles) => {
    setNotificationToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveProfile = (updatedProfile: {
    displayName: string;
    contactNumber: string;
    whatsappNumber: string;
    email: string;
  }) => {
    setProfile((prev) => ({
      ...prev,
      ...updatedProfile,
    }));
  };

  const handleLogOut = () => {
    navigate('/rco/login');
  };

  const handleReportBug = () => {
    alert('Bug report form would open here. You can report issues via email or in-app form.');
  };

  // Get user initials
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* RCO Sidebar – handles both desktop sidebar and mobile bottom nav */}
      <RCOSidebar
        userName={profile.displayName}
        userRole={profile.role}
        notificationCount={0}
        onLogout={handleLogOut}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-[240px]">
        {/* Top Bar */}
        <div
          className="bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between sticky top-0 z-30"
          style={{ height: '64px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
        >
          {/* Left: Mobile Menu + Title */}
          <div className="flex items-center gap-4">
            <div
              className="lg:hidden min-w-[48px] min-h-[48px] flex items-center justify-center"
            >
              <Menu size={24} color="#0D1B2A" />
            </div>
            <h2
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '18px',
                fontWeight: 600,
                color: '#0D1B2A',
              }}
            >
              Settings
            </h2>
          </div>

          {/* Right: Language Toggle */}
          <LanguageToggle size="compact" />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header */}
          <h1
            className="mb-8"
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '24px',
              fontWeight: 700,
              color: '#0D1B2A',
            }}
            data-i18n="scr_settings"
          >
            Settings
          </h1>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-[360px,1fr] gap-6">
            {/* Left Column: Profile Card */}
            <div
              className="bg-white rounded-lg p-6 border border-[#E5E7EB] h-fit"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
            >
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div
                  className="rounded-full flex items-center justify-center mb-4"
                  style={{ width: '64px', height: '64px', backgroundColor: '#0D1B2A' }}
                >
                  <span
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '24px',
                      fontWeight: 700,
                      color: 'white',
                    }}
                  >
                    {getInitials(profile.displayName)}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                    textAlign: 'center',
                    marginBottom: '8px',
                  }}
                >
                  {profile.displayName}
                </h3>

                <div
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#0D1B2A', marginBottom: '12px' }}
                  data-i18n="role_rco"
                >
                  <span
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    Regional Coordination Officer
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    color: '#6B7280',
                    textAlign: 'center',
                    marginBottom: '4px',
                  }}
                >
                  {profile.jurisdiction}
                </p>

                <p style={{ fontFamily: 'Noto Sans', fontSize: '11px', color: '#6B7280' }}>
                  Official ID: {profile.officialId}
                </p>
              </div>

              {/* Edit Profile Button */}
              <button
                onClick={() => setEditProfileModalOpen(true)}
                className="w-full py-3 rounded-lg border-2 border-[#0D1B2A] hover:bg-[#F8F9FA] transition-colors"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#0D1B2A',
                  height: '48px',
                }}
                data-i18n="btn_edit_profile"
              >
                Edit Profile
              </button>
            </div>

            {/* Right Column: Settings Sections */}
            <div className="space-y-6">
              {/* Group 1: Notifications */}
              <div
                className="bg-white rounded-lg p-6 border border-[#E5E7EB]"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
              >
                <h3
                  className="mb-4"
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                  }}
                >
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'newIssues', label: 'New Issues from Schools' },
                    { key: 'escalations', label: 'Auto-Escalations' },
                    { key: 'endorsements', label: 'Principal Endorsements' },
                    { key: 'disputes', label: 'Resolution Disputes' },
                    { key: 'assignments', label: 'Task Assignments' },
                    { key: 'resolutionUpdates', label: 'Resolution Status Updates' },
                    { key: 'schoolAlerts', label: 'School-Level Alerts' },
                    { key: 'systemUpdates', label: 'System Maintenance Updates' },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between py-3 border-b border-[#E5E7EB] last:border-0"
                    >
                      <span
                        style={{
                          fontFamily: 'Noto Sans',
                          fontSize: '14px',
                          color: '#0D1B2A',
                        }}
                      >
                        {item.label}
                      </span>
                      <button
                        onClick={() =>
                          handleToggleNotification(
                            item.key as keyof typeof notificationToggles
                          )
                        }
                        className="relative rounded-full transition-colors"
                        style={{
                          width: '48px',
                          height: '24px',
                          backgroundColor: notificationToggles[
                            item.key as keyof typeof notificationToggles
                          ]
                            ? '#F0A500'
                            : '#D1D5DB',
                        }}
                      >
                        <motion.div
                          className="absolute top-1 rounded-full bg-white"
                          style={{ width: '20px', height: '20px' }}
                          animate={{
                            left: notificationToggles[
                              item.key as keyof typeof notificationToggles
                            ]
                              ? '26px'
                              : '2px',
                          }}
                          transition={{ duration: 0.2 }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 2: Language & Display */}
              <div
                className="bg-white rounded-lg p-6 border border-[#E5E7EB]"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
              >
                <h3
                  className="mb-4"
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                  }}
                >
                  Language & Display
                </h3>
                <div>
                  <label
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#0D1B2A',
                      display: 'block',
                      marginBottom: '12px',
                    }}
                  >
                    App Language
                  </label>
                  <div className="flex items-center gap-4">
                    <LanguageToggle size="large" />
                    <span
                      style={{ fontFamily: 'Noto Sans', fontSize: '13px', color: '#6B7280' }}
                    >
                      {language === 'en'
                        ? 'English (selected)'
                        : 'తెలుగు (ఎంపిక చేయబడింది)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Group 3: Account Security */}
              <div
                className="bg-white rounded-lg p-6 border border-[#E5E7EB]"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
              >
                <h3
                  className="mb-4"
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                  }}
                >
                  Account Security
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setChangePasswordModalOpen(true)}
                    className="w-full py-3 rounded-lg border-2 border-[#0D1B2A] hover:bg-[#F8F9FA] transition-colors text-left px-4"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#0D1B2A',
                      height: '48px',
                    }}
                    data-i18n="btn_change_password"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={handleLogOut}
                    className="w-full py-3 rounded-lg border-2 border-[#DC2626] hover:bg-[#FEE2E2] transition-colors text-left px-4"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#DC2626',
                      height: '48px',
                    }}
                    data-i18n="btn_log_out"
                  >
                    Log Out
                  </button>
                </div>
              </div>

              {/* Group 4: About SETU */}
              <div
                className="bg-white rounded-lg p-6 border border-[#E5E7EB]"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
              >
                <h3
                  className="mb-4"
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                  }}
                >
                  About SETU
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span
                      style={{ fontFamily: 'Noto Sans', fontSize: '14px', color: '#6B7280' }}
                      data-i18n="lbl_version"
                    >
                      Version
                    </span>
                    <span
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#0D1B2A',
                      }}
                    >
                      1.0.0 (Build 2026.03)
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span
                      style={{ fontFamily: 'Noto Sans', fontSize: '14px', color: '#6B7280' }}
                    >
                      License
                    </span>
                    <span
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#0D1B2A',
                      }}
                    >
                      Government of Telangana
                    </span>
                  </div>
                  <button
                    onClick={handleReportBug}
                    className="w-full py-3 rounded-lg border border-[#E5E7EB] hover:bg-[#F8F9FA] transition-colors flex items-center justify-center gap-2"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#6B7280',
                      height: '48px',
                    }}
                    data-i18n="btn_report_bug"
                  >
                    <AlertCircle size={18} />
                    <span>Report a Bug</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <EditProfileModalRCO
        isOpen={editProfileModalOpen}
        onClose={() => setEditProfileModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      <ChangePasswordModalRCO
        isOpen={changePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
      />
    </div>
  );
}