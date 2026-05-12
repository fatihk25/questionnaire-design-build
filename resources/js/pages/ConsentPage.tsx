import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useForm } from '@/contexts/FormContext';
import { useI18n } from '@/contexts/I18nContext';

/**
 * ConsentPage — Step 2 (Persetujuan)
 *
 * Displays research information cards and a consent checkbox.
 * The "Lanjutkan" button is disabled until the respondent checks the consent box.
 */
export default function ConsentPage() {
  const { state, dispatch } = useForm();
  const { t } = useI18n();
  const navigate = useNavigate();

  // Set current step to 2 on mount
  useEffect(() => {
    dispatch({ type: 'SET_STEP', payload: 2 });
  }, [dispatch]);

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_CONSENT', payload: e.target.checked });
  };

  const handleContinue = () => {
    navigate('/identitas');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <h1 className="font-display text-2xl font-bold text-center">
        {t('consent.title')}
      </h1>

      {/* Information Cards */}
      <Card variant="info" className="p-6">
        <h2 className="font-display text-lg font-semibold mb-2">
          {t('consent.purpose')}
        </h2>
        <p className="text-sm leading-relaxed">
          Penelitian ini bertujuan untuk mengidentifikasi dan menganalisis risiko yang terjadi pada proyek Design and Build di Indonesia.
        </p>
      </Card>

      <Card variant="info" className="p-6">
        <h2 className="font-display text-lg font-semibold mb-2">
          {t('consent.privacy')}
        </h2>
        <p className="text-sm leading-relaxed">
          Seluruh data yang Anda berikan akan dijaga kerahasiaannya dan hanya digunakan untuk keperluan penelitian.
        </p>
      </Card>

      <Card variant="info" className="p-6">
        <h2 className="font-display text-lg font-semibold mb-2">
          {t('consent.voluntary')}
        </h2>
        <p className="text-sm leading-relaxed">
          Partisipasi Anda dalam penelitian ini bersifat sukarela. Anda dapat berhenti kapan saja tanpa konsekuensi.
        </p>
      </Card>

      {/* Consent Checkbox */}
      <Card variant="default" className="p-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={state.consent}
            onChange={handleConsentChange}
            className="mt-1 h-5 w-5 min-w-5 rounded border-gray-300 text-primary focus:ring-primary/50"
          />
          <span className="text-sm leading-relaxed">
            {t('consent.agree')}
          </span>
        </label>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="secondary" onClick={handleBack}>
          {t('button.previous')}
        </Button>
        <Button
          variant="primary"
          disabled={!state.consent}
          onClick={handleContinue}
        >
          {t('button.next')}
        </Button>
      </div>
    </div>
  );
}
