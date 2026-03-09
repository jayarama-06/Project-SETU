import { useState } from 'react';
import { ArrowLeft, Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { StepProgressIndicator } from '../components/StepProgressIndicator';
import { DiscardDraftModal } from '../components/DiscardDraftModal';
import { saveDraft, deleteDraft } from '../utils/draftStorage';

type UrgencyLevel = 'can_wait' | 'needs_attention' | 'urgent_now' | null;

interface UrgencyOption {
  id: UrgencyLevel;
  label: string;
  body: string;
  icon: React.ReactNode;
  borderColor: string;
  iconColor: string;
  labelColor: string;
  bgTint: string;
  i18nCard: string;
  i18nBody: string;
}

interface ReportIssueStep3Props {
  onBack?: () => void;
  onContinue?: (urgency: UrgencyLevel) => void;
  initialData?: {
    category: string;
    title: string;
    description: string;
    photos?: any[];
    voiceNote?: Blob | null;
  };
}

export function ReportIssueStep3({ onBack, onContinue, initialData }: ReportIssueStep3Props) {
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyLevel>(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const hasInput = selectedUrgency !== null;

  const urgencyOptions: UrgencyOption[] = [
    {
      id: 'can_wait',
      label: 'Can Wait',
      body: 'Not immediately affecting students',
      icon: <Clock size={28} color="#6B7280" />,
      borderColor: '#6B7280',
      iconColor: '#6B7280',
      labelColor: '#0D1B2A',
      bgTint: '#F9FAFB',
      i18nCard: 'card_can_wait',
      i18nBody: 'lbl_can_wait_body',
    },
    {
      id: 'needs_attention',
      label: 'Needs Attention Soon',
      body: 'Affecting daily activity but manageable',
      icon: <AlertTriangle size={28} color="#F59E0B" />,
      borderColor: '#F59E0B',
      iconColor: '#F59E0B',
      labelColor: '#0D1B2A',
      bgTint: '#FFFBEB',
      i18nCard: 'card_soon',
      i18nBody: 'lbl_soon_body',
    },
    {
      id: 'urgent_now',
      label: 'Urgent Now',
      body: 'Immediate risk to health or safety',
      icon: <AlertCircle size={28} color="#EF4444" />,
      borderColor: '#EF4444',
      iconColor: '#EF4444',
      labelColor: '#EF4444',
      bgTint: '#FEF2F2',
      i18nCard: 'card_urgent',
      i18nBody: 'lbl_urgent_body',
    },
  ];

  const handleBackClick = () => {
    if (hasInput) {
      setShowDiscardModal(true);
    } else {
      onBack?.();
    }
  };

  const handleUrgencySelect = (urgency: UrgencyLevel) => {
    setSelectedUrgency(urgency);
  };

  const handleContinue = () => {
    if (selectedUrgency) {
      onContinue?.(selectedUrgency);
    }
  };

  const handleDiscard = async () => {
    await deleteDraft();
    setShowDiscardModal(false);
    setTimeout(() => {
      onBack?.();
    }, 200);
  };

  const handleSaveDraft = async () => {
    await saveDraft({
      step: 3,
      category: initialData?.category,
      title: initialData?.title,
      description: initialData?.description,
      urgency: selectedUrgency,
    });
    setShowDiscardModal(false);
    onBack?.();
  };

  const handleCancelDiscard = () => {
    setShowDiscardModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      {/* App Bar - Navy 56px */}
      <div
        className="flex items-center justify-between px-4 bg-[#0D1B2A] sticky top-0 z-10"
        style={{ height: '56px' }}
      >
        <button
          onClick={handleBackClick}
          className="min-w-[48px] min-h-[48px] flex items-center justify-center -ml-3"
          data-i18n="btn_back"
        >
          <ArrowLeft size={24} color="white" />
        </button>
        <h1
          className="text-white absolute left-1/2 transform -translate-x-1/2"
          style={{
            fontFamily: 'Noto Sans',
            fontWeight: 600,
            fontSize: '16px',
          }}
          data-i18n="scr_report_title"
        >
          Report an Issue
        </h1>
        <LanguageToggle size="compact" />
      </div>

      {/* Step Progress Indicator */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <StepProgressIndicator totalSteps={4} currentStep={3} completedSteps={[1, 2]} />
        <p
          className="text-center pb-3 px-4"
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '14px',
            color: '#6B7280',
          }}
          data-i18n="lbl_step3"
        >
          Step 3 of 4 — Urgency Level
        </p>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Section Label */}
        <h2
          className="mt-6 mb-2"
          style={{
            fontFamily: 'Noto Sans',
            fontWeight: 700,
            fontSize: '18px',
            color: '#0D1B2A',
          }}
          data-i18n="lbl_urgency_prompt"
        >
          How urgent is this?
        </h2>

        {/* Info Note */}
        <p
          className="mb-6 italic"
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '12px',
            color: '#6B7280',
            lineHeight: '1.5',
          }}
          data-i18n="lbl_urgency_note"
        >
          Our system also auto-scores urgency. Your input helps prioritise faster.
        </p>

        {/* Urgency Radio Cards */}
        <div className="flex flex-col gap-3">
          {urgencyOptions.map((option) => {
            const isSelected = selectedUrgency === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleUrgencySelect(option.id)}
                className="text-left transition-all cursor-pointer"
                style={{
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  borderLeftWidth: '4px',
                  borderLeftColor: isSelected ? option.borderColor : '#E5E7EB',
                  backgroundColor: isSelected ? option.bgTint : 'white',
                  padding: '16px',
                  boxShadow: isSelected
                    ? '0 2px 8px rgba(0, 0, 0, 0.12)'
                    : '0 1px 3px rgba(0, 0, 0, 0.08)',
                }}
                data-i18n={option.i18nCard}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 pt-1">{option.icon}</div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3
                      className="mb-1"
                      style={{
                        fontFamily: 'Noto Sans',
                        fontWeight: 700,
                        fontSize: '16px',
                        color: option.labelColor,
                      }}
                    >
                      {option.label}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '14px',
                        color: '#6B7280',
                        lineHeight: '1.4',
                      }}
                      data-i18n={option.i18nBody}
                    >
                      {option.body}
                    </p>
                  </div>

                  {/* Radio Indicator */}
                  <div className="flex-shrink-0 pt-1">
                    <div
                      className="flex items-center justify-center transition-all"
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: `2px solid ${isSelected ? option.borderColor : '#D1D5DB'}`,
                        backgroundColor: 'white',
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: option.borderColor,
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Continue Button - Pinned to Bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4"
        style={{ paddingTop: '16px', paddingBottom: '16px' }}
      >
        <button
          onClick={handleContinue}
          disabled={!selectedUrgency}
          className="w-full transition-opacity"
          style={{
            height: '56px',
            borderRadius: '8px',
            backgroundColor: '#0D1B2A',
            color: 'white',
            fontFamily: 'Noto Sans',
            fontWeight: 600,
            fontSize: '16px',
            border: 'none',
            opacity: selectedUrgency ? 1 : 0.5,
            cursor: selectedUrgency ? 'pointer' : 'not-allowed',
          }}
          data-i18n="btn_continue"
        >
          Continue
        </button>
      </div>

      {/* Discard Draft Modal */}
      <DiscardDraftModal
        isOpen={showDiscardModal}
        onDiscard={handleDiscard}
        onSaveDraft={handleSaveDraft}
        onCancel={handleCancelDiscard}
      />
    </div>
  );
}
