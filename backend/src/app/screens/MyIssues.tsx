import { useState, useRef, useEffect } from 'react';
import { Plus, FileText, Trash2, ChevronRight } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { StaffBottomNav } from '../components/StaffBottomNav';
import { OfflineBanner } from '../components/OfflineBanner';
import { StatusChip } from '../components/StatusChip';
import { EscalationChip } from '../components/EscalationChip';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useIssues, Issue } from '../hooks/useIssues';
import { getDraft, deleteDraft } from '../utils/draftStorage';

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
    submitted: 'Submitted',
    open: 'Open',
    acknowledged: 'Acknowledged',
    in_progress: 'In Progress',
    on_hold: 'On Hold',
    needs_info: 'Needs Info',
    resolved: 'Resolved',
    dispute_filed: 'Disputed',
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
  const [activeTab, setActiveTab] = useState<'active' | 'resolved' | 'drafts' | 'all'>(
    'active'
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [draft, setDraft] = useState<any>(null);
  const [draftLoading, setDraftLoading] = useState(true);
  const [discardingDraft, setDiscardingDraft] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const navigate = useNavigate();

  // Load draft from IndexedDB
  useEffect(() => {
    getDraft().then((d) => {
      setDraft(d);
      setDraftLoading(false);
    });
  }, []);

  const handleDiscardDraft = async () => {
    setDiscardingDraft(true);
    await deleteDraft();
    setDraft(null);
    setDiscardingDraft(false);
  };

  const handleContinueDraft = () => {
    navigate('/staff/report');
  };

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

          {/* Drafts Tab */}
          <button
            onClick={() => setActiveTab('drafts')}
            className="flex-1 relative"
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              fontWeight: activeTab === 'drafts' ? 700 : 400,
              color: activeTab === 'drafts' ? '#0D1B2A' : '#6B7280',
              cursor: 'pointer',
            }}
            data-i18n="tab_drafts"
          >
            Drafts
            {activeTab === 'drafts' && (
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
        {/* DRAFTS TAB */}
        {activeTab === 'drafts' ? (
          draftLoading ? (
            <div className="flex items-center justify-center pt-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ width: '32px', height: '32px', border: '3px solid #F0A500', borderTopColor: 'transparent', borderRadius: '50%' }}
              />
            </div>
          ) : !draft ? (
            /* No Drafts */
            <div className="flex flex-col items-center justify-center px-4 pt-16">
              <div style={{ fontSize: '80px', opacity: 0.4, marginBottom: '20px' }}>📝</div>
              <h2 style={{ fontFamily: 'Noto Sans', fontSize: '18px', fontWeight: 700, color: '#0D1B2A', marginBottom: '8px', textAlign: 'center' }}>
                No Saved Drafts
              </h2>
              <p style={{ fontFamily: 'Noto Sans', fontSize: '14px', color: '#6B7280', textAlign: 'center', marginBottom: '24px', lineHeight: '1.5' }}>
                When you start reporting an issue and navigate away, it will be saved here automatically.
              </p>
              <button
                onClick={() => navigate('/staff/report')}
                style={{ height: '48px', borderRadius: '8px', backgroundColor: '#0D1B2A', border: 'none', color: 'white', fontFamily: 'Noto Sans', fontSize: '15px', fontWeight: 600, cursor: 'pointer', paddingLeft: '32px', paddingRight: '32px' }}
              >
                Start a Report
              </button>
            </div>
          ) : (
            /* Draft Card */
            <div className="p-4">
              {/* Section Header */}
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} color="#6B7280" />
                <span style={{ fontFamily: 'Noto Sans', fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>
                  1 draft saved
                </span>
              </div>

              {/* Draft Card */}
              <div
                className="bg-white"
                style={{ borderRadius: '8px', border: '1px dashed #F0A500', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}
              >
                {/* Draft Badge */}
                <div style={{ backgroundColor: '#FEF3C7', padding: '6px 16px', borderBottom: '1px solid #FDE68A' }}>
                  <span style={{ fontFamily: 'Noto Sans', fontSize: '11px', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Draft — Step {draft.step} of 4
                  </span>
                </div>

                <div className="p-4">
                  {/* Category + Title */}
                  <div className="flex items-start gap-3 mb-3">
                    <span style={{ fontSize: '28px', lineHeight: 1 }}>
                      {draft.category ? getCategoryIcon(draft.category) : '📋'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: 'Noto Sans', fontSize: '16px', fontWeight: 600, color: '#0D1B2A', lineHeight: '1.4', marginBottom: '4px' }}>
                        {draft.title || <span style={{ color: '#9CA3AF', fontStyle: 'italic' }}>Untitled issue</span>}
                      </p>
                      {draft.category && (
                        <span style={{ fontFamily: 'Noto Sans', fontSize: '12px', color: '#6B7280', textTransform: 'capitalize' }}>
                          {draft.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description preview */}
                  {draft.description && (
                    <p style={{ fontFamily: 'Noto Sans', fontSize: '13px', color: '#6B7280', lineHeight: '1.5', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {draft.description}
                    </p>
                  )}

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div style={{ height: '4px', backgroundColor: '#F3F4F6', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${((draft.step - 1) / 4) * 100}%`, backgroundColor: '#F0A500', borderRadius: '2px', transition: 'width 0.3s' }} />
                    </div>
                    <p style={{ fontFamily: 'Noto Sans', fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
                      Last updated {draft.updatedAt ? new Date(draft.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'recently'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleContinueDraft}
                      className="flex-1 flex items-center justify-center gap-2"
                      style={{ height: '44px', borderRadius: '8px', backgroundColor: '#0D1B2A', border: 'none', color: 'white', fontFamily: 'Noto Sans', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Continue Draft
                      <ChevronRight size={16} color="white" />
                    </button>
                    <button
                      onClick={handleDiscardDraft}
                      disabled={discardingDraft}
                      className="flex items-center justify-center"
                      style={{ width: '44px', height: '44px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid #E5E7EB', cursor: 'pointer', flexShrink: 0 }}
                      aria-label="Discard draft"
                    >
                      <Trash2 size={18} color={discardingDraft ? '#9CA3AF' : '#DC2626'} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Info note */}
              <p style={{ fontFamily: 'Noto Sans', fontSize: '12px', color: '#9CA3AF', textAlign: 'center', marginTop: '12px', lineHeight: '1.5' }}>
                Drafts are saved locally on your device and cleared once submitted.
              </p>
            </div>
          )
        ) : loading ? (
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
              const escalationLevel = issue.escalation_level ?? 0;

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