import { useState } from 'react';
import { Plus, Bell, Star, SlidersHorizontal } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { StaffBottomNav } from '../components/StaffBottomNav';
import { PrincipalFilterSortModal, PrincipalFilterSortState } from '../components/PrincipalFilterSortModal';
import { mockIssues, Issue } from '../data/mockIssues';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Building2, Utensils, BookOpen, Heart, AlertTriangle } from 'lucide-react';

type QuickFilter = 'all' | 'my_reports' | 'staff_reports';
type CategoryFilter = 'all' | 'infrastructure' | 'food' | 'academic' | 'health';

const categoryIcons: Record<string, React.ReactNode> = {
  Infrastructure: <Building2 size={24} color="#0D1B2A" />,
  'Food & Nutrition': <Utensils size={24} color="#0D1B2A" />,
  Academic: <BookOpen size={24} color="#0D1B2A" />,
  'Health & Safety': <Heart size={24} color="#0D1B2A" />,
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

// Extended Issue type with principal-specific fields
interface PrincipalIssue extends Issue {
  reportedBy: string;
  reportedByCurrentUser: boolean;
  isEndorsed: boolean;
}

// Mock data for principal view
const mockPrincipalIssues: PrincipalIssue[] = mockIssues.map((issue, idx) => ({
  ...issue,
  reportedBy: idx % 3 === 0 ? 'You' : idx % 3 === 1 ? 'Ravi Kumar' : 'Lakshmi Devi',
  reportedByCurrentUser: idx % 3 === 0,
  isEndorsed: idx % 4 === 0, // Every 4th issue is endorsed
}));

export function PrincipalDashboard() {
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [hasUnreadNotifications] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterSortState, setFilterSortState] = useState<PrincipalFilterSortState>({
    sortBy: 'urgency',
    categories: [],
    reporterFilter: 'all_staff',
  });
  const navigate = useNavigate();

  // Calculate KPIs
  const totalOpen = mockPrincipalIssues.filter((i) => i.status !== 'closed' && i.status !== 'resolved').length;
  const critical = mockPrincipalIssues.filter((i) => i.urgency === 'critical').length;
  const avgResponse = 2.3; // Mock value in hours
  const overdue = mockPrincipalIssues.filter(
    (i) => i.escalation_level >= 2 && i.status !== 'closed' && i.status !== 'resolved'
  ).length;

  // Filter issues
  const getFilteredIssues = (): PrincipalIssue[] => {
    let filtered = mockPrincipalIssues;

    // Apply quick filter
    switch (quickFilter) {
      case 'my_reports':
        filtered = filtered.filter((i) => i.reportedByCurrentUser);
        break;
      case 'staff_reports':
        filtered = filtered.filter((i) => !i.reportedByCurrentUser);
        break;
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      const categoryMap: Record<CategoryFilter, string> = {
        all: '',
        infrastructure: 'Infrastructure',
        food: 'Food & Nutrition',
        academic: 'Academic',
        health: 'Health & Safety',
      };
      filtered = filtered.filter((i) => i.category === categoryMap[categoryFilter]);
    }

    // Sort by urgency
    return filtered.sort((a, b) => {
      const urgencyOrder = { critical: 3, high: 2, low: 1 };
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    });
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
              TGTWREIS Gurukulam, Adilabad
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
              onClick={() => navigate('/notifications')}
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
        onClick={() => navigate('/school-health-summary')}
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

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          <FilterChip
            label="Infrastructure"
            i18nKey="chip_category_infrastructure"
            active={categoryFilter === 'infrastructure'}
            onClick={() => setCategoryFilter(categoryFilter === 'infrastructure' ? 'all' : 'infrastructure')}
          />
          <FilterChip
            label="Food"
            i18nKey="chip_category_food"
            active={categoryFilter === 'food'}
            onClick={() => setCategoryFilter(categoryFilter === 'food' ? 'all' : 'food')}
          />
          <FilterChip
            label="Academic"
            i18nKey="chip_category_academic"
            active={categoryFilter === 'academic'}
            onClick={() => setCategoryFilter(categoryFilter === 'academic' ? 'all' : 'academic')}
          />
          <FilterChip
            label="Health"
            i18nKey="chip_category_health"
            active={categoryFilter === 'health'}
            onClick={() => setCategoryFilter(categoryFilter === 'health' ? 'all' : 'health')}
          />
        </div>
      </div>

      {/* Issue Cards List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-[80px]">
        <div className="flex flex-col gap-3">
          {filteredIssues.map((issue) => (
            <PrincipalIssueCard
              key={issue.id}
              issue={issue}
              onClick={() => navigate(`/issue/${issue.id}`)}
            />
          ))}
        </div>
      </div>

      {/* FAB - Report Issue */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/report-issue')}
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
      <StaffBottomNav />

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
  issue: PrincipalIssue;
  onClick?: () => void;
}

function PrincipalIssueCard({ issue, onClick }: PrincipalIssueCardProps) {
  const statusStyle = statusConfig[issue.status] || statusConfig.open;
  const escalationStyle = escalationConfig[issue.escalation_level] || escalationConfig[0];
  const urgencyColor = urgencyColors[issue.urgency] || urgencyColors.low;

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

      {/* Endorsed Star Badge - Top Right */}
      {issue.isEndorsed && (
        <div
          className="absolute top-3 right-3"
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#FEF3C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          data-i18n="badge_endorsed"
        >
          <Star size={14} fill="#F0A500" color="#F0A500" />
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
            #{issue.id}
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
        <span style={{ fontWeight: 600, color: issue.reportedByCurrentUser ? '#F0A500' : '#6B7280' }}>
          {issue.reportedBy}
        </span>
      </p>

      {/* Location & Time */}
      <div className="flex items-center justify-between">
        <span
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '12px',
            color: '#9CA3AF',
          }}
        >
          {issue.location}
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
