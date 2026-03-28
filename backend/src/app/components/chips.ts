/**
 * SETU – Chip Components Barrel Export
 * Centralized import for all chip components
 * 
 * @example
 * import { StatusChip, UrgencyChip, EscalationChip } from './components/chips';
 */

export { StatusChip } from './StatusChip';
export type { IssueStatus } from './StatusChip';

export { UrgencyChip } from './UrgencyChip';
export type { UrgencyLevel } from './UrgencyChip';

export { EscalationChip } from './EscalationChip';
export type { EscalationLevel } from './EscalationChip';

// Page Layout Components (AP-05 compliant)
export { PageWrapper, MobilePageWrapper, DesktopPageWrapper } from './PageWrapper';

// Development/QA Showcase
export { ChipShowcase } from './ChipShowcase';

// AI Urgency Score
export { 
  AIUrgencyScoreBadge, 
  AIUrgencyScoreBadgeCompact, 
  AIUrgencyScoreBadgeLarge 
} from './AIUrgencyScoreBadge';

// Timeline / Audit Log
export { TimelineAuditLog } from './TimelineAuditLog';
export type { AuditLogEntry } from './TimelineAuditLog';

// RCO Sidebar
export { RCOSidebar } from './RCOSidebar';

// Offline/Draft Management
export { OfflineBanner, useOnlineStatus } from './OfflineBanner';

// Modals & Bottom Sheets
export { PhotoUploadSheet } from './PhotoUploadSheet';
export { FilterBottomSheet } from './FilterBottomSheet';
export type { FilterOptions } from './FilterBottomSheet';
export { DisputeResolutionModal } from './DisputeResolutionModal';

// Interactive Components
export { VoiceNoteRecorder } from './VoiceNoteRecorder';
