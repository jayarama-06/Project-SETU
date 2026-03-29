import { useState } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { OfflineBanner } from '../components/OfflineBanner';
import { DownloadReportModal } from '../components/DownloadReportModal';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

type DateRange = '7days' | 'month' | 'all';

interface SchoolHealthData {
  issuesReported: number;
  resolved: number;
  avgResolutionTime: number;
  overdue: number;
  categoryCounts: {
    Water: number;
    Electricity: number;
    Building: number;
    Safety: number;
    Finance: number;
    Other: number;
  };
  escalationCounts: {
    L0: number;
    L1: number;
    L2: number;
    L3: number;
    L4: number;
  };
}

// Mock data for different date ranges
const MOCK_DATA: Record<DateRange, SchoolHealthData> = {
  '7days': {
    issuesReported: 23,
    resolved: 18,
    avgResolutionTime: 3.2,
    overdue: 5,
    categoryCounts: {
      Water: 8,
      Electricity: 5,
      Building: 4,
      Safety: 3,
      Finance: 2,
      Other: 1,
    },
    escalationCounts: {
      L0: 12,
      L1: 6,
      L2: 3,
      L3: 1,
      L4: 1,
    },
  },
  month: {
    issuesReported: 87,
    resolved: 72,
    avgResolutionTime: 4.8,
    overdue: 15,
    categoryCounts: {
      Water: 28,
      Electricity: 18,
      Building: 15,
      Safety: 12,
      Finance: 8,
      Other: 6,
    },
    escalationCounts: {
      L0: 45,
      L1: 22,
      L2: 12,
      L3: 5,
      L4: 3,
    },
  },
  all: {
    issuesReported: 342,
    resolved: 298,
    avgResolutionTime: 5.3,
    overdue: 44,
    categoryCounts: {
      Water: 112,
      Electricity: 78,
      Building: 65,
      Safety: 42,
      Finance: 28,
      Other: 17,
    },
    escalationCounts: {
      L0: 186,
      L1: 92,
      L2: 38,
      L3: 16,
      L4: 10,
    },
  },
};

const escalationConfig = {
  L0: { bg: '#E5E7EB', text: '#6B7280', label: 'L0' },
  L1: { bg: '#DBEAFE', text: '#1D4ED8', label: 'L1' },
  L2: { bg: '#FEF3C7', text: '#D97706', label: 'L2' },
  L3: { bg: '#FED7AA', text: '#C2410C', label: 'L3' },
  L4: { bg: '#FECACA', text: '#B91C1C', label: 'L4' },
};

export function SchoolHealthSummary() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);

  const data = MOCK_DATA[dateRange];
  const maxCategoryCount = Math.max(...Object.values(data.categoryCounts));

  const handleDownloadReport = () => {
    // In production, this would generate and download a PDF/Excel report
    console.log('Downloading school health report for range:', dateRange);
    setDownloadModalOpen(true);
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
          data-i18n="scr_school_health"
        >
          School Health
        </h1>
        <LanguageToggle size="compact" />
      </div>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto pb-6">
        {/* Date Range Chips */}
        <div
          style={{
            padding: '16px',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setDateRange('7days')}
            style={{
              padding: '8px 16px',
              minHeight: '36px',
              backgroundColor: dateRange === '7days' ? '#0D1B2A' : 'white',
              color: dateRange === '7days' ? 'white' : '#6B7280',
              border: dateRange === '7days' ? 'none' : '1px solid #E5E7EB',
              borderRadius: '18px',
              fontFamily: 'Noto Sans',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            data-i18n="range_7d"
          >
            Last 7 Days
          </button>
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

        {/* KPI Cards - 2×2 Grid */}
        <div
          style={{
            padding: '0 16px 16px 16px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }}
        >
          {/* Issues Reported */}
          <div
            className="bg-white"
            style={{
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            }}
          >
            <p
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '12px',
                color: '#6B7280',
                marginBottom: '8px',
              }}
              data-i18n="kpi_reported"
            >
              Issues Reported
            </p>
            <p
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '32px',
                fontWeight: 700,
                color: '#0D1B2A',
                lineHeight: '1',
              }}
            >
              {data.issuesReported}
            </p>
          </div>

          {/* Resolved */}
          <div
            className="bg-white"
            style={{
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            }}
          >
            <p
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '12px',
                color: '#6B7280',
                marginBottom: '8px',
              }}
              data-i18n="kpi_resolved"
            >
              Resolved
            </p>
            <p
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '32px',
                fontWeight: 700,
                color: '#22C55E',
                lineHeight: '1',
              }}
            >
              {data.resolved}
            </p>
          </div>

          {/* Avg Resolution Time */}
          <div
            className="bg-white"
            style={{
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            }}
          >
            <p
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '12px',
                color: '#6B7280',
                marginBottom: '8px',
              }}
              data-i18n="kpi_avg_resolution"
            >
              Avg Resolution Time
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#0D1B2A',
                  lineHeight: '1',
                }}
              >
                {data.avgResolutionTime.toFixed(1)}
              </span>
              <span
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  color: '#6B7280',
                }}
                data-i18n="lbl_days"
              >
                days
              </span>
            </div>
          </div>

          {/* Overdue - Pulsing if > 0 */}
          <motion.div
            animate={
              data.overdue > 0
                ? {
                    scale: [1, 1.02, 1],
                    boxShadow: [
                      '0 1px 3px rgba(0, 0, 0, 0.08)',
                      '0 4px 12px rgba(239, 68, 68, 0.3)',
                      '0 1px 3px rgba(0, 0, 0, 0.08)',
                    ],
                  }
                : {}
            }
            transition={
              data.overdue > 0
                ? {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
                : {}
            }
            className="bg-white"
            style={{
              borderRadius: '8px',
              padding: '16px',
              border: data.overdue > 0 ? '1px solid #FEE2E2' : '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            }}
          >
            <p
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '12px',
                color: '#6B7280',
                marginBottom: '8px',
              }}
              data-i18n="kpi_overdue"
            >
              Overdue
            </p>
            <p
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '32px',
                fontWeight: 700,
                color: '#EF4444',
                lineHeight: '1',
              }}
            >
              {data.overdue}
            </p>
          </motion.div>
        </div>

        {/* Category Breakdown Section */}
        <div style={{ padding: '0 16px 24px 16px' }}>
          <h2
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '16px',
              fontWeight: 700,
              color: '#0D1B2A',
              marginBottom: '16px',
            }}
            data-i18n="lbl_by_category"
          >
            Issues by Category
          </h2>
          <div
            className="bg-white"
            style={{
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(data.categoryCounts).map(([category, count]) => (
                <CategoryBar
                  key={category}
                  category={category}
                  count={count}
                  maxCount={maxCategoryCount}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Escalation Health Section */}
        <div style={{ padding: '0 16px 24px 16px' }}>
          <h2
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '16px',
              fontWeight: 700,
              color: '#0D1B2A',
              marginBottom: '16px',
            }}
            data-i18n="lbl_escalation_health"
          >
            Current Escalation Levels
          </h2>
          <div
            className="bg-white"
            style={{
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(data.escalationCounts).map(([level, count]) => (
                <EscalationRow key={level} level={level as keyof typeof escalationConfig} count={count} />
              ))}
            </div>
          </div>
        </div>

        {/* Download Report Button */}
        <div style={{ padding: '0 16px 24px 16px' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadReport}
            style={{
              width: '100%',
              minHeight: '48px',
              backgroundColor: 'transparent',
              border: '1.5px solid #0D1B2A',
              borderRadius: '8px',
              color: '#0D1B2A',
              fontFamily: 'Noto Sans',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            data-i18n="btn_download_school_report"
          >
            <Download size={18} />
            Download School Report
          </motion.button>
        </div>
      </main>

      {/* Download Report Modal */}
      <DownloadReportModal
        isOpen={isDownloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        dateRange={dateRange}
      />
    </div>
  );
}

// Category Bar Component
interface CategoryBarProps {
  category: string;
  count: number;
  maxCount: number;
}

function CategoryBar({ category, count, maxCount }: CategoryBarProps) {
  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '13px',
            fontWeight: 600,
            color: '#0D1B2A',
          }}
        >
          {category}
        </span>
        <span
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '13px',
            fontWeight: 700,
            color: '#6B7280',
          }}
        >
          {count}
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#F3F4F6',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            height: '100%',
            backgroundColor: '#0D1B2A',
            borderRadius: '8px',
          }}
        />
      </div>
    </div>
  );
}

// Escalation Row Component
interface EscalationRowProps {
  level: keyof typeof escalationConfig;
  count: number;
}

function EscalationRow({ level, count }: EscalationRowProps) {
  const config = escalationConfig[level];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span
          style={{
            backgroundColor: config.bg,
            color: config.text,
            fontFamily: 'Noto Sans',
            fontSize: '13px',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '6px',
            minWidth: '48px',
            textAlign: 'center',
          }}
        >
          {config.label}
        </span>
        <div
          style={{
            flex: 1,
            height: '8px',
            backgroundColor: '#F3F4F6',
            borderRadius: '8px',
            overflow: 'hidden',
            minWidth: '120px',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: count > 0 ? `${Math.min((count / 50) * 100, 100)}%` : '0%' }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            style={{
              height: '100%',
              backgroundColor: config.text,
              borderRadius: '8px',
            }}
          />
        </div>
      </div>
      <span
        style={{
          fontFamily: 'Noto Sans',
          fontSize: '16px',
          fontWeight: 700,
          color: config.text,
          minWidth: '40px',
          textAlign: 'right',
        }}
      >
        {count}
      </span>
    </div>
  );
}