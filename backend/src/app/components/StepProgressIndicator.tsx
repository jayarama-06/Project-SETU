import { Check } from 'lucide-react';

interface StepProgressIndicatorProps {
  totalSteps: number;
  currentStep: number; // 1-based
  completedSteps?: number[]; // Array of completed step numbers
}

export function StepProgressIndicator({
  totalSteps,
  currentStep,
  completedSteps = [],
}: StepProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = completedSteps.includes(stepNumber);
        const isUpcoming = stepNumber > currentStep;

        if (isCompleted) {
          // Completed - Saffron checkmark dot
          return (
            <div
              key={stepNumber}
              className="flex items-center justify-center"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#F0A500',
              }}
            >
              <Check size={16} color="white" strokeWidth={3} />
            </div>
          );
        }

        if (isActive) {
          // Active - Saffron wide pill
          return (
            <div
              key={stepNumber}
              style={{
                width: '32px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: '#F0A500',
              }}
            />
          );
        }

        // Upcoming - Grey circle
        return (
          <div
            key={stepNumber}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#9CA3AF',
            }}
          />
        );
      })}
    </div>
  );
}
