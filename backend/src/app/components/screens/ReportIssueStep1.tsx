import { useState } from 'react';
import { ArrowLeft, Droplet, Zap, Building2, Shield, CreditCard, MoreHorizontal } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { StepProgressIndicator } from '../components/StepProgressIndicator';
import { DiscardDraftModal } from '../components/DiscardDraftModal';
import { saveDraft, deleteDraft } from '../utils/draftStorage';
import { motion } from 'motion/react';

type Category = 'water' | 'electricity' | 'building' | 'safety' | 'finance' | 'other';

interface CategoryOption {
  id: Category;
  icon: React.ReactNode;
  label: string;
  i18nKey: string;
}

const categories: CategoryOption[] = [
  {
    id: 'water',
    icon: <Droplet size={28} />,
    label: 'Water',
    i18nKey: 'cat_water',
  },
  {
    id: 'electricity',
    icon: <Zap size={28} />,
    label: 'Electricity',
    i18nKey: 'cat_electricity',
  },
  {
    id: 'building',
    icon: <Building2 size={28} />,
    label: 'Building',
    i18nKey: 'cat_building',
  },
  {
    id: 'safety',
    icon: <Shield size={28} />,
    label: 'Safety',
    i18nKey: 'cat_safety',
  },
  {
    id: 'finance',
    icon: <CreditCard size={28} />,
    label: 'Finance',
    i18nKey: 'cat_finance',
  },
  {
    id: 'other',
    icon: <MoreHorizontal size={28} />,
    label: 'Other',
    i18nKey: 'cat_other',
  },
];

interface ReportIssueStep1Props {
  onBack?: () => void;
  onContinue?: (category: Category, title: string) => void;
}

export function ReportIssueStep1({ onBack, onContinue }: ReportIssueStep1Props) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [issueTitle, setIssueTitle] = useState('');
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const maxLength = 80;
  const isValid = selectedCategory !== null && issueTitle.trim().length > 0;
  const hasInput = selectedCategory !== null || issueTitle.trim().length > 0;

  const handleBackClick = () => {
    if (hasInput) {
      setShowDiscardModal(true);
    } else {
      onBack?.();
    }
  };

  const handleContinue = () => {
    if (isValid && selectedCategory) {
      onContinue?.(selectedCategory, issueTitle);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setIssueTitle(value);
    }
  };

  const handleDiscard = async () => {
    await deleteDraft();
    setShowDiscardModal(false);
    // Navigate back with fade animation
    setTimeout(() => {
      onBack?.();
    }, 200);
  };

  const handleSaveDraft = async () => {
    await saveDraft({
      step: 1,
      category: selectedCategory || undefined,
      title: issueTitle,
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
        <StepProgressIndicator totalSteps={4} currentStep={1} completedSteps={[]} />
        <p
          className="text-center pb-3 px-4"
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '14px',
            color: '#6B7280',
          }}
          data-i18n="lbl_step1"
        >
          Step 1 of 4 — Category & Title
        </p>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Section Label */}
        <h2
          className="mt-6 mb-4"
          style={{
            fontFamily: 'Noto Sans',
            fontWeight: 700,
            fontSize: '18px',
            color: '#0D1B2A',
          }}
          data-i18n="lbl_category_prompt"
        >
          What is the issue about?
        </h2>

        {/* Category Grid - 2x3 */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="flex flex-col items-center justify-center gap-3 transition-all"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: isSelected ? '2px solid #0D1B2A' : '1px solid #E5E7EB',
                  padding: '24px',
                  minHeight: '120px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                }}
                data-i18n={category.i18nKey}
              >
                <div style={{ color: isSelected ? '#F0A500' : '#6B7280' }}>
                  {category.icon}
                </div>
                <span
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: isSelected ? '#0D1B2A' : '#6B7280',
                  }}
                >
                  {category.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Issue Title Input */}
        <div className="mb-2">
          <label
            htmlFor="issueTitle"
            className="block mb-2"
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              fontWeight: 600,
              color: '#0D1B2A',
            }}
            data-i18n="lbl_issue_title_field"
          >
            Issue Title
          </label>
          <input
            id="issueTitle"
            type="text"
            value={issueTitle}
            onChange={handleTitleChange}
            placeholder="Briefly describe the issue"
            className="w-full px-4 outline-none transition-colors"
            style={{
              height: '48px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              fontFamily: 'Noto Sans',
              fontSize: '15px',
              color: '#0D1B2A',
            }}
            data-i18n="placeholder_issue_title"
          />
        </div>

        {/* Character Count */}
        <div className="flex justify-end">
          <span
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '12px',
              color: '#6B7280',
            }}
          >
            {issueTitle.length} / {maxLength}
          </span>
        </div>
      </main>

      {/* Continue Button - Pinned to Bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4"
        style={{ paddingTop: '16px', paddingBottom: '16px' }}
      >
        <button
          onClick={handleContinue}
          disabled={!isValid}
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
            opacity: isValid ? 1 : 0.5,
            cursor: isValid ? 'pointer' : 'not-allowed',
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
