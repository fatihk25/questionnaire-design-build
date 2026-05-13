import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@/contexts/FormContext';
import { useI18n } from '@/contexts/I18nContext';
import { Card, TextareaField, Button } from '@/components/ui';
import { apiClient } from '@/services/api';

interface OpenQuestion {
  id: number;
  question_text: string;
  order: number;
}

/**
 * Fallback questions if API is unavailable.
 */
const FALLBACK_QUESTIONS: OpenQuestion[] = [
  { id: 1, order: 1, question_text: 'Apa risiko paling signifikan yang Anda temui dalam proyek Design and Build?' },
  { id: 2, order: 2, question_text: 'Apa saran Anda untuk mitigasi risiko tersebut?' },
  { id: 3, order: 3, question_text: 'Apakah ada risiko lain yang belum tercakup dalam kuesioner ini?' },
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
  const [questions, setQuestions] = useState<OpenQuestion[]>(FALLBACK_QUESTIONS);

  // Fetch open questions from API
  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient.get<OpenQuestion[]>('/open-questions');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setQuestions(res.data);
        }
      } catch {
        // Use fallback
      }
    }
    load();
  }, []);

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

      {questions.map((question, index) => (
        <Card key={question.id} variant="default" className="p-6">
          <TextareaField
            label={`${index + 1}. ${question.question_text}`}
            name={String(question.id)}
            value={state.openQuestions[String(question.id)] || ''}
            onChange={(value) => handleChange(String(question.id), value)}
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
