import { useState, useRef } from 'react';
import { Plus } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { StaffBottomNav } from '../components/StaffBottomNav';
import { OfflineBanner } from '../components/OfflineBanner';
import { StatusChip } from '../components/StatusChip';
import { EscalationChip } from '../components/EscalationChip';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useIssues, Issue } from '../hooks/useIssues';

// Category icons mapping
const getCategoryIcon = (category: string) => {
  const iconMap: { [key: string]: string } = {
    water: '💧',
    electricity: '⚡',
    building: '🏗️',
    safety: '🛡️',
    finance: '💰',
    other: '📋',
  };
  return iconMap[category.toLowerCase()] || '📋';
};

// Format status for display
const formatStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    open: 'Open',
    acknowledged: 'Acknowledged',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
    escalated: 'Escalated',
  };
  return statusMap[status] || status;
};

// Get days ago from timestamp
const getDaysAgo = (timestamp: string): number => {
  const now = Date.now();
  const diff = now - new Date(timestamp).getTime();
  return Math.floor(diff / 86400000);
};

export function MyIssues() {
  const [activeTab, setActiveTab] = useState<'active' | 'resolved' | 'all'>(
    'active'
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const navigate = useNavigate();

  // Fetch current user and their issues
  const { user, loading: userLoading } = useCurrentUser();
  const { issues, loading: issuesLoading, refetch } = useIssues({
    userId: user?.id,
    sortBy: 'created_at',
  });

  const loading = userLoading || issuesLoading;

  // Filter issues based on active tab
  const getFilteredIssues = () => {
    if (!issues) return [];
    
    if (activeTab === 'active') {
      return issues.filter(
        (issue) => issue.status !== 'resolved' && issue.status !== 'closed'
      );
    } else if (activeTab === 'resolved') {
      return issues.filter(
        (issue) => issue.status === 'resolved' || issue.status === 'closed'
      );
    }
    return issues;
  };

  const filteredIssues = getFilteredIssues();

  // Pull-to-refresh handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollContainerRef.current?.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (scrollContainerRef.current?.scrollTop === 0 && !isRefreshing) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - touchStartY.current;
      if (distance > 0 && distance <= 100) {
        setPullDistance(distance);
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 64 && !isRefreshing) {
      setIsRefreshing(true);
      // Refetch data from Supabase
      refetch().finally(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      });
    } else {
      setPullDistance(0);
    }
  };

  const handleIssueClick = (issueId: string) => {
    navigate('/staff/issues/' + issueId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      {/* Offline Banner */}
      <OfflineBanner />

      {/* App Bar - Navy 56px */}
      <div
        className="flex items-center justify-between px-4 bg-[#0D1B2A] sticky top-0 z-20"
        style={{ height: '56px' }}
      >
        <div style={{ width: '48px' }} />
        <h1
          style={{
            fontFamily: 'Noto Sans',
            fontWeight: 600,
            fontSize: '16px',
            color: 'white',
          }}
          data-i18n="scr_my_issues"
        >
          My Issues
        </h1>
        <LanguageToggle size="compact" />
      </div>

      {/* Segmented Control - 3 Tabs */}
      <div
        className="bg-white border-b border-[#E5E7EB] sticky top-[56px] z-10"
        style={{ height: '48px' }}
      >
        <div className="flex h-full">
          {/* Active Tab */}
          <button
            onClick={() => setActiveTab('active')}
            className="flex-1 relative"
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              fontWeight: activeTab === 'active' ? 700 : 400,
              color: activeTab === 'active' ? '#0D1B2A' : '#6B7280',
              cursor: 'pointer',
            }}
            data-i18n="tab_active"
          >
            Active
            {activeTab === 'active' && (
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: '2px',
                  backgroundColor: '#F0A500',
                }}
              />
            )}
          </button>

          {/* Resolved Tab */}
          <button
            onClick={() => setActiveTab('resolved')}
            className="flex-1 relative"
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              fontWeight: activeTab === 'resolved' ? 700 : 400,
              color: activeTab === 'resolved' ? '#0D1B2A' : '#6B7280',
              cursor: 'pointer',
            }}
            data-i18n="tab_resolved"
          >
            Resolved
            {activeTab === 'resolved' && (
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: '2px',
                  backgroundColor: '#F0A500',
                }}
              />
            )}
          </button>

          {/* All Tab */}
          <button
            onClick={() => setActiveTab('all')}
            className="flex-1 relative"
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              fontWeight: activeTab === 'all' ? 700 : 400,
              color: activeTab === 'all' ? '#0D1B2A' : '#6B7280',
              cursor: 'pointer',
            }}
            data-i18n="tab_all"
          >
            All
            {activeTab === 'all' && (
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: '2px',
                  backgroundColor: '#F0A500',
                }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Pull-to-refresh indicator */}
      {pullDistance > 0 && (
        <div
          className="flex items-center justify-center bg-white"
          style={{
            height: `${Math.min(pullDistance, 64)}px`,
            transition: isRefreshing ? 'none' : 'height 0.3s',
          }}
        >
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{
              duration: 1,
              repeat: isRefreshing ? Infinity : 0,
              ease: 'linear',
            }}
            style={{
              width: '24px',
              height: '24px',
              border: '3px solid #F0A500',
              borderTopColor: 'transparent',
              borderRadius: '50%',
            }}
          />
        </div>
      )}

      {/* Main Content - Scrollable */}
      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pb-[72px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {loading ? (
          /* Loading State */
          <div className="flex items-center justify-center pt-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                width: '40px',
                height: '40px',
                border: '4px solid #F0A500',
                borderTopColor: 'transparent',
                borderRadius: '50%',
              }}
            />
          </div>
        ) : filteredIssues.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center px-4 pt-16">
            <div
              style={{
                fontSize: '120px',
                opacity: 0.6,
                marginBottom: '24px',
              }}
            >
              📋
            </div>
            <h2
              className="mb-6"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '20px',
                fontWeight: 700,
                color: '#0D1B2A',
                textAlign: 'center',
              }}
              data-i18n="empty_no_issues"
            >
              No Issues Found
            </h2>
            <button
              onClick={() => navigate('/staff/report')}
              className="w-full"
              style={{
                height: '48px',
                borderRadius: '8px',
                backgroundColor: '#0D1B2A',
                border: 'none',
                color: 'white',
                fontFamily: 'Noto Sans',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              data-i18n="btn_report_new"
            >
              Report New Issue
            </button>
          </div>
        ) : (
          /* Issue Card List */
          <div className="p-4 space-y-3">
            {filteredIssues.map((issue) => {
              const categoryIcon = getCategoryIcon(issue.category);
              const daysAgo = getDaysAgo(issue.created_at);
              const escalationLevel = parseInt(issue.current_level.substring(1)); // Extract number from 'L0', 'L1', etc.

              return (
                <div
                  key={issue.id}
                  onClick={() => handleIssueClick(issue.setu_id)}
                  className="bg-white cursor-pointer"
                  style={{
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  {/* Row 1: Issue ID + Days Ago */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#0D1B2A',
                      }}
                    >
                      {issue.setu_id}
                    </span>
                    <span
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '11px',
                        color: '#9CA3AF',
                      }}
                    >
                      {daysAgo} {daysAgo === 1 ? 'day' : 'days'} ago
                    </span>
                  </div>

                  {/* Row 2: Title */}
                  <h3
                    className="mb-3"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#0D1B2A',
                      lineHeight: '1.4',
                    }}
                  >
                    {issue.title}
                  </h3>

                  {/* Row 3: Category Icon + Status Chip + Escalation Badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Category Chip */}
                    <div
                      className="flex items-center gap-1.5 px-2 py-1"
                      style={{
                        border: '1px solid #0D1B2A',
                        borderRadius: '12px',
                      }}
                    >
                      <span style={{ fontSize: '14px' }}>{categoryIcon}</span>
                      <span
                        style={{
                          fontFamily: 'Noto Sans',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#0D1B2A',
                          textTransform: 'capitalize',
                        }}
                      >
                        {issue.category}
                      </span>
                    </div>

                    {/* Status Chip */}
                    <StatusChip status={issue.status as any} size="sm" />

                    {/* Escalation Badge - Only show if escalation level > 0 */}
                    {escalationLevel > 0 && (
                      <EscalationChip level={escalationLevel} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FAB - Bottom Right */}
      <button
        onClick={() => navigate('/staff/report')}
        className="fixed bottom-[72px] right-4 flex items-center justify-center z-30"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#F0A500',
          border: 'none',
          boxShadow: '0 4px 12px rgba(240, 165, 0, 0.4)',
          cursor: 'pointer',
        }}
        data-i18n="fab_report_issue"
      >
        <Plus size={28} color="white" strokeWidth={2.5} />
      </button>

      {/* Bottom Navigation Bar */}
      <StaffBottomNav unreadNotifications={2} />
    </div>
  );
}
