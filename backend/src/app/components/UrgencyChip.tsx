import { useLanguage } from '../utils/languageContext';
import { t } from '../utils/translations';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

interface UrgencyConfig {
  bg: string;
  text: string;
  border: string;
  i18nKey: string;
}

/**
 * Urgency level configuration
 * UI Design Guide v1.1 - Appendix A.3
 * 
 * Score ranges:
 * - Low (0-39): Grey #9CA3AF, no animation
 * - Medium (40-69): Blue #3B82F6, no animation  
 * - High (70-99): Amber #F59E0B, subtle glow
 * - Critical (100-140): Red #DC2626, pulsing glow
 */
const urgencyConfig: Record<UrgencyLevel, UrgencyConfig> = {
  low: {
    bg: '#F3F4F6',    // Light grey background
    text: '#6B7280',  // Grey text
    border: '#9CA3AF', // Grey border
    i18nKey: 'urgency_low',
  },
  medium: {
    bg: '#DBEAFE',    // Light blue background
    text: '#1E40AF',  // Dark blue text
    border: '#3B82F6', // Blue border
    i18nKey: 'urgency_medium',
  },
  high: {
    bg: '#FEF3C7',    // Light amber background
    text: '#D97706',  // Dark amber text
    border: '#F59E0B', // Amber border
    i18nKey: 'urgency_high',
  },
  critical: {
    bg: '#FEE2E2',    // Light red background
    text: '#DC2626',  // Red text
    border: '#DC2626', // Red border
    i18nKey: 'urgency_critical',
  },
};

interface UrgencyChipProps {
  urgency: UrgencyLevel | string;
  /** Optional custom size (default: 'sm') */
  size?: 'xs' | 'sm' | 'md';
  /** Optional custom className */
  className?: string;
  /** Show icon indicator (default: false) */
  showIcon?: boolean;
}

/**
 * UrgencyChip – Material Design 3 urgency level indicator
 * Auto-translates based on global language context
 * 
 * @example
 * <UrgencyChip urgency="high" />
 * <UrgencyChip urgency="critical" size="md" showIcon />
 */
export function UrgencyChip({ 
  urgency, 
  size = 'sm', 
  className = '',
  showIcon = false 
}: UrgencyChipProps) {
  const { language } = useLanguage();
  
  const config = urgencyConfig[urgency as UrgencyLevel] || urgencyConfig.low;
  const label = t(config.i18nKey, language);

  // Size variants
  const sizeStyles = {
    xs: {
      height: '20px',
      padding: showIcon ? '0 8px 0 6px' : '0 8px',
      fontSize: '10px',
      borderRadius: '4px',
      gap: '4px',
    },
    sm: {
      height: '24px',
      padding: showIcon ? '0 10px 0 8px' : '0 10px',
      fontSize: '11px',
      borderRadius: '6px',
      gap: '4px',
    },
    md: {
      height: '28px',
      padding: showIcon ? '0 12px 0 10px' : '0 12px',
      fontSize: '12px',
      borderRadius: '8px',
      gap: '6px',
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
      data-urgency={urgency}
    >
      {showIcon && urgency === 'critical' && (
        <span className="material-symbols-rounded" style={{ fontSize: '14px' }}>
          warning
        </span>
      )}
      {label}
    </span>
  );
}
