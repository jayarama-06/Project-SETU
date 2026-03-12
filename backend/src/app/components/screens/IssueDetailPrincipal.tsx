import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Share2, Download, Play, Pause, Shield, Info, ThumbsUp, Check } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { DisputeResolutionModal } from '../components/DisputeResolutionModal';
import { AnonymousBypassModal } from '../components/AnonymousBypassModal';
import { EscalationLevelBottomSheet } from '../components/EscalationLevelBottomSheet';
import { WithdrawEndorsementModal } from '../components/WithdrawEndorsementModal';
import { EndorseIssueModal } from '../components/EndorseIssueModal';
import { Toast } from '../components/Toast';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router';

// ── Issue data type ───────────────────────────────────────────────────────────
interface TimelineEntry {
  id: string;
  actorRole: string;
  action: string;
  timestamp: string;
  isSystemAction?: boolean;
  isInternalEscalation?: boolean;
}

interface IssueData {
  id: string;
  category: string;
  categoryIcon?: string;
  title: string;
  description: string;
  status: string;
  urgencyScore: number;
  submittedDaysAgo: number;
  submittedBy: string;
  reportedByName: string;
  photo?: string;
  voiceNote?: { url: string; duration: number };
  timeline: TimelineEntry[];
  isEndorsed: boolean;
  resolvedAt?: string; // For calculating 72h dispute window
}

// ── Mock issue data store (keyed by issueId) ─────────────────────────────────
const MOCK_ISSUES: Record<string, IssueData> = {
  'SETU-2847': {
    id: 'SETU-2847',
    category: 'infrastructure',
    title: 'Broken water pipe in girls hostel',
    description:
      'The main water pipe in the girls hostel has burst, causing flooding in the ground floor corridor. Students are unable to access their rooms and water supply has been cut off to prevent further damage. This needs immediate attention as it affects over 120 students.',
    status: 'escalated_l2',
    urgencyScore: 105,
    submittedDaysAgo: 3,
    submittedBy: 'Ravi Kumar',
    reportedByName: 'Ravi Kumar',
    isEndorsed: false,
    photo:
      'https://images.unsplash.com/photo-1661520754901-bb5d6b374fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    timeline: [
      { id: '1', actorRole: 'District Official', action: 'Marked as resolved after repairs completed', timestamp: '2 hours ago' },
      { id: '2', actorRole: 'Maintenance Contractor', action: 'Added comment: "Pipe replaced and tested. System operational."', timestamp: '4 hours ago' },
      { id: '3', actorRole: 'District Official', action: 'Assigned to Maintenance Contractor', timestamp: '1 day ago' },
      { id: '4', actorRole: 'System', action: 'Escalated to L2 - District Official due to high urgency score', timestamp: '2 days ago', isSystemAction: true, isInternalEscalation: true },
      { id: '5', actorRole: 'Block Official', action: 'Acknowledged and flagged as urgent', timestamp: '2 days ago' },
      { id: '6', actorRole: 'Principal', action: 'Endorsed this issue as urgent', timestamp: '2 days ago', isInternalEscalation: true },
      { id: '7', actorRole: 'School Staff', action: 'Issue submitted', timestamp: '3 days ago' },
    ],
  },
  'SETU-2846': {
    id: 'SETU-2846',
    category: 'food',
    title: 'Food quality concerns in mess',
    description: 'Students have been reporting poor food quality in the mess for the past week. Several students fell ill after meals on Tuesday and Wednesday.',
    status: 'resolved_pending',
    urgencyScore: 72,
    submittedDaysAgo: 1,
    submittedBy: 'Lakshmi Devi',
    reportedByName: 'Lakshmi Devi',
    isEndorsed: true,
    resolvedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20 hours ago
    timeline: [
      { id: '1', actorRole: 'Block Official', action: 'Marked as resolved - new mess vendor assigned', timestamp: '20 hours ago' },
      { id: '2', actorRole: 'Principal', action: 'Endorsed this issue', timestamp: '1 day ago', isInternalEscalation: true },
      { id: '3', actorRole: 'Block Official', action: 'Assigned to mess supervisor for investigation', timestamp: '1 day ago' },
      { id: '4', actorRole: 'School Staff', action: 'Issue submitted', timestamp: '5 days ago' },
    ],
  },
};

const DEFAULT_ISSUE = MOCK_ISSUES['SETU-2847'];

// ─────────────────────────────────────────────────────────────────────────────

// Category icons mapping
const getCategoryIcon = (category: string) => {
  const iconMap: { [key: string]: string } = {
    infrastructure: '🏗️',
    health: '⚕️',
    food: '🍽️',
    safety: '🛡️',
    academics: '📚',
    utilities: '💡',
  };
  return iconMap[category.toLowerCase()] || '📋';
};

// Urgency score color configuration
const getUrgencyColor = (score: number) => {
  if (score >= 120) return { bg: '#FEE2E2', text: '#DC2626', border: '#DC2626' }; // Red
  if (score >= 100) return { bg: '#FED7AA', text: '#EA580C', border: '#EA580C' }; // Deep Orange
  if (score >= 80) return { bg: '#FEF3C7', text: '#D97706', border: '#D97706' }; // Amber
  if (score >= 60) return { bg: '#DBEAFE', text: '#2563EB', border: '#2563EB' }; // Blue
  return { bg: '#F3F4F6', text: '#6B7280', border: '#9CA3AF' }; // Gray
};

// Status chip configuration
const getStatusConfig = (status: string) => {
  const configs: { [key: string]: { bg: string; text: string } } = {
    'submitted': { bg: '#EEF2FF', text: '#4F46E5' },
    'acknowledged': { bg: '#DBEAFE', text: '#2563EB' },
    'in_progress': { bg: '#FEF3C7', text: '#D97706' },
    'resolved_pending': { bg: '#D1FAE5', text: '#059669' },
    'resolved_confirmed': { bg: '#059669', text: '#FFFFFF' },
    'escalated_l1': { bg: '#DBEAFE', text: '#2563EB' },
    'escalated_l2': { bg: '#FEF3C7', text: '#D97706' },
    'escalated_l3': { bg: '#FED7AA', text: '#EA580C' },
    'escalated_l4': { bg: '#FEE2E2', text: '#DC2626' },
  };
  return configs[status] || configs['submitted'];
};

// Format status for display
const formatStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'submitted': 'Submitted',
    'acknowledged': 'Acknowledged',
    'in_progress': 'In Progress',
    'resolved_pending': 'Resolved (Pending Confirmation)',
    'resolved_confirmed': 'Resolved & Confirmed',
    'escalated_l1': 'Escalated - L1',
    'escalated_l2': 'Escalated - L2',
    'escalated_l3': 'Escalated - L3',
    'escalated_l4': 'Escalated - L4',
  };
  return statusMap[status] || status;
};

export function IssueDetailPrincipal() {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  const issueData = (issueId && MOCK_ISSUES[issueId]) ? MOCK_ISSUES[issueId] : DEFAULT_ISSUE;

  const [showFullHistory, setShowFullHistory] = useState(false);
  const [commentExpanded, setCommentExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isAnonymousBypassModalOpen, setIsAnonymousBypassModalOpen] = useState(false);
  const [isEscalationSheetOpen, setIsEscalationSheetOpen] = useState(false);
  const [isWithdrawEndorsementModalOpen, setIsWithdrawEndorsementModalOpen] = useState(false);
  const [isEndorseIssueModalOpen, setIsEndorseIssueModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isEndorsed, setIsEndorsed] = useState(issueData.isEndorsed);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement | null>(null);

  const categoryIcon = getCategoryIcon(issueData.category);
  const urgencyColors = getUrgencyColor(issueData.urgencyScore);
  const statusConfig = getStatusConfig(issueData.status);
  const isPulsing = issueData.urgencyScore >= 100;

  // Calculate dispute window (72 hours from resolution)
  const isDisputeWindowOpen = issueData.status === 'resolved_pending';
  const [timeRemaining, setTimeRemaining] = useState(() => {
    if (issueData.resolvedAt) {
      const resolvedTime = new Date(issueData.resolvedAt).getTime();
      const now = Date.now();
      const elapsed = now - resolvedTime;
      const totalWindow = 72 * 60 * 60 * 1000; // 72 hours in ms
      const remaining = Math.max(0, totalWindow - elapsed);
      return Math.floor(remaining / 1000); // Convert to seconds
    }
    return 72 * 60 * 60; // Default 72 hours
  });

  useEffect(() => {
    if (isDisputeWindowOpen && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isDisputeWindowOpen, timeRemaining]);

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m remaining`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `Issue ${issueData.id}`, text: `${issueData.title}`, url: window.location.href });
    } else {
      alert('Share — Issue ID: ' + issueData.id);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleCommentFocus = () => {
    setCommentExpanded(true);
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 100);
  };

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      alert('Comment submitted: ' + commentText);
      setCommentText('');
      setCommentExpanded(false);
    }
  };

  const handleDispute = () => {
    setIsDisputeModalOpen(true);
  };

  const handleDisputeSubmit = (reason: string, evidencePhoto?: File) => {
    console.log('Dispute submitted:', reason, evidencePhoto);
    alert(
      `Dispute submitted!\n\nReason: ${reason}\n\nStatus changed to "Dispute Filed". Both school and official have been notified.`
    );
    setIsDisputeModalOpen(false);
  };

  const handleAnonymousBypass = () => {
    setIsAnonymousBypassModalOpen(true);
  };

  const handleAnonymousBypassSubmit = (report: string) => {
    console.log('Anonymous bypass report:', report);
    setToastMessage('Report sent securely to state officials.');
    setIsAnonymousBypassModalOpen(false);
  };

  const handleDownloadPDF = () => {
    alert('Downloading Issue PDF...');
  };

  const handleEndorse = () => {
    if (isEndorsed) {
      // Already endorsed - show withdraw modal
      setIsWithdrawEndorsementModalOpen(true);
    } else {
      // Show endorse modal
      setIsEndorseIssueModalOpen(true);
    }
  };

  const handleEndorseConfirm = (note?: string) => {
    // In production, this would submit to Supabase
    console.log('Issue endorsed with note:', note);
    
    // Set endorsed state
    setIsEndorsed(true);
    
    // Close modal
    setIsEndorseIssueModalOpen(false);
    
    // Show success toast
    setToastMessage('Issue endorsed.');
    
    // In production, this would:
    // - Add endorsement flag to issue in database
    // - Add audit entry: "Endorsed by Principal [Name]"
    // - Add gold star badge to card
    // - Notify district officials
    // - Update issue priority/visibility
  };

  const handleWithdrawEndorsement = (reason: string) => {
    // In production, this would submit to Supabase
    console.log('Endorsement withdrawn with reason:', reason);
    
    // Remove endorsed state
    setIsEndorsed(false);
    
    // Close modal
    setIsWithdrawEndorsementModalOpen(false);
    
    // Show success toast
    setToastMessage('Endorsement withdrawn');
    
    // In production, this would:
    // - Remove endorsement flag from issue in database
    // - Add audit entry: "Withdrawn endorsement by Principal [Name] - Reason: [reason]"
    // - Remove gold star badge from card
    // - Notify district officials that endorsement is no longer active
    // - Update issue priority/visibility
  };

  const displayedTimeline = showFullHistory
    ? issueData.timeline
    : issueData.timeline.slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      {/* App Bar - Navy 56px */}
      <div
        className="flex items-center justify-between px-4 bg-[#0D1B2A] sticky top-0 z-20"
        style={{ height: '56px' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="min-w-[48px] min-h-[48px] flex items-center justify-center -ml-3"
          data-i18n="btn_back"
        >
          <ArrowLeft size={24} color="white" />
        </button>
        <h1
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{
            fontFamily: 'Noto Sans',
            fontWeight: 600,
            fontSize: '16px',
            color: 'white',
          }}
          data-i18n="lbl_issue_id_appbar"
        >
          {issueData.id}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="min-w-[48px] min-h-[48px] flex items-center justify-center"
          >
            <Share2 size={20} color="white" />
          </button>
          <LanguageToggle size="compact" />
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto pb-6">
        {/* Top Card - Issue Summary */}
        <div
          className="bg-white mx-4 mt-4"
          style={{
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Row 1: Category Chip + AI Urgency Score */}
          <div className="flex items-center justify-between mb-3">
            {/* Category Chip */}
            <div
              className="flex items-center gap-2 px-3 py-1.5"
              style={{
                border: '1px solid #0D1B2A',
                borderRadius: '16px',
              }}
            >
              <span style={{ fontSize: '16px' }}>{categoryIcon}</span>
              <span
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#0D1B2A',
                  textTransform: 'capitalize',
                }}
              >
                {issueData.category}
              </span>
            </div>

            {/* AI Urgency Score Badge */}
            <motion.div
              className="px-3 py-1.5"
              style={{
                backgroundColor: urgencyColors.bg,
                borderRadius: '16px',
                border: `1px solid ${urgencyColors.border}`,
              }}
              animate={
                isPulsing
                  ? {
                      scale: [1, 1.05, 1],
                      opacity: [1, 0.9, 1],
                    }
                  : {}
              }
              transition={
                isPulsing
                  ? {
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                  : {}
              }
            >
              <span
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: urgencyColors.text,
                }}
              >
                {issueData.urgencyScore}
              </span>
            </motion.div>
          </div>

          {/* Row 2: Issue Title */}
          <h2
            className="mb-3"
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '22px',
              fontWeight: 700,
              color: '#0D1B2A',
              lineHeight: '1.3',
            }}
          >
            {issueData.title}
          </h2>

          {/* Row 3: Status Chip + Info Button */}
          <div className="mb-2 flex items-center gap-2">
            <span
              className="inline-block px-3 py-1.5"
              style={{
                backgroundColor: statusConfig.bg,
                color: statusConfig.text,
                borderRadius: '16px',
                fontFamily: 'Noto Sans',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {formatStatus(issueData.status)}
            </span>
            <button
              onClick={() => setIsEscalationSheetOpen(true)}
              className="min-w-[32px] min-h-[32px] flex items-center justify-center"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
              aria-label="View escalation info"
            >
              <Info size={18} color="#6B7280" />
            </button>
          </div>

          {/* Row 4: Reported By Metadata (Principal-specific) */}
          <p
            className="mb-2"
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '12px',
              color: '#6B7280',
              fontStyle: 'italic',
            }}
          >
            <span data-i18n="lbl_reported_by">Reported by:</span>{' '}
            <span style={{ fontWeight: 600, color: '#0D1B2A' }}>
              {issueData.reportedByName}
            </span>
          </p>

          {/* Row 5: Submission Meta */}
          <p
            className="mb-4"
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '11px',
              color: '#6B7280',
            }}
          >
            Submitted {issueData.submittedDaysAgo} {issueData.submittedDaysAgo === 1 ? 'day' : 'days'} ago
          </p>

          {/* Divider */}
          <div
            className="mb-4"
            style={{ height: '1px', backgroundColor: '#E5E7EB' }}
          />

          {/* Issue Description */}
          <p
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              color: '#4B5563',
              lineHeight: '1.6',
            }}
          >
            {issueData.description}
          </p>

          {/* Evidence Photo (if exists) */}
          {issueData.photo && (
            <div className="mt-4">
              <img
                src={issueData.photo}
                alt="Issue evidence"
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  maxHeight: '240px',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}

          {/* Voice Note Player (if exists) */}
          {issueData.voiceNote && (
            <div
              className="mt-4 flex items-center gap-3 p-3"
              style={{
                backgroundColor: '#F3F4F6',
                borderRadius: '8px',
              }}
            >
              <button
                onClick={handlePlayPause}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center"
                style={{
                  backgroundColor: '#0D1B2A',
                  borderRadius: '50%',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {isPlaying ? <Pause size={18} color="white" /> : <Play size={18} color="white" />}
              </button>
              <div className="flex-1">
                <div
                  style={{
                    height: '4px',
                    backgroundColor: '#D1D5DB',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${audioProgress}%`,
                      backgroundColor: '#F0A500',
                    }}
                  />
                </div>
                <p
                  className="mt-1"
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '11px',
                    color: '#6B7280',
                  }}
                >
                  {issueData.voiceNote.duration}s
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Panel - Principal-specific */}
        <div
          className="bg-white mx-4 mt-4"
          style={{
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          }}
        >
          <h3
            className="mb-3"
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              fontWeight: 700,
              color: '#0D1B2A',
            }}
            data-i18n="lbl_actions"
          >
            Actions
          </h3>

          {/* Endorse Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleEndorse}
            className="w-full flex items-center justify-center gap-2 mb-3"
            style={{
              minHeight: '48px',
              backgroundColor: 'white',
              border: `2px solid ${isEndorsed ? '#10B981' : '#0D1B2A'}`,
              borderRadius: '8px',
              color: isEndorsed ? '#10B981' : '#0D1B2A',
              fontFamily: 'Noto Sans',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            data-i18n={isEndorsed ? 'btn_endorsed' : 'btn_endorse'}
          >
            {isEndorsed ? (
              <>
                <Check size={20} />
                <span>Endorsed ✓</span>
              </>
            ) : (
              <>
                <ThumbsUp size={20} />
                <span>Endorse This Issue</span>
              </>
            )}
          </motion.button>

          {/* Dispute Resolution Button (if resolved within 72h) */}
          {isDisputeWindowOpen && timeRemaining > 0 && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleDispute}
              className="w-full mb-3"
              style={{
                minHeight: '48px',
                backgroundColor: '#FEF3C7',
                border: '2px solid #F59E0B',
                borderRadius: '8px',
                color: '#92400E',
                fontFamily: 'Noto Sans',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Shield size={20} />
                <span data-i18n="btn_dispute_resolution">Dispute Resolution</span>
              </div>
              <p
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '11px',
                  color: '#92400E',
                  marginTop: '4px',
                }}
              >
                {formatTimeRemaining(timeRemaining)}
              </p>
            </motion.button>
          )}

          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center gap-2 mb-3"
            style={{
              minHeight: '48px',
              backgroundColor: 'white',
              border: '1.5px solid #E5E7EB',
              borderRadius: '8px',
              color: '#6B7280',
              fontFamily: 'Noto Sans',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            data-i18n="btn_download_pdf"
          >
            <Download size={20} />
            <span>Download PDF Report</span>
          </button>

          {/* Anonymous Bypass - Principal-specific label */}
          <button
            onClick={handleAnonymousBypass}
            className="w-full flex items-center justify-center gap-2"
            style={{
              minHeight: '48px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#9CA3AF',
              fontFamily: 'Noto Sans',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            data-i18n="btn_anon_escalate"
          >
            <Shield size={16} />
            <span>Escalate Anonymously to State</span>
          </button>
        </div>

        {/* Comment Section */}
        <div
          className="bg-white mx-4 mt-4"
          style={{
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          }}
        >
          <h3
            className="mb-3"
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              fontWeight: 700,
              color: '#0D1B2A',
            }}
            data-i18n="lbl_add_comment"
          >
            Add Comment
          </h3>

          <textarea
            ref={commentInputRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onFocus={handleCommentFocus}
            placeholder="Add an internal note or update..."
            data-i18n="placeholder_comment"
            style={{
              width: '100%',
              minHeight: commentExpanded ? '96px' : '48px',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              color: '#0D1B2A',
              resize: 'vertical',
              outline: 'none',
              transition: 'min-height 0.2s',
            }}
          />

          {commentExpanded && (
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  setCommentExpanded(false);
                  setCommentText('');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#6B7280',
                  cursor: 'pointer',
                }}
                data-i18n="btn_cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
                style={{
                  padding: '8px 16px',
                  backgroundColor: commentText.trim() ? '#0D1B2A' : '#E5E7EB',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'white',
                  cursor: commentText.trim() ? 'pointer' : 'not-allowed',
                }}
                data-i18n="btn_submit"
              >
                Submit
              </button>
            </div>
          )}
        </div>

        {/* Timeline - All entries visible including internal escalation logs */}
        <div
          className="bg-white mx-4 mt-4"
          style={{
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          }}
        >
          <h3
            className="mb-4"
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              fontWeight: 700,
              color: '#0D1B2A',
            }}
            data-i18n="lbl_activity_timeline"
          >
            Activity Timeline
          </h3>

          <div className="space-y-4">
            {displayedTimeline.map((entry, index) => (
              <div key={entry.id} className="flex gap-3">
                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: entry.isSystemAction ? '#F0A500' : 
                                      entry.isInternalEscalation ? '#10B981' : '#0D1B2A',
                      marginTop: '4px',
                    }}
                  />
                  {index < displayedTimeline.length - 1 && (
                    <div
                      style={{
                        width: '2px',
                        flex: 1,
                        minHeight: '24px',
                        backgroundColor: '#E5E7EB',
                      }}
                    />
                  )}
                </div>

                {/* Timeline content */}
                <div className="flex-1 pb-2">
                  <p
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: entry.isSystemAction ? '#F59E0B' : 
                             entry.isInternalEscalation ? '#10B981' : '#0D1B2A',
                      marginBottom: '2px',
                    }}
                  >
                    {entry.actorRole}
                    {entry.isInternalEscalation && (
                      <span
                        style={{
                          marginLeft: '6px',
                          fontSize: '10px',
                          fontWeight: 700,
                          color: '#10B981',
                          backgroundColor: '#D1FAE5',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        INTERNAL
                      </span>
                    )}
                  </p>
                  <p
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      color: '#4B5563',
                      marginBottom: '4px',
                    }}
                  >
                    {entry.action}
                  </p>
                  <p
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '11px',
                      color: '#9CA3AF',
                    }}
                  >
                    {entry.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {issueData.timeline.length > 5 && !showFullHistory && (
            <button
              onClick={() => setShowFullHistory(true)}
              className="mt-4 w-full"
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#F0A500',
                fontFamily: 'Noto Sans',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              data-i18n="btn_show_full_history"
            >
              Show Full History ({issueData.timeline.length} entries)
            </button>
          )}
        </div>
      </main>

      {/* Modals */}
      <DisputeResolutionModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        onSubmit={handleDisputeSubmit}
      />

      <AnonymousBypassModal
        isOpen={isAnonymousBypassModalOpen}
        onClose={() => setIsAnonymousBypassModalOpen(false)}
        onSubmit={handleAnonymousBypassSubmit}
      />

      <EscalationLevelBottomSheet
        isOpen={isEscalationSheetOpen}
        onClose={() => setIsEscalationSheetOpen(false)}
        currentLevel={issueData.status.includes('escalated') 
          ? (issueData.status.split('_')[1].toUpperCase() as 'L1' | 'L2' | 'L3' | 'L4')
          : 'L0'}
      />

      <WithdrawEndorsementModal
        isOpen={isWithdrawEndorsementModalOpen}
        onClose={() => setIsWithdrawEndorsementModalOpen(false)}
        onConfirm={handleWithdrawEndorsement}
      />

      <EndorseIssueModal
        isOpen={isEndorseIssueModalOpen}
        onClose={() => setIsEndorseIssueModalOpen(false)}
        onEndorse={handleEndorseConfirm}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage('')}
        />
      )}
    </div>
  );
}
