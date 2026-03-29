import { useState } from 'react';
import { Plus, Bell, BadgeCheck, SlidersHorizontal } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { PrincipalBottomNav } from '../components/PrincipalBottomNav';
import { PrincipalFilterSortModal, PrincipalFilterSortState } from '../components/PrincipalFilterSortModal';
import { OfflineBanner } from '../components/OfflineBanner';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Building2, Utensils, BookOpen, Shield, AlertTriangle } from 'lucide-react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useIssues, Issue } from '../hooks/useIssues';

type QuickFilter = 'all' | 'my_reports' | 'staff_reports';

// Map database category to display icons
const categoryIcons: Record<string, React.ReactNode> = {
  water: <Building2 size={24} color="#0D1B2A" />,
  electricity: <Building2 size={24} color="#0D1B2A" />,
  building: <Building2 size={24} color="#0D1B2A" />,
  safety: <Shield size={24} color="#0D1B2A" />,
  finance: <BookOpen size={24} color="#0D1B2A" />,
  other: <AlertTriangle size={24} color="#0D1B2A" />,
};

const urgencyColors: Record<string, string> = {
  critical: '#EF4444',
  high: '#F59E0B',
  low: '#9CA3AF',
};

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  open: { bg: '#DBEAFE', text: '#1E40AF', label: 'Open' },
  acknowledged: { bg: '#E0E7FF', text: '#4338CA', label: 'Acknowledged' },
  in_progress: { bg: '#FEF3C7', text: '#D97706', label: 'In Progress' },
  resolved: { bg: '#DCFCE7', text: '#16A34A', label: 'Resolved' },
  closed: { bg: '#E5E7EB', text: '#6B7280', label: 'Closed' },
};

const escalationConfig: Record<number, { bg: string; text: string; label: string }> = {
  0: { bg: '#E5E7EB', text: '#6B7280', label: 'L0' },
  1: { bg: '#DBEAFE', text: '#1D4ED8', label: 'L1' },
  2: { bg: '#FEF3C7', text: '#D97706', label: 'L2' },
  3: { bg: '#FED7AA', text: '#C2410C', label: 'L3' },
  4: { bg: '#FECACA', text: '#B91C1C', label: 'L4' },
};

function getTimeAgo(timestamp: string): string {
  const now = Date.now();
  const diff = now - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} mins ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
}

// Calculate urgency level from score
function getUrgencyLevel(score: number): 'critical' | 'high' | 'low' {
  if (score >= 90) return 'critical';
  if (score >= 60) return 'high';
  return 'low';
}

export function PrincipalDashboard() {
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [hasUnreadNotifications] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterSortState, setFilterSortState] = useState<PrincipalFilterSortState>({
    sortBy: 'urgency',
    categories: [],
    reporterFilter: 'all_staff',
  });
  const navigate = useNavigate();

  // Fetch current user and all issues from their school
  const { user, loading: userLoading } = useCurrentUser();
  const { issues, loading: issuesLoading } = useIssues({
    schoolId: user?.school_id || undefined,
    sortBy: 'ai_urgency_score', // Changed from urgency_score
  });

  const loading = userLoading || issuesLoading;

  // Calculate KPIs from real data
  const totalOpen = issues?.filter((i) => i.status !== 'closed' && i.status !== 'resolved').length || 0;
  const critical = issues?.filter((i) => i.ai_urgency_score >= 90).length || 0; // Changed from urgency_score
  const avgResponse = 2.3; // TODO: Calculate from actual data
  const overdue = issues?.filter(
    (i) => (i.escalation_level ?? 0) >= 2 && i.status !== 'closed' && i.status !== 'resolved'
  ).length || 0;

  // Filter issues
  const getFilteredIssues = (): Issue[] => {
    if (!issues) return [];
    let filtered = issues;

    // Apply quick filter
    switch (quickFilter) {
      case 'my_reports':
        filtered = filtered.filter((i) => i.reported_by === user?.id); // Changed from created_by
        break;
      case 'staff_reports':
        filtered = filtered.filter((i) => i.reported_by !== user?.id); // Changed from created_by
        break;
    }

    // Apply category filter from modal
    if (filterSortState.categories.length > 0) {
      filtered = filtered.filter((i) => filterSortState.categories.includes(i.category));
    }

    return filtered;
  };

  const filteredIssues = getFilteredIssues();

  const handleApplyFilters = (state: PrincipalFilterSortState) => {
    setFilterSortState(state);
    // Sync quick filters with modal reporter filter
    if (state.reporterFilter === 'my_reports') {
      setQuickFilter('my_reports');
    } else if (state.reporterFilter === 'staff_only') {
      setQuickFilter('staff_reports');
    } else {
      setQuickFilter('all');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      {/* Offline Banner */}
      <OfflineBanner />

      {/* Top App Bar - Navy 56px */}
      <div
        className="bg-[#0D1B2A] sticky top-0 z-20"
        style={{ paddingTop: '8px', paddingBottom: '8px' }}
      >
        <div className="flex items-center justify-between px-4" style={{ minHeight: '40px' }}>
          <div className="flex-1">
            <h1
              className="text-white"
              style={{
                fontFamily: 'Noto Sans',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '22px',
              }}
              data-i18n="lbl_school_name_appbar"
            >
              {loading ? 'Loading...' : user?.school?.name || 'TGTWREIS School'}
            </h1>
            {/* Role chip */}
            <span
              style={{
                display: 'inline-block',
                backgroundColor: '#F0A500',
                color: '#0D1B2A',
                fontFamily: 'Noto Sans',
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                marginTop: '4px',
                letterSpacing: '0.3px',
                textTransform: 'uppercase',
              }}
              data-i18n="role_principal"
            >
              Principal
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle size="compact" />
            <button
              className="relative min-w-[48px] min-h-[48px] flex items-center justify-center"
              onClick={() => navigate('/principal/notifications')}
            >
              <Bell size={20} color="white" />
              {hasUnreadNotifications && (
                <span
                  className="absolute top-2 right-2"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#EF4444',
                  }}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* School Health Summary Strip */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/principal/school-health')}
        className="bg-white mx-4 mt-4 cursor-pointer"
        style={{
          borderRadius: '8px',
          padding: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div className="flex flex-wrap gap-2">
          {/* Total Open */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#0D1B2A',
              color: 'white',
              fontFamily: 'Noto Sans',
              fontSize: '12px',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '6px',
            }}
          >
            <span data-i18n="kpi_total_open">Total Open:</span>
            <span style={{ marginLeft: '4px', fontWeight: 700 }}>{totalOpen}</span>
          </div>

          {/* Critical */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#FEE2E2',
              color: '#B91C1C',
              fontFamily: 'Noto Sans',
              fontSize: '12px',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '6px',
            }}
          >
            <span data-i18n="kpi_critical">Critical:</span>
            <span style={{ marginLeft: '4px', fontWeight: 700 }}>{critical}</span>
          </div>

          {/* Avg Response */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#0D1B2A',
              color: 'white',
              fontFamily: 'Noto Sans',
              fontSize: '12px',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '6px',
            }}
          >
            <span data-i18n="kpi_avg_response">Avg Response:</span>
            <span style={{ marginLeft: '4px', fontWeight: 700 }}>{avgResponse}h</span>
          </div>

          {/* Overdue */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              fontFamily: 'Noto Sans',
              fontSize: '12px',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '6px',
            }}
          >
            <span data-i18n="kpi_overdue">Overdue:</span>
            <span style={{ marginLeft: '4px', fontWeight: 700 }}>{overdue}</span>
          </div>
        </div>
      </motion.div>

      {/* Filter Chips Row */}
      <div className="px-4 mt-4">
        <div className="flex items-center gap-2 mb-2">
          {/* Filter/Sort Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'white',
              color: '#0D1B2A',
              border: '1.5px solid #0D1B2A',
              borderRadius: '8px',
              padding: '8px 12px',
              fontFamily: 'Noto Sans',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              flexShrink: 0,
            }}
            data-i18n="btn_filter_sort"
          >
            <SlidersHorizontal size={16} strokeWidth={2.5} />
            <span>Filter & Sort</span>
          </motion.button>

          {/* View All Issues Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/principal/all-issues')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#F0A500',
              color: '#0D1B2A',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              fontFamily: 'Noto Sans',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              flexShrink: 0,
            }}
            data-i18n="btn_view_all_issues"
          >
            <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>
              list_alt
            </span>
            <span>View All</span>
          </motion.button>

          {/* Quick Filter Chips */}
          <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <FilterChip
              label="All Issues"
              i18nKey="chip_all_issues"
              active={quickFilter === 'all'}
              onClick={() => setQuickFilter('all')}
            />
            <FilterChip
              label="My Reports"
              i18nKey="chip_my_reports"
              active={quickFilter === 'my_reports'}
              onClick={() => setQuickFilter('my_reports')}
            />
            <FilterChip
              label="Staff Reports"
              i18nKey="chip_staff_reports"
              active={quickFilter === 'staff_reports'}
              onClick={() => setQuickFilter('staff_reports')}
            />
          </div>
        </div>
      </div>

      {/* Issue Cards List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-[80px]">
        {loading ? (
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
          <div className="flex flex-col items-center justify-center pt-16 px-4">
            <div style={{ fontSize: '80px', opacity: 0.5, marginBottom: '16px' }}>📋</div>
            <p style={{ fontFamily: 'Noto Sans', fontSize: '15px', color: '#6B7280', textAlign: 'center' }}>
              No issues found
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredIssues.map((issue) => (
              <PrincipalIssueCard
                key={issue.id}
                issue={issue}
                currentUserId={user?.id || ''}
                onClick={() => navigate(`/principal/issues/${issue.setu_id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB - Report Issue */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/principal/report')}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '16px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#F0A500',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(240, 165, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
        data-i18n="fab_report_issue"
      >
        <Plus size={28} color="#0D1B2A" strokeWidth={3} />
      </motion.button>

      {/* Bottom Navigation */}
      <PrincipalBottomNav />

      {/* Filter/Sort Modal */}
      <PrincipalFilterSortModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentState={filterSortState}
        onApply={handleApplyFilters}
      />
    </div>
  );
}

// Filter Chip Component
interface FilterChipProps {
  label: string;
  i18nKey: string;
  active: boolean;
  onClick: () => void;
}

function FilterChip({ label, i18nKey, active, onClick }: FilterChipProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        backgroundColor: active ? '#0D1B2A' : 'white',
        color: active ? 'white' : '#6B7280',
        border: `1px solid ${active ? '#0D1B2A' : '#E5E7EB'}`,
        borderRadius: '20px',
        padding: '8px 16px',
        fontFamily: 'Noto Sans',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s',
      }}
      data-i18n={i18nKey}
    >
      {label}
    </motion.button>
  );
}

// Principal Issue Card Component
interface PrincipalIssueCardProps {
  issue: Issue;
  currentUserId: string;
  onClick?: () => void;
}

function PrincipalIssueCard({ issue, currentUserId, onClick }: PrincipalIssueCardProps) {
  const statusStyle = statusConfig[issue.status] || statusConfig.open;
  const escalationLevel = issue.escalation_level ?? 0;
  const escalationStyle = escalationConfig[escalationLevel] || escalationConfig[0];
  const urgencyLevel = getUrgencyLevel(issue.ai_urgency_score); // Changed from urgency_score
  const urgencyColor = urgencyColors[urgencyLevel] || urgencyColors.low;
  const isEndorsed = issue.is_endorsed;
  const reportedByCurrentUser = issue.reported_by === currentUserId; // Changed from created_by

  return (
    <div
      className="bg-white relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      style={{
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      }}
      onClick={onClick}
    >
      {/* Left urgency border */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{ width: '4px', backgroundColor: urgencyColor }}
      />

      {/* Endorsed Badge - Top Right */}
      {isEndorsed && (
        <div
          className="absolute top-3 right-3 flex items-center justify-center"
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: '#DCFCE7',
            border: '1.5px solid #4ADE80',
          }}
          data-i18n="badge_endorsed"
          title="Principal Endorsed"
        >
          <BadgeCheck size={13} color="#166534" strokeWidth={2.5} />
        </div>
      )}

      {/* Category icon + Issue ID */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {categoryIcons[issue.category] || <AlertTriangle size={24} color="#0D1B2A" />}
          <span
            className="text-xs"
            style={{ color: '#6B7280', fontFamily: 'Noto Sans', fontSize: '11px' }}
            data-i18n="lbl_issue_id"
          >
            #{issue.setu_id}
          </span>
        </div>
        {/* Status and Escalation badges */}
        <div className="flex items-center gap-2">
          <span
            style={{
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
              fontFamily: 'Noto Sans',
              fontSize: '10px',
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: '4px',
            }}
          >
            {statusStyle.label}
          </span>
          <span
            style={{
              backgroundColor: escalationStyle.bg,
              color: escalationStyle.text,
              fontFamily: 'Noto Sans',
              fontSize: '10px',
              fontWeight: 700,
              padding: '3px 6px',
              borderRadius: '4px',
            }}
          >
            {escalationStyle.label}
          </span>
        </div>
      </div>

      {/* Issue Title */}
      <h3
        className="mb-2"
        style={{
          fontFamily: 'Noto Sans',
          fontSize: '15px',
          fontWeight: 600,
          color: '#0D1B2A',
          lineHeight: '20px',
        }}
      >
        {issue.title}
      </h3>

      {/* Issue Description */}
      <p
        className="mb-3"
        style={{
          fontFamily: 'Noto Sans',
          fontSize: '13px',
          color: '#6B7280',
          lineHeight: '18px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {issue.description}
      </p>

      {/* Reported By Caption */}
      <p
        className="mb-2"
        style={{
          fontFamily: 'Noto Sans',
          fontSize: '11px',
          color: '#9CA3AF',
          fontStyle: 'italic',
        }}
      >
        <span data-i18n="lbl_reported_by">Reported by:</span>{' '}
        <span style={{ fontWeight: 600, color: reportedByCurrentUser ? '#F0A500' : '#6B7280' }}>
          {reportedByCurrentUser ? 'You' : issue.reporter?.full_name || 'Staff Member'}
        </span>
      </p>

      {/* School & Time */}
      <div className="flex items-center justify-between">
        <span
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '12px',
            color: '#9CA3AF',
          }}
        >
          {issue.school?.name || 'School'}
        </span>
        <span
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '11px',
            color: '#9CA3AF',
          }}
        >
          {getTimeAgo(issue.created_at)}
        </span>
      </div>
    </div>
  );
}