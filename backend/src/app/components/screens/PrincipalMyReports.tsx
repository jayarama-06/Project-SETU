import { useState, useRef } from 'react';
import { Plus, Info } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { PrincipalBottomNav } from '../components/PrincipalBottomNav';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

interface Issue {
  id: string;
  title: string;
  category: string;
  status: string;
  escalationLevel: number;
  daysAgo: number;
}

// Category icons mapping
const getCategoryIcon = (category: string) => {
  const iconMap: { [key: string]: string } = {
    infrastructure: '🏗️',
    health: '⚕️',
    food: '🍽️',
    safety: '🛡️',
    academics: '📚',
    utilities: '💡',
  };
  return iconMap[category.toLowerCase()] || '📋';
};

// Status chip configuration
const getStatusConfig = (status: string) => {
  const configs: { [key: string]: { bg: string; text: string } } = {
    submitted: { bg: '#EEF2FF', text: '#4F46E5' },
    acknowledged: { bg: '#DBEAFE', text: '#2563EB' },
    in_progress: { bg: '#FEF3C7', text: '#D97706' },
    resolved_pending: { bg: '#D1FAE5', text: '#059669' },
    resolved_confirmed: { bg: '#059669', text: '#FFFFFF' },
    escalated_l1: { bg: '#DBEAFE', text: '#2563EB' },
    escalated_l2: { bg: '#FEF3C7', text: '#D97706' },
    escalated_l3: { bg: '#FED7AA', text: '#EA580C' },
    escalated_l4: { bg: '#FEE2E2', text: '#DC2626' },
  };
  return configs[status] || configs['submitted'];
};

// Format status for display
const formatStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    submitted: 'Submitted',
    acknowledged: 'Acknowledged',
    in_progress: 'In Progress',
    resolved_pending: 'Resolved (Pending)',
    resolved_confirmed: 'Resolved',
    escalated_l1: 'Escalated - L1',
    escalated_l2: 'Escalated - L2',
    escalated_l3: 'Escalated - L3',
    escalated_l4: 'Escalated - L4',
  };
  return statusMap[status] || status;
};

// Escalation level badge configuration
const getEscalationBadge = (level: number) => {
  const configs: {
    [key: number]: { bg: string; text: string; label: string };
  } = {
    0: { bg: '#F3F4F6', text: '#6B7280', label: 'L0' },
    1: { bg: '#DBEAFE', text: '#2563EB', label: 'L1' },
    2: { bg: '#FEF3C7', text: '#D97706', label: 'L2' },
    3: { bg: '#FED7AA', text: '#EA580C', label: 'L3' },
    4: { bg: '#FEE2E2', text: '#DC2626', label: 'L4' },
  };
  return configs[level] || configs[0];
};

export function PrincipalMyReports() {
  const [activeTab, setActiveTab] = useState<'active' | 'resolved' | 'all'>(
    'active'
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const navigate = useNavigate();

  // Mock data - issues filed by the Principal
  const allIssues: Issue[] = [
    {
      id: 'SETU-2850',
      title: 'Need additional security guards at main gate',
      category: 'safety',
      status: 'in_progress',
      escalationLevel: 0,
      daysAgo: 2,
    },
    {
      id: 'SETU-2848',
      title: 'Budget approval needed for library renovation',
      category: 'academics',
      status: 'escalated_l1',
      escalationLevel: 1,
      daysAgo: 5,
    },
    {
      id: 'SETU-2845',
      title: 'Staff quarters water supply issue',
      category: 'infrastructure',
      status: 'acknowledged',
      escalationLevel: 0,
      daysAgo: 7,
    },
    {
      id: 'SETU-2842',
      title: 'Medical equipment upgrade request',
      category: 'health',
      status: 'resolved_confirmed',
      escalationLevel: 0,
      daysAgo: 12,
    },
    {
      id: 'SETU-2840',
      title: 'Electricity backup generator maintenance',
      category: 'utilities',
      status: 'resolved_pending',
      escalationLevel: 0,
      daysAgo: 15,
    },
  ];

  // Filter issues based on active tab
  const getFilteredIssues = () => {
    if (activeTab === 'active') {
      return allIssues.filter(
        (issue) =>
          !issue.status.includes('resolved') && issue.status !== 'resolved_confirmed'
      );
    } else if (activeTab === 'resolved') {
      return allIssues.filter(
        (issue) =>
          issue.status === 'resolved_pending' ||
          issue.status === 'resolved_confirmed'
      );
    }
    return allIssues;
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
      // Simulate refresh
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 1500);
    } else {
      setPullDistance(0);
    }
  };

  const handleIssueClick = (issueId: string) => {
    navigate('/principal/issues/' + issueId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
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
          data-i18n="scr_my_reports"
        >
          My Reports
        </h1>
        <LanguageToggle size="compact" />
      </div>

      {/* Amber Note Strip */}
      <div
        className="bg-[#FEF3C7] px-4 py-3 flex items-start gap-2 sticky z-10"
        style={{ top: '56px' }}
      >
        <Info size={16} color="#D97706" className="flex-shrink-0 mt-0.5" />
        <p
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '12px',
            lineHeight: '1.5',
            color: '#92400E',
          }}
          data-i18n="lbl_my_reports_note"
        >
          These are issues you personally filed. Go to School-Wide Issues to see all reports.
        </p>
      </div>

      {/* Segmented Control - 3 Tabs */}
      <div
        className="bg-white border-b border-[#E5E7EB] sticky z-10"
        style={{ top: 'calc(56px + 48px)', height: '48px' }}
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
        {filteredIssues.length === 0 ? (
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
              No issues here
            </h2>
            <button
              onClick={() => navigate('/principal/report')}
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
              const statusConfig = getStatusConfig(issue.status);
              const escalationBadge = getEscalationBadge(issue.escalationLevel);
              const categoryIcon = getCategoryIcon(issue.category);

              return (
                <div
                  key={issue.id}
                  onClick={() => handleIssueClick(issue.id)}
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
                      {issue.id}
                    </span>
                    <span
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '11px',
                        color: '#9CA3AF',
                      }}
                    >
                      {issue.daysAgo} days ago
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
                    <span
                      className="inline-block px-2 py-1"
                      style={{
                        backgroundColor: statusConfig.bg,
                        color: statusConfig.text,
                        borderRadius: '12px',
                        fontFamily: 'Noto Sans',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      {formatStatus(issue.status)}
                    </span>

                    {/* Escalation Badge - Only show if escalation level > 0 */}
                    {issue.escalationLevel > 0 && (
                      <span
                        className="inline-block px-2 py-1"
                        style={{
                          backgroundColor: escalationBadge.bg,
                          color: escalationBadge.text,
                          borderRadius: '12px',
                          fontFamily: 'Noto Sans',
                          fontSize: '11px',
                          fontWeight: 700,
                        }}
                      >
                        {escalationBadge.label}
                      </span>
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
        onClick={() => navigate('/principal/report')}
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
      <PrincipalBottomNav unreadNotifications={2} />
    </div>
  );
}
