import { useState } from 'react';
import {
  ChevronDown,
  Download,
  Menu,
  Maximize2,
  Flag,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { RCOSidebar } from '../components/RCOSidebar';
import { DownloadAnalyticsModal } from '../components/DownloadAnalyticsModal';
import { ChartFullScreenModal } from '../components/ChartFullScreenModal';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface OfficerData {
  name: string;
  role: string;
  responseRate: number;
  avgResolutionTime: number; // hours
  activeIssues: number;
  resolvedIssues: number;
}

export function RCOAnalytics() {
  const [dateRange, setDateRange] = useState('last_7_days');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [fullScreenChart, setFullScreenChart] = useState<{
    title: string;
    type: 'donut' | 'line' | 'bar';
    data: ChartData[];
  } | null>(null);
  const navigate = useNavigate();

  const districtName = 'Adilabad District';

  // Get date range label
  const getDateRangeLabel = () => {
    switch (dateRange) {
      case 'last_7_days':
        return 'Last 7 Days';
      case 'last_30_days':
        return 'Last 30 Days';
      case 'this_month':
        return 'This Month';
      case 'custom':
        return 'Custom Range';
      default:
        return 'Last 7 Days';
    }
  };

  // KPI Data
  const kpiData = [
    {
      id: 'reported',
      label: 'Issues Reported',
      value: 247,
      change: '+12%',
      trend: 'up' as const,
      i18n: 'kpi_reported',
    },
    {
      id: 'resolved',
      label: 'Resolved',
      value: 189,
      change: '+8%',
      trend: 'up' as const,
      i18n: 'kpi_resolved',
    },
    {
      id: 'avg_resolution',
      label: 'Avg Resolution Time',
      value: '3.2 days',
      change: '-15%',
      trend: 'down' as const,
      i18n: 'kpi_avg_resolution',
    },
    {
      id: 'escalation_rate',
      label: 'Escalation Rate %',
      value: '18%',
      change: '-5%',
      trend: 'down' as const,
      i18n: 'kpi_escalation_rate',
    },
  ];

  // Chart 1: Issues by Category (Donut)
  const categoryData: ChartData[] = [
    { name: 'Infrastructure', value: 45, color: '#F0A500' },
    { name: 'Safety', value: 38, color: '#DC2626' },
    { name: 'Food', value: 32, color: '#059669' },
    { name: 'Health', value: 28, color: '#2563EB' },
    { name: 'Academics', value: 24, color: '#7C3AED' },
    { name: 'Utilities', value: 20, color: '#6B7280' },
  ];

  // Chart 2: Resolution Time Trend (Line)
  const resolutionTrendData: ChartData[] = [
    { name: 'Mon', value: 4.2 },
    { name: 'Tue', value: 3.8 },
    { name: 'Wed', value: 4.5 },
    { name: 'Thu', value: 3.2 },
    { name: 'Fri', value: 2.9 },
    { name: 'Sat', value: 3.5 },
    { name: 'Sun', value: 3.1 },
  ];

  // Chart 3: Per-School Heatmap (simplified as table)
  const schoolHeatmapData = [
    { school: 'TGTWREIS Adilabad', week1: 5, week2: 3, week3: 8, week4: 2 },
    { school: 'TGTWREIS Nirmal', week1: 12, week2: 15, week3: 10, week4: 8 },
    { school: 'TGTWREIS Mancherial', week1: 2, week2: 1, week3: 3, week4: 1 },
    { school: 'TGTWREIS Jagtial', week1: 18, week2: 20, week3: 15, week4: 12 },
    { school: 'TGTWREIS Karimnagar', week1: 4, week2: 3, week3: 5, week4: 2 },
  ];

  // Chart 4: Official Response Rate (Bar)
  const responseRateData: ChartData[] = [
    { name: 'Dr. Rajesh Kumar', value: 95, color: '#10B981' },
    { name: 'Mrs. Lakshmi Devi', value: 88, color: '#F59E0B' },
    { name: 'Mr. Suresh Reddy', value: 92, color: '#10B981' },
    { name: 'Dr. Priya Sharma', value: 78, color: '#EF4444' },
    { name: 'Mr. Anil Kumar', value: 85, color: '#F59E0B' },
  ];

  // Accountability Table Data
  const officerData: OfficerData[] = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Headmaster - Adilabad',
      responseRate: 95,
      avgResolutionTime: 28,
      activeIssues: 5,
      resolvedIssues: 42,
    },
    {
      name: 'Mrs. Lakshmi Devi',
      role: 'Headmaster - Nirmal',
      responseRate: 88,
      avgResolutionTime: 36,
      activeIssues: 12,
      resolvedIssues: 38,
    },
    {
      name: 'Mr. Suresh Reddy',
      role: 'Headmaster - Mancherial',
      responseRate: 92,
      avgResolutionTime: 22,
      activeIssues: 3,
      resolvedIssues: 45,
    },
    {
      name: 'Dr. Priya Sharma',
      role: 'Headmaster - Jagtial',
      responseRate: 78,
      avgResolutionTime: 48,
      activeIssues: 15,
      resolvedIssues: 30,
    },
    {
      name: 'Mr. Anil Kumar',
      role: 'Headmaster - Karimnagar',
      responseRate: 85,
      avgResolutionTime: 32,
      activeIssues: 5,
      resolvedIssues: 40,
    },
  ];

  const getHeatmapColor = (count: number) => {
    if (count === 0) return '#F3F4F6';
    if (count <= 3) return '#D1FAE5';
    if (count <= 7) return '#FEF3C7';
    if (count <= 12) return '#FED7AA';
    return '#FEE2E2';
  };

  const handleFlagOfficer = (officerName: string) => {
    alert(`Flagging ${officerName} for review...`);
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
              Analytics
            </h2>
          </div>

          {/* Right: Language Toggle */}
          <LanguageToggle size="compact" />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header + Controls */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#0D1B2A',
                }}
                data-i18n="scr_analytics"
              >
                Analytics — {districtName}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Date Range Selector */}
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F0A500] cursor-pointer"
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    color: '#0D1B2A',
                    minWidth: '160px',
                  }}
                >
                  <option value="last_7_days">Last 7 Days</option>
                  <option value="last_30_days">Last 30 Days</option>
                  <option value="this_month">This Month</option>
                  <option value="custom">Custom Range</option>
                </select>
                <ChevronDown
                  size={16}
                  color="#6B7280"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                />
              </div>

              {/* Download Report Button */}
              <button
                onClick={() => setDownloadModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2 rounded-lg transition-colors"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'white',
                  backgroundColor: '#F0A500',
                  height: '40px',
                }}
                data-i18n="btn_download_report"
              >
                <Download size={18} />
                <span>Download Report</span>
              </button>
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {kpiData.map((kpi) => (
              <div
                key={kpi.id}
                className="bg-white rounded-lg p-4 border border-[#E5E7EB]"
                style={{
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#6B7280',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                  data-i18n={kpi.i18n}
                >
                  {kpi.label}
                </p>
                <div className="flex items-end justify-between">
                  <p
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '28px',
                      fontWeight: 700,
                      color: '#0D1B2A',
                    }}
                  >
                    {kpi.value}
                  </p>
                  <div
                    className="flex items-center gap-1"
                    style={{
                      color: kpi.trend === 'up' ? '#10B981' : '#EF4444',
                    }}
                  >
                    {kpi.trend === 'up' ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    <span
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      {kpi.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid 2x2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Chart 1: Issues by Category */}
            <div
              className="bg-white rounded-lg p-4 border border-[#E5E7EB]"
              style={{
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                  }}
                >
                  Issues by Category
                </h3>
                <button
                  onClick={() =>
                    setFullScreenChart({
                      title: 'Issues by Category',
                      type: 'donut',
                      data: categoryData,
                    })
                  }
                  className="min-w-[32px] min-h-[32px] flex items-center justify-center rounded hover:bg-[#F8F9FA] transition-colors"
                >
                  <Maximize2 size={18} color="#6B7280" />
                </button>
              </div>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius="50%"
                      outerRadius="70%"
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-category-${index}-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontFamily: 'Noto Sans',
                        fontSize: '14px',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{
                        fontFamily: 'Noto Sans',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Resolution Time Trend */}
            <div
              className="bg-white rounded-lg p-4 border border-[#E5E7EB]"
              style={{
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                  }}
                >
                  Resolution Time Trend
                </h3>
                <button
                  onClick={() =>
                    setFullScreenChart({
                      title: 'Resolution Time Trend',
                      type: 'line',
                      data: resolutionTrendData,
                    })
                  }
                  className="min-w-[32px] min-h-[32px] flex items-center justify-center rounded hover:bg-[#F8F9FA] transition-colors"
                >
                  <Maximize2 size={18} color="#6B7280" />
                </button>
              </div>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={resolutionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="name"
                      stroke="#6B7280"
                      style={{ fontFamily: 'Noto Sans', fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="#6B7280"
                      style={{ fontFamily: 'Noto Sans', fontSize: '12px' }}
                      label={{
                        value: 'Days',
                        angle: -90,
                        position: 'insideLeft',
                        style: { fontFamily: 'Noto Sans', fontSize: '12px' },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontFamily: 'Noto Sans',
                        fontSize: '14px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#0D1B2A"
                      strokeWidth={2}
                      dot={{ fill: '#0D1B2A', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Per-School Heatmap */}
            <div
              className="bg-white rounded-lg p-4 border border-[#E5E7EB]"
              style={{
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                  }}
                >
                  Per-School Issue Heatmap
                </h3>
                <button className="min-w-[32px] min-h-[32px] flex items-center justify-center rounded hover:bg-[#F8F9FA] transition-colors">
                  <Maximize2 size={18} color="#6B7280" />
                </button>
              </div>
              <div style={{ height: '300px', overflowY: 'auto' }}>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th
                        className="text-left p-2 sticky top-0 bg-white"
                        style={{
                          fontFamily: 'Noto Sans',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#6B7280',
                          textTransform: 'uppercase',
                        }}
                      >
                        School
                      </th>
                      {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week) => (
                        <th
                          key={week}
                          className="text-center p-2 sticky top-0 bg-white"
                          style={{
                            fontFamily: 'Noto Sans',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#6B7280',
                            textTransform: 'uppercase',
                          }}
                        >
                          {week}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {schoolHeatmapData.map((row, idx) => (
                      <tr key={idx}>
                        <td
                          className="p-2"
                          style={{
                            fontFamily: 'Noto Sans',
                            fontSize: '12px',
                            color: '#0D1B2A',
                          }}
                        >
                          {row.school.replace('TGTWREIS ', '')}
                        </td>
                        {[row.week1, row.week2, row.week3, row.week4].map(
                          (count, cellIdx) => (
                            <td key={cellIdx} className="p-2">
                              <div
                                className="rounded text-center"
                                style={{
                                  backgroundColor: getHeatmapColor(count),
                                  padding: '4px',
                                  fontFamily: 'Noto Sans',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  color: count > 7 ? '#991B1B' : '#0D1B2A',
                                }}
                              >
                                {count}
                              </div>
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chart 4: Official Response Rate */}
            <div
              className="bg-white rounded-lg p-4 border border-[#E5E7EB]"
              style={{
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                  }}
                >
                  Official Response Rate
                </h3>
                <button
                  onClick={() =>
                    setFullScreenChart({
                      title: 'Official Response Rate',
                      type: 'bar',
                      data: responseRateData,
                    })
                  }
                  className="min-w-[32px] min-h-[32px] flex items-center justify-center rounded hover:bg-[#F8F9FA] transition-colors"
                >
                  <Maximize2 size={18} color="#6B7280" />
                </button>
              </div>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={responseRateData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      stroke="#6B7280"
                      style={{ fontFamily: 'Noto Sans', fontSize: '12px' }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={120}
                      stroke="#6B7280"
                      style={{ fontFamily: 'Noto Sans', fontSize: '11px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontFamily: 'Noto Sans',
                        fontSize: '14px',
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="#F0A500" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Accountability Table */}
          <div
            className="bg-white rounded-lg p-4 border border-[#E5E7EB]"
            style={{
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <h3
              className="mb-4"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '18px',
                fontWeight: 700,
                color: '#0D1B2A',
              }}
              data-i18n="lbl_accountability_table"
            >
              Accountability & Resolution Metrics
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    <th
                      className="text-left p-3"
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#6B7280',
                        textTransform: 'uppercase',
                      }}
                    >
                      Officer
                    </th>
                    <th
                      className="text-left p-3"
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#6B7280',
                        textTransform: 'uppercase',
                      }}
                    >
                      Role
                    </th>
                    <th
                      className="text-center p-3"
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#6B7280',
                        textTransform: 'uppercase',
                      }}
                    >
                      Response Rate
                    </th>
                    <th
                      className="text-center p-3"
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#6B7280',
                        textTransform: 'uppercase',
                      }}
                    >
                      Avg Resolution (hrs)
                    </th>
                    <th
                      className="text-center p-3"
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#6B7280',
                        textTransform: 'uppercase',
                      }}
                    >
                      Active Issues
                    </th>
                    <th
                      className="text-center p-3"
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#6B7280',
                        textTransform: 'uppercase',
                      }}
                    >
                      Resolved
                    </th>
                    <th
                      className="text-center p-3"
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#6B7280',
                        textTransform: 'uppercase',
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {officerData.map((officer, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-[#E5E7EB] hover:bg-[#F8F9FA] transition-colors"
                    >
                      <td
                        className="p-3"
                        style={{
                          fontFamily: 'Noto Sans',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#0D1B2A',
                        }}
                      >
                        {officer.name}
                      </td>
                      <td
                        className="p-3"
                        style={{
                          fontFamily: 'Noto Sans',
                          fontSize: '13px',
                          color: '#6B7280',
                        }}
                      >
                        {officer.role}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className="inline-block px-3 py-1 rounded-full"
                          style={{
                            backgroundColor:
                              officer.responseRate >= 90
                                ? '#D1FAE5'
                                : officer.responseRate >= 80
                                ? '#FEF3C7'
                                : '#FEE2E2',
                            color:
                              officer.responseRate >= 90
                                ? '#065F46'
                                : officer.responseRate >= 80
                                ? '#92400E'
                                : '#991B1B',
                            fontFamily: 'Noto Sans',
                            fontSize: '13px',
                            fontWeight: 700,
                          }}
                        >
                          {officer.responseRate}%
                        </span>
                      </td>
                      <td
                        className="p-3 text-center"
                        style={{
                          fontFamily: 'Noto Sans',
                          fontSize: '14px',
                          color: '#4B5563',
                        }}
                      >
                        {officer.avgResolutionTime}h
                      </td>
                      <td
                        className="p-3 text-center"
                        style={{
                          fontFamily: 'Noto Sans',
                          fontSize: '14px',
                          fontWeight: 700,
                          color: officer.activeIssues > 10 ? '#DC2626' : '#0D1B2A',
                        }}
                      >
                        {officer.activeIssues}
                      </td>
                      <td
                        className="p-3 text-center"
                        style={{
                          fontFamily: 'Noto Sans',
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#059669',
                        }}
                      >
                        {officer.resolvedIssues}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleFlagOfficer(officer.name)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-[#F59E0B] hover:bg-[#FEF3C7] transition-colors"
                          style={{
                            fontFamily: 'Noto Sans',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#D97706',
                          }}
                        >
                          <Flag size={14} />
                          <span>Flag</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <DownloadAnalyticsModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        districtName={districtName}
        dateRange={getDateRangeLabel()}
      />

      {fullScreenChart && (
        <ChartFullScreenModal
          isOpen={true}
          onClose={() => setFullScreenChart(null)}
          chartTitle={fullScreenChart.title}
          chartType={fullScreenChart.type}
          data={fullScreenChart.data}
          onDrillDown={(item) => {
            console.log('Drill down into:', item);
            // In production, this would navigate to filtered issue list
          }}
        />
      )}
    </div>
  );
}