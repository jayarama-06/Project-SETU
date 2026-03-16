import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Search, X, ChevronDown } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { OfflineBanner } from '../components/OfflineBanner';
import { StaffSelectorModal } from '../components/StaffSelectorModal';
import { mockIssues, Issue } from '../data/mockIssues';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router';
import { Building2, Utensils, BookOpen, Heart, AlertTriangle, Star } from 'lucide-react';

type StatusFilter = 'all' | 'open' | 'pending' | 'resolved' | 'disputed';
type SortOption = 'urgency' | 'date' | 'updated';

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

// Extended Issue type with reporter info
interface SchoolIssue extends Issue {
  reportedBy: string;
  reportedByCurrentUser: boolean;
  isEndorsed: boolean;
  reporterStaffId: string;
}

// Mock data with reporter info
const mockSchoolIssues: SchoolIssue[] = mockIssues.map((issue, idx) => ({
  ...issue,
  reportedBy: idx % 3 === 0 ? 'Ravi Kumar' : idx % 3 === 1 ? 'Lakshmi Devi' : 'Suresh Reddy',
  reportedByCurrentUser: idx % 5 === 0,
  isEndorsed: idx % 4 === 0,
  reporterStaffId: String((idx % 8) + 1),
}));

export function SchoolWideIssues() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('urgency');
  const [isStaffSelectorOpen, setIsStaffSelectorOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle incoming filter from Staff Activity screen
  useEffect(() => {
    if (location.state && location.state.filterStaff) {
      setSelectedStaffIds(location.state.filterStaff);
    }
  }, [location.state]);

  // Filter and sort issues
  const getFilteredIssues = (): SchoolIssue[] => {
    let filtered = mockSchoolIssues;

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(query) ||
          issue.description.toLowerCase().includes(query) ||
          issue.id.toLowerCase().includes(query) ||
          issue.category.toLowerCase().includes(query) ||
          issue.reportedBy.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    switch (statusFilter) {
      case 'open':
        filtered = filtered.filter((i) => i.status === 'open');
        break;
      case 'pending':
        filtered = filtered.filter((i) => i.status === 'acknowledged' || i.status === 'in_progress');
        break;
      case 'resolved':
        filtered = filtered.filter((i) => i.status === 'resolved' || i.status === 'closed');
        break;
      case 'disputed':
        // Mock disputed status - for now filter by high escalation
        filtered = filtered.filter((i) => i.escalation_level >= 3);
        break;
    }

    // Apply staff filter
    if (selectedStaffIds.length > 0) {
      filtered = filtered.filter((issue) => selectedStaffIds.includes(issue.reporterStaffId));
    }

    // Apply sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case 'urgency':
        sorted.sort((a, b) => {
          const urgencyOrder = { critical: 3, high: 2, low: 1 };
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        });
        break;
      case 'date':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'updated':
        // For now, same as date - in real app would use updated_at field
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return sorted;
  };

  const filteredIssues = getFilteredIssues();

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSelectedStaffIds([]);
    setSortBy('urgency');
  };

  const handlePullToRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const sortOptions = [
    { value: 'urgency' as SortOption, label: 'Urgency', i18n: 'sort_urgency' },
    { value: 'date' as SortOption, label: 'Date Added', i18n: 'sort_date' },
    { value: 'updated' as SortOption, label: 'Last Updated', i18n: 'sort_updated' },
  ];

  const activeSortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label || 'Urgency';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      {/* Offline Banner */}
      <OfflineBanner />

      {/* App Bar - Navy */}
      <div
        className="bg-[#0D1B2A] sticky top-0 z-20"
        style={{ minHeight: '56px', display: 'flex', alignItems: 'center', padding: '0 16px' }}
      >
        <button
          className="min-w-[48px] min-h-[48px] flex items-center justify-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} color="white" />
        </button>
        <h1
          className="flex-1 text-white"
          style={{
            fontFamily: 'Noto Sans',
            fontWeight: 600,
            fontSize: '16px',
            marginLeft: '8px',
          }}
          data-i18n="scr_all_issues"
        >
          All School Issues
        </h1>
        <LanguageToggle size="compact" />
      </div>

      {/* Search Bar - Pinned */}
      <div
        className="bg-white sticky z-10"
        style={{ top: '56px', borderBottom: '1px solid #E5E7EB', padding: '12px 16px' }}
      >
        <div
          className="flex items-center gap-3"
          style={{
            backgroundColor: '#F3F4F6',
            borderRadius: '8px',
            padding: '12px 16px',
            minHeight: '48px',
          }}
        >
          <Search size={20} color="#6B7280" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issues, IDs, categories…"
            data-i18n="placeholder_search_issues"
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'Noto Sans',
              fontSize: '15px',
              color: '#0D1B2A',
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="min-w-[24px] min-h-[24px]">
              <X size={18} color="#9CA3AF" />
            </button>
          )}
        </div>

        {/* Issue Count */}
        <p
          className="mt-2"
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '13px',
            color: '#6B7280',
          }}
        >
          <span data-i18n="lbl_showing_count">Showing</span>{' '}
          <span style={{ fontWeight: 600, color: '#0D1B2A' }}>{filteredIssues.length}</span>{' '}
          <span>issues</span>
        </p>
      </div>

      {/* Filter Row + Sort Toggle */}
      <div
        className="bg-white sticky z-10"
        style={{ top: '152px', borderBottom: '1px solid #E5E7EB', padding: '12px 16px' }}
      >
        <div className="flex items-center gap-2">
          {/* Filter Chips - Scrollable */}
          <div className="flex-1 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {/* Status Filters */}
            <StatusChip
              label="Open"
              i18nKey="status_open"
              active={statusFilter === 'open'}
              onClick={() => setStatusFilter(statusFilter === 'open' ? 'all' : 'open')}
            />
            <StatusChip
              label="Pending"
              i18nKey="status_pending"
              active={statusFilter === 'pending'}
              onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
            />
            <StatusChip
              label="Resolved"
              i18nKey="status_resolved"
              active={statusFilter === 'resolved'}
              onClick={() => setStatusFilter(statusFilter === 'resolved' ? 'all' : 'resolved')}
            />
            <StatusChip
              label="Disputed"
              i18nKey="status_disputed"
              active={statusFilter === 'disputed'}
              onClick={() => setStatusFilter(statusFilter === 'disputed' ? 'all' : 'disputed')}
            />

            {/* Filter by Staff Chip */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsStaffSelectorOpen(true)}
              style={{
                backgroundColor: selectedStaffIds.length > 0 ? '#FEF3C7' : 'white',
                color: selectedStaffIds.length > 0 ? '#92400E' : '#6B7280',
                border: `1.5px solid ${selectedStaffIds.length > 0 ? '#F0A500' : '#E5E7EB'}`,
                borderRadius: '20px',
                padding: '8px 16px',
                fontFamily: 'Noto Sans',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
              data-i18n="filter_by_staff"
            >
              {selectedStaffIds.length > 0
                ? `Staff (${selectedStaffIds.length})`
                : 'Filter by Staff'}
            </motion.button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
              className="flex items-center gap-1"
              style={{
                backgroundColor: 'white',
                border: '1.5px solid #E5E7EB',
                borderRadius: '8px',
                padding: '8px 12px',
                minHeight: '36px',
                fontFamily: 'Noto Sans',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0D1B2A',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <span data-i18n="lbl_sort">Sort:</span>
              <span style={{ color: '#F0A500', marginLeft: '2px' }}>{activeSortLabel}</span>
              <ChevronDown size={14} color="#6B7280" />
            </motion.button>

            {/* Sort Dropdown Menu */}
            <AnimatePresence>
              {isSortMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsSortMenuOpen(false)}
                  />
                  {/* Menu */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 bg-white z-30"
                    style={{
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                      minWidth: '180px',
                      overflow: 'hidden',
                    }}
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortMenuOpen(false);
                        }}
                        className="w-full text-left"
                        style={{
                          padding: '12px 16px',
                          fontFamily: 'Noto Sans',
                          fontSize: '15px',
                          fontWeight: sortBy === option.value ? 600 : 400,
                          color: sortBy === option.value ? '#F0A500' : '#0D1B2A',
                          backgroundColor: sortBy === option.value ? '#FEF3C7' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s',
                        }}
                        data-i18n={option.i18n}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Pull to Refresh Indicator */}
      {isRefreshing && (
        <div className="flex justify-center py-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '24px',
              height: '24px',
              border: '3px solid #FEF3C7',
              borderTopColor: '#F0A500',
              borderRadius: '50%',
            }}
          />
        </div>
      )}

      {/* Issue Cards List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-[80px]">
        {filteredIssues.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Search size={32} color="#9CA3AF" />
            </div>
            <p
              className="text-center mb-6"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '16px',
                fontWeight: 600,
                color: '#6B7280',
                lineHeight: '24px',
              }}
              data-i18n="empty_no_match"
            >
              No issues match your filters
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResetFilters}
              style={{
                backgroundColor: '#0D1B2A',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontFamily: 'Noto Sans',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: '48px',
              }}
              data-i18n="btn_reset_filters"
            >
              Reset Filters
            </motion.button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredIssues.map((issue) => (
              <SchoolIssueCard
                key={issue.id}
                issue={issue}
                onClick={() => navigate(`/principal/issues/${issue.id}`)}
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
          bottom: '24px',
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

      {/* Staff Selector Modal */}
      <StaffSelectorModal
        isOpen={isStaffSelectorOpen}
        onClose={() => setIsStaffSelectorOpen(false)}
        selectedStaffIds={selectedStaffIds}
        onApply={setSelectedStaffIds}
      />
    </div>
  );
}

// Status Chip Component
interface StatusChipProps {
  label: string;
  i18nKey: string;
  active: boolean;
  onClick: () => void;
}

function StatusChip({ label, i18nKey, active, onClick }: StatusChipProps) {
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
        flexShrink: 0,
      }}
      data-i18n={i18nKey}
    >
      {label}
    </motion.button>
  );
}

// School Issue Card Component
interface SchoolIssueCardProps {
  issue: SchoolIssue;
  onClick?: () => void;
}

function SchoolIssueCard({ issue, onClick }: SchoolIssueCardProps) {
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