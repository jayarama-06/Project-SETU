import { Issue } from '../hooks/useIssues';
import { StatusChip } from './StatusChip';
import { EscalationChip } from './EscalationChip';
import { AIUrgencyScoreBadgeCompact } from './AIUrgencyScoreBadge';
import { getUrgencyColor } from '../utils/calculateUrgencyScore';
import { useLanguage } from '../utils/languageContext';
import { t } from '../utils/translations';

interface SchoolStaffIssueCardProps {
  issue: Issue;
  onClick?: () => void;
}

const categoryIcons: Record<Issue['category'], string> = {
  water: 'water_drop',
  electricity: 'bolt',
  building: 'domain',
  safety: 'health_and_safety',
  finance: 'account_balance',
  other: 'more_horiz',
};

const categoryLabels: Record<Issue['category'], string> = {
  water: 'Water',
  electricity: 'Electricity',
  building: 'Infrastructure',
  safety: 'Health & Safety',
  finance: 'Finance',
  other: 'Other',
};

function getTimeAgo(timestamp: string): string {
  const now = Date.now();
  const diff = now - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} mins ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
}

export function SchoolStaffIssueCard({ issue, onClick }: SchoolStaffIssueCardProps) {
  const { language } = useLanguage();
  
  // Use urgency_score directly from database
  const aiScore = issue.urgency_score;
  const urgencyColor = getUrgencyColor(aiScore);

  return (
    <div
      className="bg-white relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      style={{
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      }}
      onClick={onClick}
    >
      {/* Left urgency border */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{ width: '4px', backgroundColor: urgencyColor }}
      />

      {/* Category icon + Issue ID */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-rounded" style={{ fontSize: '24px', color: '#0D1B2A' }}>
            {categoryIcons[issue.category] || 'error'}
          </span>
          <span
            className="text-xs"
            style={{ color: '#6B7280', fontFamily: 'Noto Sans', fontSize: '11px' }}
            data-i18n="lbl_issue_id"
          >
            {issue.id}
          </span>
        </div>
      </div>

      {/* Issue Title */}
      <h3
        className="mb-3 line-clamp-2"
        style={{
          fontFamily: 'Noto Sans',
          fontWeight: 600,
          fontSize: '16px',
          color: '#0D1B2A',
        }}
        data-i18n="lbl_issue_title"
      >
        {issue.title}
      </h3>

      {/* Badges Row - Using new Chip components */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <StatusChip status={issue.status} size="sm" />
        <EscalationChip level={issue.escalation_level} mode="badge" size="sm" />
        <AIUrgencyScoreBadgeCompact score={aiScore} />
      </div>

      {/* Timestamp */}
      <div className="flex justify-end">
        <span
          className="text-right"
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '11px',
            color: '#6B7280',
          }}
          data-i18n="lbl_time_ago"
        >
          {getTimeAgo(issue.created_at)}
        </span>
      </div>
    </div>
  );
}
