import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/contexts/I18nContext';
import { resetPhaseData } from '@/services/api';
import type { PhaseKey } from '@/types/questionnaire';

/**
 * Phase configuration for rendering reset buttons.
 */
const PHASES: { key: PhaseKey; labelKey: string }[] = [
  { key: 'inisiasi', labelKey: 'admin.phase.inisiasi' },
  { key: 'perencanaan', labelKey: 'admin.phase.perencanaan' },
  { key: 'perancangan', labelKey: 'admin.phase.perancangan' },
  { key: 'pelaksanaan', labelKey: 'admin.phase.pelaksanaan' },
  { key: 'penggunaan', labelKey: 'admin.phase.penggunaan' },
];

type FeedbackState = {
  phase: PhaseKey;
  type: 'success' | 'error';
} | null;

/**
 * ResetDataSection — renders per-phase reset buttons with confirmation dialog.
 *
 * Each button triggers a window.confirm dialog warning that the action is irreversible.
 * On confirmation, calls the resetPhaseData API and shows success/error feedback.
 *
 * Requirements: 16.1, 16.2, 16.3
 */
export function ResetDataSection() {
  const { t } = useI18n();
  const [loadingPhase, setLoadingPhase] = useState<PhaseKey | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const handleReset = async (phase: PhaseKey) => {
    const confirmed = window.confirm(t('admin.resetConfirm'));
    if (!confirmed) return;

    setLoadingPhase(phase);
    setFeedback(null);

    try {
      await resetPhaseData(phase);
      setFeedback({ phase, type: 'success' });
    } catch {
      setFeedback({ phase, type: 'error' });
    } finally {
      setLoadingPhase(null);
    }
  };

  return (
    <section aria-labelledby="reset-data-heading">
      <h3
        id="reset-data-heading"
        className="text-lg font-semibold mb-4"
      >
        {t('admin.resetTitle')}
      </h3>

      <div className="flex flex-wrap gap-3">
        {PHASES.map(({ key, labelKey }) => {
          const isLoading = loadingPhase === key;

          return (
            <div key={key} className="flex flex-col items-start gap-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={isLoading}
                onClick={() => handleReset(key)}
                className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
                aria-label={`${t('button.reset')} ${t(labelKey)}`}
              >
                {isLoading ? (
                  <span
                    className="inline-block w-4 h-4 mr-2 border-2 border-red-400 border-t-transparent rounded-full animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
                )}
                {t(labelKey)}
              </Button>

              {feedback?.phase === key && (
                <span
                  role="status"
                  className={
                    feedback.type === 'success'
                      ? 'text-xs text-green-600 dark:text-green-400'
                      : 'text-xs text-red-600 dark:text-red-400'
                  }
                >
                  {feedback.type === 'success'
                    ? t('admin.resetSuccess')
                    : t('admin.resetError')}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
