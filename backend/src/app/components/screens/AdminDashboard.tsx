import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';
import {
  Dashboard,
  School,
  Group,
  Person,
  Assessment,
  ReportProblem,
  TrendingUp,
  CheckCircle,
  Settings,
  Logout,
  Add,
} from '@mui/icons-material';

interface Stats {
  totalSchools: number;
  activeSchools: number;
  totalStudents: number;
  totalUsers: number;
  totalIssues: number;
  openIssues: number;
}

interface RecentSchool {
  id: string;
  name: string;
  district: string;
  created_at: string;
  student_count: number;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalSchools: 0,
    activeSchools: 0,
    totalStudents: 0,
    totalUsers: 0,
    totalIssues: 0,
    openIssues: 0,
  });
  const [recentSchools, setRecentSchools] = useState<RecentSchool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);

      // Load schools stats
      const { data: schools, error: schoolsError } = await supabase
        .from('schools')
        .select('id, student_count, is_active');

      if (schoolsError) throw schoolsError;

      const totalSchools = schools?.length || 0;
      const activeSchools = schools?.filter((s) => s.is_active).length || 0;
      const totalStudents = schools?.reduce((sum, s) => sum + (s.student_count || 0), 0) || 0;

      // Load users count
      const { count: usersCount, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      // Load issues stats
      const { data: issues, error: issuesError } = await supabase
        .from('issues')
        .select('id, status');

      if (issuesError) throw issuesError;

      const totalIssues = issues?.length || 0;
      const openIssues = issues?.filter((i) => i.status !== 'resolved' && i.status !== 'closed').length || 0;

      // Load recent schools
      const { data: recent, error: recentError } = await supabase
        .from('schools')
        .select('id, name, district, created_at, student_count')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      setStats({
        totalSchools,
        activeSchools,
        totalStudents,
        totalUsers: usersCount || 0,
        totalIssues,
        openIssues,
      });

      setRecentSchools(recent || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col bg-[#0D1B2A]">
        {/* Logo */}
        <div className="p-6 border-b border-[#162336]">
          <h1 className="text-2xl font-bold text-[#F0A500]">SETU</h1>
          <p className="text-xs text-gray-400 mt-1">Super Admin Portal</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative min-h-[48px] bg-[#162336]"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r bg-[#F0A500]" />
            <Dashboard style={{ fontSize: 20 }} className="text-white" />
            <span className="text-sm text-white font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/admin/schools')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all min-h-[48px] hover:bg-[#162336]"
          >
            <School style={{ fontSize: 20 }} className="text-gray-400" />
            <span className="text-sm text-gray-400">School Management</span>
          </button>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all min-h-[48px] hover:bg-[#162336] opacity-50 cursor-not-allowed"
            disabled
          >
            <Group style={{ fontSize: 20 }} className="text-gray-400" />
            <span className="text-sm text-gray-400">User Management</span>
          </button>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all min-h-[48px] hover:bg-[#162336] opacity-50 cursor-not-allowed"
            disabled
          >
            <Assessment style={{ fontSize: 20 }} className="text-gray-400" />
            <span className="text-sm text-gray-400">System Analytics</span>
          </button>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all min-h-[48px] hover:bg-[#162336] opacity-50 cursor-not-allowed"
            disabled
          >
            <Settings style={{ fontSize: 20 }} className="text-gray-400" />
            <span className="text-sm text-gray-400">Settings</span>
          </button>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#162336]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all min-h-[48px] hover:bg-red-900/20 text-red-400"
          >
            <Logout style={{ fontSize: 20 }} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-[#0D1B2A]">Admin Dashboard</h2>
            <p className="text-sm text-gray-500">SETU System Overview</p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading dashboard...</div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Total Schools */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-[#F0A500] shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <School className="text-[#F0A500]" style={{ fontSize: 32 }} />
                  </div>
                  <div className="text-3xl font-bold text-[#0D1B2A] mb-1">{stats.totalSchools}</div>
                  <div className="text-sm text-gray-600">Total Schools</div>
                  <div className="mt-2 text-xs text-green-600">
                    {stats.activeSchools} active
                  </div>
                </div>

                {/* Total Students */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <Group className="text-blue-500" style={{ fontSize: 32 }} />
                  </div>
                  <div className="text-3xl font-bold text-[#0D1B2A] mb-1">
                    {stats.totalStudents.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>

                {/* Total Users */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-purple-500 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <Person className="text-purple-500" style={{ fontSize: 32 }} />
                  </div>
                  <div className="text-3xl font-bold text-[#0D1B2A] mb-1">{stats.totalUsers}</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                  <div className="mt-2 text-xs text-gray-500">Staff & Principals</div>
                </div>

                {/* Total Issues */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-orange-500 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <ReportProblem className="text-orange-500" style={{ fontSize: 32 }} />
                  </div>
                  <div className="text-3xl font-bold text-[#0D1B2A] mb-1">{stats.totalIssues}</div>
                  <div className="text-sm text-gray-600">Total Issues</div>
                  <div className="mt-2 text-xs text-orange-600">
                    {stats.openIssues} open
                  </div>
                </div>

                {/* System Health */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-green-500 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="text-green-500" style={{ fontSize: 32 }} />
                  </div>
                  <div className="text-3xl font-bold text-[#0D1B2A] mb-1">
                    {stats.totalSchools > 0
                      ? Math.round((stats.activeSchools / stats.totalSchools) * 100)
                      : 0}
                    %
                  </div>
                  <div className="text-sm text-gray-600">System Health</div>
                  <div className="mt-2 text-xs text-green-600">Active schools ratio</div>
                </div>

                {/* Performance */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-indigo-500 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="text-indigo-500" style={{ fontSize: 32 }} />
                  </div>
                  <div className="text-3xl font-bold text-[#0D1B2A] mb-1">
                    {stats.totalIssues > 0
                      ? Math.round(((stats.totalIssues - stats.openIssues) / stats.totalIssues) * 100)
                      : 0}
                    %
                  </div>
                  <div className="text-sm text-gray-600">Resolution Rate</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h3 className="text-lg font-semibold text-[#0D1B2A] mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => navigate('/admin/schools/add')}
                    className="flex items-center gap-3 p-4 bg-[#F0A500] text-[#0D1B2A] rounded-lg hover:bg-[#d89400] transition-colors"
                  >
                    <Add style={{ fontSize: 24 }} />
                    <div className="text-left">
                      <div className="font-medium">Add New School</div>
                      <div className="text-xs opacity-80">Register a new school</div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('/admin/schools')}
                    className="flex items-center gap-3 p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <School style={{ fontSize: 24 }} />
                    <div className="text-left">
                      <div className="font-medium">Manage Schools</div>
                      <div className="text-xs opacity-80">View all schools</div>
                    </div>
                  </button>

                  <button
                    className="flex items-center gap-3 p-4 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
                    disabled
                  >
                    <Assessment style={{ fontSize: 24 }} />
                    <div className="text-left">
                      <div className="font-medium">View Reports</div>
                      <div className="text-xs opacity-80">Coming soon</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Schools */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#0D1B2A]">Recently Added Schools</h3>
                  <button
                    onClick={() => navigate('/admin/schools')}
                    className="text-sm text-[#F0A500] hover:underline"
                  >
                    View All →
                  </button>
                </div>

                {recentSchools.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <School className="mx-auto mb-2 text-gray-300" style={{ fontSize: 48 }} />
                    <p>No schools added yet</p>
                    <button
                      onClick={() => navigate('/admin/schools/add')}
                      className="mt-3 text-[#F0A500] hover:underline text-sm"
                    >
                      Add your first school
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentSchools.map((school) => (
                      <div
                        key={school.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-[#0D1B2A]">{school.name}</div>
                          <div className="text-sm text-gray-600">
                            {school.district} • {school.student_count} students
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(school.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
