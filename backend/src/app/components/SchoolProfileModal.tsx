import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, AlertTriangle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router';

interface SchoolIssue {
  id: string;
  title: string;
  status: string;
  date: string;
}

interface CategoryData {
  category: string;
  count: number;
  color: string;
}

interface SchoolData {
  id: string;
  name: string;
  district: string;
  headmaster: string;
  contactNumber: string;
  avgResolutionTime: number; // in hours
  recentIssues: SchoolIssue[];
  categoryBreakdown: CategoryData[];
  hasRecurringIssues: boolean;
  recurringCategory?: string;
}

interface SchoolProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: SchoolData | null;
}

// Status chip configuration
const getStatusConfig = (status: string) => {
  const configs: { [key: string]: { bg: string; text: string } } = {
    'open': { bg: '#EEF2FF', text: '#4F46E5' },
    'acknowledged': { bg: '#DBEAFE', text: '#2563EB' },
    'in_progress': { bg: '#FEF3C7', text: '#D97706' },
    'resolved': { bg: '#D1FAE5', text: '#059669' },
    'escalated': { bg: '#FED7AA', text: '#EA580C' },
  };
  return configs[status.toLowerCase()] || configs['open'];
};

export function SchoolProfileModal({ isOpen, onClose, school }: SchoolProfileModalProps) {
  const navigate = useNavigate();

  if (!school) return null;

  const handleIssueClick = (issueId: string) => {
    navigate(`/rco/issues/${issueId}`);
    onClose();
  };

  const handleViewAllIssues = () => {
    navigate(`/rco/issues?school=${encodeURIComponent(school.name)}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Right-side Slide Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 bottom-0 bg-white z-50 overflow-y-auto"
            style={{ width: '640px', maxWidth: '100vw' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-start justify-between z-10"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                    marginBottom: '8px',
                  }}
                  data-i18n="modal_school_profile_title"
                >
                  {school.name}
                </h2>
                <div
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    color: '#6B7280',
                    lineHeight: '1.6',
                  }}
                >
                  <p>
                    <span style={{ fontWeight: 600 }}>District:</span> {school.district}
                  </p>
                  <p>
                    <span style={{ fontWeight: 600 }}>School ID:</span> {school.id}
                  </p>
                  <p>
                    <span style={{ fontWeight: 600 }}>Headmaster:</span> {school.headmaster}
                  </p>
                  <p>
                    <span style={{ fontWeight: 600 }}>Contact:</span> {school.contactNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg hover:bg-[#F8F9FA] transition-colors"
              >
                <X size={24} color="#6B7280" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Recurring Issues Warning */}
              {school.hasRecurringIssues && (
                <div
                  className="flex items-start gap-3 p-4 rounded-lg"
                  style={{
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #F59E0B',
                  }}
                >
                  <AlertTriangle size={20} color="#D97706" className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#92400E',
                        marginBottom: '4px',
                      }}
                    >
                      Recurring Issues Detected
                    </p>
                    <p
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '13px',
                        color: '#92400E',
                        lineHeight: '1.5',
                      }}
                    >
                      Multiple {school.recurringCategory} issues reported. Consider preventive action.
                    </p>
                  </div>
                </div>
              )}

              {/* Avg Resolution Time */}
              <div>
                <h3
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                    marginBottom: '12px',
                  }}
                >
                  Average Resolution Time
                </h3>
                <div className="flex items-baseline gap-2">
                  <span
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '32px',
                      fontWeight: 700,
                      color: '#F0A500',
                    }}
                  >
                    {school.avgResolutionTime}
                  </span>
                  <span
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '16px',
                      color: '#6B7280',
                    }}
                  >
                    hours
                  </span>
                </div>
              </div>

              {/* Category Breakdown */}
              <div>
                <h3
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                    marginBottom: '16px',
                  }}
                >
                  Category Breakdown
                </h3>
                <div className="space-y-3">
                  {school.categoryBreakdown.map((cat) => {
                    const total = school.categoryBreakdown.reduce((sum, c) => sum + c.count, 0);
                    const percentage = total > 0 ? (cat.count / total) * 100 : 0;
                    
                    return (
                      <div key={cat.category}>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#0D1B2A',
                            }}
                          >
                            {cat.category}
                          </span>
                          <span
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#6B7280',
                            }}
                          >
                            {cat.count}
                          </span>
                        </div>
                        <div
                          className="w-full rounded-full overflow-hidden"
                          style={{
                            height: '8px',
                            backgroundColor: '#E5E7EB',
                          }}
                        >
                          <div
                            style={{
                              width: `${percentage}%`,
                              height: '100%',
                              backgroundColor: cat.color,
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Issue History */}
              <div>
                <h3
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                    marginBottom: '16px',
                  }}
                >
                  Recent Issues (Last 10)
                </h3>
                <div className="space-y-2">
                  {school.recentIssues.map((issue) => {
                    const statusConfig = getStatusConfig(issue.status);
                    
                    return (
                      <button
                        key={issue.id}
                        onClick={() => handleIssueClick(issue.id)}
                        className="w-full text-left p-3 rounded-lg border border-[#E5E7EB] hover:border-[#F0A500] hover:bg-[#FFFBF0] transition-all"
                        style={{
                          cursor: 'pointer',
                        }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <span
                            style={{
                              fontFamily: 'Noto Sans',
                              fontSize: '13px',
                              fontWeight: 700,
                              color: '#0D1B2A',
                            }}
                          >
                            {issue.id}
                          </span>
                          <span
                            className="px-2 py-1 rounded"
                            style={{
                              backgroundColor: statusConfig.bg,
                              color: statusConfig.text,
                              fontFamily: 'Noto Sans',
                              fontSize: '11px',
                              fontWeight: 600,
                              textTransform: 'capitalize',
                            }}
                          >
                            {issue.status}
                          </span>
                        </div>
                        <p
                          style={{
                            fontFamily: 'Noto Sans',
                            fontSize: '14px',
                            color: '#4B5563',
                            marginBottom: '4px',
                          }}
                        >
                          {issue.title}
                        </p>
                        <p
                          style={{
                            fontFamily: 'Noto Sans',
                            fontSize: '12px',
                            color: '#9CA3AF',
                          }}
                        >
                          {issue.date}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* View All Issues Link */}
              <button
                onClick={handleViewAllIssues}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 border-[#F0A500] hover:bg-[#FFFBF0] transition-colors"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#F0A500',
                  cursor: 'pointer',
                }}
                data-i18n="lnk_view_school_issues"
              >
                <span>View All Issues for This School</span>
                <ExternalLink size={18} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
