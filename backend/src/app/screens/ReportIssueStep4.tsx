import { useState } from 'react';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { StepProgressIndicator } from '../components/StepProgressIndicator';
import { SubmissionErrorModal } from '../components/SubmissionErrorModal';
import { SubmissionSuccessAnimation } from '../components/SubmissionSuccessAnimation';
import { OfflineBanner } from '../components/OfflineBanner';

interface Photo {
  id: string;
  url: string;
}

interface ReportIssueStep4Props {
  onBack?: () => void;
  onSubmit?: () => Promise<boolean>; // Returns true on success, false on failure
  onEdit?: (step: number) => void;
  onSuccess?: () => void; // Navigate to My Issues
  onViewDrafts?: () => void;
  initialData: {
    category: string;
    title: string;
    description: string;
    photos?: Photo[];
    voiceNote?: Blob | null;
    voiceNoteDuration?: number;
    urgency: string;
  };
}

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

// Urgency chip configuration
const getUrgencyConfig = (urgency: string) => {
  const config = {
    can_wait: {
      label: 'Can Wait',
      bgColor: '#F3F4F6',
      textColor: '#6B7280',
      i18n: 'chip_can_wait',
    },
    needs_attention: {
      label: 'Needs Attention Soon',
      bgColor: '#FEF3C7',
      textColor: '#D97706',
      i18n: 'chip_needs_attention',
    },
    urgent_now: {
      label: 'Urgent Now',
      bgColor: '#FEE2E2',
      textColor: '#DC2626',
      i18n: 'chip_urgent_now',
    },
  };
  return config[urgency as keyof typeof config] || config.can_wait;
};

export function ReportIssueStep4({
  onBack,
  onSubmit,
  onEdit,
  onSuccess,
  onViewDrafts,
  initialData,
}: ReportIssueStep4Props) {
  const [isOffline] = useState(false); // Mock offline state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const success = await onSubmit?.();
      setIsSubmitting(false);
      if (success) {
        setSubmissionSuccess(true);
      } else {
        setSubmissionError(true);
      }
    } catch (error) {
      setIsSubmitting(false);
      setSubmissionError(true);
    }
  };

  const handleTryAgain = async () => {
    setSubmissionError(false);
    await handleSubmit();
  };

  const handleSuccessComplete = () => {
    setSubmissionSuccess(false);
    onSuccess?.();
  };
  
  const urgencyConfig = getUrgencyConfig(initialData.urgency);
  const categoryIcon = getCategoryIcon(initialData.category);
  
  // Truncate description to 100 characters
  const truncatedDescription =
    initialData.description.length > 100
      ? `${initialData.description.substring(0, 100)}...`
      : initialData.description;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      {/* Offline Banner */}
      <OfflineBanner showDraftMessage />

      {/* App Bar - Navy 56px */}
      <div
        className="flex items-center justify-between px-4 bg-[#0D1B2A] sticky top-0 z-10"
        style={{ height: '56px' }}
      >
        <button
          onClick={onBack}
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
        <StepProgressIndicator totalSteps={4} currentStep={4} completedSteps={[1, 2, 3, 4]} />
        <p
          className="text-center pb-3 px-4"
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '14px',
            color: '#6B7280',
          }}
          data-i18n="lbl_step4"
        >
          Step 4 of 4 — Review & Submit
        </p>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-32">
        {/* Section Label */}
        <h2
          className="mt-6 mb-4"
          style={{
            fontFamily: 'Noto Sans',
            fontWeight: 700,
            fontSize: '18px',
            color: '#0D1B2A',
          }}
          data-i18n="lbl_review_title"
        >
          Review your report
        </h2>

        {/* Summary Card */}
        <div
          className="bg-white"
          style={{
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Category Row */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '24px' }}>{categoryIcon}</span>
              <div>
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '12px',
                    color: '#6B7280',
                    marginBottom: '2px',
                  }}
                  data-i18n="lbl_category"
                >
                  Category
                </p>
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#0D1B2A',
                    textTransform: 'capitalize',
                  }}
                >
                  {initialData.category}
                </p>
              </div>
            </div>
            <button
              onClick={() => onEdit?.(1)}
              className="flex items-center gap-1"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '12px',
                fontWeight: 600,
                color: '#F0A500',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              data-i18n="lnk_edit"
            >
              Edit
              <Edit2 size={12} color="#F0A500" />
            </button>
          </div>

          {/* Title Row */}
          <div className="flex items-start justify-between py-4 border-b border-[#E5E7EB]">
            <div className="flex-1 pr-4">
              <p
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '12px',
                  color: '#6B7280',
                  marginBottom: '4px',
                }}
                data-i18n="lbl_title"
              >
                Title
              </p>
              <p
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#0D1B2A',
                  lineHeight: '1.4',
                }}
              >
                {initialData.title}
              </p>
            </div>
            <button
              onClick={() => onEdit?.(2)}
              className="flex items-center gap-1"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '12px',
                fontWeight: 600,
                color: '#F0A500',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              data-i18n="lnk_edit"
            >
              Edit
              <Edit2 size={12} color="#F0A500" />
            </button>
          </div>

          {/* Description Row */}
          <div className="flex items-start justify-between py-4 border-b border-[#E5E7EB]">
            <div className="flex-1 pr-4">
              <p
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '12px',
                  color: '#6B7280',
                  marginBottom: '4px',
                }}
                data-i18n="lbl_description"
              >
                Description
              </p>
              <p
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  color: '#0D1B2A',
                  lineHeight: '1.5',
                }}
              >
                {truncatedDescription}
              </p>
            </div>
            <button
              onClick={() => onEdit?.(3)}
              className="flex items-center gap-1"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '12px',
                fontWeight: 600,
                color: '#F0A500',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              data-i18n="lnk_edit"
            >
              Edit
              <Edit2 size={12} color="#F0A500" />
            </button>
          </div>

          {/* Photo Row */}
          <div className="flex items-center justify-between py-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3 flex-1">
              <div>
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '12px',
                    color: '#6B7280',
                    marginBottom: '4px',
                  }}
                  data-i18n="lbl_photo"
                >
                  Photo
                </p>
                {initialData.photos && initialData.photos.length > 0 ? (
                  <div className="flex gap-2">
                    {initialData.photos.map((photo) => (
                      <img
                        key={photo.id}
                        src={photo.url}
                        alt="Attached"
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '4px',
                          objectFit: 'cover',
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '14px',
                      color: '#9CA3AF',
                      fontStyle: 'italic',
                    }}
                  >
                    No photo attached
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Voice Note Row */}
          <div className="flex items-center justify-between py-4 border-b border-[#E5E7EB]">
            <div>
              <p
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '12px',
                  color: '#6B7280',
                  marginBottom: '4px',
                }}
                data-i18n="lbl_voice_note"
              >
                Voice Note
              </p>
              {initialData.voiceNote ? (
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#0D1B2A',
                  }}
                >
                  {initialData.voiceNoteDuration} seconds
                </p>
              ) : (
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    color: '#9CA3AF',
                    fontStyle: 'italic',
                  }}
                >
                  No voice note
                </p>
              )}
            </div>
          </div>

          {/* Urgency Self-Rating Row */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <p
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '12px',
                  color: '#6B7280',
                  marginBottom: '6px',
                }}
                data-i18n="lbl_urgency_rating"
              >
                Urgency Self-Rating
              </p>
              <span
                className="inline-block px-3 py-1"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: urgencyConfig.textColor,
                  backgroundColor: urgencyConfig.bgColor,
                  borderRadius: '16px',
                }}
                data-i18n={urgencyConfig.i18n}
              >
                {urgencyConfig.label}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Submit Button - Pinned to Bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4"
        style={{ paddingTop: '12px', paddingBottom: '16px' }}
      >
        {/* Note Above Button */}
        <p
          className="text-center mb-3"
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '11px',
            color: '#6B7280',
            lineHeight: '1.4',
          }}
          data-i18n="lbl_submit_note"
        >
          Submitting is permanent. You can track status from My Issues.
        </p>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full transition-opacity"
          style={{
            height: '56px',
            borderRadius: '8px',
            backgroundColor: '#F0A500',
            color: '#0D1B2A',
            fontFamily: 'Noto Sans',
            fontWeight: 700,
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
          }}
          data-i18n="btn_submit_issue"
        >
          Submit Issue
        </button>
      </div>

      {/* Submission Error Modal */}
      <SubmissionErrorModal
        isOpen={submissionError}
        onTryAgain={handleTryAgain}
        onViewDrafts={onViewDrafts}
      />

      {/* Submission Success Animation */}
      {submissionSuccess && (
        <SubmissionSuccessAnimation onComplete={handleSuccessComplete} />
      )}
    </div>
  );
}