import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Share2, Download, Play, Pause, Shield, Info, ThumbsUp, Check } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { DisputeResolutionModal } from '../components/DisputeResolutionModal';
import { AnonymousBypassModal } from '../components/AnonymousBypassModal';
import { EscalationLevelBottomSheet } from '../components/EscalationLevelBottomSheet';
import { WithdrawEndorsementModal } from '../components/WithdrawEndorsementModal';
import { EndorseIssueModal } from '../components/EndorseIssueModal';
import { Toast } from '../components/Toast';
import { AIUrgencyScoreBadgeLarge } from '../components/AIUrgencyScoreBadge';
import { TimelineAuditLog, AuditLogEntry } from '../components/TimelineAuditLog';
import { OfflineBanner } from '../components/OfflineBanner';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router';
import { useIssue, endorseIssue, withdrawEndorsement } from '../hooks/useIssues';
import { useIssueAuditLog, formatAuditEntry, addAuditLogEntry } from '../hooks/useIssueAuditLog';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useIssueComments } from '../hooks/useIssueComments';
import { fileDispute } from '../hooks/useDisputes';
import { submitAnonymousReport } from '../hooks/useAnonymousReports';

// Category icons mapping
const getCategoryIcon = (category: string) => {
  const iconMap: { [key: string]: string } = {
    water: '💧',
    electricity: '⚡',
    building: '🏗️',
    safety: '🛡️',
    finance: '💰',
    other: '📋',
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

// Get days ago from timestamp
const getDaysAgo = (timestamp: string): number => {
  const now = Date.now();
  const diff = now - new Date(timestamp).getTime();
  return Math.floor(diff / 86400000);
};

// Get escalation level from current_level string
const getEscalationLevel = (currentLevel: string): number => {
  return parseInt(currentLevel.substring(1)); // 'L0' -> 0, 'L2' -> 2, etc.
};

export function IssueDetailPrincipal() {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { issue, loading: issueLoading, error: issueError, refetch } = useIssue(issueId || '', true); // true = search by SETU ID
  const { entries: auditEntries, loading: auditLoading, refetch: refetchAudit } = useIssueAuditLog(issue?.id || '');
  const { comments, loading: commentsLoading, addComment } = useIssueComments(issue?.id || '');

  const [showFullHistory, setShowFullHistory] = useState(false);
  const [commentExpanded, setCommentExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isAnonymousBypassModalOpen, setIsAnonymousBypassModalOpen] = useState(false);
  const [isEscalationSheetOpen, setIsEscalationSheetOpen] = useState(false);
  const [isEndorseModalOpen, setIsEndorseModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isEndorsing, setIsEndorsing] = useState(false);
  const commentInputRef = useRef<HTMLTextAreaElement | null>(null);

  // Loading state
  if (issueLoading || auditLoading || commentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #F0A500',
            borderTopColor: 'transparent',
            borderRadius: '50%',
          }}
        />
      </div>
    );
  }

  // Error or not found
  if (issueError || !issue) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] px-4">
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>❌</div>
        <h2 style={{ fontFamily: 'Noto Sans', fontSize: '20px', fontWeight: 700, color: '#0D1B2A', marginBottom: '8px' }}>
          Issue Not Found
        </h2>
        <p style={{ fontFamily: 'Noto Sans', fontSize: '14px', color: '#6B7280', marginBottom: '24px', textAlign: 'center' }}>
          The issue you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <button
          onClick={() => navigate('/principal/dashboard')}
          style={{
            backgroundColor: '#0D1B2A',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontFamily: 'Noto Sans',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const categoryIcon = getCategoryIcon(issue.category);
  const urgencyColors = getUrgencyColor(issue.ai_urgency_score);
  const submittedBy = issue.reporter?.full_name || 'Unknown'; // Changed from creator to reporter
  const isOwnIssue = issue.reported_by === user?.id; // Changed from created_by to reported_by

  // Calculate dispute deadline (72 hours from resolved_at)
  const isDisputeWindowOpen = issue.status === 'resolved' && issue.resolved_at;
  const [timeRemaining, setTimeRemaining] = useState(72 * 60 * 60); // 72 hours in seconds

  useEffect(() => {
    if (isDisputeWindowOpen && issue.resolved_at) {
      const resolvedTime = new Date(issue.resolved_at).getTime();
      const deadline = resolvedTime + (72 * 60 * 60 * 1000);
      const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((deadline - now) / 1000));
        setTimeRemaining(remaining);
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [isDisputeWindowOpen, issue.resolved_at]);

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m remaining`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Issue ${issue.setu_id}`,
        text: issue.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage('Link copied to clipboard');
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
      // Submit comment to Supabase
      addComment(commentText);
      setToastMessage('Comment added successfully');
      setCommentText('');
      setCommentExpanded(false);
    }
  };

  const handleEndorse = () => {
    setIsEndorseModalOpen(true);
  };

  const handleEndorseConfirm = async (note: string) => {
    if (!user?.id || !issue.id) return;

    setIsEndorsing(true);
    try {
      // Endorse the issue
      const result = await endorseIssue(issue.id, user.id);
      
      if (result.success) {
        // Add audit log entry
        await addAuditLogEntry({
          issue_id: issue.id,
          actor_id: user.id,
          action_type: 'endorsed',
          note: note || 'Principal endorsed this issue as urgent',
          metadata: { ai_urgency_score: issue.ai_urgency_score },
        });

        // Refresh data
        await refetch();
        await refetchAudit();

        setToastMessage('Issue endorsed successfully');
        setIsEndorseModalOpen(false);
      } else {
        setToastMessage('Failed to endorse issue');
      }
    } catch (error) {
      console.error('Error endorsing issue:', error);
      setToastMessage('An error occurred while endorsing');
    } finally {
      setIsEndorsing(false);
    }
  };

  const handleWithdrawEndorsement = () => {
    setIsWithdrawModalOpen(true);
  };

  const handleWithdrawConfirm = async (reason: string) => {
    if (!user?.id || !issue.id) return;

    try {
      // Implement withdraw endorsement in Supabase
      const result = await withdrawEndorsement(issue.id);
      
      if (result.success) {
        // Add audit log entry
        await addAuditLogEntry({
          issue_id: issue.id,
          actor_id: user.id,
          action_type: 'commented', // Using 'commented' as closest action_type
          note: `Endorsement withdrawn: ${reason || 'No reason provided'}`,
          metadata: { action: 'withdraw_endorsement' },
        });

        // Refresh data
        await refetch();
        await refetchAudit();

        setToastMessage('Endorsement withdrawn');
        setIsWithdrawModalOpen(false);
      } else {
        setToastMessage('Failed to withdraw endorsement');
      }
    } catch (error) {
      console.error('Error withdrawing endorsement:', error);
      setToastMessage('Failed to withdraw endorsement');
    }
  };

  const handleDispute = () => {
    setIsDisputeModalOpen(true);
  };

  const handleDisputeSubmit = (reason: string, evidencePhoto?: File) => {
    // Submit dispute to Supabase
    fileDispute(issue.id, reason, evidencePhoto);
    setToastMessage('Dispute filed successfully');
    setIsDisputeModalOpen(false);
  };

  const handleAnonymousBypass = () => {
    setIsAnonymousBypassModalOpen(true);
  };

  const handleAnonymousBypassSubmit = (report: string) => {
    // Submit anonymous report to Supabase
    submitAnonymousReport(issue.id, report);
    setToastMessage('Report sent securely to state officials.');
    setIsAnonymousBypassModalOpen(false);
  };

  const handleDownloadPDF = () => {
    setToastMessage('Generating PDF...');
    // Generate and download PDF
  };

  // Check if escalation is L2 or higher
  const escalationLevel = getEscalationLevel(issue.current_level);
  const isL2OrHigher = escalationLevel >= 2;

  // Format audit entries for TimelineAuditLog component
  const timelineEntries: AuditLogEntry[] = auditEntries.map(entry => {
    const formatted = formatAuditEntry(entry);
    return {
      id: entry.id,
      actorRole: formatted.actorRole,
      action: formatted.action,
      timestamp: formatted.timestamp,
      isSystemAction: formatted.isSystemAction,
      isInternalEscalation: formatted.isInternalEscalation,
    };
  });

  const displayedTimeline = showFullHistory
    ? timelineEntries
    : timelineEntries.slice(0, 5);

  // Check if already endorsed by current principal
  const isEndorsedByMe = issue.is_endorsed && issue.endorsed_by === user?.id;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <OfflineBanner />

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
          {issue.setu_id}
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
                {issue.category}
              </span>
            </div>

            {/* AI Urgency Score Badge */}
            <AIUrgencyScoreBadgeLarge score={issue.ai_urgency_score} />
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
            {issue.title}
          </h2>

          {/* Row 3: Status + Escalation Chips + Endorsed Badge */}
          <div className="mb-2 flex items-center gap-2 flex-wrap">
            <span
              className="inline-block px-3 py-1.5"
              style={{
                backgroundColor: issue.status === 'resolved' ? '#D1FAE5' : issue.status === 'closed' ? '#E5E7EB' : '#FEF3C7',
                color: issue.status === 'resolved' ? '#059669' : issue.status === 'closed' ? '#6B7280' : '#D97706',
                borderRadius: '16px',
                fontFamily: 'Noto Sans',
                fontSize: '13px',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {issue.status}
            </span>

            {escalationLevel > 0 && (
              <span
                className="inline-block px-3 py-1.5"
                style={{
                  backgroundColor: escalationLevel >= 3 ? '#FEE2E2' : escalationLevel >= 2 ? '#FEF3C7' : '#DBEAFE',
                  color: escalationLevel >= 3 ? '#DC2626' : escalationLevel >= 2 ? '#D97706' : '#2563EB',
                  borderRadius: '16px',
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                L{escalationLevel}
              </span>
            )}

            {issue.is_endorsed && (
              <span
                className="inline-flex items-center gap-1 px-3 py-1.5"
                style={{
                  backgroundColor: '#FEF3C7',
                  color: '#92400E',
                  borderRadius: '16px',
                  fontFamily: 'Noto Sans',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <ThumbsUp size={12} fill="#92400E" />
                Endorsed
              </span>
            )}

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
            Submitted {getDaysAgo(issue.created_at)} days ago • By: {submittedBy}
          </p>

          {/* Divider */}
          <div className="my-4" style={{ height: '1px', backgroundColor: '#E5E7EB' }} />

          {/* Photo Thumbnail */}
          {issue.photo_url && (
            <div className="mb-4">
              <img
                src={issue.photo_url}
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

          {/* Description */}
          <p
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              color: '#0D1B2A',
              lineHeight: '1.6',
            }}
          >
            {issue.description}
          </p>

          {/* Divider */}
          <div className="my-4" style={{ height: '1px', backgroundColor: '#E5E7EB' }} />

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
            <TimelineAuditLog
              entries={displayedTimeline}
              showFullHistory={showFullHistory}
              onToggleHistory={() => setShowFullHistory(!showFullHistory)}
            />
          </div>

          {/* Divider */}
          <div className="my-4" style={{ height: '1px', backgroundColor: '#E5E7EB' }} />

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
                  onChange={(e) => setCommentText(e.target.value.slice(0, 500))}
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

      {/* Principal Actions - Floating Bottom Bar */}
      <div
        className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 py-3"
        style={{
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.08)',
        }}
      >
        {isEndorsedByMe ? (
          /* Already Endorsed - Show Withdraw Button */
          <div className="flex items-center gap-3">
            <div
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3"
              style={{
                backgroundColor: '#FEF3C7',
                borderRadius: '8px',
                border: '1px solid #F0A500',
              }}
            >
              <Check size={18} color="#92400E" />
              <span
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#92400E',
                }}
              >
                Endorsed
              </span>
            </div>
            <button
              onClick={handleWithdrawEndorsement}
              style={{
                height: '48px',
                paddingLeft: '16px',
                paddingRight: '16px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                border: '1px solid #DC2626',
                color: '#DC2626',
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Withdraw
            </button>
          </div>
        ) : (
          /* Not Endorsed - Show Endorse Button */
          <button
            onClick={handleEndorse}
            disabled={isEndorsing}
            className="w-full flex items-center justify-center gap-2"
            style={{
              height: '48px',
              borderRadius: '8px',
              backgroundColor: '#F0A500',
              border: 'none',
              color: '#0D1B2A',
              fontFamily: 'Noto Sans',
              fontSize: '15px',
              fontWeight: 600,
              cursor: isEndorsing ? 'not-allowed' : 'pointer',
              opacity: isEndorsing ? 0.6 : 1,
            }}
            data-i18n="btn_endorse_issue"
          >
            {isEndorsing ? (
              'Endorsing...'
            ) : (
              <>
                <ThumbsUp size={18} />
                Endorse Issue
              </>
            )}
          </button>
        )}
      </div>

      {/* Anonymous Bypass Button - Only visible for L2 or higher escalations */}
      {isL2OrHigher && (
        <div className="mx-4 mt-4 mb-4">
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

      {/* Endorse Issue Modal */}
      <EndorseIssueModal
        isOpen={isEndorseModalOpen}
        onClose={() => setIsEndorseModalOpen(false)}
        onConfirm={handleEndorseConfirm}
        issueTitle={issue.title}
      />

      {/* Withdraw Endorsement Modal */}
      <WithdrawEndorsementModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onConfirm={handleWithdrawConfirm}
      />

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
        currentLevel={escalationLevel}
        onContactDEO={() => {
          setIsEscalationSheetOpen(false);
          setToastMessage('Contact: DEO - Ph: +91-xxx-xxx-xxxx');
        }}
        onViewFullHistory={() => {
          setIsEscalationSheetOpen(false);
          setShowFullHistory(true);
        }}
      />
    </div>
  );
}
