import { useState, useRef, useEffect } from 'react';
import { Mic, Play, Pause } from 'lucide-react';
import { motion } from 'motion/react';

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, duration: number) => void;
  maxDuration?: number; // in seconds
}

export function VoiceRecorder({ onRecordingComplete, maxDuration = 60 }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleMouseDown = () => {
    // Start recording
    setIsRecording(true);
    setRecordingDuration(0);
    setHasRecording(false);

    intervalRef.current = setInterval(() => {
      setRecordingDuration((prev) => {
        const newDuration = prev + 1;
        if (newDuration >= maxDuration) {
          handleMouseUp();
          return maxDuration;
        }
        return newDuration;
      });
    }, 1000);
  };

  const handleMouseUp = () => {
    // Stop recording
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (recordingDuration > 0) {
      setHasRecording(true);
      setPlaybackDuration(recordingDuration);
      // Mock: Create a fake blob
      const fakeBlob = new Blob(['audio-data'], { type: 'audio/webm' });
      onRecordingComplete?.(fakeBlob, recordingDuration);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (hasRecording) {
    // Playback UI
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={handlePlayPause}
          className="flex items-center justify-center transition-colors"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '2px solid #0D1B2A',
            backgroundColor: 'white',
          }}
        >
          {isPlaying ? (
            <Pause size={20} color="#0D1B2A" />
          ) : (
            <Play size={20} color="#0D1B2A" fill="#0D1B2A" />
          )}
        </button>
        <div className="flex-1 flex items-center gap-2">
          <div
            className="flex-1 h-1 bg-[#E5E7EB] rounded-full overflow-hidden"
            style={{ borderRadius: '2px' }}
          >
            <motion.div
              className="h-full bg-[#F0A500]"
              initial={{ width: 0 }}
              animate={{ width: isPlaying ? '100%' : 0 }}
              transition={{ duration: playbackDuration, ease: 'linear' }}
            />
          </div>
          <span
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              color: '#6B7280',
            }}
          >
            {formatTime(playbackDuration)}
          </span>
        </div>
      </div>
    );
  }

  if (isRecording) {
    // Recording UI with waveform animation
    return (
      <div className="flex items-center gap-3">
        <button
          onMouseDown={(e) => e.preventDefault()}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="flex items-center justify-center"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '2px solid #EF4444',
            backgroundColor: '#FEE2E2',
          }}
        >
          <div className="w-3 h-3 rounded-full bg-[#EF4444] animate-pulse" />
        </button>
        
        {/* Waveform Animation */}
        <div className="flex items-center gap-1 h-12">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-[#F0A500] rounded-full"
              animate={{
                height: ['8px', '24px', '12px', '24px', '8px'],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        <span
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '14px',
            color: '#EF4444',
            fontWeight: 600,
          }}
        >
          {formatTime(recordingDuration)} / {formatTime(maxDuration)}
        </span>
      </div>
    );
  }

  // Initial state - Hold to record
  return (
    <div className="flex items-center gap-3">
      <button
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        className="flex items-center justify-center transition-colors"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '2px solid #0D1B2A',
          backgroundColor: 'white',
        }}
        data-i18n="btn_voice_note"
      >
        <Mic size={20} color="#0D1B2A" />
      </button>
      <span
        style={{
          fontFamily: 'Noto Sans',
          fontSize: '14px',
          color: '#6B7280',
        }}
        data-i18n="btn_voice_note"
      >
        Hold to record (max 60s)
      </span>
    </div>
  );
}
