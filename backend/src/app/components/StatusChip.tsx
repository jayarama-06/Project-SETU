/**
 * SETU – Status Chip Component
 * AP-03 compliant with i18n support
 * Material Design 3 chip for issue status display
 */

import { useLanguage } from '../utils/languageContext';
import { t } from '../utils/translations';

export type IssueStatus =
  | 'submitted'
  | 'acknowledged'
  | 'in_progress'
  | 'awaiting'
  | 'resolved_pending'
  | 'dispute'
  | 'resolved'
  | 'closed'
  // Legacy statuses for backward compatibility
  | 'open';

interface StatusConfig {
  bg: string;
  text: string;
  i18nKey: string;
}

// AP-03 Status Configuration
const STATUS_CONFIG: Record<IssueStatus, StatusConfig> = {
  submitted: {
    bg: '#F8F9FA',
    text: '#6B7280',
    i18nKey: 'status_submitted',
  },
  acknowledged: {
    bg: '#EEF2FF',
    text: '#4F46E5',
    i18nKey: 'status_acknowledged',
  },
  in_progress: {
    bg: '#FEF3C7',
    text: '#F59E0B',
    i18nKey: 'status_in_progress',
  },
  awaiting: {
    bg: '#FEF3C7',
    text: '#D97706',
    i18nKey: 'status_awaiting',
  },
  resolved_pending: {
    bg: '#DCFCE7',
    text: '#16A34A',
    i18nKey: 'status_resolved_pending',
  },
  dispute: {
    bg: '#FEE2E2',
    text: '#EF4444',
    i18nKey: 'status_dispute',
  },
  resolved: {
    bg: '#DCFCE7',
    text: '#16A34A',
    i18nKey: 'status_resolved',
  },
  closed: {
    bg: '#F3F4F6',
    text: '#374151',
    i18nKey: 'status_closed',
  },
  // Legacy mapping
  open: {
    bg: '#F8F9FA',
    text: '#6B7280',
    i18nKey: 'status_open',
  },
};

interface StatusChipProps {
  status: IssueStatus | string;
  /** Optional custom size (default: 'sm') */
  size?: 'xs' | 'sm' | 'md';
  /** Optional custom className */
  className?: string;
}

/**
 * StatusChip – Material Design 3 status indicator
 * Auto-translates based on global language context
 * 
 * @example
 * <StatusChip status="in_progress" />
 * <StatusChip status="resolved" size="md" />
 */
export function StatusChip({ status, size = 'sm', className = '' }: StatusChipProps) {
  const { language } = useLanguage();
  
  const config = STATUS_CONFIG[status as IssueStatus] || STATUS_CONFIG.submitted;
  const label = t(config.i18nKey, language);

  // Size variants
  const sizeStyles = {
    xs: {
      height: '20px',
      padding: '0 8px',
      fontSize: '10px',
      borderRadius: '4px',
    },
    sm: {
      height: '24px',
      padding: '0 10px',
      fontSize: '11px',
      borderRadius: '6px',
    },
    md: {
      height: '28px',
      padding: '0 12px',
      fontSize: '12px',
      borderRadius: '8px',
    },
  };

  const activeSize = sizeStyles[size];

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        fontFamily: 'Noto Sans',
        fontWeight: 600,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
        ...activeSize,
      }}
      data-i18n={config.i18nKey}
      data-status={status}
    >
      {label}
    </span>
  );
}
