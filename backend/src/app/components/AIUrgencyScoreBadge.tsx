/**
 * SETU – AI Urgency Score Badge
 * Displays 0-140 urgency score with color coding and optional pulsing animation
 * 
 * Design Spec: Lines 355-356, 845
 * - 0-30: Gray
 * - 31-69: Amber
 * - 70-99: Orange
 * - 100-140: Red (pulsing)
 */

import { CSSProperties } from 'react';
import { getUrgencyColor, shouldPulse } from '../utils/calculateUrgencyScore';
import { useLanguage } from '../utils/languageContext';
import { t } from '../utils/translations';

interface AIUrgencyScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

/**
 * AIUrgencyScoreBadge – Displays AI-calculated urgency score
 * 
 * @param score - Urgency score (0-140)
 * @param size - Badge size variant
 * @param showLabel - Show "AI Score" label
 * 
 * @example
 * <AIUrgencyScoreBadge score={105} size="md" showLabel />
 */
export function AIUrgencyScoreBadge({
  score,
  size = 'md',
  showLabel = false,
}: AIUrgencyScoreBadgeProps) {
  const { language } = useLanguage();
  const color = getUrgencyColor(score);
  const pulse = shouldPulse(score);

  const sizeConfig = {
    sm: { fontSize: '14px', padding: '4px 8px', iconSize: '16px' },
    md: { fontSize: '16px', padding: '6px 12px', iconSize: '20px' },
    lg: { fontSize: '20px', padding: '8px 16px', iconSize: '24px' },
  };

  const config = sizeConfig[size];

  const badgeStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: `${color}15`, // 15% opacity background
    color: color,
    fontSize: config.fontSize,
    fontWeight: 700,
    fontFamily: 'Noto Sans',
    padding: config.padding,
    borderRadius: size === 'sm' ? '4px' : size === 'md' ? '6px' : '8px',
    border: `1.5px solid ${color}`,
    animation: pulse ? 'urgency-pulse 2s ease-in-out infinite' : 'none',
    whiteSpace: 'nowrap',
  };

  return (
    <>
      <style>
        {`
          @keyframes urgency-pulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 ${color}40;
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 0 6px ${color}00;
            }
          }
        `}
      </style>
      
      <div style={badgeStyle} data-i18n="lbl_ai_urgency_score">
        {/* AI Icon */}
        <span 
          className="material-symbols-rounded" 
          style={{ 
            fontSize: config.iconSize,
            fontVariationSettings: "'FILL' 1, 'wght' 600",
          }}
        >
          psychology
        </span>
        
        {/* Score */}
        <span>{score}</span>
        
        {/* Label (optional) */}
        {showLabel && (
          <span style={{ 
            fontSize: size === 'lg' ? '14px' : '12px',
            fontWeight: 600,
            opacity: 0.9,
          }}>
            {t('lbl_ai_score', language)}
          </span>
        )}
      </div>
    </>
  );
}

/**
 * Compact variant for card headers
 */
export function AIUrgencyScoreBadgeCompact({ score }: { score: number }) {
  return <AIUrgencyScoreBadge score={score} size="sm" showLabel={false} />;
}

/**
 * Large variant for issue detail screens
 */
export function AIUrgencyScoreBadgeLarge({ score }: { score: number }) {
  return <AIUrgencyScoreBadge score={score} size="lg" showLabel />;
}
