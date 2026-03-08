import { useState } from 'react';
import { Bell, Plus, Home, List, User, SlidersHorizontal } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { SchoolStaffIssueCard } from '../components/SchoolStaffIssueCard';
import { FilterSortModal, FilterSortState } from '../components/FilterSortModal';
import { mockIssues, Issue } from '../data/mockIssues';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

type FilterType = 'all' | 'critical' | 'pending' | 'resolved';
type NavTab = 'home' | 'issues' | 'notifications' | 'profile';

export function SchoolStaffDashboard() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterSortState, setFilterSortState] = useState<FilterSortState>({
    sortBy: 'urgency',
    categories: [],
  });
  const navigate = useNavigate();

  // Calculate stats
  const openCount = mockIssues.filter((i) => i.status === 'open').length;
  const pendingCount = mockIssues.filter(
    (i) => i.status === 'acknowledged' || i.status === 'in_progress'
  ).length;
  const resolvedCount = mockIssues.filter((i) => i.status === 'resolved' || i.status === 'closed').length;

  // Filter and sort issues
  const getFilteredIssues = (): Issue[] => {
    let filtered = mockIssues;

    // Apply quick filter
    switch (activeFilter) {
      case 'critical':
        filtered = filtered.filter((i) => i.urgency === 'critical');
        break;
      case 'pending':
        filtered = filtered.filter((i) => i.status === 'acknowledged' || i.status === 'in_progress');
        break;
      case 'resolved':
        filtered = filtered.filter((i) => i.status === 'resolved' || i.status === 'closed');
        break;
    }

    // Apply category filter if any selected
    if (filterSortState.categories.length > 0) {
      // Note: This is a simplified implementation - you'd need to map category values to issue categories
      // For now, we'll keep all issues since mock data uses different category names
    }

    // Apply sorting
    const sorted = [...filtered];
    switch (filterSortState.sortBy) {
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
        // For now, same as date - in real app, you'd have updated_at field
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return sorted;
  };

  const filteredIssues = getFilteredIssues();

  const handleFilterApply = (newState: FilterSortState) => {
    setFilterSortState(newState);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      {/* Top App Bar - Navy 56px */}
      <div
        className="flex items-center justify-between px-4 bg-[#0D1B2A] sticky top-0 z-10"
        style={{ height: '56px' }}
      >
        <h1
          className="text-white"
          style={{
            fontFamily: 'Noto Sans',
            fontWeight: 600,
            fontSize: '16px',
          }}
          data-i18n="lbl_school_name_appbar"
        >
          TGTWREIS Gurukulam, Adilabad
        </h1>
        <div className="flex items-center gap-3">
          <LanguageToggle size="compact" />
          <button
            className="relative min-w-[48px] min-h-[48px] flex items-center justify-center"
            data-i18n="btn_notifications"
          >
            <Bell size={24} color="white" />
            <span
              className="absolute top-2 right-2 w-2 h-2 rounded-full"
              style={{ backgroundColor: '#EF4444' }}
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {/* Summary Stats Row */}
        <div className="flex items-center gap-2 px-4 py-3">
          {/* Open */}
          <div
            className="flex-1"
            style={{
              backgroundColor: '#0D1B2A',
              borderRadius: '8px',
              padding: '12px',
            }}
          >
            <span
              className="text-white"
              style={{ fontFamily: 'Noto Sans', fontSize: '14px', fontWeight: 500 }}
              data-i18n="lbl_open_count"
            >
              Open: {openCount}
            </span>
          </div>

          {/* Pending */}
          <div
            className="flex-1"
            style={{
              backgroundColor: '#FEF3C7',
              borderRadius: '8px',
              padding: '12px',
            }}
          >
            <span
              style={{
                color: '#0D1B2A',
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                fontWeight: 500,
              }}
              data-i18n="lbl_pending_count"
            >
              Pending: {pendingCount}
            </span>
          </div>

          {/* Resolved */}
          <div
            className="flex-1"
            style={{
              backgroundColor: '#DCFCE7',
              borderRadius: '8px',
              padding: '12px',
            }}
          >
            <span
              style={{
                color: '#0D1B2A',
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                fontWeight: 500,
              }}
              data-i18n="lbl_resolved_count"
            >
              Resolved: {resolvedCount}
            </span>
          </div>
        </div>

        {/* Filter Chips Row - Horizontally Scrollable */}
        <div className="overflow-x-auto px-4 py-2 scrollbar-hide">
          <div className="flex gap-2 pb-1">
            {(['all', 'critical', 'pending', 'resolved'] as const).map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className="shrink-0 min-h-[48px] px-4 py-2 transition-colors"
                  style={{
                    backgroundColor: isActive ? '#0D1B2A' : 'white',
                    color: isActive ? 'white' : '#0D1B2A',
                    border: isActive ? 'none' : '1px solid #0D1B2A',
                    borderRadius: '8px',
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                  data-i18n={`chip_${filter}`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter/Sort Button */}
        <div className="px-4 py-2 flex justify-end">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 min-h-[48px] px-4 py-2 transition-colors hover:bg-[#E5E7EB]"
            style={{
              backgroundColor: 'transparent',
              color: '#0D1B2A',
              border: 'none',
              borderRadius: '8px',
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              fontWeight: 500,
            }}
            data-i18n="btn_filter_sort"
          >
            <SlidersHorizontal size={20} color="#0D1B2A" />
            Filter / Sort
          </button>
        </div>

        {/* Issue Cards List */}
        <div className="px-4 space-y-2 mt-2">
          {filteredIssues.map((issue, index) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <SchoolStaffIssueCard
                issue={issue}
                onClick={() => navigate('/staff/issues/' + issue.id)}
              />
            </motion.div>
          ))}

          {filteredIssues.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#6B7280]" style={{ fontFamily: 'Noto Sans' }}>
                No issues found
              </p>
            </div>
          )}
        </div>
      </main>

      {/* FAB - 56px Saffron Circle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed flex items-center justify-center z-20"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#F0A500',
          bottom: 'calc(56px + 16px)',
          right: '16px',
          boxShadow: '0 4px 12px rgba(240, 165, 0, 0.3)',
        }}
        onClick={() => navigate('/staff/report')}
        data-i18n="fab_report_issue"
      >
        <Plus size={24} color="#0D1B2A" strokeWidth={2.5} />
      </motion.button>

      {/* Bottom Navigation Bar - 56px height */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around bg-white border-t z-10"
        style={{ height: '56px', borderColor: '#E5E7EB' }}
      >
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex flex-col items-center justify-center gap-1 min-w-[60px] min-h-[48px] relative"
          data-i18n="nav_home"
        >
          <Home
            size={24}
            color={activeTab === 'home' ? '#F0A500' : '#6B7280'}
            fill={activeTab === 'home' ? '#F0A500' : 'none'}
            strokeWidth={2}
          />
          <span
            className="text-xs"
            style={{
              color: activeTab === 'home' ? '#F0A500' : '#6B7280',
              fontFamily: 'Noto Sans',
              fontSize: '11px',
            }}
          >
            Home
          </span>
          {activeTab === 'home' && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute bottom-0 left-0 right-0"
              style={{ height: '2px', backgroundColor: '#F0A500' }}
            />
          )}
        </button>

        {/* My Issues */}
        <button
          onClick={() => setActiveTab('issues')}
          className="flex flex-col items-center justify-center gap-1 min-w-[60px] min-h-[48px] relative"
          data-i18n="nav_my_issues"
        >
          <List size={24} color={activeTab === 'issues' ? '#F0A500' : '#6B7280'} strokeWidth={2} />
          <span
            className="text-xs"
            style={{
              color: activeTab === 'issues' ? '#F0A500' : '#6B7280',
              fontFamily: 'Noto Sans',
              fontSize: '11px',
            }}
          >
            My Issues
          </span>
          {activeTab === 'issues' && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute bottom-0 left-0 right-0"
              style={{ height: '2px', backgroundColor: '#F0A500' }}
            />
          )}
        </button>

        {/* Notifications */}
        <button
          onClick={() => setActiveTab('notifications')}
          className="flex flex-col items-center justify-center gap-1 min-w-[60px] min-h-[48px] relative"
          data-i18n="nav_notifications"
        >
          <div className="relative">
            <Bell
              size={24}
              color={activeTab === 'notifications' ? '#F0A500' : '#6B7280'}
              strokeWidth={2}
            />
            <span
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: '#EF4444' }}
            />
          </div>
          <span
            className="text-xs"
            style={{
              color: activeTab === 'notifications' ? '#F0A500' : '#6B7280',
              fontFamily: 'Noto Sans',
              fontSize: '11px',
            }}
          >
            Notifications
          </span>
          {activeTab === 'notifications' && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute bottom-0 left-0 right-0"
              style={{ height: '2px', backgroundColor: '#F0A500' }}
            />
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className="flex flex-col items-center justify-center gap-1 min-w-[60px] min-h-[48px] relative"
          data-i18n="nav_profile"
        >
          <User
            size={24}
            color={activeTab === 'profile' ? '#F0A500' : '#6B7280'}
            strokeWidth={2}
          />
          <span
            className="text-xs"
            style={{
              color: activeTab === 'profile' ? '#F0A500' : '#6B7280',
              fontFamily: 'Noto Sans',
              fontSize: '11px',
            }}
          >
            Profile
          </span>
          {activeTab === 'profile' && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute bottom-0 left-0 right-0"
              style={{ height: '2px', backgroundColor: '#F0A500' }}
            />
          )}
        </button>
      </div>

      {/* Filter/Sort Modal */}
      <FilterSortModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentState={filterSortState}
        onApply={handleFilterApply}
      />
    </div>
  );
}
