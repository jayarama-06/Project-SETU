import {
  Add,
  School,
  Phone,
  LocationOn,
  Group,
  CheckCircle,
  Cancel,
  Dashboard,
  Assessment,
  Settings,
  Logout,
} from '@mui/icons-material';

interface SchoolType {
  id: string;
  name: string;
  udise_code: string;
  district: string;
  region: string | null;
  principal_name: string | null;
  contact_phone: string | null;
  whatsapp_number: string | null;
  address: string | null;
  student_count: number;
  is_active: boolean;
  created_at: string;
}

export function AdminSchools() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSchools();
  }, []);

  async function loadSchools() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSchools(data || []);
    } catch (err) {
      console.error('Error loading schools:', err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleSchoolStatus(schoolId: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('schools')
        .update({ is_active: !currentStatus })
        .eq('id', schoolId);

      if (error) throw error;
      await loadSchools(); // Reload list
    } catch (err) {
      console.error('Error updating school status:', err);
      alert('Failed to update school status');
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }

  const filteredSchools = schools.filter((school) => {
    // Apply status filter
    if (filter === 'active' && !school.is_active) return false;
    if (filter === 'inactive' && school.is_active) return false;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        school.name.toLowerCase().includes(query) ||
        school.udise_code.toLowerCase().includes(query) ||
        school.district.toLowerCase().includes(query)
      );
    }

    return true;
  });

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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all min-h-[48px] hover:bg-[#162336]"
          >
            <Dashboard style={{ fontSize: 20 }} className="text-gray-400" />
            <span className="text-sm text-gray-400">Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/admin/schools')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative min-h-[48px] bg-[#162336]"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r bg-[#F0A500]" />
            <School style={{ fontSize: 20 }} className="text-white" />
            <span className="text-sm text-white font-medium">School Management</span>
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
            <h2 className="text-xl font-semibold text-[#0D1B2A]">School Management</h2>
            <p className="text-sm text-gray-500">Manage all registered schools</p>
          </div>
          <button
            onClick={() => navigate('/admin/schools/add')}
            className="flex items-center gap-2 bg-[#F0A500] text-[#0D1B2A] px-4 py-2.5 rounded-lg font-medium hover:bg-[#d89400] transition-colors"
          >
            <Add style={{ fontSize: 20 }} />
            Add School
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border-l-4 border-[#F0A500] shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Total Schools</div>
              <div className="text-2xl font-semibold text-[#0D1B2A]">{schools.length}</div>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Active Schools</div>
              <div className="text-2xl font-semibold text-[#0D1B2A]">
                {schools.filter((s) => s.is_active).length}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Inactive Schools</div>
              <div className="text-2xl font-semibold text-[#0D1B2A]">
                {schools.filter((s) => !s.is_active).length}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Total Students</div>
              <div className="text-2xl font-semibold text-[#0D1B2A]">
                {schools.reduce((sum, s) => sum + s.student_count, 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by school name, UDISE code, or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-[#0D1B2A] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'active'
                      ? 'bg-[#0D1B2A] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilter('inactive')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'inactive'
                      ? 'bg-[#0D1B2A] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>

          {/* School List */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading schools...</div>
          ) : filteredSchools.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <School className="text-gray-300 mx-auto mb-3" style={{ fontSize: 64 }} />
              <p className="text-gray-500 mb-4">No schools found</p>
              {searchQuery || filter !== 'all' ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilter('all');
                  }}
                  className="text-[#F0A500] hover:underline text-sm"
                >
                  Clear filters
                </button>
              ) : (
                <button
                  onClick={() => navigate('/admin/schools/add')}
                  className="text-[#F0A500] hover:underline text-sm"
                >
                  Add your first school
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSchools.map((school) => (
                <div
                  key={school.id}
                  className="bg-white rounded-lg p-5 hover:shadow-md transition-shadow border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-[#0D1B2A]">{school.name}</h3>
                        {school.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                            <CheckCircle style={{ fontSize: 14 }} />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                            <Cancel style={{ fontSize: 14 }} />
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <School style={{ fontSize: 18 }} className="text-gray-400" />
                          <span>UDISE: {school.udise_code}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <LocationOn style={{ fontSize: 18 }} className="text-gray-400" />
                          <span>{school.district}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Group style={{ fontSize: 18 }} className="text-gray-400" />
                          <span>{school.student_count} Students</span>
                        </div>
                        {school.contact_phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone style={{ fontSize: 18 }} className="text-gray-400" />
                            <span>{school.contact_phone}</span>
                          </div>
                        )}
                        {school.principal_name && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Principal:</span> {school.principal_name}
                          </div>
                        )}
                      </div>

                      {school.address && <p className="text-sm text-gray-500">{school.address}</p>}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() =>
                          navigate(`/admin/schools/create-principal?schoolId=${school.id}`)
                        }
                        className="px-4 py-2 bg-[#F0A500] text-[#0D1B2A] rounded-lg text-sm font-medium hover:bg-[#d89400] transition-colors whitespace-nowrap"
                      >
                        Create Principal
                      </button>
                      <button
                        onClick={() => toggleSchoolStatus(school.id, school.is_active)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                          school.is_active
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {school.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
