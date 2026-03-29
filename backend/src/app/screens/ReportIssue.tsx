import { useState } from 'react';
import { ReportIssueStep1 } from './ReportIssueStep1';
import { ReportIssueStep2 } from './ReportIssueStep2';
import { ReportIssueStep3 } from './ReportIssueStep3';
import { ReportIssueStep4 } from './ReportIssueStep4';
import { useNavigate } from 'react-router';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

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

  const { user } = useCurrentUser();

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
    try {
      if (!user) {
        toast.error('User not authenticated');
        return false;
      }

      if (!user.school_id) {
        toast.error('User school not found');
        return false;
      }

      // Upload photos to Supabase Storage if any
      let photoUrls: string[] = [];
      if (reportData.photos && reportData.photos.length > 0) {
        for (const photo of reportData.photos) {
          if (photo.file) {
            const fileExt = photo.file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${user.school_id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from('issue-attachments')
              .upload(filePath, photo.file);

            if (uploadError) {
              console.error('Photo upload error:', uploadError);
              toast.error('Failed to upload photo');
              return false;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('issue-attachments')
              .getPublicUrl(filePath);

            photoUrls.push(publicUrl);
          }
        }
      }

      // Calculate AI urgency score based on self-urgency
      let ai_urgency_score = 50; // Default medium
      if (reportData.urgency === 'urgent_now') {
        ai_urgency_score = 95; // High
      } else if (reportData.urgency === 'needs_attention') {
        ai_urgency_score = 70; // Medium-high
      } else if (reportData.urgency === 'can_wait') {
        ai_urgency_score = 40; // Low-medium
      }

      // Create issue in database
      const { data: newIssue, error: insertError } = await supabase
        .from('issues')
        .insert({
          school_id: user.school_id,
          reported_by: user.id,
          category: reportData.category,
          title: reportData.title,
          description: reportData.description,
          photo_urls: photoUrls.length > 0 ? photoUrls : [],
          ai_urgency_score,
          self_urgency: reportData.urgency,
          // escalation_level defaults to 0 in DB
          // status defaults to 'submitted' in DB
          // is_principal_endorsed defaults to false in DB
        })
        .select()
        .single();

      if (insertError) {
        console.error('Issue creation error:', insertError);
        toast.error('Failed to create issue');
        return false;
      }

      console.log('Issue created successfully:', newIssue);
      toast.success('Issue reported successfully!');
      return true;
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An error occurred');
      return false;
    }
  };

  const handleBackToStep1 = () => setCurrentStep(1);
  const handleBackToStep2 = () => setCurrentStep(2);
  const handleBackToStep3 = () => setCurrentStep(3);

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