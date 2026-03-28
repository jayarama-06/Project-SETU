/**
 * SETU – Timeline / Audit Log Component
 * Visual timeline with circle dots + connecting lines
 * Shows issue history with actor roles, actions, and timestamps
 * 
 * Design Spec: Lines 359-361
 */

import { CSSProperties } from 'react';
import { useLanguage } from '../utils/languageContext';
import { t } from '../utils/translations';

export interface AuditLogEntry {
  id: string;
  action: 'submitted' | 'acknowledged' | 'status_updated' | 'comment_added' | 'escalated' | 'assigned' | 'resolved' | 'disputed' | 'closed';
  actor: {
    name: string;
    role: 'staff' | 'principal' | 'rco' | 'officer';
  };
  timestamp: Date;
  details?: string; // e.g., "Status updated to In Progress"
  newStatus?: string;
  assignedTo?: string;
}

interface TimelineAuditLogProps {
  entries: AuditLogEntry[];
  maxVisible?: number;
  showFullHistory?: boolean;
  onToggleHistory?: () => void;
}

/**
 * TimelineAuditLog – Visual timeline component
 * 
 * @param entries - Array of audit log entries (newest first)
 * @param maxVisible - Max entries to show before collapse (default: 5)
 * @param showFullHistory - Show all entries or collapsed
 * @param onToggleHistory - Callback when "Show full history" clicked
 */
export function TimelineAuditLog({
  entries,
  maxVisible = 5,
  showFullHistory = false,
  onToggleHistory,
}: TimelineAuditLogProps) {
  const { language } = useLanguage();
  
  const visibleEntries = showFullHistory ? entries : entries.slice(0, maxVisible);
  const hasMore = entries.length > maxVisible;

  return (
    <div style={{ width: '100%' }}>
      {/* Section Header */}
      <h3
        style={{
          fontSize: '16px',
          fontWeight: 600,
          fontFamily: 'Noto Sans',
          color: '#0D1B2A',
          marginBottom: '16px',
        }}
        data-i18n="lbl_timeline"
      >
        {t('lbl_timeline', language)}
      </h3>

      {/* Timeline Entries */}
      <div style={{ position: 'relative', paddingLeft: '32px' }}>
        {visibleEntries.map((entry, index) => (
          <TimelineEntry
            key={entry.id}
            entry={entry}
            isLast={index === visibleEntries.length - 1 && !hasMore}
          />
        ))}
      </div>

      {/* Show Full History Link */}
      {hasMore && !showFullHistory && (
        <button
          onClick={onToggleHistory}
          style={{
            background: 'none',
            border: 'none',
            color: '#F0A500',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'Noto Sans',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: '8px 0',
            marginTop: '8px',
          }}
          data-i18n="lnk_show_history"
        >
          {t('lnk_show_history', language)} ({entries.length - maxVisible} more)
        </button>
      )}
    </div>
  );
}

/**
 * Individual timeline entry
 */
function TimelineEntry({ entry, isLast }: { entry: AuditLogEntry; isLast: boolean }) {
  const { language } = useLanguage();

  const dotColor = getActionColor(entry.action);
  const actionLabel = getActionLabel(entry.action, entry.details, entry.newStatus, entry.assignedTo, language);
  const roleLabel = t(`role_${entry.actor.role}`, language);

  const entryStyle: CSSProperties = {
    position: 'relative',
    paddingBottom: isLast ? '0' : '24px',
  };

  const dotStyle: CSSProperties = {
    position: 'absolute',
    left: '-32px',
    top: '4px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: dotColor,
    border: `2px solid ${dotColor}40`,
    zIndex: 2,
  };

  const lineStyle: CSSProperties = {
    position: 'absolute',
    left: '-26px',
    top: '16px',
    bottom: '-24px',
    width: '2px',
    backgroundColor: '#E5E7EB',
    zIndex: 1,
  };

  const contentStyle: CSSProperties = {
    fontFamily: 'Noto Sans',
  };

  return (
    <div style={entryStyle}>
      {/* Circle Dot */}
      <div style={dotStyle} />

      {/* Connecting Line (except for last entry) */}
      {!isLast && <div style={lineStyle} />}

      {/* Content */}
      <div style={contentStyle}>
        {/* Actor Role Tag */}
        <span
          style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: 600,
            color: '#6B7280',
            backgroundColor: '#F3F4F6',
            padding: '2px 8px',
            borderRadius: '4px',
            marginRight: '8px',
          }}
        >
          {roleLabel}
        </span>

        {/* Actor Name */}
        <span
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#0D1B2A',
          }}
        >
          {entry.actor.name}
        </span>

        {/* Action Description */}
        <div
          style={{
            fontSize: '14px',
            color: '#374151',
            marginTop: '4px',
          }}
        >
          {actionLabel}
        </div>

        {/* Timestamp */}
        <div
          style={{
            fontSize: '11px',
            color: '#9CA3AF',
            marginTop: '4px',
          }}
        >
          {formatTimestamp(entry.timestamp, language)}
        </div>
      </div>
    </div>
  );
}

/**
 * Get action-specific color
 */
function getActionColor(action: AuditLogEntry['action']): string {
  const colorMap: Record<AuditLogEntry['action'], string> = {
    submitted: '#6B7280',      // Gray
    acknowledged: '#4F46E5',   // Indigo
    status_updated: '#F59E0B', // Amber
    comment_added: '#6B7280',  // Gray
    escalated: '#EA580C',      // Orange
    assigned: '#1D4ED8',       // Blue
    resolved: '#16A34A',       // Green
    disputed: '#EF4444',       // Red
    closed: '#374151',         // Dark Gray
  };
  return colorMap[action] || '#6B7280';
}

/**
 * Get action label with context
 */
function getActionLabel(
  action: AuditLogEntry['action'],
  details?: string,
  newStatus?: string,
  assignedTo?: string,
  language: 'en' | 'te' = 'en'
): string {
  if (details) return details;

  const labels: Record<AuditLogEntry['action'], string> = {
    submitted: t('lbl_timeline_submitted', language),
    acknowledged: t('lbl_timeline_acknowledged', language),
    status_updated: newStatus
      ? `${t('lbl_timeline_status_updated', language)} ${newStatus}`
      : t('lbl_timeline_status_updated', language),
    comment_added: t('lbl_timeline_comment_added', language),
    escalated: t('lbl_timeline_escalated', language),
    assigned: assignedTo
      ? `${t('lbl_timeline_assigned', language)} ${assignedTo}`
      : t('lbl_timeline_assigned', language),
    resolved: t('lbl_timeline_resolved', language),
    disputed: t('lbl_timeline_disputed', language),
    closed: t('lbl_timeline_closed', language),
  };

  return labels[action] || action;
}

/**
 * Format timestamp to relative time
 */
function formatTimestamp(timestamp: Date, language: 'en' | 'te'): string {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return t('time_just_now', language);
  if (diffMins < 60) return `${diffMins} ${t('time_mins_ago', language)}`;
  if (diffHours < 24) return `${diffHours} ${t('time_hours_ago', language)}`;
  if (diffDays < 7) return `${diffDays} ${t('time_days_ago', language)}`;
  
  const diffWeeks = Math.floor(diffDays / 7);
  return `${diffWeeks} ${t('time_weeks_ago', language)}`;
}
