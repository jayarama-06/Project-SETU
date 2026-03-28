import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageToggle } from './LanguageToggle';

interface EscalationLevelBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
  onContactDEO?: () => void;
  onViewFullHistory?: () => void;
}

const LEVELS = [
  {
    id: 'L0',
    label: 'Submitted',
    color: '#9CA3AF',
    description: 'Issue is in queue. No action yet required.',
    i18n: { label: 'level_L0', desc: 'desc_L0' },
    expandedDesc:
      'Your issue has been successfully submitted and is now in the system. School administrators and officials can see your report. You will be notified when someone acknowledges it.',
    whatThisMeans:
      'No immediate action is needed from you. The system is waiting for an official to review and acknowledge your report.',
    pulse: false,
    showDEOButton: false,
  },
  {
    id: 'L1',
    label: 'Acknowledged',
    color: '#3B82F6',
    description: 'Official has seen the report. Awaiting action.',
    i18n: { label: 'level_L1', desc: 'desc_L1' },
    expandedDesc:
      'An official has reviewed your report and acknowledged it. They are now responsible for taking action to resolve the issue within 72 hours.',
    whatThisMeans:
      'Your issue is being handled. The assigned official is expected to take action soon. You will receive updates as progress is made.',
    pulse: false,
    showDEOButton: false,
  },
  {
    id: 'L2',
    label: 'Awaiting Action',
    color: '#F59E0B',
    description: 'Official has not acted for 72h. Contact DEO directly.',
    i18n: { label: 'level_L2', desc: 'desc_L2' },
    expandedDesc:
      '72 hours have passed since acknowledgment without resolution. The issue has been automatically escalated to the District Education Officer (DEO) for urgent attention.',
    whatThisMeans:
      'You may want to contact the DEO directly to expedite resolution. Use the "Contact Your DEO" button below to get their contact information.',
    pulse: true,
    showDEOButton: true,
  },
  {
    id: 'L3',
    label: 'State Attention',
    color: '#F97316',
    description: 'State-level notified. Consider contacting Regional JD.',
    i18n: { label: 'level_L3', desc: 'desc_L3' },
    expandedDesc:
      'The issue has escalated to state-level attention. Regional Joint Directors have been notified and are now monitoring the situation.',
    whatThisMeans:
      'This is a high-priority escalation. State officials are aware and tracking resolution. You may consider reaching out to your Regional Joint Director for updates.',
    pulse: true,
    showDEOButton: true,
  },
  {
    id: 'L4',
    label: 'Auto-Escalated',
    color: '#EF4444',
    description: 'All channels attempted. All state admins tracking.',
    i18n: { label: 'level_L4', desc: 'desc_L4' },
    expandedDesc:
      'This issue has reached the highest escalation level. All available channels have been attempted, and all state administrators are actively tracking this case.',
    whatThisMeans:
      'Your issue is receiving maximum attention from all levels of administration. Senior state officials are directly involved in ensuring resolution.',
    pulse: true,
    showDEOButton: true,
  },
];

export function EscalationLevelBottomSheet({
  isOpen,
  onClose,
  currentLevel,
  onContactDEO,
  onViewFullHistory,
}: EscalationLevelBottomSheetProps) {
  const currentLevelIndex = LEVELS.findIndex((l) => l.id === currentLevel);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleDragEnd = (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
    if (info.offset.y > 80 || info.velocity.y > 400) {
      onClose();
    }
  };

  return (
    <>
      <style>{`
        @keyframes setu-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.65; }
        }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="escalation-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 9998,
              }}
            />

            {/* Bottom Sheet */}
            <motion.div
              key="escalation-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320, mass: 0.8 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={{ top: 0, bottom: 0.3 }}
              onDragEnd={handleDragEnd}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '80%',
                maxWidth: '480px',
                margin: '0 auto',
                backgroundColor: 'white',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                touchAction: 'none',
              }}
            >
              {/* Handle Bar */}
              <div
                style={{
                  padding: '12px 0 8px',
                  display: 'flex',
                  justifyContent: 'center',
                  flexShrink: 0,
                  cursor: 'grab',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '4px',
                    backgroundColor: '#9CA3AF',
                    borderRadius: '2px',
                  }}
                />
              </div>

              {/* App Bar */}
              <div
                style={{
                  padding: '8px 24px 16px',
                  borderBottom: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexShrink: 0,
                }}
              >
                <h2
                  style={{
                    fontFamily: 'Noto Sans, sans-serif',
                    fontWeight: 700,
                    fontSize: '18px',
                    color: '#0D1B2A',
                    margin: 0,
                  }}
                  data-i18n="lbl_escalation_title"
                >
                  Escalation Levels
                </h2>
                <LanguageToggle />
              </div>

              {/* Scrollable Content */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '24px',
                  touchAction: 'pan-y',
                }}
              >
                {/* Step Indicator */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '32px',
                    position: 'relative',
                  }}
                >
                  {/* Connecting Line — sits at circle center row */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '18px',
                      right: '18px',
                      height: '2px',
                      backgroundColor: '#E5E7EB',
                      zIndex: 0,
                    }}
                  />

                  {LEVELS.map((level, index) => {
                    const isActive = index <= currentLevelIndex;
                    const isCurrent = index === currentLevelIndex;
                    const size = isCurrent ? 28 : 20;

                    return (
                      <div
                        key={level.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          flex: 1,
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        {/* Circle */}
                        <div
                          style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            borderRadius: '50%',
                            backgroundColor: isActive ? level.color : '#E5E7EB',
                            border: isCurrent ? `3px solid ${level.color}` : 'none',
                            boxShadow: isCurrent
                              ? `0 0 0 4px ${level.color}33`
                              : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation:
                              level.pulse && isCurrent
                                ? 'setu-pulse 2s ease-in-out infinite'
                                : 'none',
                          }}
                        >
                          {isActive && (
                            <div
                              style={{
                                width: isCurrent ? '10px' : '7px',
                                height: isCurrent ? '10px' : '7px',
                                borderRadius: '50%',
                                backgroundColor: 'white',
                              }}
                            />
                          )}
                        </div>

                        {/* Label */}
                        <span
                          style={{
                            fontFamily: 'Noto Sans, sans-serif',
                            fontSize: isCurrent ? '11px' : '10px',
                            fontWeight: isCurrent ? 700 : 400,
                            color: isActive ? level.color : '#9CA3AF',
                            marginTop: '6px',
                            textAlign: 'center',
                          }}
                        >
                          {level.id}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Level Detail Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {LEVELS.map((level, index) => {
                    const isCurrent = index === currentLevelIndex;

                    return (
                      <div
                        key={level.id}
                        style={{
                          padding: isCurrent ? '18px' : '14px 16px',
                          borderRadius: '8px',
                          border: `1px solid ${isCurrent ? level.color : '#E5E7EB'}`,
                          backgroundColor: isCurrent ? `${level.color}0d` : 'white',
                          boxShadow: isCurrent
                            ? '0 2px 8px rgba(0,0,0,0.08)'
                            : '0 1px 3px rgba(0,0,0,0.06)',
                        }}
                      >
                        {/* Header row: badge + label */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: isCurrent ? '10px' : '5px',
                          }}
                        >
                          {/* Badge chip */}
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '3px 10px',
                              borderRadius: '10px',
                              backgroundColor: level.color,
                              fontFamily: 'Noto Sans, sans-serif',
                              fontSize: '11px',
                              fontWeight: 700,
                              color: 'white',
                              letterSpacing: '0.02em',
                              animation:
                                level.pulse && isCurrent
                                  ? 'setu-pulse 2s ease-in-out infinite'
                                  : 'none',
                            }}
                          >
                            {level.id}
                          </span>

                          <span
                            style={{
                              fontFamily: 'Noto Sans, sans-serif',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#0D1B2A',
                            }}
                            data-i18n={level.i18n.label}
                          >
                            {level.label}
                          </span>
                        </div>

                        {/* One-line description */}
                        <p
                          style={{
                            fontFamily: 'Noto Sans, sans-serif',
                            fontSize: '13px',
                            color: '#6B7280',
                            margin: 0,
                            lineHeight: '1.5',
                          }}
                          data-i18n={level.i18n.desc}
                        >
                          {level.description}
                        </p>

                        {/* Expanded section — current level only */}
                        {isCurrent && (
                          <div style={{ marginTop: '14px' }}>
                            {/* Full explanation card */}
                            <div
                              style={{
                                padding: '14px',
                                borderRadius: '8px',
                                backgroundColor: 'white',
                                border: '1px solid #E5E7EB',
                                marginBottom: '10px',
                              }}
                            >
                              <p
                                style={{
                                  fontFamily: 'Noto Sans, sans-serif',
                                  fontSize: '13px',
                                  color: '#0D1B2A',
                                  margin: 0,
                                  lineHeight: '1.65',
                                }}
                              >
                                {level.expandedDesc}
                              </p>
                            </div>

                            {/* What this means card */}
                            <div
                              style={{
                                padding: '14px',
                                borderRadius: '8px',
                                backgroundColor: 'white',
                                border: '1px solid #E5E7EB',
                              }}
                            >
                              <p
                                style={{
                                  fontFamily: 'Noto Sans, sans-serif',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  color: '#0D1B2A',
                                  margin: '0 0 6px 0',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.04em',
                                }}
                              >
                                What this means for you
                              </p>
                              <p
                                style={{
                                  fontFamily: 'Noto Sans, sans-serif',
                                  fontSize: '13px',
                                  color: '#6B7280',
                                  margin: 0,
                                  lineHeight: '1.65',
                                }}
                              >
                                {level.whatThisMeans}
                              </p>
                            </div>

                            {/* Contact DEO button (L2+) */}
                            {level.showDEOButton && (
                              <button
                                onClick={onContactDEO}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  height: '48px',
                                  marginTop: '14px',
                                  borderRadius: '8px',
                                  border: '2px solid #0D1B2A',
                                  backgroundColor: 'white',
                                  color: '#0D1B2A',
                                  fontFamily: 'Noto Sans, sans-serif',
                                  fontSize: '14px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                                data-i18n="btn_contact_deo"
                              >
                                Contact Your DEO
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* View Full History link */}
                <button
                  onClick={onViewFullHistory}
                  style={{
                    display: 'block',
                    marginTop: '24px',
                    marginBottom: '8px',
                    background: 'none',
                    border: 'none',
                    color: '#F0A500',
                    fontFamily: 'Noto Sans, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                    minHeight: '44px',
                  }}
                  data-i18n="lnk_full_history"
                >
                  View Full Issue History
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
