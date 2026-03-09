import { useState, useRef } from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle, CheckSquare, Gavel, Info, Trash2, BellOff } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { StaffBottomNav } from '../components/StaffBottomNav';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { useNavigate } from 'react-router';

interface Notification {
  id: string;
  issueId: string;
  type: 'acknowledged' | 'escalation' | 'resolution' | 'dispute' | 'system';
  title: string;
  action: string;
  timestamp: string;
  isRead: boolean;
}

interface NotificationsProps {
  showBackButton?: boolean;
}

// Notification type configuration
const getNotificationConfig = (type: string) => {
  const configs: {
    [key: string]: { icon: any; color: string; bg: string };
  } = {
    acknowledged: {
      icon: CheckCircle,
      color: '#059669',
      bg: '#D1FAE5',
    },
    escalation: {
      icon: AlertTriangle,
      color: '#F59E0B',
      bg: '#FEF3C7',
    },
    resolution: {
      icon: CheckSquare,
      color: '#059669',
      bg: '#D1FAE5',
    },
    dispute: {
      icon: Gavel,
      color: '#DC2626',
      bg: '#FEE2E2',
    },
    system: {
      icon: Info,
      color: '#4F46E5',
      bg: '#EEF2FF',
    },
  };
  return configs[type] || configs.system;
};

export function Notifications({ showBackButton = false }: NotificationsProps) {
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'unread' | 'escalations' | 'resolutions'
  >('all');
  const navigate = useNavigate();

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      issueId: 'SETU-2847',
      type: 'escalation',
      title: 'Broken water pipe in girls hostel',
      action: 'Escalated to L2 - District Official',
      timestamp: '2 hours ago',
      isRead: false,
    },
    {
      id: '2',
      issueId: 'SETU-2846',
      type: 'acknowledged',
      title: 'Food quality concerns in mess',
      action: 'Acknowledged by Block Official',
      timestamp: '5 hours ago',
      isRead: false,
    },
    {
      id: '3',
      issueId: 'SETU-2845',
      type: 'resolution',
      title: 'Library AC not working',
      action: 'Marked as resolved - Pending your confirmation',
      timestamp: '1 day ago',
      isRead: true,
    },
    {
      id: '4',
      issueId: 'SETU-2844',
      type: 'system',
      title: 'Safety concern at main gate',
      action: 'AI urgency score updated to 95',
      timestamp: '2 days ago',
      isRead: true,
    },
    {
      id: '5',
      issueId: 'SETU-2843',
      type: 'dispute',
      title: 'Medical supplies shortage',
      action: 'Your dispute has been reviewed',
      timestamp: '3 days ago',
      isRead: true,
    },
  ]);

  const [swipedNotificationId, setSwipedNotificationId] = useState<
    string | null
  >(null);

  // Filter notifications
  const getFilteredNotifications = () => {
    let filtered = notifications;

    if (activeFilter === 'unread') {
      filtered = notifications.filter((n) => !n.isRead);
    } else if (activeFilter === 'escalations') {
      filtered = notifications.filter((n) => n.type === 'escalation');
    } else if (activeFilter === 'resolutions') {
      filtered = notifications.filter((n) => n.type === 'resolution');
    }

    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  };

  const handleNotificationTap = (notification: Notification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );

    // Navigate to issue detail
    navigate(`/staff/issues/${notification.issueId}`);
  };

  const handleDelete = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    setSwipedNotificationId(null);
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
    notificationId: string
  ) => {
    if (info.offset.x < -100) {
      setSwipedNotificationId(notificationId);
    } else {
      setSwipedNotificationId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      {/* App Bar - Navy 56px */}
      <div
        className="flex items-center justify-between px-4 bg-[#0D1B2A] sticky top-0 z-20"
        style={{ height: '56px' }}
      >
        {showBackButton ? (
          <button
            onClick={() => navigate(-1)}
            className="min-w-[48px] min-h-[48px] flex items-center justify-center -ml-3"
            data-i18n="btn_back"
          >
            <ArrowLeft size={24} color="white" />
          </button>
        ) : (
          <div style={{ width: '48px' }} />
        )}
        <h1
          style={{
            fontFamily: 'Noto Sans',
            fontWeight: 600,
            fontSize: '16px',
            color: 'white',
          }}
          data-i18n="scr_notifications"
        >
          Notifications
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              color: 'white',
              cursor: 'pointer',
              padding: '8px',
            }}
            data-i18n="btn_mark_all_read"
          >
            Mark All Read
          </button>
          <LanguageToggle size="compact" />
        </div>
      </div>

      {/* Filter Chips Row - Scrollable Horizontal */}
      <div
        className="bg-white border-b border-[#E5E7EB] px-4 py-3 overflow-x-auto sticky top-[56px] z-10"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
          {/* All Chip */}
          <button
            onClick={() => setActiveFilter('all')}
            className="px-4 py-2 whitespace-nowrap"
            style={{
              borderRadius: '16px',
              backgroundColor:
                activeFilter === 'all' ? '#0D1B2A' : 'transparent',
              border: activeFilter === 'all' ? 'none' : '1px solid #E5E7EB',
              color: activeFilter === 'all' ? 'white' : '#6B7280',
              fontFamily: 'Noto Sans',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            data-i18n="chip_all"
          >
            All
          </button>

          {/* Unread Chip */}
          <button
            onClick={() => setActiveFilter('unread')}
            className="px-4 py-2 whitespace-nowrap"
            style={{
              borderRadius: '16px',
              backgroundColor:
                activeFilter === 'unread' ? '#0D1B2A' : 'transparent',
              border: activeFilter === 'unread' ? 'none' : '1px solid #E5E7EB',
              color: activeFilter === 'unread' ? 'white' : '#6B7280',
              fontFamily: 'Noto Sans',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            data-i18n="chip_unread"
          >
            Unread
          </button>

          {/* Escalations Chip */}
          <button
            onClick={() => setActiveFilter('escalations')}
            className="px-4 py-2 whitespace-nowrap"
            style={{
              borderRadius: '16px',
              backgroundColor:
                activeFilter === 'escalations' ? '#0D1B2A' : 'transparent',
              border:
                activeFilter === 'escalations' ? 'none' : '1px solid #E5E7EB',
              color: activeFilter === 'escalations' ? 'white' : '#6B7280',
              fontFamily: 'Noto Sans',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            data-i18n="chip_escalations"
          >
            Escalations
          </button>

          {/* Resolutions Chip */}
          <button
            onClick={() => setActiveFilter('resolutions')}
            className="px-4 py-2 whitespace-nowrap"
            style={{
              borderRadius: '16px',
              backgroundColor:
                activeFilter === 'resolutions' ? '#0D1B2A' : 'transparent',
              border:
                activeFilter === 'resolutions' ? 'none' : '1px solid #E5E7EB',
              color: activeFilter === 'resolutions' ? 'white' : '#6B7280',
              fontFamily: 'Noto Sans',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            data-i18n="chip_resolutions"
          >
            Resolutions
          </button>
        </div>
      </div>

      {/* Notification List */}
      <main className="flex-1 overflow-y-auto p-4 pb-[72px]">
        {filteredNotifications.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center pt-16">
            <BellOff size={120} color="#9CA3AF" opacity={0.6} />
            <h2
              className="mt-6"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '20px',
                fontWeight: 700,
                color: '#0D1B2A',
                textAlign: 'center',
              }}
              data-i18n="empty_notifications"
            >
              All caught up!
            </h2>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filteredNotifications.map((notification) => {
                const config = getNotificationConfig(notification.type);
                const Icon = config.icon;
                const isSwiped = swipedNotificationId === notification.id;

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.2 }}
                    className="relative overflow-hidden"
                    style={{ borderRadius: '8px' }}
                  >
                    {/* Delete Background - Revealed on Swipe */}
                    {isSwiped && (
                      <div
                        className="absolute inset-0 flex items-center justify-end pr-6"
                        style={{
                          backgroundColor: '#DC2626',
                        }}
                      >
                        <button
                          onClick={() => handleDelete(notification.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={24} color="white" />
                        </button>
                      </div>
                    )}

                    {/* Notification Card - Draggable */}
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: -150, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(event, info) =>
                        handleDragEnd(event, info, notification.id)
                      }
                      onClick={() => handleNotificationTap(notification)}
                      className="cursor-pointer"
                      style={{
                        backgroundColor: notification.isRead
                          ? 'white'
                          : '#FFFBF0',
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        borderLeft: notification.isRead
                          ? '1px solid #E5E7EB'
                          : '4px solid #F0A500',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                        padding: '16px',
                        position: 'relative',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Left: Icon in Circle */}
                        <div
                          className="flex items-center justify-center flex-shrink-0"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: config.bg,
                          }}
                        >
                          <Icon size={20} color={config.color} />
                        </div>

                        {/* Center: Text Content */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="mb-1"
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '14px',
                              color: '#0D1B2A',
                              lineHeight: '1.4',
                            }}
                          >
                            <span style={{ fontWeight: 600 }}>
                              {notification.title}
                            </span>{' '}
                            — {notification.action}
                          </p>
                          <p
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '11px',
                              color: '#6B7280',
                            }}
                          >
                            {notification.timestamp}
                          </p>
                        </div>

                        {/* Right: Issue ID Chip */}
                        <div
                          className="flex-shrink-0 px-2 py-1"
                          style={{
                            backgroundColor: '#0D1B2A',
                            borderRadius: '12px',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '10px',
                              fontWeight: 700,
                              color: 'white',
                            }}
                          >
                            {notification.issueId}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <StaffBottomNav unreadNotifications={0} />
    </div>
  );
}
