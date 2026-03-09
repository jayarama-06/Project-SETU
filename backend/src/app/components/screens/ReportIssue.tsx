import { useState } from 'react';
import { ReportIssueStep1 } from './ReportIssueStep1';
import { ReportIssueStep2 } from './ReportIssueStep2';
import { ReportIssueStep3 } from './ReportIssueStep3';
import { ReportIssueStep4 } from './ReportIssueStep4';
import { useNavigate } from 'react-router';

interface ReportData {
  category?: string;
  title?: string;
  description?: string;
  photos?: any[];
  voiceNote?: Blob | null;
  voiceNoteDuration?: number;
  urgency?: string;
}

export function ReportIssue() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [reportData, setReportData] = useState<ReportData>({});
  const navigate = useNavigate();

  const handleComplete = () => navigate('/staff/my-issues', { replace: true });

  const handleStep1Continue = (data: { category: string; title: string }) => {
    setReportData((prev) => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleStep2Continue = (data: {
    description: string;
    photos: any[];
    voiceNote?: Blob | null;
    voiceNoteDuration?: number;
  }) => {
    setReportData((prev) => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleStep3Continue = (data: { urgency: string }) => {
    setReportData((prev) => ({ ...prev, ...data }));
    setCurrentStep(4);
  };

  const handleStep4Submit = async (): Promise<boolean> => {
    console.log('Submitting report:', reportData);
    handleComplete();
    return true;
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleBackToStep2 = () => {
    setCurrentStep(2);
  };

  const handleBackToStep3 = () => {
    setCurrentStep(3);
  };

  if (currentStep === 1) {
    return (
      <ReportIssueStep1
        onBack={handleComplete}
        onContinue={handleStep1Continue}
      />
    );
  }

  if (currentStep === 2) {
    return (
      <ReportIssueStep2
        onBack={handleBackToStep1}
        onContinue={handleStep2Continue}
        initialData={{
          description: reportData.description || '',
          photos: reportData.photos || [],
          voiceNote: reportData.voiceNote || null,
          voiceNoteDuration: reportData.voiceNoteDuration || 0,
        }}
      />
    );
  }

  if (currentStep === 3) {
    return (
      <ReportIssueStep3
        onBack={handleBackToStep2}
        onContinue={handleStep3Continue}
        initialData={{
          urgency: reportData.urgency || null,
        }}
      />
    );
  }

  return (
    <ReportIssueStep4
      onBack={handleBackToStep3}
      onSubmit={handleStep4Submit}
      onSuccess={handleComplete}
      initialData={{
        category: reportData.category || '',
        title: reportData.title || '',
        description: reportData.description || '',
        photos: reportData.photos || [],
        voiceNote: reportData.voiceNote || null,
        voiceNoteDuration: reportData.voiceNoteDuration || 0,
        urgency: reportData.urgency || '',
      }}
    />
  );
}
