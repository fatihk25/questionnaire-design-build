import { useNavigate } from 'react-router-dom';
import { useForm } from '@/contexts/FormContext';
import { useI18n } from '@/contexts/I18nContext';
import { Card, TextareaField, Button } from '@/components/ui';

/**
 * Open-ended questions matching the database IDs from OpenQuestionSeeder.
 * Backend expects numeric IDs (1, 2, 3) for OpenQuestion::find().
 */
const openQuestions = [
  {
    id: '1',
    label:
      'Apa risiko paling signifikan yang Anda temui dalam proyek Design and Build?',
  },
  {
    id: '2',
    label: 'Apa saran Anda untuk mitigasi risiko tersebut?',
  },
  {
    id: '3',
    label:
      'Apakah ada risiko lain yang belum tercakup dalam kuesioner ini?',
  },
];

const MAX_LENGTH = 500;

/**
 * OpenQuestionPage — renders textarea fields for open-ended questions.
 *
 * Each question is wrapped in a Card and wired to FormContext via SET_OPEN_QUESTION.
 * Displays character count guidance (max 500 characters per field).
 * Navigation: "Kembali" → /fase/penggunaan, "Lanjutkan" → /selesai
 */
export default function OpenQuestionPage() {
  const { state, dispatch } = useForm();
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleChange = (questionId: string, value: string) => {
    dispatch({
      type: 'SET_OPEN_QUESTION',
      payload: { questionId, value },
    });
  };

  const handleBack = () => {
    navigate('/fase/penggunaan');
  };

  const handleContinue = () => {
    navigate('/selesai');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <h1 className="font-display text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
        {t('openQuestion.title')}
      </h1>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        {t('openQuestion.subtitle')}
      </p>

      {openQuestions.map((question, index) => (
        <Card key={question.id} variant="default" className="p-6">
          <TextareaField
            label={`${index + 1}. ${question.label}`}
            name={question.id}
            value={state.openQuestions[question.id] || ''}
            onChange={(value) => handleChange(question.id, value)}
            maxLength={MAX_LENGTH}
            rows={4}
            placeholder={t('openQuestion.placeholder')}
          />
        </Card>
      ))}

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
