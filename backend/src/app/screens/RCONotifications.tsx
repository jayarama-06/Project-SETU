import { useState } from 'react';
import {
  PlusCircle,
  ArrowUpCircle,
  ShieldCheck,
  Gavel,
  UserCheck,
  Bell,
  X,
  Menu,
} from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { RCOSidebar } from '../components/RCOSidebar';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

interface Notification {
  id: string;
  type: 'new_issue' | 'escalation' | 'endorsed' | 'disputed' | 'assignment';
  title: string;
  body: string;
  issueId: string;
  timestamp: string;
  isRead: boolean;
}

export function RCONotifications() {
  const [filterChip, setFilterChip] = useState('all');
  const [hoveredNotificationId, setHoveredNotificationId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-001',
      type: 'new_issue',
      title: 'New Issue Reported',
      body: 'Water supply disruption in girls hostel at TGTWREIS Gurukulam, Adilabad',
      issueId: 'SETU-2851',
      timestamp: '2 minutes ago',
      isRead: false,
    },
    {
      id: 'notif-002',
      type: 'escalation',
      title: 'Auto-Escalation Triggered',
      body: 'Issue escalated to L2 due to no response within 24 hours',
      issueId: 'SETU-2850',
      timestamp: '15 minutes ago',
      isRead: false,
    },
    {
      id: 'notif-003',
      type: 'endorsed',
      title: 'Principal Endorsed Issue',
      body: 'Principal has endorsed electrical wiring safety concern as critical',
      issueId: 'SETU-2849',
      timestamp: '1 hour ago',
      isRead: false,
    },
    {
      id: 'notif-004',
      type: 'disputed',
      title: 'Resolution Disputed',
      body: 'Staff member has disputed the resolution of food quality issue',
      issueId: 'SETU-2847',
      timestamp: '2 hours ago',
      isRead: true,
    },
    {
      id: 'notif-005',
      type: 'assignment',
      title: 'Assignment Confirmed',
      body: 'Issue has been assigned to maintenance contractor for resolution',
      issueId: 'SETU-2845',
      timestamp: '3 hours ago',
      isRead: true,
    },
    {
      id: 'notif-006',
      type: 'new_issue',
      title: 'New Issue Reported',
      body: 'Library AC not working at TGTWREIS Gurukulam, Nirmal',
      issueId: 'SETU-2843',
      timestamp: '5 hours ago',
      isRead: true,
    },
    {
      id: 'notif-007',
      type: 'escalation',
      title: 'Auto-Escalation Triggered',
      body: 'Multiple hostel safety concerns escalated to L3',
      issueId: 'SETU-2842',
      timestamp: '1 day ago',
      isRead: true,
    },
    {
      id: 'notif-008',
      type: 'endorsed',
      title: 'Principal Endorsed Issue',
      body: 'Food contamination issue marked as high priority',
      issueId: 'SETU-2840',
      timestamp: '1 day ago',
      isRead: true,
    },
    {
      id: 'notif-009',
      type: 'new_issue',
      title: 'New Issue Reported',
      body: 'Broken water pipe in corridor at TGTWREIS Gurukulam, Mancherial',
      issueId: 'SETU-2839',
      timestamp: '2 days ago',
      isRead: true,
    },
    {
      id: 'notif-010',
      type: 'assignment',
      title: 'Assignment Confirmed',
      body: 'Electrical repair work assigned to certified electrician',
      issueId: 'SETU-2838',
      timestamp: '2 days ago',
      isRead: true,
    },
  ]);

  const navigate = useNavigate();

  // Get notification icon and color
  const getNotificationConfig = (type: Notification['type']) => {
    switch (type) {
      case 'new_issue':
        return {
          icon: PlusCircle,
          color: '#10B981',
          bgColor: '#D1FAE5',
          i18n: 'notif_new_issue',
        };
      case 'escalation':
        return {
          icon: ArrowUpCircle,
          color: '#F97316',
          bgColor: '#FFEDD5',
          i18n: 'notif_auto_escalate',
        };
      case 'endorsed':
        return {
          icon: ShieldCheck,
          color: '#F0A500',
          bgColor: '#FEF3C7',
          i18n: 'notif_endorsed',
        };
      case 'disputed':
        return {
          icon: Gavel,
          color: '#DC2626',
          bgColor: '#FEE2E2',
          i18n: 'notif_disputed',
        };
      case 'assignment':
        return {
          icon: UserCheck,
          color: '#4F46E5',
          bgColor: '#EEF2FF',
          i18n: 'notif_assigned',
        };
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    if (filterChip === 'all') return true;
    if (filterChip === 'unread') return !notif.isRead;
    if (filterChip === 'new_issues') return notif.type === 'new_issue';
    if (filterChip === 'escalations') return notif.type === 'escalation';
    if (filterChip === 'disputes') return notif.type === 'disputed';
    if (filterChip === 'assignments') return notif.type === 'assignment';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const handleDismiss = (notifId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
  };

  const handleNotificationClick = (issueId: string) => {
    navigate(`/rco/issues/${issueId}`);
  };

  const handleLogOut = () => {
    navigate('/rco/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* RCO Sidebar – handles both desktop sidebar and mobile bottom nav */}
      <RCOSidebar
        userName="Dr. Ramesh Kumar"
        userRole="Regional Coordinator"
        notificationCount={unreadCount}
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
              Notifications
              {unreadCount > 0 && (
                <span
                  style={{
                    marginLeft: '10px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#6B7280',
                  }}
                >
                  ({unreadCount} unread)
                </span>
              )}
            </h2>
          </div>

          {/* Right: Mark All Read + Language */}
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-4 py-2 rounded-lg hover:bg-[#F8F9FA] transition-colors"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#F0A500',
                }}
                data-i18n="btn_mark_all_read"
              >
                Mark All Read
              </button>
            )}
            <LanguageToggle size="compact" />
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {/* Filter Chips Row */}
          <div className="px-6 py-4 bg-white border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'all', label: 'All', i18n: 'chip_all' },
                { id: 'unread', label: 'Unread', i18n: 'chip_unread' },
                { id: 'new_issues', label: 'New Issues', i18n: 'chip_new_issues' },
                { id: 'escalations', label: 'Escalations', i18n: 'chip_escalations' },
                { id: 'disputes', label: 'Disputes', i18n: 'chip_disputes' },
                { id: 'assignments', label: 'Assignments', i18n: 'chip_assignments' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setFilterChip(chip.id)}
                  className="px-4 py-2 rounded-lg transition-all"
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    fontWeight: filterChip === chip.id ? 600 : 400,
                    color: filterChip === chip.id ? 'white' : '#6B7280',
                    backgroundColor: filterChip === chip.id ? '#0D1B2A' : '#F8F9FA',
                    border: filterChip === chip.id ? '1px solid #0D1B2A' : '1px solid #E5E7EB',
                  }}
                  data-i18n={chip.i18n}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notification List */}
          <div className="bg-white">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <Bell size={48} color="#D1D5DB" strokeWidth={1.5} />
                <p
                  className="mt-4"
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#9CA3AF',
                  }}
                >
                  No notifications
                </p>
                <p
                  className="mt-2"
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    color: '#D1D5DB',
                  }}
                >
                  You're all caught up!
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const config = getNotificationConfig(notif.type);
                if (!config) return null;
                const Icon = config.icon;
                const isHovered = hoveredNotificationId === notif.id;

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.issueId)}
                    onMouseEnter={() => setHoveredNotificationId(notif.id)}
                    onMouseLeave={() => setHoveredNotificationId(null)}
                    className="flex items-start gap-4 px-6 py-4 border-b border-[#E5E7EB] cursor-pointer transition-colors relative"
                    style={{
                      backgroundColor: notif.isRead ? 'white' : '#FFFBF0',
                      borderLeft: notif.isRead ? 'none' : '4px solid #F0A500',
                      paddingLeft: notif.isRead ? '24px' : '20px',
                    }}
                  >
                    {/* Icon Circle */}
                    <div
                      className="flex-shrink-0 rounded-full flex items-center justify-center"
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: config.bgColor,
                      }}
                    >
                      <Icon size={20} color={config.color} strokeWidth={2} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3
                          style={{
                            fontFamily: 'Noto Sans',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#0D1B2A',
                          }}
                          data-i18n={config.i18n}
                        >
                          {notif.title}
                        </h3>
                        <span
                          className="flex-shrink-0"
                          style={{
                            fontFamily: 'Noto Sans',
                            fontSize: '11px',
                            color: '#9CA3AF',
                          }}
                        >
                          {notif.timestamp}
                        </span>
                      </div>
                      <p
                        style={{
                          fontFamily: 'Noto Sans',
                          fontSize: '14px',
                          color: '#6B7280',
                          lineHeight: '1.5',
                          marginBottom: '8px',
                        }}
                      >
                        {notif.body}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className="inline-block px-2 py-1 rounded"
                          style={{
                            fontFamily: 'Noto Sans',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#4F46E5',
                            backgroundColor: '#EEF2FF',
                          }}
                        >
                          {notif.issueId}
                        </span>

                        {/* Dismiss Button (appears on hover) */}
                        {isHovered && (
                          <button
                            onClick={(e) => handleDismiss(notif.id, e)}
                            className="flex items-center gap-1 px-3 py-1 rounded border border-[#E5E7EB] hover:bg-[#F8F9FA] transition-colors"
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '12px',
                              fontWeight: 600,
                              color: '#6B7280',
                            }}
                          >
                            <X size={12} />
                            Dismiss
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}