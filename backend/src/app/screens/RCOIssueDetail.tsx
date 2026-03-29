import { useState } from 'react';
import { LanguageToggle } from '../components/LanguageToggle';
import { UpdateStatusDrawer } from '../components/UpdateStatusDrawer';
import { ResolveConfirmModal } from '../components/ResolveConfirmModal';
import { RCOSidebar } from '../components/RCOSidebar';
import { AIUrgencyScoreBadgeLarge } from '../components/AIUrgencyScoreBadge';
import { EscalationChip } from '../components/EscalationChip';
import { TimelineAuditLog, AuditLogEntry } from '../components/TimelineAuditLog';
import {
  ChevronRight,
  Bell,
  School,
  BadgeCheck,
  Play,
  Pause,
  CheckCircle,
  Flag,
  AlertTriangle,
  Edit,
  UserPlus,
  Send,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router';

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details?: string;
  type: 'system' | 'user' | 'comment';
}

export function RCOIssueDetail() {
  const [internalNote, setInternalNote] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolveReason, setResolveReason] = useState('');
  const [showFullHistory, setShowFullHistory] = useState(false);
  const navigate = useNavigate();
  const { issueId } = useParams();

  // Mock issue data
  const issue = {
    id: issueId || 'SETU-2851',
    title: 'Water supply disruption in girls hostel',
    category: 'Infrastructure',
    urgencyScore: 112,
    status: 'In Progress',
    school: 'TGTWREIS Gurukulam, Adilabad',
    submittedDate: '2 days ago',
    filedBy: { name: 'Priya Sharma', role: 'Hostel Warden' },
    escalationLevel: 'L2',
    principalEndorsed: true,
    isAcknowledged: true,
    isFlagged: false,
    assignedOfficer: { name: 'Rajesh Kumar', role: 'RCO' },
    description: `The water supply to the girls hostel has been disrupted for the past 48 hours. The main water tank pump has stopped functioning, affecting approximately 120 students. We have arranged for temporary water tankers, but a permanent solution is urgently needed.\n\nThe pump was last serviced 6 months ago. The maintenance contractor has inspected and confirmed that the motor needs replacement. This is affecting daily activities including bathing, washing, and drinking water access.`,
    photoUrl: null as string | null,
    hasVoiceNote: true,
    voiceNoteDuration: '2:34',
  };

  // Mock audit log
  const rawAuditLog: AuditEntry[] = [
    {
      id: '1',
      timestamp: '2 hours ago',
      actor: 'Rajesh Kumar (RCO)',
      action: 'Updated status to "In Progress"',
      type: 'user',
    },
    {
      id: '2',
      timestamp: '4 hours ago',
      actor: 'System',
      action: 'Escalated to L2 — Urgency threshold exceeded',
      type: 'system',
    },
    {
      id: '3',
      timestamp: '6 hours ago',
      actor: 'Rajesh Kumar (RCO)',
      action: 'Acknowledged issue',
      details: 'Will coordinate with maintenance contractor for pump replacement',
      type: 'user',
    },
    {
      id: '4',
      timestamp: '1 day ago',
      actor: 'Dr. Ramesh Naidu (Principal)',
      action: 'Endorsed this issue',
      type: 'user',
    },
    {
      id: '5',
      timestamp: '2 days ago',
      actor: 'Priya Sharma (Hostel Warden)',
      action: 'Created issue',
      type: 'user',
    },
  ];

  // Convert to AuditLogEntry format
  const auditEntries: AuditLogEntry[] = rawAuditLog.map((entry) => {
    const inferRole = (actor: string): AuditLogEntry['actor']['role'] => {
      if (actor.includes('RCO') || actor.includes('Rajesh')) return 'rco';
      if (actor.includes('Principal')) return 'principal';
      if (actor.includes('Warden') || actor.includes('Staff')) return 'staff';
      return 'officer';
    };
    const parseTime = (ts: string): Date => {
      const now = new Date();
      const h = ts.match(/(\d+)\s*hours?\s*ago/);
      const d = ts.match(/(\d+)\s*days?\s*ago/);
      if (h) return new Date(now.getTime() - parseInt(h[1]) * 3600000);
      if (d) return new Date(now.getTime() - parseInt(d[1]) * 86400000);
      return now;
    };
    const inferAction = (action: string, type: string): AuditLogEntry['action'] => {
      if (type === 'system') return 'escalated';
      const l = action.toLowerCase();
      if (l.includes('acknowledged')) return 'acknowledged';
      if (l.includes('updated status') || l.includes('in progress')) return 'status_updated';
      if (l.includes('created')) return 'submitted';
      if (l.includes('endorsed')) return 'status_updated';
      return 'comment_added';
    };
    return {
      id: entry.id,
      action: inferAction(entry.action, entry.type),
      actor: {
        name: entry.actor,
        role: inferRole(entry.actor),
      },
      timestamp: parseTime(entry.timestamp),
      details: entry.details ? `${entry.action} — ${entry.details}` : entry.action,
    };
  });

  const getUrgencyColor = (score: number) => {
    if (score >= 100) return { bg: '#FECACA', text: '#B91C1C' };
    if (score >= 80) return { bg: '#FED7AA', text: '#C2410C' };
    if (score >= 60) return { bg: '#FEF3C7', text: '#D97706' };
    if (score >= 40) return { bg: '#DBEAFE', text: '#1D4ED8' };
    return { bg: '#E5E7EB', text: '#6B7280' };
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      'Open': { bg: '#DBEAFE', text: '#1D4ED8' },
      'In Progress': { bg: '#FEF3C7', text: '#D97706' },
      'Escalated': { bg: '#FED7AA', text: '#C2410C' },
      'Resolved': { bg: '#D1FAE5', text: '#059669' },
    };
    return colors[status] || { bg: '#E5E7EB', text: '#6B7280' };
  };

  const statusColors = getStatusColor(issue.status);

  const handleLogout = () => {
    localStorage.removeItem('session');
    navigate('/rco/login', { replace: true });
  };

  const handleSubmitNote = () => {
    if (internalNote.trim()) {
      console.log('Internal note submitted:', {
        issueId: issue.id,
        note: internalNote,
        timestamp: new Date().toISOString(),
      });
      setInternalNote('');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* RCO Sidebar */}
      <RCOSidebar
        userName="Rajesh Kumar"
        userRole="Regional Coordinator"
        notificationCount={5}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-[240px]">
        {/* Top Bar */}
        <div
          className="flex items-center justify-between px-6 bg-white border-b border-[#E5E7EB]"
          style={{ height: '64px' }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2" data-i18n="breadcrumb">
              <button
                onClick={() => navigate('/rco/dashboard')}
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  color: '#6B7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Dashboard
              </button>
              <ChevronRight size={16} color="#6B7280" />
              <button
                onClick={() => navigate('/rco/issue-queue')}
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  color: '#6B7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Issue Queue
              </button>
              <ChevronRight size={16} color="#6B7280" />
              <span
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0D1B2A',
                }}
              >
                {issue.id}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageToggle size="compact" />
            <button className="relative min-w-[48px] min-h-[48px] flex items-center justify-center">
              <Bell size={20} color="#0D1B2A" />
              <span
                className="absolute top-1 right-1 flex items-center justify-center"
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  fontFamily: 'Noto Sans',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                5
              </span>
            </button>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 max-w-[1440px] mx-auto">
            {/* Left Column - 60% */}
            <div className="xl:col-span-3 space-y-6">
              {/* Issue Header Card */}
              <div
                className="bg-white rounded-lg border border-[#E5E7EB] p-6"
                style={{
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                  borderLeft: '4px solid #EA580C',
                }}
              >
                {/* ID + Category + Endorsed */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#0D1B2A',
                    }}
                  >
                    {issue.id}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: '#DBEAFE',
                      color: '#1D4ED8',
                      fontFamily: 'Noto Sans',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    {issue.category}
                  </span>
                  <EscalationChip level={issue.escalationLevel as 'L0' | 'L1' | 'L2' | 'L3' | 'L4'} />
                  {issue.principalEndorsed && (
                    <div
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg"
                      style={{
                        backgroundColor: '#F0FDF4',
                        border: '1px solid #86EFAC',
                      }}
                    >
                      <BadgeCheck size={13} color="#166534" strokeWidth={2.5} />
                      <span
                        style={{
                          fontFamily: 'Noto Sans',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#166534',
                        }}
                        data-i18n="badge_endorsed"
                      >
                        Principal Endorsed
                      </span>
                    </div>
                  )}
                </div>

                {/* AI Urgency Score Badge - Large */}
                <div className="mb-4">
                  <AIUrgencyScoreBadgeLarge score={issue.urgencyScore} />
                </div>

                {/* Issue Title */}
                <h1
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                    marginBottom: '12px',
                  }}
                >
                  {issue.title}
                </h1>

                {/* Status Chip */}
                <span
                  className="inline-flex items-center px-4 py-2 rounded-full mb-4"
                  style={{
                    backgroundColor: statusColors.bg,
                    color: statusColors.text,
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  {issue.status}
                </span>

                {/* Meta Row */}
                <div className="space-y-2 mt-4 pt-4 border-t border-[#E5E7EB]">
                  <div className="flex items-center gap-2">
                    <School size={16} color="#6B7280" />
                    <span style={{ fontFamily: 'Noto Sans', fontSize: '14px', color: '#6B7280' }}>
                      {issue.school}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span style={{ fontFamily: 'Noto Sans', fontSize: '13px', color: '#6B7280' }}>
                      Submitted: {issue.submittedDate}
                    </span>
                    <span style={{ fontFamily: 'Noto Sans', fontSize: '13px', color: '#6B7280' }}>
                      Filed by: <strong>{issue.filedBy.name}</strong> ({issue.filedBy.role})
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Card */}
              <div
                className="bg-white rounded-lg border border-[#E5E7EB] p-6"
                style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}
              >
                <h3
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                    marginBottom: '12px',
                  }}
                >
                  Description
                </h3>
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    color: '#0D1B2A',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {issue.description}
                </p>
              </div>

              {/* Voice Note Player */}
              {issue.hasVoiceNote && (
                <div
                  className="bg-white rounded-lg border border-[#E5E7EB] p-6"
                  style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}
                >
                  <h3
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#0D1B2A',
                      marginBottom: '12px',
                    }}
                  >
                    Voice Note
                  </h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="flex items-center justify-center rounded-full"
                      style={{ width: '48px', height: '48px', backgroundColor: '#F0A500', border: 'none', cursor: 'pointer' }}
                    >
                      {isPlayingAudio ? (
                        <Pause size={20} color="white" />
                      ) : (
                        <Play size={20} color="white" style={{ marginLeft: '2px' }} />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                        <motion.div
                          animate={{ width: isPlayingAudio ? '100%' : '0%' }}
                          transition={{ duration: 154, ease: 'linear' }}
                          className="h-full bg-[#F0A500]"
                        />
                      </div>
                      <p className="mt-1" style={{ fontFamily: 'Noto Sans', fontSize: '13px', color: '#6B7280' }}>
                        Duration: {issue.voiceNoteDuration}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - 40% */}
            <div className="xl:col-span-2 space-y-6">
              {/* Action Panel */}
              <div
                className="bg-white rounded-lg border border-[#E5E7EB] p-4 xl:sticky xl:top-6"
                style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}
              >
                <h3
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                    marginBottom: '16px',
                  }}
                >
                  Actions
                </h3>

                <div className="space-y-3">
                  {(issue.status === 'Open') && (
                    <button
                      disabled={issue.isAcknowledged}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
                      style={{
                        height: '48px',
                        backgroundColor: issue.isAcknowledged ? '#9CA3AF' : '#0D1B2A',
                        color: 'white',
                        fontFamily: 'Noto Sans',
                        fontSize: '14px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: issue.isAcknowledged ? 'not-allowed' : 'pointer',
                      }}
                      data-i18n="btn_acknowledge"
                    >
                      <CheckCircle size={18} />
                      Acknowledge
                    </button>
                  )}

                  <button
                    disabled={issue.status === 'Resolved' || issue.status === 'Closed'}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors hover:bg-[#F8F9FA] disabled:opacity-50"
                    style={{
                      height: '48px',
                      borderColor: '#0D1B2A',
                      color: '#0D1B2A',
                      fontFamily: 'Noto Sans',
                      fontSize: '14px',
                      fontWeight: 600,
                      backgroundColor: 'white',
                      cursor: 'pointer',
                    }}
                    data-i18n="btn_update_status"
                    onClick={() => setUpdateStatusOpen(true)}
                  >
                    <Edit size={18} />
                    Update Status
                  </button>

                  <button
                    disabled={issue.isFlagged}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors disabled:opacity-50"
                    style={{
                      height: '48px',
                      borderColor: issue.isFlagged ? '#9CA3AF' : '#F0A500',
                      color: issue.isFlagged ? '#9CA3AF' : '#F0A500',
                      fontFamily: 'Noto Sans',
                      fontSize: '14px',
                      fontWeight: 600,
                      backgroundColor: 'white',
                      cursor: issue.isFlagged ? 'not-allowed' : 'pointer',
                    }}
                    data-i18n="btn_flag_urgent"
                  >
                    <Flag size={18} />
                    {issue.isFlagged ? 'Flagged' : 'Flag Urgent'}
                  </button>

                  <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors hover:bg-[#F8F9FA]"
                    style={{
                      height: '48px',
                      borderColor: '#0D1B2A',
                      color: '#0D1B2A',
                      fontFamily: 'Noto Sans',
                      fontSize: '14px',
                      fontWeight: 600,
                      backgroundColor: 'white',
                      cursor: 'pointer',
                    }}
                    data-i18n="btn_assign"
                  >
                    <UserPlus size={18} />
                    Assign to Officer
                  </button>

                  {(issue.status === 'In Progress' || issue.status === 'Acknowledged') && (
                    <button
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors"
                      style={{
                        height: '48px',
                        backgroundColor: '#22C55E',
                        color: 'white',
                        fontFamily: 'Noto Sans',
                        fontSize: '14px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      data-i18n="btn_resolve"
                      onClick={() => setResolveModalOpen(true)}
                    >
                      <CheckCircle size={18} />
                      Mark Resolved
                    </button>
                  )}

                  {(issue.escalationLevel === 'L1' || issue.escalationLevel === 'L2') && (
                    <button
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors hover:bg-[#FEE2E2]"
                      style={{
                        height: '48px',
                        borderColor: '#DC2626',
                        color: '#DC2626',
                        fontFamily: 'Noto Sans',
                        fontSize: '14px',
                        fontWeight: 600,
                        backgroundColor: 'white',
                        cursor: 'pointer',
                      }}
                      data-i18n="btn_escalate"
                    >
                      <AlertTriangle size={18} />
                      Escalate Manually
                    </button>
                  )}
                </div>

                {/* Assigned Officer */}
                {issue.assignedOfficer && (
                  <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                    <p
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#6B7280',
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                      }}
                    >
                      Assigned Officer
                    </p>
                    <div
                      className="px-3 py-2 rounded-lg"
                      style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }}
                    >
                      <p style={{ fontFamily: 'Noto Sans', fontSize: '14px', fontWeight: 600, color: '#0D1B2A' }}>
                        {issue.assignedOfficer.name}
                      </p>
                      <p style={{ fontFamily: 'Noto Sans', fontSize: '12px', color: '#6B7280' }}>
                        {issue.assignedOfficer.role}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Audit Log - TimelineAuditLog Component */}
              <div
                className="bg-white rounded-lg border border-[#E5E7EB] p-4"
                style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}
              >
                <TimelineAuditLog
                  entries={auditEntries}
                  showFullHistory={showFullHistory}
                  onToggleHistory={() => setShowFullHistory(true)}
                />

                {/* Comment Input */}
                <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                      placeholder="Add internal note…"
                      className="flex-1 px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white focus:outline-none focus:border-[#F0A500]"
                      style={{
                        height: '48px',
                        fontFamily: 'Noto Sans',
                        fontSize: '14px',
                        color: '#0D1B2A',
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && internalNote.trim()) {
                          handleSubmitNote();
                        }
                      }}
                    />
                    <button
                      onClick={handleSubmitNote}
                      disabled={!internalNote.trim()}
                      className="flex items-center justify-center rounded-lg disabled:opacity-50"
                      style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#F0A500',
                        border: 'none',
                        cursor: internalNote.trim() ? 'pointer' : 'not-allowed',
                      }}
                    >
                      <Send size={18} color="white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Status Drawer */}
      <UpdateStatusDrawer
        isOpen={updateStatusOpen}
        onClose={() => {
          setUpdateStatusOpen(false);
          setSelectedStatus('');
          setStatusNote('');
        }}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        statusNote={statusNote}
        setStatusNote={setStatusNote}
        onUpdate={() => {
          if (selectedStatus && statusNote.trim()) {
            console.log('Status updated:', {
              issueId: issue.id,
              newStatus: selectedStatus,
              note: statusNote,
              timestamp: new Date().toISOString(),
            });
            setUpdateStatusOpen(false);
            setSelectedStatus('');
            setStatusNote('');
          }
        }}
      />

      {/* Resolve Confirm Modal */}
      <ResolveConfirmModal
        isOpen={resolveModalOpen}
        onClose={() => {
          setResolveModalOpen(false);
          setResolveReason('');
        }}
        reason={resolveReason}
        setReason={setResolveReason}
        onConfirm={() => {
          console.log('Issue resolved:', {
            issueId: issue.id,
            reason: resolveReason,
            timestamp: new Date().toISOString(),
          });
          setResolveModalOpen(false);
          setResolveReason('');
        }}
      />
    </div>
  );
}