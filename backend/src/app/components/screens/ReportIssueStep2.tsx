import { useState } from 'react';
import { ArrowLeft, Camera, Image, X } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { StepProgressIndicator } from '../components/StepProgressIndicator';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { DiscardDraftModal } from '../components/DiscardDraftModal';
import { PhotoSourceBottomSheet } from '../components/PhotoSourceBottomSheet';
import { saveDraft, deleteDraft } from '../utils/draftStorage';

interface Photo {
  id: string;
  url: string;
  file?: File;
}

interface ReportIssueStep2Props {
  onBack?: () => void;
  onContinue?: (description: string, photos: Photo[], voiceNote?: Blob, voiceNoteDuration?: number) => void;
  initialData?: {
    category: string;
    title: string;
  };
}

export function ReportIssueStep2({ onBack, onContinue, initialData }: ReportIssueStep2Props) {
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [voiceNote, setVoiceNote] = useState<{ blob: Blob; duration: number } | null>(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showPhotoSourceSheet, setShowPhotoSourceSheet] = useState(false);

  const maxLength = 500;
  const hasInput = description.trim().length > 0 || photos.length > 0 || voiceNote !== null;

  const handleBackClick = () => {
    if (hasInput) {
      setShowDiscardModal(true);
    } else {
      onBack?.();
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setDescription(value);
    }
  };

  const handleTakePhoto = () => {
    // Mock camera - in production, would use navigator.mediaDevices.getUserMedia
    const mockPhoto: Photo = {
      id: `photo_${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=400&fit=crop',
    };
    setPhotos([...photos, mockPhoto]);
  };

  const handleChooseFromGallery = () => {
    // Mock file picker - in production, would use input[type="file"]
    const mockPhoto: Photo = {
      id: `photo_${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=400&fit=crop',
    };
    setPhotos([...photos, mockPhoto]);
  };

  const handleRemovePhoto = (photoId: string) => {
    setPhotos(photos.filter((p) => p.id !== photoId));
  };

  const handleVoiceRecordingComplete = (audioBlob: Blob, duration: number) => {
    setVoiceNote({ blob: audioBlob, duration });
  };

  const handleContinue = () => {
    if (description.trim().length > 0) {
      onContinue?.(description, photos, voiceNote?.blob, voiceNote?.duration);
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
      step: 2,
      category: initialData?.category,
      title: initialData?.title,
      description,
      // Note: Photos and voice notes would need special handling for IndexedDB
      // For now, we're just saving the text description
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
        <StepProgressIndicator totalSteps={4} currentStep={2} completedSteps={[1]} />
        <p
          className="text-center pb-3 px-4"
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '14px',
            color: '#6B7280',
          }}
          data-i18n="lbl_step2"
        >
          Step 2 of 4 — Description & Media
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
          data-i18n="lbl_desc_prompt"
        >
          Describe the problem
        </h2>

        {/* Multi-line Textarea */}
        <div className="mb-2">
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="What happened? When did it start? How many students are affected?"
            className="w-full px-4 py-3 outline-none transition-colors resize-none"
            style={{
              minHeight: '120px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              fontFamily: 'Noto Sans',
              fontSize: '15px',
              color: '#0D1B2A',
              lineHeight: '1.5',
            }}
            data-i18n="placeholder_description"
          />
        </div>

        {/* Character Count */}
        <div className="flex justify-end mb-6">
          <span
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '12px',
              color: '#6B7280',
            }}
          >
            {description.length} / {maxLength}
          </span>
        </div>

        {/* Attach Photo Row */}
        <div className="mb-4">
          <h3
            className="mb-3"
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              fontWeight: 600,
              color: '#0D1B2A',
            }}
          >
            Add Photos (Optional)
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPhotoSourceSheet(true)}
              className="flex-1 flex items-center justify-center gap-2 transition-colors"
              style={{
                height: '44px',
                borderRadius: '8px',
                border: '2px solid #0D1B2A',
                backgroundColor: 'white',
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                fontWeight: 500,
                color: '#0D1B2A',
              }}
              data-i18n="btn_add_photo"
            >
              <Camera size={20} color="#0D1B2A" />
              Add Photo
            </button>
          </div>
        </div>

        {/* Photo Thumbnails */}
        {photos.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {photos.map((photo) => (
              <div key={photo.id} className="relative">
                <img
                  src={photo.url}
                  alt="Attached"
                  className="object-cover"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                  }}
                />
                <button
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="absolute flex items-center justify-center"
                  style={{
                    top: '-6px',
                    right: '-6px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#EF4444',
                    border: '2px solid white',
                  }}
                  data-i18n="btn_remove_photo"
                >
                  <X size={14} color="white" strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Voice Note */}
        <div className="mb-6">
          <h3
            className="mb-3"
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              fontWeight: 600,
              color: '#0D1B2A',
            }}
          >
            Add Voice Note (Optional)
          </h3>
          <VoiceRecorder onRecordingComplete={handleVoiceRecordingComplete} maxDuration={60} />
        </div>
      </main>

      {/* Continue Button - Pinned to Bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4"
        style={{ paddingTop: '16px', paddingBottom: '16px' }}
      >
        <button
          onClick={handleContinue}
          disabled={description.trim().length === 0}
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
            opacity: description.trim().length > 0 ? 1 : 0.5,
            cursor: description.trim().length > 0 ? 'pointer' : 'not-allowed',
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

      {/* Photo Source Bottom Sheet */}
      <PhotoSourceBottomSheet
        isOpen={showPhotoSourceSheet}
        hasPhoto={photos.length > 0}
        onTakePhoto={handleTakePhoto}
        onChooseFromGallery={handleChooseFromGallery}
        onRemovePhoto={() => {
          // Remove the last photo added
          if (photos.length > 0) {
            setPhotos(photos.slice(0, -1));
          }
        }}
        onCancel={() => setShowPhotoSourceSheet(false)}
      />
    </div>
  );
}
