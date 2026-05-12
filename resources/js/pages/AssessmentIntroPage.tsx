import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui';
import { useForm } from '@/contexts/FormContext';
import { useI18n } from '@/contexts/I18nContext';

/**
 * Probability scale data (0–5) with Indonesian labels.
 */
const probabilityScale = [
  { value: 0, label: 'Tidak Mungkin', description: 'Impossible' },
  { value: 1, label: 'Sangat Jarang', description: 'Very Rare' },
  { value: 2, label: 'Jarang', description: 'Rare' },
  { value: 3, label: 'Kadang-kadang', description: 'Occasional' },
  { value: 4, label: 'Sering', description: 'Frequent' },
  { value: 5, label: 'Sangat Sering', description: 'Very Frequent' },
];

/**
 * Impact scale data (0–5) with Indonesian labels.
 */
const impactScale = [
  { value: 0, label: 'Tidak Ada Dampak', description: 'No Impact' },
  { value: 1, label: 'Sangat Kecil', description: 'Very Low' },
  { value: 2, label: 'Kecil', description: 'Low' },
  { value: 3, label: 'Sedang', description: 'Moderate' },
  { value: 4, label: 'Besar', description: 'High' },
  { value: 5, label: 'Sangat Besar', description: 'Very High' },
];

/**
 * AssessmentIntroPage — Step 4 (Penilaian)
 *
 * Displays the probability and impact rating scales so respondents
 * understand how to rate risk indicators in the subsequent phase pages.
 */
export default function AssessmentIntroPage() {
  const { dispatch } = useForm();
  const { t } = useI18n();
  const navigate = useNavigate();

  // Set current step to 4 on mount
  useEffect(() => {
    dispatch({ type: 'SET_STEP', payload: 4 });
  }, [dispatch]);

  const handleContinue = () => {
    navigate('/fase/inisiasi');
  };

  const handleBack = () => {
    navigate('/identitas');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <h1 className="font-display text-2xl font-bold text-center">
        {t('assessment.title')}
      </h1>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Berikut adalah skala penilaian yang akan digunakan untuk menilai setiap indikator risiko.
        Silakan pelajari skala di bawah ini sebelum melanjutkan.
      </p>

      {/* Probability Scale Card - Blue Tint */}
      <Card className="border border-primary/20 bg-primary/5 p-6">
        <h2 className="font-display text-lg font-semibold mb-4 text-primary">
          {t('assessment.probability')} (0–5)
        </h2>
        <div className="space-y-2">
          {probabilityScale.map((item) => (
            <div
              key={item.value}
              className="flex items-center gap-3 rounded-md bg-white/60 px-4 py-2 dark:bg-white/10"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                {item.value}
              </span>
              <div>
                <span className="font-medium">{item.label}</span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({item.description})
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Impact Scale Card - Teal Tint */}
      <Card className="border border-secondary/20 bg-secondary/5 p-6">
        <h2 className="font-display text-lg font-semibold mb-4 text-secondary">
          {t('assessment.impact')} (0–5)
        </h2>
        <div className="space-y-2">
          {impactScale.map((item) => (
            <div
              key={item.value}
              className="flex items-center gap-3 rounded-md bg-white/60 px-4 py-2 dark:bg-white/10"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-white text-sm font-bold">
                {item.value}
              </span>
              <div>
                <span className="font-medium">{item.label}</span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({item.description})
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="secondary" onClick={handleBack}>
          {t('button.previous')}
        </Button>
        <Button variant="primary" onClick={handleContinue}>
          {t('button.next')}
        </Button>
      </div>
    </div>
  );
}
