import { useState } from 'react';
import { 
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  Star,
} from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { RCOSidebar } from '../components/RCOSidebar';
import { AIUrgencyScoreBadgeCompact } from '../components/AIUrgencyScoreBadge';
import { EscalationChip } from '../components/EscalationChip';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

interface Issue {
  id: string;
  title: string;
  school: string;
  category: string;
  urgencyScore: number;
  status: string;
  submitted: string;
  lastAction: string;
  isAcknowledged: boolean;
  isFlagged?: boolean;
  escalationLevel: 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
  principalEndorsed: boolean;
  assignedOfficer: string | null;
}

export function RCOIssueQueue() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set());
  
  // Filter states
  const [statusFilters, setStatusFilters] = useState<Set<string>>(new Set());
  const [categoryFilters, setCategoryFilters] = useState<Set<string>>(new Set());
  const [urgencyRange, setUrgencyRange] = useState([0, 140]);
  const [escalationFilters, setEscalationFilters] = useState<Set<string>>(new Set());
  const [schoolSearch, setSchoolSearch] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [principalEndorsedOnly, setPrincipalEndorsedOnly] = useState(false);
  const [assignedToMe, setAssignedToMe] = useState(false);
  
  // Modal states
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [selectedIssueForModal, setSelectedIssueForModal] = useState<Issue | null>(null);
  const [resolveReason, setResolveReason] = useState('');
  const [escalateReason, setEscalateReason] = useState('');
  
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Mock issues data
  const allIssues: Issue[] = [
    {
      id: 'SETU-2851',
      title: 'Water supply disruption in girls hostel',
      school: 'TGTWREIS Gurukulam, Adilabad',
      category: 'Infrastructure',
      urgencyScore: 95,
      status: 'Open',
      submitted: '2h ago',
      lastAction: '1h ago',
      isAcknowledged: false,
      escalationLevel: 'L1',
      principalEndorsed: true,
      assignedOfficer: 'Rajesh Kumar',
    },
    {
      id: 'SETU-2850',
      title: 'Electrical wiring issue in classroom block',
      school: 'TGTWREIS Gurukulam, Nirmal',
      category: 'Safety',
      urgencyScore: 112,
      status: 'In Progress',
      submitted: '5h ago',
      lastAction: '3h ago',
      isAcknowledged: true,
      escalationLevel: 'L2',
      principalEndorsed: true,
      assignedOfficer: 'Rajesh Kumar',
    },
    {
      id: 'SETU-2849',
      title: 'Food quality concerns in mess',
      school: 'TGTWREIS Gurukulam, Mancherial',
      category: 'Food & Nutrition',
      urgencyScore: 68,
      status: 'In Progress',
      submitted: '1d ago',
      lastAction: '6h ago',
      isAcknowledged: true,
      escalationLevel: 'L0',
      principalEndorsed: false,
      assignedOfficer: 'Priya Sharma',
    },
    {
      id: 'SETU-2848',
      title: 'Library books shortage',
      school: 'TGTWREIS Gurukulam, Adilabad',
      category: 'Academic',
      urgencyScore: 42,
      status: 'Open',
      submitted: '2d ago',
      lastAction: '1d ago',
      isAcknowledged: false,
      escalationLevel: 'L0',
      principalEndorsed: false,
      assignedOfficer: null,
    },
    {
      id: 'SETU-2847',
      title: 'Broken water pipe in girls hostel',
      school: 'TGTWREIS Gurukulam, Nirmal',
      category: 'Infrastructure',
      urgencyScore: 88,
      status: 'Resolved',
      submitted: '3d ago',
      lastAction: '2d ago',
      isAcknowledged: true,
      escalationLevel: 'L1',
      principalEndorsed: true,
      assignedOfficer: 'Rajesh Kumar',
    },
    {
      id: 'SETU-2846',
      title: 'Need additional security guards',
      school: 'TGTWREIS Gurukulam, Mancherial',
      category: 'Safety',
      urgencyScore: 75,
      status: 'Open',
      submitted: '3d ago',
      lastAction: '2d ago',
      isAcknowledged: false,
      escalationLevel: 'L1',
      principalEndorsed: false,
      assignedOfficer: null,
    },
  ];

  const getUrgencyColor = (score: number) => {
    if (score >= 100) return { bg: '#FECACA', text: '#B91C1C' }; // Red
    if (score >= 80) return { bg: '#FED7AA', text: '#C2410C' }; // Orange
    if (score >= 60) return { bg: '#FEF3C7', text: '#D97706' }; // Amber
    if (score >= 40) return { bg: '#DBEAFE', text: '#1D4ED8' }; // Blue
    return { bg: '#E5E7EB', text: '#6B7280' }; // Grey
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      'Open': { bg: '#DBEAFE', text: '#1D4ED8' },
      'In Progress': { bg: '#FEF3C7', text: '#D97706' },
      'Escalated': { bg: '#FED7AA', text: '#C2410C' },
      'Resolved': { bg: '#D1FAE5', text: '#059669' },
    };
    return colors[status] || { bg: '#E5E7EB', text: '#6B7280' };
  };

  const getEscalationColor = (level: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      'L0': { bg: '#E5E7EB', text: '#6B7280' },
      'L1': { bg: '#DBEAFE', text: '#1D4ED8' },
      'L2': { bg: '#FEF3C7', text: '#D97706' },
      'L3': { bg: '#FED7AA', text: '#C2410C' },
      'L4': { bg: '#FECACA', text: '#B91C1C' },
    };
    return colors[level] || { bg: '#E5E7EB', text: '#6B7280' };
  };

  const handleLogout = () => {
    localStorage.removeItem('session');
    navigate('/rco/login', { replace: true });
  };

  const handleSelectAll = () => {
    if (selectedIssues.size === currentIssues.length) {
      setSelectedIssues(new Set());
    } else {
      setSelectedIssues(new Set(currentIssues.map(issue => issue.id)));
    }
  };

  const handleSelectIssue = (issueId: string) => {
    const newSelected = new Set(selectedIssues);
    if (newSelected.has(issueId)) {
      newSelected.delete(issueId);
    } else {
      newSelected.add(issueId);
    }
    setSelectedIssues(newSelected);
  };

  const getActiveFilters = () => {
    const filters: string[] = [];
    if (statusFilters.size > 0) filters.push(...Array.from(statusFilters));
    if (categoryFilters.size > 0) filters.push(...Array.from(categoryFilters));
    if (urgencyRange[0] > 0 || urgencyRange[1] < 140) filters.push(`Urgency: ${urgencyRange[0]}-${urgencyRange[1]}`);
    if (escalationFilters.size > 0) filters.push(...Array.from(escalationFilters));
    if (schoolSearch) filters.push(`School: ${schoolSearch}`);
    if (dateRange !== 'all') filters.push(`Date: ${dateRange}`);
    if (principalEndorsedOnly) filters.push('Principal Endorsed');
    if (assignedToMe) filters.push('Assigned to Me');
    return filters;
  };

  const removeFilter = (filter: string) => {
    if (statusFilters.has(filter)) {
      const newFilters = new Set(statusFilters);
      newFilters.delete(filter);
      setStatusFilters(newFilters);
    } else if (categoryFilters.has(filter)) {
      const newFilters = new Set(categoryFilters);
      newFilters.delete(filter);
      setCategoryFilters(newFilters);
    } else if (escalationFilters.has(filter)) {
      const newFilters = new Set(escalationFilters);
      newFilters.delete(filter);
      setEscalationFilters(newFilters);
    } else if (filter === 'Principal Endorsed') {
      setPrincipalEndorsedOnly(false);
    } else if (filter === 'Assigned to Me') {
      setAssignedToMe(false);
    } else if (filter.startsWith('School:')) {
      setSchoolSearch('');
    } else if (filter.startsWith('Date:')) {
      setDateRange('all');
    } else if (filter.startsWith('Urgency:')) {
      setUrgencyRange([0, 140]);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(allIssues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, allIssues.length);
  const currentIssues = allIssues.slice(startIndex, endIndex);

  const activeFilters = getActiveFilters();

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* RCO Sidebar */}
      <RCOSidebar
        userName="Rajesh Kumar"
        userRole="Regional Coordinator"
        notificationCount={5}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-[240px]">
        {/* Top Bar */}
        <div
          className="flex items-center justify-between px-6 bg-white border-b border-[#E5E7EB]"
          style={{ height: '64px' }}
        >
          {/* Left: Breadcrumb */}
          <div className="flex items-center gap-4">
            <h2
              style={{
                fontFamily: 'Noto Sans',
                fontWeight: 700,
                fontSize: '16px',
                color: '#0D1B2A',
              }}
              data-i18n="breadcrumb_issue_queue"
            >
              Issue Queue
            </h2>
          </div>

          {/* Right: Language, Notifications */}
          <div className="flex items-center gap-4">
            <LanguageToggle size="compact" />

            <button className="relative min-w-[48px] min-h-[48px] flex items-center justify-center">
              <Bell size={20} color="#0D1B2A" />
              <span
                className="absolute top-1 right-1 flex items-center justify-center"
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  fontFamily: 'Noto Sans',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                5
              </span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto flex">
          {/* Filter Panel */}
          {filterPanelOpen && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 240 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-r border-[#E5E7EB] overflow-y-auto"
              style={{ minWidth: '240px', maxWidth: '240px' }}
            >
              <div className="p-4 space-y-4">
                <h3
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                    marginBottom: '12px',
                  }}
                >
                  Filters
                </h3>

                {/* Status Multi-select */}
                <div>
                  <p
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#6B7280',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Status
                  </p>
                  {['Open', 'In Progress', 'Escalated', 'Resolved'].map((status) => (
                    <label key={status} className="flex items-center gap-2 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={statusFilters.has(status)}
                        onChange={(e) => {
                          const newFilters = new Set(statusFilters);
                          if (e.target.checked) {
                            newFilters.add(status);
                          } else {
                            newFilters.delete(status);
                          }
                          setStatusFilters(newFilters);
                        }}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#F0A500',
                        }}
                      />
                      <span
                        style={{
                          fontFamily: 'Noto Sans',
                          fontSize: '13px',
                          color: '#0D1B2A',
                        }}
                      >
                        {status}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Category Multi-select */}
                <div>
                  <p
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#6B7280',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Category
                  </p>
                  {['Infrastructure', 'Safety', 'Food & Nutrition', 'Academic'].map((category) => (
                    <label key={category} className="flex items-center gap-2 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={categoryFilters.has(category)}
                        onChange={(e) => {
                          const newFilters = new Set(categoryFilters);
                          if (e.target.checked) {
                            newFilters.add(category);
                          } else {
                            newFilters.delete(category);
                          }
                          setCategoryFilters(newFilters);
                        }}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#F0A500',
                        }}
                      />
                      <span
                        style={{
                          fontFamily: 'Noto Sans',
                          fontSize: '13px',
                          color: '#0D1B2A',
                        }}
                      >
                        {category}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Urgency Score Range */}
                <div>
                  <p
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#6B7280',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Urgency Score: {urgencyRange[0]}–{urgencyRange[1]}
                  </p>
                  <input
                    type="range"
                    min="0"
                    max="140"
                    value={urgencyRange[1]}
                    onChange={(e) => setUrgencyRange([urgencyRange[0], parseInt(e.target.value)])}
                    className="w-full"
                    style={{ accentColor: '#F0A500' }}
                  />
                </div>

                {/* Escalation Level Multi-select */}
                <div>
                  <p
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#6B7280',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Escalation Level
                  </p>
                  {['L0', 'L1', 'L2', 'L3', 'L4'].map((level) => (
                    <label key={level} className="flex items-center gap-2 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={escalationFilters.has(level)}
                        onChange={(e) => {
                          const newFilters = new Set(escalationFilters);
                          if (e.target.checked) {
                            newFilters.add(level);
                          } else {
                            newFilters.delete(level);
                          }
                          setEscalationFilters(newFilters);
                        }}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#F0A500',
                        }}
                      />
                      <span
                        style={{
                          fontFamily: 'Noto Sans',
                          fontSize: '13px',
                          color: '#0D1B2A',
                        }}
                      >
                        {level}
                      </span>
                    </label>
                  ))}
                </div>

                {/* School Search */}
                <div>
                  <p
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#6B7280',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                    }}
                  >
                    School
                  </p>
                  <input
                    type="text"
                    value={schoolSearch}
                    onChange={(e) => setSchoolSearch(e.target.value)}
                    placeholder="Search school..."
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      color: '#0D1B2A',
                    }}
                  />
                </div>

                {/* Date Range */}
                <div>
                  <p
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#6B7280',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Date Range
                  </p>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      color: '#0D1B2A',
                    }}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="7days">Last 7 days</option>
                    <option value="30days">Last 30 days</option>
                  </select>
                </div>

                {/* Principal Endorsed Only Toggle */}
                <label className="flex items-center justify-between cursor-pointer">
                  <span
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      color: '#0D1B2A',
                      fontWeight: 600,
                    }}
                  >
                    Principal Endorsed Only
                  </span>
                  <input
                    type="checkbox"
                    checked={principalEndorsedOnly}
                    onChange={(e) => setPrincipalEndorsedOnly(e.target.checked)}
                    className="toggle"
                    style={{ accentColor: '#F0A500' }}
                  />
                </label>

                {/* Assigned to Me Toggle */}
                <label className="flex items-center justify-between cursor-pointer">
                  <span
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      color: '#0D1B2A',
                      fontWeight: 600,
                    }}
                  >
                    Assigned to Me
                  </span>
                  <input
                    type="checkbox"
                    checked={assignedToMe}
                    onChange={(e) => setAssignedToMe(e.target.checked)}
                    className="toggle"
                    style={{ accentColor: '#F0A500' }}
                  />
                </label>
              </div>
            </motion.div>
          )}

          {/* Issue Table Section */}
          <div className="flex-1 p-6">
            {/* Page Title + Issue Count */}
            <div className="flex items-center gap-3 mb-4">
              <h1
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#0D1B2A',
                }}
                data-i18n="scr_issue_queue"
              >
                Issue Queue
              </h1>
              <span
                className="px-3 py-1 rounded-full"
                style={{
                  backgroundColor: '#F0A500',
                  color: 'white',
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
                data-i18n="lbl_queue_count"
              >
                {allIssues.length} issues
              </span>
            </div>

            {/* Filter Panel Toggle + Active Filters */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#0D1B2A] bg-white hover:bg-[#F8F9FA] transition-colors"
                style={{
                  height: '40px',
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0D1B2A',
                }}
                data-i18n="btn_filter_panel"
              >
                <Filter size={16} />
                Filter Panel
              </button>

              {/* Active Filter Chips */}
              {activeFilters.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {activeFilters.map((filter, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#DBEAFE] border border-[#3B82F6]"
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '12px',
                        color: '#1D4ED8',
                      }}
                      data-i18n="chip_active_filter"
                    >
                      {filter}
                      <button
                        onClick={() => removeFilter(filter)}
                        className="flex items-center justify-center"
                        style={{ width: '16px', height: '16px' }}
                      >
                        <X size={12} color="#1D4ED8" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Bulk Actions Bar */}
            {selectedIssues.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-[#FEF3C7] border border-[#F0A500]"
              >
                <span
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0D1B2A',
                  }}
                >
                  {selectedIssues.size} selected
                </span>
                <button
                  className="px-4 py-2 rounded-lg bg-[#F0A500] text-white hover:bg-[#D99500] transition-colors"
                  style={{
                    height: '36px',
                    fontFamily: 'Noto Sans',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                  data-i18n="btn_bulk_acknowledge"
                >
                  Acknowledge Selected
                </button>
                <button
                  className="px-4 py-2 rounded-lg border border-[#0D1B2A] bg-white hover:bg-[#F8F9FA] transition-colors"
                  style={{
                    height: '36px',
                    fontFamily: 'Noto Sans',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0D1B2A',
                  }}
                  data-i18n="btn_bulk_export"
                >
                  Export Selected
                </button>
              </motion.div>
            )}

            {/* Search Bar */}
            <div className="mb-4 relative">
              <Search
                size={18}
                color="#6B7280"
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search issues, schools, IDs…"
                className="w-full px-12 py-2 rounded-lg border border-[#E5E7EB] bg-white"
                style={{
                  height: '48px',
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  color: '#0D1B2A',
                }}
                data-i18n="placeholder_search"
              />
            </div>

            {/* Issue Table */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ minWidth: '1200px' }}>
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
                      <th className="py-3 px-4" style={{ width: '40px' }}>
                        <input
                          type="checkbox"
                          checked={selectedIssues.size === currentIssues.length && currentIssues.length > 0}
                          onChange={handleSelectAll}
                          style={{
                            width: '18px',
                            height: '18px',
                            accentColor: '#F0A500',
                            cursor: 'pointer',
                          }}
                        />
                      </th>
                      {[
                        { key: 'id', label: 'Issue ID', i18n: 'col_issue_id' },
                        { key: 'title', label: 'Title', i18n: 'col_title' },
                        { key: 'school', label: 'School', i18n: 'col_school' },
                        { key: 'category', label: 'Category', i18n: 'col_category' },
                        { key: 'urgency', label: 'Urgency', i18n: 'col_urgency_score' },
                        { key: 'escalation', label: 'Level', i18n: 'col_escalation_level' },
                        { key: 'status', label: 'Status', i18n: 'col_status' },
                        { key: 'assigned', label: 'Assigned', i18n: 'col_assigned_officer' },
                        { key: 'actions', label: 'Actions', i18n: 'col_actions' },
                      ].map((col) => (
                        <th
                          key={col.key}
                          className="text-left py-3 px-4"
                          style={{
                            fontFamily: 'Noto Sans',
                            fontSize: '12px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            color: '#6B7280',
                            letterSpacing: '0.05em',
                          }}
                          data-i18n={col.i18n}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentIssues.map((issue, index) => {
                      const statusColors = getStatusColor(issue.status);
                      const isEven = index % 2 === 0;
                      const isSelected = selectedIssues.has(issue.id);

                      return (
                        <tr
                          key={issue.id}
                          className="border-b border-[#E5E7EB] hover:bg-[#F8F9FA] transition-colors"
                          style={{
                            backgroundColor: isSelected ? '#FEF3C7' : (isEven ? 'white' : '#F8F9FA'),
                          }}
                        >
                          {/* Checkbox */}
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectIssue(issue.id)}
                              style={{
                                width: '18px',
                                height: '18px',
                                accentColor: '#F0A500',
                                cursor: 'pointer',
                              }}
                            />
                          </td>

                          {/* Issue ID */}
                          <td
                            className="py-3 px-4"
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#0D1B2A',
                            }}
                          >
                            {issue.id}
                          </td>

                          {/* Title */}
                          <td
                            className="py-3 px-4"
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '14px',
                              color: '#0D1B2A',
                            }}
                          >
                            <div className="flex items-center gap-2">
                              {issue.title}
                              {issue.principalEndorsed && (
                                <Star size={16} color="#F0A500" fill="#F0A500" title="Principal Endorsed" />
                              )}
                            </div>
                          </td>

                          {/* School */}
                          <td
                            className="py-3 px-4"
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '14px',
                              color: '#6B7280',
                            }}
                          >
                            {issue.school}
                          </td>

                          {/* Category */}
                          <td
                            className="py-3 px-4"
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '14px',
                              color: '#6B7280',
                            }}
                          >
                            {issue.category}
                          </td>

                          {/* Urgency Score */}
                          <td className="py-3 px-4">
                            <AIUrgencyScoreBadgeCompact score={issue.urgencyScore} />
                          </td>

                          {/* Escalation Level */}
                          <td className="py-3 px-4">
                            <EscalationChip level={issue.escalationLevel} />
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-full"
                              style={{
                                backgroundColor: statusColors.bg,
                                color: statusColors.text,
                                fontFamily: 'Noto Sans',
                                fontSize: '13px',
                                fontWeight: 600,
                              }}
                            >
                              {issue.status}
                            </span>
                          </td>

                          {/* Assigned Officer */}
                          <td
                            className="py-3 px-4"
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '14px',
                              color: '#6B7280',
                            }}
                          >
                            {issue.assignedOfficer || '—'}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => navigate(`/rco/issues/${issue.id}`)}
                                style={{
                                  fontFamily: 'Noto Sans',
                                  fontSize: '13px',
                                  fontWeight: 600,
                                  color: '#F0A500',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  textDecoration: 'underline',
                                }}
                                data-i18n="btn_view"
                              >
                                View
                              </button>
                              {(issue.status === 'In Progress' || issue.status === 'Open') && issue.assignedOfficer && (
                                <button
                                  onClick={() => {
                                    setSelectedIssueForModal(issue);
                                    setResolveModalOpen(true);
                                  }}
                                  className="px-2 py-1 rounded border transition-colors"
                                  style={{
                                    borderColor: '#22C55E',
                                    backgroundColor: '#22C55E',
                                    color: 'white',
                                    fontFamily: 'Noto Sans',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    height: '28px',
                                  }}
                                  data-i18n="btn_resolve"
                                >
                                  Resolve
                                </button>
                              )}
                              {(issue.escalationLevel === 'L1' || issue.escalationLevel === 'L2') && (
                                <button
                                  onClick={() => {
                                    setSelectedIssueForModal(issue);
                                    setEscalateModalOpen(true);
                                  }}
                                  className="px-2 py-1 rounded border transition-colors"
                                  style={{
                                    borderColor: '#DC2626',
                                    color: '#DC2626',
                                    fontFamily: 'Noto Sans',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    backgroundColor: 'white',
                                    height: '28px',
                                  }}
                                  data-i18n="btn_escalate"
                                >
                                  Escalate
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-[#E5E7EB]">
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '13px',
                    color: '#6B7280',
                  }}
                  data-i18n="lbl_pagination"
                >
                  Showing {startIndex + 1}–{endIndex} of {allIssues.length}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F8F9FA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      height: '36px',
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      color: '#0D1B2A',
                    }}
                    data-i18n="btn_prev"
                  >
                    <ChevronLeft size={16} />
                    Prev
                  </button>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F8F9FA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      height: '36px',
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      color: '#0D1B2A',
                    }}
                    data-i18n="btn_next"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mark Resolved Modal */}
      {resolveModalOpen && selectedIssueForModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setResolveModalOpen(false);
            setResolveReason('');
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            style={{ maxWidth: '480px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <h2
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '20px',
                fontWeight: 700,
                color: '#0D1B2A',
                marginBottom: '16px',
              }}
              data-i18n="modal_resolve_title"
            >
              Confirm Resolution
            </h2>

            {/* Reason Field */}
            <textarea
              value={resolveReason}
              onChange={(e) => setResolveReason(e.target.value)}
              placeholder="What was done to resolve this?"
              required
              className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white focus:outline-none focus:border-[#22C55E] mb-4"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                color: '#0D1B2A',
                minHeight: '100px',
                resize: 'vertical',
              }}
              data-i18n="placeholder_resolve_reason"
            />

            {/* Warning Banner */}
            <div
              className="flex items-start gap-2 p-3 rounded-lg mb-4"
              style={{
                backgroundColor: '#FEF3C7',
                border: '1px solid #F0A500',
              }}
            >
              <AlertTriangle size={20} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  color: '#D97706',
                  lineHeight: '1.5',
                }}
                data-i18n="lbl_resolve_warning"
              >
                School staff have 72 hours to dispute this resolution. The issue will be re-opened if disputed.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setResolveModalOpen(false);
                  setResolveReason('');
                }}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#6B7280',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  height: '40px',
                }}
                data-i18n="btn_cancel"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (resolveReason.trim().length >= 30) {
                    console.log('Resolve issue:', {
                      issueId: selectedIssueForModal.id,
                      reason: resolveReason,
                      newStatus: 'Resolved (Pending Confirmation)',
                      timestamp: new Date().toISOString(),
                    });
                    setResolveModalOpen(false);
                    setResolveReason('');
                    setSelectedIssueForModal(null);
                  }
                }}
                disabled={resolveReason.trim().length < 30}
                className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'white',
                  backgroundColor: '#22C55E',
                  border: 'none',
                  cursor: resolveReason.trim().length >= 30 ? 'pointer' : 'not-allowed',
                  height: '40px',
                }}
                data-i18n="btn_confirm_resolve"
              >
                Confirm Resolution
              </button>
            </div>

            {/* Character count hint */}
            <p
              className="text-right mt-2"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '12px',
                color: resolveReason.trim().length < 30 ? '#DC2626' : '#059669',
              }}
            >
              {resolveReason.trim().length} / 30 characters minimum
            </p>
          </motion.div>
        </div>
      )}

      {/* Escalate Manually Modal */}
      {escalateModalOpen && selectedIssueForModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setEscalateModalOpen(false);
            setEscalateReason('');
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            style={{ maxWidth: '480px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <h2
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '20px',
                fontWeight: 700,
                color: '#0D1B2A',
                marginBottom: '16px',
              }}
              data-i18n="modal_escalate_title"
            >
              Manual Escalation
            </h2>

            {/* Current Level */}
            <div className="flex items-center gap-3 mb-4">
              <span
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  color: '#6B7280',
                }}
              >
                Current Level:
              </span>
              <span
                className="px-3 py-1 rounded-md"
                style={{
                  backgroundColor: getEscalationColor(selectedIssueForModal.escalationLevel).bg,
                  color: getEscalationColor(selectedIssueForModal.escalationLevel).text,
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                {selectedIssueForModal.escalationLevel}
              </span>
              <span style={{ color: '#6B7280' }}>→</span>
              <span
                className="px-3 py-1 rounded-md"
                style={{
                  backgroundColor: getEscalationColor(
                    selectedIssueForModal.escalationLevel === 'L1' ? 'L2' : 'L3'
                  ).bg,
                  color: getEscalationColor(
                    selectedIssueForModal.escalationLevel === 'L1' ? 'L2' : 'L3'
                  ).text,
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                {selectedIssueForModal.escalationLevel === 'L1' ? 'L2' : 'L3'}
              </span>
            </div>

            {/* Reason Field */}
            <textarea
              value={escalateReason}
              onChange={(e) => setEscalateReason(e.target.value)}
              placeholder="Reason for manual escalation"
              required
              className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white focus:outline-none focus:border-[#DC2626] mb-4"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                color: '#0D1B2A',
                minHeight: '100px',
                resize: 'vertical',
              }}
              data-i18n="placeholder_escalate_reason"
            />

            {/* Warning Banner */}
            <div
              className="flex items-start gap-2 p-3 rounded-lg mb-4"
              style={{
                backgroundColor: '#FEE2E2',
                border: '1px solid #DC2626',
              }}
            >
              <AlertTriangle size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  color: '#DC2626',
                  lineHeight: '1.5',
                }}
                data-i18n="lbl_escalate_warning"
              >
                This action is permanent and immutable. It cannot be reversed.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setEscalateModalOpen(false);
                  setEscalateReason('');
                }}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#6B7280',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  height: '40px',
                }}
                data-i18n="btn_cancel"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (escalateReason.trim()) {
                    console.log('Escalate issue:', {
                      issueId: selectedIssueForModal.id,
                      currentLevel: selectedIssueForModal.escalationLevel,
                      targetLevel: selectedIssueForModal.escalationLevel === 'L1' ? 'L2' : 'L3',
                      reason: escalateReason,
                      timestamp: new Date().toISOString(),
                    });
                    setEscalateModalOpen(false);
                    setEscalateReason('');
                    setSelectedIssueForModal(null);
                  }
                }}
                disabled={!escalateReason.trim()}
                className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'white',
                  backgroundColor: '#DC2626',
                  border: 'none',
                  cursor: escalateReason.trim() ? 'pointer' : 'not-allowed',
                  height: '40px',
                }}
                data-i18n="btn_escalate_confirm"
              >
                Escalate
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
