import { useState } from 'react';
import { 
  Search,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Download,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle,
  Loader2,
  UserPlus
} from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { ExportModal } from '../components/ExportModal';
import { RCOSidebar } from '../components/RCOSidebar';
import { AIUrgencyScoreBadgeCompact } from '../components/AIUrgencyScoreBadge';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { toast, Toaster } from 'sonner';

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
}

export function RCODashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [flagReason, setFlagReason] = useState('');
  const [flaggedIssues, setFlaggedIssues] = useState<Set<string>>(new Set());
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [acknowledgedIssues, setAcknowledgedIssues] = useState<Set<string>>(new Set());
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedIssueForAssign, setSelectedIssueForAssign] = useState<string | null>(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Mock KPI data
  const kpiData = {
    issuesOpen: 24,
    issuesOpenTrend: 'up',
    issuesOpenPercent: '+12%',
    avgResponseTime: '3.2h',
    avgResponseTrend: 'down',
    avgResponsePercent: '-8%',
    overdue: 5,
    schoolsActive: 12,
  };

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
    },
    {
      id: 'SETU-2850',
      title: 'Electrical wiring issue in classroom block',
      school: 'TGTWREIS Gurukulam, Nirmal',
      category: 'Safety',
      urgencyScore: 112,
      status: 'Escalated',
      submitted: '5h ago',
      lastAction: '3h ago',
      isAcknowledged: true,
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

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('session');
    navigate('/rco/login', { replace: true });
  };

  // Pagination logic
  const totalPages = Math.ceil(allIssues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, allIssues.length);
  const currentIssues = allIssues.slice(startIndex, endIndex);

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
              data-i18n="breadcrumb_dashboard"
            >
              Dashboard
            </h2>
          </div>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden md:flex items-center relative" style={{ width: '400px' }}>
            <Search
              size={18}
              color="#6B7280"
              style={{ position: 'absolute', left: '16px' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search issues, schools, IDs…"
              style={{
                width: '100%',
                height: '40px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#F8F9FA',
                paddingLeft: '44px',
                paddingRight: '16px',
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                color: '#0D1B2A',
              }}
              data-i18n="placeholder_search"
            />
          </div>

          {/* Right: Date Range, Language, Notifications */}
          <div className="flex items-center gap-4">
            <button
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5E7EB] bg-white"
              style={{
                height: '40px',
                fontFamily: 'Noto Sans',
                fontSize: '13px',
                color: '#0D1B2A',
              }}
            >
              Last 7 days
              <ChevronDown size={16} color="#6B7280" />
            </button>
            <LanguageToggle size="compact" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Issues Open */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="bg-white rounded-lg p-4 lg:p-6 border border-[#E5E7EB]"
              style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}
            >
              <p
                className="mb-2"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  color: '#6B7280',
                  letterSpacing: '0.05em',
                }}
                data-i18n="kpi_issues_open"
              >
                Issues Open
              </p>
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                  }}
                >
                  {kpiData.issuesOpen}
                </span>
                {kpiData.issuesOpenTrend === 'up' ? (
                  <TrendingUp size={20} color="#EF4444" />
                ) : (
                  <TrendingDown size={20} color="#059669" />
                )}
                <span
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    color: '#6B7280',
                  }}
                >
                  {kpiData.issuesOpenPercent}
                </span>
              </div>
            </motion.div>

            {/* Avg Response Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-4 lg:p-6 border border-[#E5E7EB]"
              style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}
            >
              <p
                className="mb-2"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  color: '#6B7280',
                  letterSpacing: '0.05em',
                }}
                data-i18n="kpi_avg_response"
              >
                Avg Response Time
              </p>
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                  }}
                >
                  {kpiData.avgResponseTime}
                </span>
                {kpiData.avgResponseTrend === 'down' ? (
                  <TrendingDown size={20} color="#059669" />
                ) : (
                  <TrendingUp size={20} color="#EF4444" />
                )}
                <span
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    color: '#6B7280',
                  }}
                >
                  {kpiData.avgResponsePercent}
                </span>
              </div>
            </motion.div>

            {/* Overdue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-4 lg:p-6 border border-[#E5E7EB]"
              style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}
            >
              <p
                className="mb-2"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  color: '#6B7280',
                  letterSpacing: '0.05em',
                }}
                data-i18n="kpi_overdue"
              >
                Overdue
              </p>
              <motion.span
                animate={kpiData.overdue > 0 ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '32px',
                  fontWeight: 700,
                  color: kpiData.overdue > 0 ? '#DC2626' : '#0D1B2A',
                }}
              >
                {kpiData.overdue}
              </motion.span>
            </motion.div>

            {/* Schools Active */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-4 lg:p-6 border border-[#E5E7EB]"
              style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}
            >
              <p
                className="mb-2"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  color: '#6B7280',
                  letterSpacing: '0.05em',
                }}
                data-i18n="kpi_schools_active"
              >
                Schools Active
              </p>
              <span
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#0D1B2A',
                }}
              >
                {kpiData.schoolsActive}
              </span>
            </motion.div>
          </div>

          {/* Issue Table Section */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 lg:p-6" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}>
            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {/* Status Dropdown */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white"
                style={{
                  height: '40px',
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  color: '#0D1B2A',
                  minWidth: '140px',
                }}
                data-i18n="filter_status"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="escalated">Escalated</option>
                <option value="resolved">Resolved</option>
              </select>

              {/* Category Dropdown */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white"
                style={{
                  height: '40px',
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  color: '#0D1B2A',
                  minWidth: '140px',
                }}
                data-i18n="filter_category"
              >
                <option value="all">All Categories</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="safety">Safety</option>
                <option value="food">Food & Nutrition</option>
                <option value="academic">Academic</option>
              </select>

              {/* Urgency Dropdown */}
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white"
                style={{
                  height: '40px',
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  color: '#0D1B2A',
                  minWidth: '140px',
                }}
                data-i18n="filter_urgency"
              >
                <option value="all">All Urgency</option>
                <option value="critical">Critical (100+)</option>
                <option value="high">High (80-99)</option>
                <option value="medium">Medium (60-79)</option>
                <option value="low">Low (&lt;60)</option>
              </select>

              {/* School Search */}
              <input
                type="text"
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
                placeholder="Search school..."
                className="px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white"
                style={{
                  height: '40px',
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  color: '#0D1B2A',
                  minWidth: '180px',
                }}
                data-i18n="filter_school"
              />

              {/* Export Button */}
              <button
                className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg border border-[#0D1B2A] bg-white hover:bg-[#F8F9FA] transition-colors"
                style={{
                  height: '40px',
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0D1B2A',
                }}
                data-i18n="btn_export"
                onClick={() => setExportModalOpen(true)}
              >
                <Download size={16} />
                Export
              </button>
            </div>

            {/* Table - Horizontal Scroll on Mobile */}
            <div className="overflow-x-auto -mx-4 lg:mx-0">
              <table className="w-full" style={{ minWidth: '900px' }}>
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    {[
                      { key: 'id', label: 'Issue ID', i18n: 'col_issue_id' },
                      { key: 'title', label: 'Title', i18n: 'col_title' },
                      { key: 'school', label: 'School', i18n: 'col_school' },
                      { key: 'category', label: 'Category', i18n: 'col_category' },
                      { key: 'urgency', label: 'Urgency Score', i18n: 'col_urgency_score' },
                      { key: 'status', label: 'Status', i18n: 'col_status' },
                      { key: 'submitted', label: 'Submitted', i18n: 'col_submitted' },
                      { key: 'lastAction', label: 'Last Action', i18n: 'col_last_action' },
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
                        <button
                          onClick={() => col.key !== 'actions' && handleSort(col.key)}
                          className="flex items-center gap-1"
                          style={{ cursor: col.key !== 'actions' ? 'pointer' : 'default' }}
                        >
                          {col.label}
                          {col.key !== 'actions' && <ArrowUpDown size={14} color="#9CA3AF" />}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentIssues.map((issue, index) => {
                    const urgencyColors = getUrgencyColor(issue.urgencyScore);
                    const statusColors = getStatusColor(issue.status);
                    const isEven = index % 2 === 0;
                    const isFlagged = flaggedIssues.has(issue.id);
                    const isAcknowledged = acknowledgedIssues.has(issue.id);

                    return (
                      <motion.tr
                        key={issue.id}
                        className="border-b border-[#E5E7EB] hover:bg-[#F8F9FA] transition-colors relative"
                        style={{
                          backgroundColor: isEven ? 'white' : '#F8F9FA',
                          height: '48px',
                          borderLeft: isFlagged ? '3px solid #F97316' : '3px solid transparent',
                        }}
                        animate={isFlagged ? { borderLeftColor: ['#F97316', '#FED7AA', '#F97316'] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
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
                          {issue.title}
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

                        {/* Submitted */}
                        <td
                          className="py-3 px-4"
                          style={{
                            fontFamily: 'Noto Sans',
                            fontSize: '14px',
                            color: '#6B7280',
                          }}
                        >
                          {issue.submitted}
                        </td>

                        {/* Last Action */}
                        <td
                          className="py-3 px-4"
                          style={{
                            fontFamily: 'Noto Sans',
                            fontSize: '14px',
                            color: '#6B7280',
                          }}
                        >
                          {issue.lastAction}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
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
                            {!isAcknowledged && (
                              <button
                                className="px-2 py-1 rounded border transition-colors"
                                style={{
                                  borderColor: '#0D1B2A',
                                  color: '#0D1B2A',
                                  fontFamily: 'Noto Sans',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  backgroundColor: 'white',
                                  height: '28px',
                                }}
                                data-i18n="btn_acknowledge"
                                onClick={() => {
                                  setAcknowledgedIssues(new Set([...acknowledgedIssues, issue.id]));
                                }}
                              >
                                Acknowledge
                              </button>
                            )}
                            <button
                              title="Flag Urgent"
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                              }}
                              data-i18n="btn_flag_urgent"
                              onClick={() => {
                                setSelectedIssueId(issue.id);
                                setFlagModalOpen(true);
                              }}
                            >
                              <Flag size={16} color="#F97316" />
                            </button>
                            <button
                              className="hidden lg:inline-flex px-2 py-1 rounded border transition-colors"
                              style={{
                                borderColor: '#0D1B2A',
                                color: '#0D1B2A',
                                fontFamily: 'Noto Sans',
                                fontSize: '12px',
                                fontWeight: 600,
                                backgroundColor: 'white',
                                height: '28px',
                              }}
                              data-i18n="btn_assign"
                              onClick={() => {
                                setSelectedIssueForAssign(issue.id);
                                setAssignModalOpen(true);
                              }}
                            >
                              Assign
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E5E7EB]">
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

      {/* Flag Issue Modal */}
      {flagModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setFlagModalOpen(false);
            setFlagReason('');
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
              data-i18n="modal_flag_title"
            >
              Flag Issue as Urgent
            </h2>

            {/* Warning body */}
            <p
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                color: '#6B7280',
                lineHeight: '1.5',
                marginBottom: '16px',
              }}
              data-i18n="modal_flag_body"
            >
              This flag escalates the issue for state-level attention. Your name and reason are permanently recorded.
            </p>

            {/* Text area */}
            <textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="Reason for flagging"
              required
              className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white focus:outline-none focus:border-[#F0A500]"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                color: '#0D1B2A',
                minHeight: '100px',
                resize: 'vertical',
              }}
              data-i18n="placeholder_flag_reason"
            />

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setFlagModalOpen(false);
                  setFlagReason('');
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
                  if (selectedIssueId && flagReason.trim()) {
                    // Create audit entry (mock)
                    console.log('Flag set:', {
                      issueId: selectedIssueId,
                      rcoName: 'Rajesh Kumar',
                      reason: flagReason,
                      timestamp: new Date().toISOString(),
                    });
                    
                    // Add to flagged issues
                    setFlaggedIssues(new Set([...flaggedIssues, selectedIssueId]));
                    
                    // Close modal and reset
                    setFlagModalOpen(false);
                    setFlagReason('');
                    setSelectedIssueId(null);
                  }
                }}
                disabled={!flagReason.trim()}
                className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'white',
                  backgroundColor: '#F97316',
                  border: 'none',
                  cursor: flagReason.trim() ? 'pointer' : 'not-allowed',
                  height: '40px',
                }}
                data-i18n="btn_confirm_flag"
              >
                Confirm Flag
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={(format) => {
          console.log('Export triggered:', {
            format,
            dateRange: 'Last 7 days',
            filters: {
              status: statusFilter,
              category: categoryFilter,
              urgency: urgencyFilter,
              school: schoolFilter,
            },
            timestamp: new Date().toISOString(),
          });
        }}
        dateRange="Last 7 days"
      />

      {/* Assign Modal */}
      {assignModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setAssignModalOpen(false);
            setSelectedIssueForAssign(null);
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
            <h2
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '20px',
                fontWeight: 700,
                color: '#0D1B2A',
                marginBottom: '16px',
              }}
            >
              Assign Issue
            </h2>

            <p
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                color: '#6B7280',
                marginBottom: '16px',
              }}
            >
              Assign {selectedIssueForAssign} to an officer for action.
            </p>

            <select
              className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white mb-4"
              style={{
                height: '40px',
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                color: '#0D1B2A',
              }}
            >
              <option value="">Select Officer</option>
              <option value="rajesh">Rajesh Kumar - Sr. Officer</option>
              <option value="priya">Priya Sharma - Field Officer</option>
              <option value="amit">Amit Patel - Technical Officer</option>
            </select>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setAssignModalOpen(false);
                  setSelectedIssueForAssign(null);
                }}
                className="px-4 py-2 rounded-lg"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#6B7280',
                  height: '40px',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Issue assigned successfully');
                  setAssignModalOpen(false);
                  setSelectedIssueForAssign(null);
                }}
                className="px-4 py-2 rounded-lg"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'white',
                  backgroundColor: '#F0A500',
                  height: '40px',
                }}
              >
                Assign
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toaster position="top-center" />
    </div>
  );
}