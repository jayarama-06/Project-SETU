import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { OfflineBanner } from '../components/OfflineBanner';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

type DateRange = 'month' | '30days' | 'all';

interface StaffMember {
  id: string;
  name: string;
  role: 'Teacher' | 'Warden' | 'Other';
  filedCount: number;
  openCount: number;
  resolvedCount: number;
  mostRecentIssue?: {
    title: string;
    timestamp: string;
  };
}

// Mock staff data
const MOCK_STAFF: StaffMember[] = [
  {
    id: 'staff-001',
    name: 'Ravi Kumar',
    role: 'Teacher',
    filedCount: 8,
    openCount: 2,
    resolvedCount: 6,
    mostRecentIssue: {
      title: 'Broken water pipe in girls hostel',
      timestamp: '2 hours ago',
    },
  },
  {
    id: 'staff-002',
    name: 'Lakshmi Devi',
    role: 'Warden',
    filedCount: 12,
    openCount: 0,
    resolvedCount: 12,
    mostRecentIssue: {
      title: 'Food quality concerns in mess',
      timestamp: '1 day ago',
    },
  },
  {
    id: 'staff-003',
    name: 'Suresh Babu',
    role: 'Teacher',
    filedCount: 5,
    openCount: 3,
    resolvedCount: 2,
    mostRecentIssue: {
      title: 'Library AC not working',
      timestamp: '3 days ago',
    },
  },
  {
    id: 'staff-004',
    name: 'Anita Reddy',
    role: 'Warden',
    filedCount: 15,
    openCount: 1,
    resolvedCount: 14,
    mostRecentIssue: {
      title: 'Hostel bathroom maintenance needed',
      timestamp: '5 days ago',
    },
  },
  {
    id: 'staff-005',
    name: 'Prakash Rao',
    role: 'Other',
    filedCount: 3,
    openCount: 1,
    resolvedCount: 2,
    mostRecentIssue: {
      title: 'Sports equipment storage issue',
      timestamp: '1 week ago',
    },
  },
];

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Role chip colors
const getRoleStyle = (role: string) => {
  const styles = {
    Teacher: { bg: '#DBEAFE', text: '#1E40AF' },
    Warden: { bg: '#FEF3C7', text: '#92400E' },
    Other: { bg: '#F3F4F6', text: '#6B7280' },
  };
  return styles[role as keyof typeof styles] || styles.Other;
};

export function StaffActivityOverview() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);

  const staffMembers = MOCK_STAFF;

  // Pull to refresh handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const scrollTop = (e.currentTarget as HTMLElement).scrollTop;

    if (scrollTop === 0 && currentY > touchStartY) {
      const distance = Math.min(currentY - touchStartY, 120);
      setPullDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 80) {
      handleRefresh();
    }
    setPullDistance(0);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const handleStaffCardClick = (staffId: string, staffName: string) => {
    // Navigate to School-Wide Issues List filtered by this staff member
    navigate('/principal/all-issues', { 
      state: { 
        filterStaff: [staffId],
        staffName: staffName 
      } 
    });
  };

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
          data-i18n="scr_staff_activity"
        >
          Staff Activity
        </h1>
        <LanguageToggle size="compact" />
      </div>

      {/* Pull-to-refresh indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="flex justify-center items-center bg-[#F8F9FA]"
          style={{
            height: isRefreshing ? '48px' : `${pullDistance}px`,
            overflow: 'hidden',
            transition: isRefreshing ? 'height 0.3s' : 'none',
          }}
        >
          <motion.div
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: '3px solid #FEF3C7',
              borderTopColor: '#F0A500',
              opacity: isRefreshing ? 1 : pullDistance / 80,
            }}
          />
        </div>
      )}

      {/* Main Content - Scrollable */}
      <main
        className="flex-1 overflow-y-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Introduction Text */}
        <div style={{ padding: '16px 16px 12px 16px' }}>
          <p
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              color: '#6B7280',
              lineHeight: '1.5',
            }}
            data-i18n="lbl_staff_activity_intro"
          >
            Overview of all staff reporting activity at your school.
          </p>
        </div>

        {/* Date Range Chips */}
        <div
          style={{
            padding: '0 16px 16px 16px',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setDateRange('month')}
            style={{
              padding: '8px 16px',
              minHeight: '36px',
              backgroundColor: dateRange === 'month' ? '#0D1B2A' : 'white',
              color: dateRange === 'month' ? 'white' : '#6B7280',
              border: dateRange === 'month' ? 'none' : '1px solid #E5E7EB',
              borderRadius: '18px',
              fontFamily: 'Noto Sans',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            data-i18n="range_month"
          >
            This Month
          </button>
          <button
            onClick={() => setDateRange('30days')}
            style={{
              padding: '8px 16px',
              minHeight: '36px',
              backgroundColor: dateRange === '30days' ? '#0D1B2A' : 'white',
              color: dateRange === '30days' ? 'white' : '#6B7280',
              border: dateRange === '30days' ? 'none' : '1px solid #E5E7EB',
              borderRadius: '18px',
              fontFamily: 'Noto Sans',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            data-i18n="range_30d"
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setDateRange('all')}
            style={{
              padding: '8px 16px',
              minHeight: '36px',
              backgroundColor: dateRange === 'all' ? '#0D1B2A' : 'white',
              color: dateRange === 'all' ? 'white' : '#6B7280',
              border: dateRange === 'all' ? 'none' : '1px solid #E5E7EB',
              borderRadius: '18px',
              fontFamily: 'Noto Sans',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            data-i18n="range_all"
          >
            All Time
          </button>
        </div>

        {/* Staff Cards List */}
        {staffMembers.length === 0 ? (
          // Empty State
          <div
            style={{
              padding: '64px 16px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '15px',
                color: '#6B7280',
              }}
              data-i18n="empty_no_staff_issues"
            >
              No staff have filed issues yet.
            </p>
          </div>
        ) : (
          <div
            style={{
              padding: '0 16px 24px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {staffMembers.map((staff) => (
              <StaffActivityCard
                key={staff.id}
                staff={staff}
                onClick={() => handleStaffCardClick(staff.id, staff.name)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Staff Activity Card Component
interface StaffActivityCardProps {
  staff: StaffMember;
  onClick: () => void;
}

function StaffActivityCard({ staff, onClick }: StaffActivityCardProps) {
  const roleStyle = getRoleStyle(staff.role);
  const initials = getInitials(staff.name);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="bg-white cursor-pointer"
      style={{
        borderRadius: '8px',
        padding: '16px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Row 1: Avatar + Name + Role */}
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar Circle */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#0D1B2A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              fontWeight: 600,
              color: 'white',
            }}
          >
            {initials}
          </span>
        </div>

        {/* Name + Role */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '16px',
                fontWeight: 700,
                color: '#0D1B2A',
              }}
            >
              {staff.name}
            </h3>
            <span
              style={{
                backgroundColor: roleStyle.bg,
                color: roleStyle.text,
                fontFamily: 'Noto Sans',
                fontSize: '12px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              {staff.role}
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Mini-stat Chips */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {/* Filed Count - Navy */}
        <span
          style={{
            backgroundColor: '#E5E7EB',
            color: '#0D1B2A',
            fontFamily: 'Noto Sans',
            fontSize: '12px',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: '12px',
          }}
          data-i18n="stat_filed"
        >
          Filed: {staff.filedCount}
        </span>

        {/* Open Count - Amber if > 0 */}
        <span
          style={{
            backgroundColor: staff.openCount > 0 ? '#FEF3C7' : '#F3F4F6',
            color: staff.openCount > 0 ? '#D97706' : '#6B7280',
            fontFamily: 'Noto Sans',
            fontSize: '12px',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: '12px',
          }}
          data-i18n="stat_open"
        >
          Open: {staff.openCount}
        </span>

        {/* Resolved Count - Green */}
        <span
          style={{
            backgroundColor: '#DCFCE7',
            color: '#16A34A',
            fontFamily: 'Noto Sans',
            fontSize: '12px',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: '12px',
          }}
          data-i18n="stat_resolved"
        >
          Resolved: {staff.resolvedCount}
        </span>
      </div>

      {/* Row 3: Most Recent Issue */}
      {staff.mostRecentIssue && (
        <div className="flex items-center justify-between gap-2">
          <p
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '11px',
              color: '#6B7280',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {staff.mostRecentIssue.title}
          </p>
          <span
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '11px',
              color: '#9CA3AF',
              flexShrink: 0,
            }}
          >
            {staff.mostRecentIssue.timestamp}
          </span>
        </div>
      )}
    </motion.div>
  );
}