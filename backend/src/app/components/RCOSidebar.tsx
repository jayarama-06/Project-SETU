/**
 * SETU – RCO Desktop Sidebar
 * 240px desktop sidebar with collapsible mobile variant
 * 
 * Design Spec: Lines 751-760, AP-06
 * Desktop: 240px left sidebar
 * Mobile (<768px): Collapses to bottom nav
 */

import { CSSProperties } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useLanguage } from '../utils/languageContext';
import { t } from '../utils/translations';

interface RCOSidebarProps {
  /** User display name */
  userName?: string;
  /** User role */
  userRole?: string;
  /** Unread notifications count */
  notificationCount?: number;
  /** Callback for logout */
  onLogout?: () => void;
}

/**
 * RCOSidebar – Desktop sidebar for RCO role
 * 
 * Automatically responsive:
 * - Desktop (≥768px): 240px left sidebar
 * - Mobile (<768px): Bottom navigation bar
 * 
 * @example
 * <RCOSidebar 
 *   userName="Rajesh Kumar" 
 *   userRole="Regional Coordinator"
 *   notificationCount={5}
 *   onLogout={() => console.log('Logout')}
 * />
 */
export function RCOSidebar({
  userName = 'RCO User',
  userRole = 'Regional Coordinator',
  notificationCount = 0,
  onLogout,
}: RCOSidebarProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: '/rco/dashboard',
      icon: 'dashboard',
      label: t('nav_dashboard', language),
      key: 'nav_dashboard',
    },
    {
      path: '/rco/issue-queue',
      icon: 'format_list_bulleted',
      label: t('nav_issue_queue', language),
      key: 'nav_issue_queue',
    },
    {
      path: '/rco/analytics',
      icon: 'bar_chart',
      label: t('nav_analytics', language),
      key: 'nav_analytics',
    },
    {
      path: '/rco/directory',
      icon: 'school',
      label: t('nav_schools', language),
      key: 'nav_schools',
    },
    {
      path: '/rco/settings',
      icon: 'settings',
      label: t('nav_settings', language),
      key: 'nav_settings',
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const sidebarStyle: CSSProperties = {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    width: '240px',
    backgroundColor: '#0D1B2A',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    fontFamily: 'Noto Sans',
  };

  const headerStyle: CSSProperties = {
    padding: '24px 16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const logoStyle: CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: '#F0A500',
    marginBottom: '8px',
  };

  const userInfoStyle: CSSProperties = {
    marginTop: '16px',
  };

  const userNameStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: '4px',
  };

  const userRoleStyle: CSSProperties = {
    fontSize: '12px',
    color: '#9CA3AF',
  };

  const navStyle: CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 0',
  };

  return (
    <>
      {/* Desktop Sidebar (≥768px) */}
      <div 
        style={sidebarStyle}
        className="rco-sidebar-desktop"
      >
        {/* Header */}
        <div style={headerStyle}>
          <div style={logoStyle} data-i18n="lbl_app_name">SETU</div>
          <div style={{ fontSize: '11px', color: '#9CA3AF' }} data-i18n="lbl_app_tagline">
            Smart Escalation & Tracking
          </div>

          {/* User Info */}
          <div style={userInfoStyle}>
            <div style={userNameStyle}>{userName}</div>
            <div style={userRoleStyle}>{userRole}</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={navStyle}>
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.path)}
              onClick={() => navigate(item.path)}
              notificationCount={item.path.includes('issue-queue') ? notificationCount : undefined}
              i18nKey={item.key}
            />
          ))}
        </nav>

        {/* Logout Button */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Noto Sans',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            data-i18n="btn_log_out"
          >
            <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>
              logout
            </span>
            {t('btn_log_out', language)}
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav (<768px) */}
      <RCOBottomNav 
        navItems={navItems} 
        isActive={isActive} 
        navigate={navigate}
        notificationCount={notificationCount}
      />

      {/* Responsive Styles */}
      <style>
        {`
          /* Show desktop sidebar on desktop, hide on mobile */
          @media (max-width: 767px) {
            .rco-sidebar-desktop {
              display: none !important;
            }
          }

          /* Show mobile bottom nav only on mobile */
          .rco-bottom-nav-mobile {
            display: none;
          }

          @media (max-width: 767px) {
            .rco-bottom-nav-mobile {
              display: flex !important;
            }
          }
        `}
      </style>
    </>
  );
}

/**
 * Sidebar navigation item
 */
function SidebarNavItem({
  icon,
  label,
  isActive,
  onClick,
  notificationCount,
  i18nKey,
}: {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  notificationCount?: number;
  i18nKey: string;
}) {
  const itemStyle: CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    margin: '4px 0',
    backgroundColor: isActive ? 'rgba(240, 165, 0, 0.15)' : 'transparent',
    border: 'none',
    borderLeft: isActive ? '3px solid #F0A500' : '3px solid transparent',
    color: isActive ? '#F0A500' : '#FFFFFF',
    fontSize: '14px',
    fontWeight: isActive ? 600 : 500,
    fontFamily: 'Noto Sans',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    position: 'relative',
  };

  return (
    <button
      onClick={onClick}
      style={itemStyle}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
      data-i18n={i18nKey}
    >
      <span
        className="material-symbols-rounded"
        style={{
          fontSize: '24px',
          fontVariationSettings: isActive ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 300",
        }}
      >
        {icon}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {notificationCount !== undefined && notificationCount > 0 && (
        <span
          style={{
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: '10px',
            minWidth: '20px',
            textAlign: 'center',
          }}
        >
          {notificationCount > 99 ? '99+' : notificationCount}
        </span>
      )}
    </button>
  );
}

/**
 * Mobile bottom navigation
 */
function RCOBottomNav({
  navItems,
  isActive,
  navigate,
  notificationCount,
}: {
  navItems: any[];
  isActive: (path: string) => boolean;
  navigate: (path: string) => void;
  notificationCount: number;
}) {
  const { language } = useLanguage();

  const bottomNavStyle: CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '56px',
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #E5E7EB',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 100,
    fontFamily: 'Noto Sans',
    paddingBottom: 'env(safe-area-inset-bottom)',
  };

  // Show only first 4 items on mobile
  const mobileNavItems = navItems.slice(0, 4);

  return (
    <div style={bottomNavStyle} className="rco-bottom-nav-mobile">
      {mobileNavItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            flex: 1,
            height: '100%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            color: isActive(item.path) ? '#F0A500' : '#6B7280',
            position: 'relative',
            fontSize: '11px',
            fontWeight: isActive(item.path) ? 600 : 500,
            fontFamily: 'Noto Sans',
          }}
          data-i18n={item.key}
        >
          {/* Active Indicator */}
          {isActive(item.path) && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '2px',
                backgroundColor: '#F0A500',
              }}
            />
          )}

          {/* Icon */}
          <span
            className="material-symbols-rounded"
            style={{
              fontSize: '24px',
              fontVariationSettings: isActive(item.path) ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 300",
            }}
          >
            {item.icon}
          </span>

          {/* Label */}
          <span>{item.label}</span>

          {/* Notification Badge */}
          {item.path.includes('issue-queue') && notificationCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '8px',
                right: '50%',
                marginRight: '-20px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '9px',
                fontWeight: 700,
                padding: '2px 4px',
                borderRadius: '8px',
                minWidth: '16px',
                textAlign: 'center',
              }}
            >
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
