import { Check } from 'lucide-react';
import clsx from 'clsx';
import { useI18n } from '@/contexts/I18nContext';

export interface StepperProps {
  currentStep: number;
  totalSteps?: number;
}

const TOTAL_STEPS = 10;
const stepKeys = Array.from({ length: TOTAL_STEPS }, (_, i) => `step.${i + 1}`);

export function Stepper({ currentStep, totalSteps = TOTAL_STEPS }: StepperProps) {
  const { t } = useI18n();

  if (currentStep === 1) return null;

  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full bg-white border-b border-gray-200" role="navigation" aria-label="Progress">
      <div className="hidden md:block px-6 pt-4 pb-1">

        {/* Steps row: each step is flex-1, circle centered, short lines on each side */}
        <div className="flex items-center">
          {stepKeys.map((key, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;
            const isFirst = index === 0;
            const isLast = index === totalSteps - 1;

            // Line color: green if the segment is "done" (both sides completed)
            const leftLineDone = stepNumber <= currentStep;   // left side of this circle
            const rightLineDone = stepNumber < currentStep;   // right side of this circle

            return (
              <div key={key} className="flex-1 flex flex-col items-center">
                {/* Circle row with short lines */}
                <div className="flex items-center w-full">
                  {/* Left line (hidden for first step) */}
                  <div className={clsx(
                    'flex-1 h-px',
                    isFirst ? 'invisible' : leftLineDone ? 'bg-green-500' : 'bg-gray-300'
                  )} />

                  {/* Circle */}
                  <div
                    className={clsx(
                      'flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full font-semibold text-sm border-2 transition-all',
                      isCompleted && 'bg-green-600 border-green-600 text-white',
                      isActive && 'bg-[#025695] border-[#025695] text-white',
                      !isCompleted && !isActive && 'bg-white border-gray-300 text-gray-500'
                    )}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" strokeWidth={3} />
                    ) : (
                      <span>{stepNumber}</span>
                    )}
                  </div>

                  {/* Right line (hidden for last step) */}
                  <div className={clsx(
                    'flex-1 h-px',
                    isLast ? 'invisible' : rightLineDone ? 'bg-green-500' : 'bg-gray-300'
                  )} />
                </div>

                {/* Label */}
                <span className={clsx(
                  'mt-1.5 text-[10px] text-center whitespace-nowrap',
                  isCompleted && 'text-green-700 font-medium',
                  isActive && 'text-[#025695] font-semibold',
                  !isCompleted && !isActive && 'text-gray-400'
                )}>
                  {t(key)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom: thin progress bar + "Langkah X dari 10" */}
        <div className="flex items-center gap-4 mt-3 pb-2">
          <div className="flex-1 h-px bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-[#025695] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-gray-500 whitespace-nowrap flex-shrink-0">
            {t('stepper.stepOf')
              .replace('{current}', String(currentStep))
              .replace('{total}', String(totalSteps))}
          </span>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#025695] text-white text-sm font-bold border-2 border-[#025695]">
              {currentStep}
            </div>
            <span className="text-sm font-semibold text-[#025695]">
              {t(stepKeys[currentStep - 1])}
            </span>
          </div>
          <span className="text-xs text-gray-500">{currentStep}/{totalSteps}</span>
        </div>
        <div className="h-px w-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-[#025695] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-1.5 text-right text-[11px] text-gray-500">
          {t('stepper.stepOf')
            .replace('{current}', String(currentStep))
            .replace('{total}', String(totalSteps))}
        </p>
      </div>
    </div>
  );
}

export default Stepper;
