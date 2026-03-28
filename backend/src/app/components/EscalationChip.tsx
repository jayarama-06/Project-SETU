/**
 * SETU – Escalation Level Chip Component
 * Material Design 3 chip for escalation level indicators (L0-L4)
 * 
 * Design Spec: AP-03, Appendix A.4
 * Escalation hierarchy with 5 levels + color-coded badges
 */

import { useLanguage } from '../utils/languageContext';
import { t } from '../utils/translations';

export type EscalationLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 0 | 1 | 2 | 3 | 4;

interface EscalationConfig {
  label: string;
  badge: string; // Short label (e.g., "L0")
  bg: string;
  text: string;
  border: string;
  i18nKey: string;
  pulse?: boolean;
}

/**
 * Escalation level configuration
 * UI Design Guide v1.1 - Appendix A.4
 * 
 * L0: Submitted - Grey #9CA3AF
 * L1: Acknowledged - Blue #3B82F6
 * L2: Awaiting Action - Amber #F59E0B + pulse
 * L3: State Attention - Orange #F97316 + pulse
 * L4: Auto-Escalated - Red #EF4444 + pulse
 */
const escalationConfig: Record<EscalationLevel, EscalationConfig> = {
  L0: {
    label: 'L0 - Submitted',
    badge: 'L0',
    bg: '#F3F4F6',    // Light grey
    text: '#6B7280',  // Grey text
    border: '#9CA3AF', // Grey border
    i18nKey: 'escalation_l0',
  },
  0: {
    label: 'L0 - Submitted',
    badge: 'L0',
    bg: '#F3F4F6',
    text: '#6B7280',
    border: '#9CA3AF',
    i18nKey: 'escalation_l0',
  },
  L1: {
    label: 'L1 - Acknowledged',
    badge: 'L1',
    bg: '#DBEAFE',    // Light blue
    text: '#1E40AF',  // Dark blue text
    border: '#3B82F6', // Blue border
    i18nKey: 'escalation_l1',
  },
  1: {
    label: 'L1 - Acknowledged',
    badge: 'L1',
    bg: '#DBEAFE',
    text: '#1E40AF',
    border: '#3B82F6',
    i18nKey: 'escalation_l1',
  },
  L2: {
    label: 'L2 - Awaiting Action',
    badge: 'L2',
    bg: '#FEF3C7',    // Light amber
    text: '#D97706',  // Dark amber text
    border: '#F59E0B', // Amber border
    i18nKey: 'escalation_l2',
    pulse: true,
  },
  2: {
    label: 'L2 - Awaiting Action',
    badge: 'L2',
    bg: '#FEF3C7',
    text: '#D97706',
    border: '#F59E0B',
    i18nKey: 'escalation_l2',
    pulse: true,
  },
  L3: {
    label: 'L3 - State Attention',
    badge: 'L3',
    bg: '#FFEDD5',    // Light orange
    text: '#C2410C',  // Dark orange text
    border: '#F97316', // Orange border
    i18nKey: 'escalation_l3',
    pulse: true,
  },
  3: {
    label: 'L3 - State Attention',
    badge: 'L3',
    bg: '#FFEDD5',
    text: '#C2410C',
    border: '#F97316',
    i18nKey: 'escalation_l3',
    pulse: true,
  },
  L4: {
    label: 'L4 - Auto-Escalated',
    badge: 'L4',
    bg: '#FEE2E2',    // Light red
    text: '#DC2626',  // Red text
    border: '#EF4444', // Red border
    i18nKey: 'escalation_l4',
    pulse: true,
  },
  4: {
    label: 'L4 - Auto-Escalated',
    badge: 'L4',
    bg: '#FEE2E2',
    text: '#DC2626',
    border: '#EF4444',
    i18nKey: 'escalation_l4',
    pulse: true,
  },
};

interface EscalationChipProps {
  level: EscalationLevel | number;
  /** Display mode: 'badge' shows "L0", 'full' shows full text (default: 'badge') */
  mode?: 'badge' | 'full';
  /** Optional custom size (default: 'sm') */
  size?: 'xs' | 'sm' | 'md';
  /** Optional custom className */
  className?: string;
}

/**
 * EscalationChip – Material Design 3 escalation level indicator
 * Auto-translates based on global language context
 * 
 * @example
 * <EscalationChip level={0} />
 * <EscalationChip level={3} mode="full" size="md" />
 */
export function EscalationChip({ 
  level, 
  mode = 'badge',
  size = 'sm', 
  className = '' 
}: EscalationChipProps) {
  const { language } = useLanguage();
  
  const config = escalationConfig[level as EscalationLevel] || escalationConfig['L0'];
  const label = mode === 'badge' ? config.badge : t(config.i18nKey, language);

  // Size variants
  const sizeStyles = {
    xs: {
      height: '20px',
      padding: mode === 'badge' ? '0 6px' : '0 8px',
      fontSize: '10px',
      borderRadius: '4px',
    },
    sm: {
      height: '24px',
      padding: mode === 'badge' ? '0 8px' : '0 10px',
      fontSize: '11px',
      borderRadius: '6px',
    },
    md: {
      height: '28px',
      padding: mode === 'badge' ? '0 10px' : '0 12px',
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
        fontWeight: 700,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        ...activeSize,
      }}
      data-i18n={config.i18nKey}
      data-escalation={level}
    >
      {label}
    </span>
  );
}
