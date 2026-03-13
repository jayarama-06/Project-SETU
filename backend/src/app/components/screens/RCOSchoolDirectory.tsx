import { useState } from 'react';
import {
  Search,
  ChevronDown,
  Download,
  Menu,
  ArrowUpDown,
} from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { RCOSidebar } from '../components/RCOSidebar';
import { SchoolProfileModal } from '../components/SchoolProfileModal';
import { useNavigate } from 'react-router';

interface SchoolRow {
  id: string;
  name: string;
  district: string;
  totalOpenIssues: number;
  criticalIssues: number;
  avgResponseTime: number; // hours
  lastIssueFiled: string;
  healthScore: number; // 0-100
  headmaster: string;
  contactNumber: string;
  avgResolutionTime: number;
  recentIssues: Array<{
    id: string;
    title: string;
    status: string;
    date: string;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    color: string;
  }>;
  hasRecurringIssues: boolean;
  recurringCategory?: string;
}

export function RCOSchoolDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState<SchoolRow | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  // Mock school data
  const allSchools: SchoolRow[] = [
    {
      id: 'SCH-001',
      name: 'TGTWREIS Gurukulam, Adilabad',
      district: 'Adilabad',
      totalOpenIssues: 8,
      criticalIssues: 2,
      avgResponseTime: 4.5,
      lastIssueFiled: '2 hours ago',
      healthScore: 65,
      headmaster: 'Dr. Rajesh Kumar',
      contactNumber: '+91 9876543210',
      avgResolutionTime: 24,
      recentIssues: [
        { id: 'SETU-2851', title: 'Water supply disruption in girls hostel', status: 'Open', date: '2h ago' },
        { id: 'SETU-2847', title: 'Broken water pipe in corridor', status: 'In Progress', date: '1 day ago' },
        { id: 'SETU-2845', title: 'Library AC not working', status: 'Resolved', date: '3 days ago' },
        { id: 'SETU-2843', title: 'Electrical issue in classroom', status: 'Open', date: '5 days ago' },
        { id: 'SETU-2840', title: 'Food quality concerns', status: 'Escalated', date: '1 week ago' },
      ],
      categoryBreakdown: [
        { category: 'Infrastructure', count: 3, color: '#F0A500' },
        { category: 'Safety', count: 2, color: '#DC2626' },
        { category: 'Food', count: 2, color: '#059669' },
        { category: 'Health', count: 1, color: '#2563EB' },
      ],
      hasRecurringIssues: true,
      recurringCategory: 'Infrastructure',
    },
    {
      id: 'SCH-002',
      name: 'TGTWREIS Gurukulam, Nirmal',
      district: 'Nirmal',
      totalOpenIssues: 12,
      criticalIssues: 4,
      avgResponseTime: 6.2,
      lastIssueFiled: '1 hour ago',
      healthScore: 38,
      headmaster: 'Mrs. Lakshmi Devi',
      contactNumber: '+91 9876543211',
      avgResolutionTime: 36,
      recentIssues: [
        { id: 'SETU-2850', title: 'Electrical wiring issue in classroom', status: 'Escalated', date: '1h ago' },
        { id: 'SETU-2848', title: 'Safety concern at main gate', status: 'Open', date: '3h ago' },
        { id: 'SETU-2846', title: 'Mess food quality poor', status: 'In Progress', date: '1 day ago' },
      ],
      categoryBreakdown: [
        { category: 'Safety', count: 5, color: '#DC2626' },
        { category: 'Infrastructure', count: 4, color: '#F0A500' },
        { category: 'Food', count: 3, color: '#059669' },
      ],
      hasRecurringIssues: true,
      recurringCategory: 'Safety',
    },
    {
      id: 'SCH-003',
      name: 'TGTWREIS Gurukulam, Mancherial',
      district: 'Mancherial',
      totalOpenIssues: 3,
      criticalIssues: 0,
      avgResponseTime: 2.8,
      lastIssueFiled: '2 days ago',
      healthScore: 85,
      headmaster: 'Mr. Suresh Reddy',
      contactNumber: '+91 9876543212',
      avgResolutionTime: 18,
      recentIssues: [
        { id: 'SETU-2849', title: 'Library book shortage', status: 'Acknowledged', date: '2 days ago' },
        { id: 'SETU-2842', title: 'Computer lab maintenance', status: 'Resolved', date: '1 week ago' },
      ],
      categoryBreakdown: [
        { category: 'Academics', count: 2, color: '#2563EB' },
        { category: 'Utilities', count: 1, color: '#6B7280' },
      ],
      hasRecurringIssues: false,
    },
    {
      id: 'SCH-004',
      name: 'TGTWREIS Gurukulam, Jagtial',
      district: 'Jagtial',
      totalOpenIssues: 15,
      criticalIssues: 6,
      avgResponseTime: 8.5,
      lastIssueFiled: '30 minutes ago',
      healthScore: 25,
      headmaster: 'Dr. Priya Sharma',
      contactNumber: '+91 9876543213',
      avgResolutionTime: 48,
      recentIssues: [
        { id: 'SETU-2852', title: 'Severe water contamination', status: 'Escalated', date: '30m ago' },
        { id: 'SETU-2841', title: 'Multiple electrical failures', status: 'Open', date: '2h ago' },
        { id: 'SETU-2839', title: 'Hostel safety concerns', status: 'Open', date: '4h ago' },
      ],
      categoryBreakdown: [
        { category: 'Health', count: 6, color: '#DC2626' },
        { category: 'Safety', count: 5, color: '#DC2626' },
        { category: 'Infrastructure', count: 4, color: '#F0A500' },
      ],
      hasRecurringIssues: true,
      recurringCategory: 'Health',
    },
    {
      id: 'SCH-005',
      name: 'TGTWREIS Gurukulam, Karimnagar',
      district: 'Karimnagar',
      totalOpenIssues: 5,
      criticalIssues: 1,
      avgResponseTime: 3.5,
      lastIssueFiled: '1 day ago',
      healthScore: 75,
      headmaster: 'Mr. Anil Kumar',
      contactNumber: '+91 9876543214',
      avgResolutionTime: 20,
      recentIssues: [
        { id: 'SETU-2838', title: 'Sports equipment needed', status: 'In Progress', date: '1 day ago' },
        { id: 'SETU-2835', title: 'Dining hall cleanliness', status: 'Resolved', date: '3 days ago' },
      ],
      categoryBreakdown: [
        { category: 'Academics', count: 3, color: '#2563EB' },
        { category: 'Food', count: 2, color: '#059669' },
      ],
      hasRecurringIssues: false,
    },
  ];

  // Get unique districts
  const districts = ['all', ...Array.from(new Set(allSchools.map(s => s.district)))];

  // Filter schools
  const filteredSchools = allSchools.filter((school) => {
    // Search filter
    const matchesSearch =
      searchQuery === '' ||
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.id.toLowerCase().includes(searchQuery.toLowerCase());

    // District filter
    const matchesDistrict = districtFilter === 'all' || school.district === districtFilter;

    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'needs_attention') {
      matchesStatus = school.healthScore >= 40 && school.healthScore <= 70;
    } else if (statusFilter === 'critical') {
      matchesStatus = school.healthScore < 40;
    } else if (statusFilter === 'healthy') {
      matchesStatus = school.healthScore > 70;
    }

    return matchesSearch && matchesDistrict && matchesStatus;
  });

  // Sorting
  const sortedSchools = [...filteredSchools].sort((a, b) => {
    if (!sortColumn) return 0;

    let aVal: any = a[sortColumn as keyof SchoolRow];
    let bVal: any = b[sortColumn as keyof SchoolRow];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    alert('Exporting directory...');
  };

  const handleSchoolClick = (school: SchoolRow) => {
    setSelectedSchool(school);
  };

  const getHealthScoreColor = (score: number) => {
    if (score > 70) return '#10B981'; // Green
    if (score >= 40) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  const handleLogOut = () => {
    navigate('/rco/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* RCO Sidebar – handles both desktop sidebar and mobile bottom nav */}
      <RCOSidebar
        userName="Dr. Ramesh Kumar"
        userRole="Regional Coordinator"
        notificationCount={0}
        onLogout={handleLogOut}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-[240px]">
        {/* Top Bar */}
        <div
          className="bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between sticky top-0 z-30"
          style={{ height: '64px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
        >
          {/* Left: Mobile Menu + Title */}
          <div className="flex items-center gap-4">
            <div className="lg:hidden min-w-[48px] min-h-[48px] flex items-center justify-center">
              <Menu size={24} color="#0D1B2A" />
            </div>
            <h2
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '18px',
                fontWeight: 600,
                color: '#0D1B2A',
              }}
            >
              School Directory
            </h2>
          </div>

          {/* Right: Language Toggle */}
          <LanguageToggle size="compact" />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '24px',
                fontWeight: 700,
                color: '#0D1B2A',
                marginBottom: '8px',
              }}
              data-i18n="scr_school_directory"
            >
              School Directory
            </h1>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search
                size={20}
                color="#9CA3AF"
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by school name or ID"
                className="w-full pl-12 pr-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F0A500]"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  color: '#0D1B2A',
                }}
                data-i18n="placeholder_school_search"
              />
            </div>
          </div>

          {/* Filter Row + Export Button */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* District Dropdown */}
              <div className="relative">
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F0A500] cursor-pointer"
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    color: '#0D1B2A',
                    minWidth: '150px',
                  }}
                >
                  <option value="all">All Districts</option>
                  {districts.slice(1).map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  color="#6B7280"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg p-1">
                {[
                  { id: 'all', label: 'All', i18n: 'filter_all' },
                  { id: 'needs_attention', label: 'Needs Attention', i18n: 'filter_needs_attn' },
                  { id: 'critical', label: 'Critical', i18n: 'filter_critical' },
                  { id: 'healthy', label: 'Healthy', i18n: 'filter_healthy' },
                ].map((status) => (
                  <button
                    key={status.id}
                    onClick={() => setStatusFilter(status.id)}
                    className="px-3 py-1.5 rounded transition-all"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      fontWeight: statusFilter === status.id ? 600 : 400,
                      color: statusFilter === status.id ? 'white' : '#6B7280',
                      backgroundColor: statusFilter === status.id ? '#F0A500' : 'transparent',
                    }}
                    data-i18n={status.i18n}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F8F9FA] transition-colors"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                fontWeight: 600,
                color: '#6B7280',
              }}
              data-i18n="btn_export_directory"
            >
              <Download size={18} />
              <span>Export Directory</span>
            </button>
          </div>

          {/* School Table */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: '1200px' }}>
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
                    {[
                      { key: 'name', label: 'School Name', width: '250px' },
                      { key: 'district', label: 'District', width: '120px' },
                      { key: 'totalOpenIssues', label: 'Total Open Issues', width: '140px' },
                      { key: 'criticalIssues', label: 'Critical Issues', width: '120px' },
                      { key: 'avgResponseTime', label: 'Avg Response Time', width: '150px' },
                      { key: 'lastIssueFiled', label: 'Last Issue Filed', width: '140px' },
                      { key: 'healthScore', label: 'Health Score', width: '180px' },
                    ].map((col) => (
                      <th
                        key={col.key}
                        className="px-4 py-3 text-left cursor-pointer hover:bg-[#F3F4F6] transition-colors"
                        style={{ width: col.width }}
                        onClick={() => handleSort(col.key)}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '13px',
                              fontWeight: 700,
                              color: '#6B7280',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            {col.label}
                          </span>
                          <ArrowUpDown size={14} color="#9CA3AF" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedSchools.map((school) => {
                    const healthColor = getHealthScoreColor(school.healthScore);

                    return (
                      <tr
                        key={school.id}
                        onClick={() => handleSchoolClick(school)}
                        className="border-b border-[#E5E7EB] hover:bg-[#FFFBF0] cursor-pointer transition-colors"
                      >
                        {/* School Name */}
                        <td className="px-4 py-4">
                          <div>
                            <p
                              style={{
                                fontFamily: 'Noto Sans',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#0D1B2A',
                                marginBottom: '2px',
                              }}
                            >
                              {school.name}
                            </p>
                            <p
                              style={{
                                fontFamily: 'Noto Sans',
                                fontSize: '12px',
                                color: '#9CA3AF',
                              }}
                            >
                              {school.id}
                            </p>
                          </div>
                        </td>

                        {/* District */}
                        <td className="px-4 py-4">
                          <span
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '14px',
                              color: '#4B5563',
                            }}
                          >
                            {school.district}
                          </span>
                        </td>

                        {/* Total Open Issues */}
                        <td className="px-4 py-4">
                          <span
                            className="inline-flex items-center justify-center rounded-full"
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '14px',
                              fontWeight: 700,
                              color: school.totalOpenIssues > 10 ? '#DC2626' : '#0D1B2A',
                              backgroundColor: school.totalOpenIssues > 10 ? '#FEE2E2' : '#F3F4F6',
                              minWidth: '32px',
                              height: '32px',
                              padding: '0 8px',
                            }}
                          >
                            {school.totalOpenIssues}
                          </span>
                        </td>

                        {/* Critical Issues */}
                        <td className="px-4 py-4">
                          <span
                            className="inline-flex items-center justify-center rounded-full"
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '14px',
                              fontWeight: 700,
                              color: school.criticalIssues > 0 ? 'white' : '#6B7280',
                              backgroundColor: school.criticalIssues > 0 ? '#DC2626' : '#F3F4F6',
                              minWidth: '32px',
                              height: '32px',
                              padding: '0 8px',
                            }}
                          >
                            {school.criticalIssues}
                          </span>
                        </td>

                        {/* Avg Response Time */}
                        <td className="px-4 py-4">
                          <span
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '14px',
                              color: '#4B5563',
                            }}
                          >
                            {school.avgResponseTime}h
                          </span>
                        </td>

                        {/* Last Issue Filed */}
                        <td className="px-4 py-4">
                          <span
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '13px',
                              color: '#9CA3AF',
                            }}
                          >
                            {school.lastIssueFiled}
                          </span>
                        </td>

                        {/* Health Score */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div
                                className="w-full rounded-full overflow-hidden"
                                style={{
                                  height: '8px',
                                  backgroundColor: '#E5E7EB',
                                }}
                              >
                                <div
                                  style={{
                                    width: `${school.healthScore}%`,
                                    height: '100%',
                                    backgroundColor: healthColor,
                                    transition: 'width 0.3s ease',
                                  }}
                                />
                              </div>
                            </div>
                            <span
                              style={{
                                fontFamily: 'Noto Sans',
                                fontSize: '14px',
                                fontWeight: 700,
                                color: healthColor,
                                minWidth: '40px',
                                textAlign: 'right',
                              }}
                            >
                              {school.healthScore}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Row Count Caption */}
          <div className="mt-4">
            <p
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '13px',
                color: '#6B7280',
              }}
            >
              Showing {sortedSchools.length} of {allSchools.length} schools
            </p>
          </div>
        </main>
      </div>

      {/* School Profile Modal */}
      <SchoolProfileModal
        isOpen={selectedSchool !== null}
        onClose={() => setSelectedSchool(null)}
        school={selectedSchool}
      />
    </div>
  );
}
