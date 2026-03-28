import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { useLanguage } from '../utils/languageContext';
import { t } from '../utils/translations';

interface PrincipalBottomNavProps {
  unreadNotifications?: number;
}

// Material Symbols Rounded icon names
const NAV_ITEMS = [
  { 
    id: 'dashboard', 
    icon: 'home', 
    path: '/principal/dashboard',
    i18nKey: 'nav_home'
  },
  { 
    id: 'my-issues', 
    icon: 'format_list_bulleted', 
    path: '/principal/my-issues',
    i18nKey: 'nav_my_reports'
  },
  { 
    id: 'notifications', 
    icon: 'notifications', 
    path: '/principal/notifications',
    i18nKey: 'nav_notifications'
  },
  { 
    id: 'settings', 
    icon: 'person', 
    path: '/principal/settings',
    i18nKey: 'nav_profile'
  },
] as const;

export function PrincipalBottomNav({ unreadNotifications = 0 }: PrincipalBottomNavProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { language } = useLanguage();

  // Derive active tab from current URL segment
  const activeId = NAV_ITEMS.find((item) => pathname.startsWith(item.path))?.id ?? 'dashboard';

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-20 flex"
      style={{ 
        height: '56px',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.08)' 
      }}
    >
      {NAV_ITEMS.map(({ id, icon, path, i18nKey }) => {
        const isActive = activeId === id;
        const label = t(i18nKey, language);
        
        return (
          <button
            key={id}
            onClick={() => navigate(path)}
            className="flex-1 flex flex-col items-center justify-center gap-[3px] relative"
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              minHeight: '48px'
            }}
          >
            {/* Active top-border indicator */}
            {isActive && (
              <motion.div
                layoutId="principalNavIndicator"
                className="absolute top-0 left-0 right-0"
                style={{ height: '2px', backgroundColor: '#F0A500' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}

            {/* Material Symbol Icon — with notification badge */}
            <div className="relative">
              <span
                className="material-symbols-rounded"
                style={{
                  fontSize: '24px',
                  color: isActive ? '#F0A500' : '#6B7280',
                  fontVariationSettings: isActive ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 300",
                }}
              >
                {icon}
              </span>
              {id === 'notifications' && unreadNotifications > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-[#EF4444] text-white"
                  style={{
                    minWidth: '16px',
                    height: '16px',
                    fontSize: '9px',
                    fontFamily: 'Noto Sans',
                    fontWeight: 700,
                    padding: '0 3px',
                  }}
                >
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </div>

            {/* Label */}
            <span
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '10px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#F0A500' : '#6B7280',
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
