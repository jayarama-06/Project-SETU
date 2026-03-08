import { useState } from 'react';
import { Bell, LayoutDashboard, List, School, BarChart3, Settings, User } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { motion } from 'motion/react';

export function OfficialDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');

  // Temporary mock data
  const totalOpen = 24;
  const resolvedToday = 8;
  const escalated = 5;

  const priorityIssues = [
    {
      id: 'GRV-1001',
      title: 'Water supply disruption',
      category: 'Infrastructure',
      school_name: 'TGTWREIS Gurukulam, Adilabad',
      escalation_level: 3,
    },
    {
      id: 'GRV-1002',
      title: 'Teacher shortage',
      category: 'Staffing',
      school_name: 'TGTWREIS Gurukulam, Nirmal',
      escalation_level: 2,
    },
  ];

  const getEscalationBadge = (level: number) => {
    const badges: Record<number, { bg: string; text: string; label: string }> = {
      0: { bg: '#E5E7EB', text: '#6B7280', label: 'L0' },
      1: { bg: '#DBEAFE', text: '#1D4ED8', label: 'L1' },
      2: { bg: '#FEF3C7', text: '#D97706', label: 'L2' },
      3: { bg: '#FED7AA', text: '#C2410C', label: 'L3' },
      4: { bg: '#FECACA', text: '#B91C1C', label: 'L4' },
    };
    const badge = badges[level] || badges[0];
    return (
      <span
        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold"
        style={{ backgroundColor: badge.bg, color: badge.text }}
      >
        {badge.label}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Sidebar */}
      <div
        className="w-64 flex-shrink-0 flex flex-col bg-[#0D1B2A]"
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#162336]">
          <h1 className="text-2xl font-bold text-[#F0A500]">
            SETU
          </h1>
          <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'grievance', icon: List, label: 'Grievance Monitor' },
            { id: 'schools', icon: School, label: 'School Profile' },
            { id: 'analytics', icon: BarChart3, label: 'Analytics Reports' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative min-h-[48px] ${
                  isActive ? 'bg-[#162336]' : 'hover:bg-[#162336]'
                }`}
              >
                {isActive && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-r bg-[#F0A500]"
                  />
                )}
                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                <span className={`text-sm ${isActive ? 'text-white font-medium' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[#162336]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F0A500] flex items-center justify-center">
              <User size={20} color="#0D1B2A" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">District Officer</p>
              <p className="text-xs text-gray-400">Adilabad</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-14 flex items-center justify-between px-6 bg-[#FFFFFF] border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-lg font-semibold text-[#0D1B2A]">
              Adilabad District
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle size="compact" />
            <button className="relative min-w-[48px] min-h-[48px] flex items-center justify-center">
              <Bell size={20} color="#0D1B2A" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] rounded-full text-xs flex items-center justify-center text-white">
                5
              </span>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Open Issues', value: totalOpen, color: '#0D1B2A' },
              { label: 'Resolved Today', value: resolvedToday, color: '#22C55E' },
              { label: 'Avg Resolution Time', value: '4.2d', color: '#4F46E5' },
              { label: 'Escalated / Overdue', value: escalated, color: '#EF4444' },
            ].map((kpi, index) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#FFFFFF] rounded-lg p-6 border border-[#E5E7EB] cursor-pointer hover:shadow-md transition-shadow"
                style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}
              >
                <p className="text-xs uppercase tracking-wide text-[#6B7280] mb-2">
                  {kpi.label}
                </p>
                <p className="text-3xl font-bold" style={{ color: kpi.color }}>
                  {kpi.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Priority Escalations */}
          <div className="bg-[#FFFFFF] rounded-lg border border-[#E5E7EB] p-6" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#0D1B2A]">
                Priority Escalations
              </h3>
              <button className="text-sm text-[#F0A500] hover:underline min-h-[48px] px-4">
                View All →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wide text-[#6B7280] font-medium">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wide text-[#6B7280] font-medium">
                      Issue
                    </th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wide text-[#6B7280] font-medium">
                      School
                    </th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wide text-[#6B7280] font-medium">
                      Level
                    </th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wide text-[#6B7280] font-medium">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {priorityIssues.map((issue) => (
                    <tr
                      key={issue.id}
                      className="border-b border-[#E5E7EB] hover:bg-[#F8F9FA] transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-[#6B7280]">{issue.id}</td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-[#0D1B2A]">{issue.title}</p>
                        <p className="text-xs text-[#6B7280]">{issue.category}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#6B7280]">
                        {issue.school_name}
                      </td>
                      <td className="py-3 px-4">
                        {getEscalationBadge(issue.escalation_level)}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          className="text-sm px-3 py-1.5 rounded border border-[#0D1B2A] text-[#0D1B2A] hover:bg-[#F8F9FA] transition-colors min-h-[40px]"
                          style={{ borderRadius: '8px' }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
