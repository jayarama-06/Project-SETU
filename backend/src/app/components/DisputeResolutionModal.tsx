/**
 * SETU – Dispute Resolution Modal
 * Allows staff to dispute a resolution within 72 hours
 * Shows countdown timer + dispute reason form
 * 
 * Design Spec: A-09 Issue Detail View, Dispute Flow
 */

import { useState, useEffect, CSSProperties } from 'react';
import { useLanguage } from '../utils/languageContext';
import { t } from '../utils/translations';

interface DisputeResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
  resolvedAt: Date;
  issueId: string;
}

const DISPUTE_REASONS = [
  'issue_not_resolved',
  'incomplete_resolution',
  'needs_follow_up',
  'other_reason',
];

/**
 * DisputeResolutionModal – Dispute a resolution within 72h
 * 
 * @example
 * <DisputeResolutionModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   onSubmit={(reason, details) => console.log('Dispute:', reason)}
 *   resolvedAt={new Date('2026-03-13T10:00:00')}
 *   issueId="SETU-1234"
 * />
 */
export function DisputeResolutionModal({
  isOpen,
  onClose,
  onSubmit,
  resolvedAt,
  issueId,
}: DisputeResolutionModalProps) {
  const { language } = useLanguage();
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);

  const DISPUTE_WINDOW = 72 * 60 * 60 * 1000; // 72 hours in milliseconds

  useEffect(() => {
    if (!isOpen) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const resolvedTime = resolvedAt.getTime();
      const deadline = resolvedTime + DISPUTE_WINDOW;
      const remaining = deadline - now;

      if (remaining <= 0) {
        setTimeRemaining(0);
      } else {
        setTimeRemaining(remaining);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isOpen, resolvedAt]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedReason) {
      alert('Please select a reason for dispute');
      return;
    }

    onSubmit(selectedReason, details);
    onClose();
  };

  const formatTimeRemaining = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'Noto Sans',
  };

  const modalStyle: CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    maxWidth: '480px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  };

  const headerStyle: CSSProperties = {
    padding: '20px 24px',
    borderBottom: '1px solid #E5E7EB',
  };

  const bodyStyle: CSSProperties = {
    padding: '24px',
  };

  const footerStyle: CSSProperties = {
    padding: '16px 24px',
    borderTop: '1px solid #E5E7EB',
    display: 'flex',
    gap: '12px',
  };

  return (
    <div style={overlayStyle} onClick={onClose} role="dialog" aria-modal="true">
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#0D1B2A',
                  margin: '0 0 8px 0',
                }}
                data-i18n="btn_dispute"
              >
                {t('btn_dispute', language)}
              </h2>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                Issue ID: {issueId}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                color: '#6B7280',
                cursor: 'pointer',
                padding: '0',
              }}
            >
              ✕
            </button>
          </div>

          {/* Countdown Timer */}
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: timeRemaining > 0 ? '#FEF3C7' : '#FEE2E2',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span 
              className="material-symbols-rounded" 
              style={{ 
                fontSize: '24px', 
                color: timeRemaining > 0 ? '#D97706' : '#EF4444',
              }}
            >
              schedule
            </span>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: timeRemaining > 0 ? '#92400E' : '#991B1B',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
                data-i18n="lbl_dispute_timer"
              >
                Time Remaining to Dispute
              </p>
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: timeRemaining > 0 ? '#D97706' : '#EF4444',
                  margin: 0,
                  fontFamily: 'monospace',
                }}
              >
                {timeRemaining > 0 ? formatTimeRemaining(timeRemaining) : 'Expired'}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={bodyStyle}>
          {timeRemaining > 0 ? (
            <>
              {/* Reason Selection */}
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0D1B2A',
                  marginBottom: '12px',
                }}
              >
                Reason for Dispute *
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {DISPUTE_REASONS.map((reason) => (
                  <label
                    key={reason}
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      gap: '12px',
                      padding: '12px',
                      border: selectedReason === reason ? '2px solid #F0A500' : '1px solid #E5E7EB',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: selectedReason === reason ? '#FEF3C7' : '#FFFFFF',
                      transition: 'all 0.2s',
                    }}
                  >
                    <input
                      type="radio"
                      name="dispute-reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      style={{
                        marginTop: '2px',
                        width: '18px',
                        height: '18px',
                        accentColor: '#F0A500',
                      }}
                    />
                    <span style={{ fontSize: '14px', color: '#0D1B2A', flex: 1 }}>
                      {getReasonLabel(reason, language)}
                    </span>
                  </label>
                ))}
              </div>

              {/* Additional Details */}
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0D1B2A',
                  marginBottom: '8px',
                }}
              >
                Additional Details (optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain why you believe this issue is not resolved..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '12px',
                  fontSize: '14px',
                  fontFamily: 'Noto Sans',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
                maxLength={500}
              />
              <p style={{ fontSize: '11px', color: '#6B7280', textAlign: 'right', marginTop: '4px' }}>
                {details.length}/500 characters
              </p>

              {/* Warning Message */}
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: '#FEF3C7',
                  borderLeft: '4px solid #F59E0B',
                  borderRadius: '4px',
                }}
              >
                <p style={{ fontSize: '12px', color: '#92400E', margin: 0 }}>
                  ⚠️ Filing a dispute will reopen this issue and notify the assigned officer.
                  Please ensure all details are accurate.
                </p>
              </div>
            </>
          ) : (
            <div
              style={{
                padding: '32px',
                textAlign: 'center',
              }}
            >
              <span 
                className="material-symbols-rounded" 
                style={{ 
                  fontSize: '64px', 
                  color: '#EF4444',
                  display: 'block',
                  marginBottom: '16px',
                }}
              >
                cancel
              </span>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#0D1B2A', marginBottom: '8px' }}>
                Dispute Window Expired
              </p>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>
                The 72-hour window to dispute this resolution has passed.
                Please contact your principal for further assistance.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {timeRemaining > 0 && (
          <div style={footerStyle}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                height: '48px',
                backgroundColor: 'transparent',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#6B7280',
                cursor: 'pointer',
                fontFamily: 'Noto Sans',
              }}
              data-i18n="btn_cancel"
            >
              {t('btn_cancel', language)}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedReason}
              style={{
                flex: 2,
                height: '48px',
                backgroundColor: selectedReason ? '#EF4444' : '#E5E7EB',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#FFFFFF',
                cursor: selectedReason ? 'pointer' : 'not-allowed',
                fontFamily: 'Noto Sans',
                opacity: selectedReason ? 1 : 0.5,
              }}
              data-i18n="btn_submit"
            >
              Submit Dispute
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Get translated reason label
 */
function getReasonLabel(reason: string, language: 'en' | 'te'): string {
  const labels: Record<string, { en: string; te: string }> = {
    issue_not_resolved: {
      en: 'Issue is not actually resolved',
      te: 'సమస్య నిజంగా పరిష్కరించబడలేదు',
    },
    incomplete_resolution: {
      en: 'Resolution is incomplete or partial',
      te: 'పరిష్కారం అసంపూర్ణం లేదా పాక్షికం',
    },
    needs_follow_up: {
      en: 'Issue needs further follow-up',
      te: 'సమస్యకు మరింత అనుసరణ అవసరం',
    },
    other_reason: {
      en: 'Other reason (specify in details)',
      te: 'ఇతర కారణం (వివరాలలో పేర్కొనండి)',
    },
  };

  return labels[reason]?.[language] || reason;
}
