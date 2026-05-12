import { Check } from 'lucide-react';
import clsx from 'clsx';
import { useI18n } from '@/contexts/I18nContext';

export interface StepperProps {
  currentStep: number;
  totalSteps?: number;
}

const TOTAL_STEPS = 10;

/**
 * Step label i18n keys for steps 1–10.
 */
const stepKeys = Array.from({ length: TOTAL_STEPS }, (_, i) => `step.${i + 1}`);

/**
 * Stepper — horizontal progress indicator showing completed, active, and upcoming steps.
 *
 * Visual states:
 * - Completed: green circle with white check icon, green connector line
 * - Active: blue circle with step number, blue ring/pulse effect, blue connector line
 * - Upcoming: gray circle with step number, gray connector line
 *
 * Behavior:
 * - Hidden on Step 1 (returns null)
 * - Desktop (≥768px): shows all 10 steps horizontally with connector lines
 * - Mobile (<768px): shows only active step label and "X/10" indicator
 */
export function Stepper({ currentStep, totalSteps = TOTAL_STEPS }: StepperProps) {
  const { t } = useI18n();

  // Hide stepper on Step 1
  if (currentStep === 1) {
    return null;
  }

  return (
    <div className="w-full py-4" role="navigation" aria-label="Progress">
      {/* Desktop view (≥768px) */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {stepKeys.map((key, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;

            return (
              <div key={key} className="flex items-center flex-1 last:flex-none">
                {/* Step indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className={clsx(
                      'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all',
                      isCompleted && 'bg-[var(--color-accent-green)] text-white',
                      isActive &&
                        'bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary)]/20',
                      !isCompleted && !isActive && 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-300'
                    )}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" strokeWidth={3} />
                    ) : (
                      <span>{stepNumber}</span>
                    )}
                  </div>
                  {/* Step label */}
                  <span
                    className={clsx(
                      'mt-1 text-xs text-center whitespace-nowrap',
                      isCompleted && 'text-[var(--color-accent-green)] font-medium',
                      isActive && 'text-[var(--color-primary)] font-semibold',
                      !isCompleted && !isActive && 'text-gray-400 dark:text-gray-400'
                    )}
                  >
                    {t(key)}
                  </span>
                </div>

                {/* Connector line (not after last step) */}
                {stepNumber < totalSteps && (
                  <div
                    className={clsx(
                      'flex-1 h-0.5 mx-2',
                      stepNumber < currentStep && 'bg-[var(--color-accent-green)]',
                      stepNumber === currentStep && 'bg-[var(--color-primary)]',
                      stepNumber > currentStep && 'bg-gray-200 dark:bg-gray-600'
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* "Langkah X dari 10" text */}
        <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-300">
          {t('stepper.stepOf')
            .replace('{current}', String(currentStep))
            .replace('{total}', String(totalSteps))}
        </p>
      </div>

      {/* Mobile view (<768px) */}
      <div className="md:hidden">
        <div className="flex items-center justify-between">
          {/* Active step indicator + label */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-primary)] text-white text-sm font-medium ring-4 ring-[var(--color-primary)]/20">
              {currentStep}
            </div>
            <span className="text-sm font-semibold text-[var(--color-primary)] dark:text-blue-300">
              {t(stepKeys[currentStep - 1])}
            </span>
          </div>

          {/* "X/10" indicator */}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentStep}/{totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>

        {/* "Langkah X dari 10" text */}
        <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          {t('stepper.stepOf')
            .replace('{current}', String(currentStep))
            .replace('{total}', String(totalSteps))}
        </p>
      </div>
    </div>
  );
}

export default Stepper;
