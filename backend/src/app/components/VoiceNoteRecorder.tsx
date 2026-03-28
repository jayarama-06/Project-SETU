/**
 * SETU – Voice Note Recorder Component
 * Hold-to-record voice note with waveform animation
 * Max 60 seconds recording
 * 
 * Design Spec: A-06 Report Issue Step 2
 */

import { useState, useRef, useEffect, CSSProperties } from 'react';
import { useLanguage } from '../utils/languageContext';
import { t } from '../utils/translations';

interface VoiceNoteRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void;
  existingRecording?: {
    blob: Blob;
    duration: number;
  };
  onRemove?: () => void;
}

/**
 * VoiceNoteRecorder – Record voice notes with visual feedback
 * 
 * @example
 * <VoiceNoteRecorder
 *   onRecordingComplete={(blob, duration) => console.log('Recorded', duration)}
 *   onRemove={() => console.log('Removed')}
 * />
 */
export function VoiceNoteRecorder({
  onRecordingComplete,
  existingRecording,
  onRemove,
}: VoiceNoteRecorderProps) {
  const { language } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const MAX_DURATION = 60; // 60 seconds

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob, duration);
        
        // Create URL for playback
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }
        audioUrlRef.current = URL.createObjectURL(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          if (newDuration >= MAX_DURATION) {
            stopRecording();
            return MAX_DURATION;
          }
          return newDuration;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const togglePlayback = () => {
    if (!audioUrlRef.current && !existingRecording) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrlRef.current || URL.createObjectURL(existingRecording!.blob));
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleRemove = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setDuration(0);
    setIsPlaying(false);
    onRemove?.();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const hasRecording = existingRecording || audioUrlRef.current;

  // Container Style
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    fontFamily: 'Noto Sans',
  };

  // Recording Button Style
  const recordButtonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: isRecording ? '2px solid #EF4444' : '2px solid #0D1B2A',
    backgroundColor: isRecording ? '#FEE2E2' : '#FFFFFF',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const labelStyle: CSSProperties = {
    fontSize: '12px',
    color: '#6B7280',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      {/* Label */}
      <p style={labelStyle} data-i18n="lbl_voice_note">
        {t('lbl_voice_note', language) || 'Voice Note'}
      </p>

      {!hasRecording ? (
        // Recording State
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Record Button */}
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            style={recordButtonStyle}
            data-i18n="btn_voice_note"
          >
            <span 
              className="material-symbols-rounded" 
              style={{ 
                fontSize: '24px',
                color: isRecording ? '#EF4444' : '#0D1B2A',
              }}
            >
              mic
            </span>
          </button>

          {/* Recording Status */}
          {isRecording ? (
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Waveform Animation */}
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '3px',
                      height: '16px',
                      backgroundColor: '#EF4444',
                      borderRadius: '2px',
                      animation: `waveform 0.8s ease-in-out ${i * 0.1}s infinite`,
                    }}
                  />
                ))}
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#EF4444' }}>
                  {formatDuration(duration)}
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
                Max {MAX_DURATION}s
              </p>
            </div>
          ) : (
            <p style={{ fontSize: '12px', color: '#6B7280' }} data-i18n="btn_voice_note">
              {t('btn_voice_note', language)}
            </p>
          )}
        </div>
      ) : (
        // Playback State
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            padding: '12px',
            backgroundColor: '#F3F4F6',
            borderRadius: '8px',
          }}
        >
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayback}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#0D1B2A',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span 
              className="material-symbols-rounded" 
              style={{ fontSize: '20px', color: '#FFFFFF' }}
            >
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Duration */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#0D1B2A', margin: 0 }}>
              Voice Note
            </p>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
              {formatDuration(existingRecording?.duration || duration)}
            </p>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            data-i18n="btn_remove"
          >
            <span 
              className="material-symbols-rounded" 
              style={{ fontSize: '20px', color: '#EF4444' }}
            >
              delete
            </span>
          </button>
        </div>
      )}

      {/* Waveform Animation CSS */}
      <style>
        {`
          @keyframes waveform {
            0%, 100% {
              transform: scaleY(1);
            }
            50% {
              transform: scaleY(2);
            }
          }
        `}
      </style>
    </div>
  );
}
