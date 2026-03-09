import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Share2, Download, Play, Pause, Shield, Info } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { DisputeResolutionModal } from '../components/DisputeResolutionModal';
import { AnonymousBypassModal } from '../components/AnonymousBypassModal';
import { EscalationLevelBottomSheet } from '../components/EscalationLevelBottomSheet';
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
  photo?: string;
  voiceNote?: { url: string; duration: number };
  timeline: TimelineEntry[];
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
    submittedBy: 'You',
    photo:
      'https://images.unsplash.com/photo-1661520754901-bb5d6b374fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    timeline: [
      { id: '1', actorRole: 'District Official', action: 'Marked as resolved after repairs completed', timestamp: '2 hours ago' },
      { id: '2', actorRole: 'Maintenance Contractor', action: 'Added comment: "Pipe replaced and tested. System operational."', timestamp: '4 hours ago' },
      { id: '3', actorRole: 'District Official', action: 'Assigned to Maintenance Contractor', timestamp: '1 day ago' },
      { id: '4', actorRole: 'System', action: 'Escalated to L2 - District Official due to high urgency score', timestamp: '2 days ago', isSystemAction: true },
      { id: '5', actorRole: 'Block Official', action: 'Acknowledged and flagged as urgent', timestamp: '2 days ago' },
      { id: '6', actorRole: 'School Staff', action: 'Issue submitted', timestamp: '3 days ago' },
    ],
  },
  'SETU-2846': {
    id: 'SETU-2846',
    category: 'food',
    title: 'Food quality concerns in mess',
    description: 'Students have been reporting poor food quality in the mess for the past week. Several students fell ill after meals on Tuesday and Wednesday.',
    status: 'in_progress',
    urgencyScore: 72,
    submittedDaysAgo: 5,
    submittedBy: 'You',
    timeline: [
      { id: '1', actorRole: 'Block Official', action: 'Assigned to mess supervisor for investigation', timestamp: '1 day ago' },
      { id: '2', actorRole: 'School Staff', action: 'Issue submitted', timestamp: '5 days ago' },
    ],
  },
  'SETU-2845': {
    id: 'SETU-2845',
    category: 'utilities',
    title: 'Library AC not working',
    description: 'The air conditioning unit in the library has stopped working. Students studying during peak hours are affected due to extreme heat.',
    status: 'acknowledged',
    urgencyScore: 45,
    submittedDaysAgo: 7,
    submittedBy: 'You',
    timeline: [
      { id: '1', actorRole: 'Block Official', action: 'Acknowledged - maintenance team notified', timestamp: '6 days ago' },
      { id: '2', actorRole: 'School Staff', action: 'Issue submitted', timestamp: '7 days ago' },
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

// Get current escalation level from status
const getEscalationLevel = (status: string): 'L0' | 'L1' | 'L2' | 'L3' | 'L4' => {
  if (status === 'escalated_l1') return 'L1';
  if (status === 'escalated_l2') return 'L2';
  if (status === 'escalated_l3') return 'L3';
  if (status === 'escalated_l4') return 'L4';
  return 'L0'; // Default for submitted/acknowledged/in_progress
};

export function IssueDetailStaff() {
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
  const [toastMessage, setToastMessage] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement | null>(null);

  const categoryIcon = getCategoryIcon(issueData.category);
  const urgencyColors = getUrgencyColor(issueData.urgencyScore);
  const statusConfig = getStatusConfig(issueData.status);
  const isPulsing = issueData.urgencyScore >= 100;

  // Calculate dispute deadline (72 hours from now for demo)
  const isDisputeWindowOpen = issueData.status === 'resolved_pending';
  const [timeRemaining, setTimeRemaining] = useState(72 * 60 * 60); // 72 hours in seconds

  useEffect(() => {
    if (isDisputeWindowOpen) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isDisputeWindowOpen]);

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
    // In production, this would submit to Supabase
    console.log('Dispute submitted:', reason, evidencePhoto);
    
    // Show success alert
    alert(
      `Dispute submitted!\n\nReason: ${reason}\n\nStatus changed to "Dispute Filed". Both school and official have been notified.`
    );
    
    // Close modal
    setIsDisputeModalOpen(false);
    
    // In production, this would:
    // - Update status to "Dispute Filed"
    // - Send notifications to school and official
    // - Add new audit entry with dispute reason
    // - Re-open the issue
  };

  const handleAnonymousBypass = () => {
    setIsAnonymousBypassModalOpen(true);
  };

  const handleAnonymousBypassSubmit = (report: string) => {
    // In production, this would submit encrypted report to Supabase
    console.log('Anonymous bypass report:', report);
    
    // Show toast notification
    setToastMessage('Report sent securely to state officials.');
    
    // Close modal
    setIsAnonymousBypassModalOpen(false);
    
    // In production, this would:
    // - Encrypt and send report directly to state admins
    // - NOT log in public audit trail
    // - Only state officials can see this report
    // - District officials have no visibility
  };

  const handleDownloadPDF = () => {
    alert('Downloading Issue PDF...');
  };

  // Check if escalation is L2 or higher
  const isL2OrHigher =
    issueData.status === 'escalated_l2' ||
    issueData.status === 'escalated_l3' ||
    issueData.status === 'escalated_l4';

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
          onClick={() => navigate('/staff/my-issues')}
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

          {/* Row 4: Submission Meta */}
          <p
            className="mb-4"
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '11px',
              color: '#6B7280',
            }}
            data-i18n="lbl_submission_meta"
          >
            Submitted {issueData.submittedDaysAgo} days ago • By: {issueData.submittedBy}
          </p>

          {/* Divider */}
          <div
            className="my-4"
            style={{ height: '1px', backgroundColor: '#E5E7EB' }}
          />

          {/* Photo Thumbnail */}
          {issueData.photo && (
            <div className="mb-4">
              <img
                src={issueData.photo}
                alt="Issue"
                style={{
                  width: '100%',
                  maxHeight: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            </div>
          )}

          {/* Voice Note Playback Bar */}
          {issueData.voiceNote && (
            <div className="mb-4">
              <div
                className="flex items-center gap-3 p-3"
                style={{
                  backgroundColor: '#F8F9FA',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                }}
              >
                <button
                  onClick={handlePlayPause}
                  className="flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#0D1B2A',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {isPlaying ? (
                    <Pause size={20} color="white" />
                  ) : (
                    <Play size={20} color="white" />
                  )}
                </button>
                <div className="flex-1">
                  <div
                    style={{
                      height: '4px',
                      backgroundColor: '#E5E7EB',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${audioProgress}%`,
                        backgroundColor: '#F0A500',
                        transition: 'width 0.1s linear',
                      }}
                    />
                  </div>
                  <p
                    className="mt-1"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '12px',
                      color: '#6B7280',
                    }}
                  >
                    {Math.floor(issueData.voiceNote.duration / 60)}:
                    {(issueData.voiceNote.duration % 60)
                      .toString()
                      .padStart(2, '0')}
                  </p>
                </div>
              </div>
              <audio
                ref={audioRef}
                src={issueData.voiceNote.url}
                onTimeUpdate={(e) => {
                  const audio = e.currentTarget;
                  setAudioProgress((audio.currentTime / audio.duration) * 100);
                }}
                onEnded={() => {
                  setIsPlaying(false);
                  setAudioProgress(0);
                }}
              />
            </div>
          )}

          {/* Description */}
          <p
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              color: '#0D1B2A',
              lineHeight: '1.6',
            }}
          >
            {issueData.description}
          </p>

          {/* Divider */}
          <div
            className="my-4"
            style={{ height: '1px', backgroundColor: '#E5E7EB' }}
          />

          {/* Timeline Section */}
          <div>
            <h3
              className="mb-4"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '16px',
                fontWeight: 700,
                color: '#0D1B2A',
              }}
              data-i18n="lbl_timeline"
            >
              Timeline / Updates
            </h3>

            {/* Timeline Entries */}
            <div className="relative">
              {displayedTimeline.map((entry, index) => (
                <div key={entry.id} className="flex gap-3 pb-4 relative">
                  {/* Left Rail: Circle Dot + Line */}
                  <div className="flex flex-col items-center">
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: '#0D1B2A',
                        border: '2px solid white',
                        boxShadow: '0 0 0 1px #E5E7EB',
                        zIndex: 1,
                      }}
                    />
                    {index < displayedTimeline.length - 1 && (
                      <div
                        style={{
                          width: '2px',
                          flex: 1,
                          backgroundColor: '#E5E7EB',
                          marginTop: '4px',
                          minHeight: '40px',
                        }}
                      />
                    )}
                  </div>

                  {/* Right Content */}
                  <div className="flex-1">
                    {/* Actor Role Tag */}
                    <span
                      className="inline-block px-2 py-0.5 mb-1"
                      style={{
                        backgroundColor: '#F3F4F6',
                        color: '#6B7280',
                        borderRadius: '4px',
                        fontFamily: 'Noto Sans',
                        fontSize: '10px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}
                    >
                      {entry.actorRole}
                    </span>

                    {/* Action Description */}
                    <p
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '13px',
                        color: '#0D1B2A',
                        marginBottom: '4px',
                      }}
                    >
                      {entry.action}
                    </p>

                    {/* Timestamp */}
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

            {/* Show Full History Link */}
            {issueData.timeline.length > 5 && !showFullHistory && (
              <button
                onClick={() => setShowFullHistory(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#F0A500',
                  cursor: 'pointer',
                  padding: '8px 0',
                }}
                data-i18n="lnk_show_history"
              >
                Show full history
              </button>
            )}
          </div>

          {/* Divider */}
          <div
            className="my-4"
            style={{ height: '1px', backgroundColor: '#E5E7EB' }}
          />

          {/* Add Comment Area */}
          <div>
            {!commentExpanded ? (
              <button
                onClick={handleCommentFocus}
                className="w-full text-left px-4 py-3"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  color: '#9CA3AF',
                  cursor: 'text',
                }}
                data-i18n="placeholder_add_comment"
              >
                Add a note...
              </button>
            ) : (
              <div>
                <textarea
                  ref={commentInputRef}
                  value={commentText}
                  onChange={(e) =>
                    setCommentText(e.target.value.slice(0, 500))
                  }
                  maxLength={500}
                  placeholder="Add a note..."
                  className="w-full px-4 py-3 mb-2"
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    color: '#0D1B2A',
                    minHeight: '100px',
                    resize: 'vertical',
                  }}
                  data-i18n="placeholder_add_comment"
                />
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '11px',
                      color: '#9CA3AF',
                    }}
                  >
                    {commentText.length}/500
                  </span>
                  <button
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim()}
                    className="px-4 py-2"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #0D1B2A',
                      borderRadius: '8px',
                      fontFamily: 'Noto Sans',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#0D1B2A',
                      cursor: commentText.trim() ? 'pointer' : 'not-allowed',
                      opacity: commentText.trim() ? 1 : 0.5,
                    }}
                  >
                    Submit Comment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Download PDF Link */}
        <button
          onClick={handleDownloadPDF}
          className="flex items-center justify-center gap-2 mx-4 mt-4"
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'Noto Sans',
            fontSize: '14px',
            fontWeight: 600,
            color: '#F0A500',
            cursor: 'pointer',
            padding: '12px',
          }}
          data-i18n="lnk_download_pdf"
        >
          <Download size={16} color="#F0A500" />
          Download Issue PDF
        </button>
      </main>

      {/* Dispute Resolution Button - Only visible during 72h window */}
      {isDisputeWindowOpen && timeRemaining > 0 && (
        <div
          className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 py-3"
          style={{
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          <p
            className="text-center mb-2"
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '11px',
              color: '#DC2626',
              fontWeight: 500,
            }}
            data-i18n="lbl_dispute_timer"
          >
            {formatTimeRemaining(timeRemaining)}
          </p>
          <button
            onClick={handleDispute}
            className="w-full"
            style={{
              height: '48px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              border: '2px solid #DC2626',
              color: '#DC2626',
              fontFamily: 'Noto Sans',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            data-i18n="btn_dispute"
          >
            Dispute Resolution
          </button>
        </div>
      )}

      {/* Anonymous Bypass Button - Only visible for L2 or higher escalations */}
      {isL2OrHigher && (
        <div className="mx-4 mt-4">
          <button
            onClick={handleAnonymousBypass}
            className="w-full flex items-center justify-center gap-2"
            style={{
              height: '48px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#6B7280',
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            data-i18n="btn_report_state"
          >
            <Shield size={18} color="#6B7280" />
            Report to State Officials
          </button>
        </div>
      )}

      {/* Dispute Resolution Modal */}
      <DisputeResolutionModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        onSubmit={handleDisputeSubmit}
      />

      {/* Anonymous Bypass Modal */}
      <AnonymousBypassModal
        isOpen={isAnonymousBypassModalOpen}
        onClose={() => setIsAnonymousBypassModalOpen(false)}
        onSubmit={handleAnonymousBypassSubmit}
      />

      {/* Toast */}
      <Toast
        message={toastMessage}
        isVisible={!!toastMessage}
        onClose={() => setToastMessage('')}
        type="success"
      />

      {/* Escalation Level Explainer Bottom Sheet */}
      <EscalationLevelBottomSheet
        isOpen={isEscalationSheetOpen}
        onClose={() => setIsEscalationSheetOpen(false)}
        currentLevel={getEscalationLevel(issueData.status)}
        onContactDEO={() => {
          setIsEscalationSheetOpen(false);
          alert('Contact DEO - Phone: +91-xxx-xxx-xxxx');
        }}
        onViewFullHistory={() => {
          setIsEscalationSheetOpen(false);
          setShowFullHistory(true);
        }}
      />
    </div>
  );
}
