import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { QuestionnaireState, IdentityData } from '@/types/questionnaire';
import type { FormAction } from '@/types/formActions';

/**
 * Validation result for a given step.
 */
export interface StepValidation {
  isValid: boolean;
  errors: string[];
}

/**
 * The shape of the FormContext value exposed to consumers.
 */
export interface FormContextValue {
  state: QuestionnaireState;
  dispatch: React.Dispatch<FormAction>;
  getStepValidation: (step: number) => StepValidation;
  resetForm: () => void;
}

/**
 * Initial identity data with all fields empty/null.
 */
const initialIdentity: IdentityData = {
  nama: '',
  perusahaan: '',
  telepon: '',
  email: '',
  kelompokUmur: null,
  pendidikan: null,
  posisiStakeholder: null,
  posisiLainnya: '',
  pengalamanKonstruksi: null,
  pengalamanProyekDB: null,
  fasePalingTerlibat: null,
  sektorProyek: null,
};

/**
 * Initial questionnaire state.
 */
export const initialState: QuestionnaireState = {
  currentStep: 1,
  eligibility: null,
  consent: false,
  identity: { ...initialIdentity },
  answers: {},
  openQuestions: {},
  submissionStatus: 'idle',
};

/**
 * Pure reducer function handling all form actions.
 * Exported separately for testing.
 */
export function formReducer(state: QuestionnaireState, action: FormAction): QuestionnaireState {
  switch (action.type) {
    case 'SET_ELIGIBILITY':
      return { ...state, eligibility: action.payload };

    case 'SET_CONSENT':
      return { ...state, consent: action.payload };

    case 'SET_IDENTITY_FIELD':
      return {
        ...state,
        identity: {
          ...state.identity,
          [action.payload.field]: action.payload.value,
        },
      };

    case 'SET_ANSWER': {
      const { phase, questionId, field, value } = action.payload;
      const phaseAnswers = state.answers[phase] || {};
      const questionAnswer = phaseAnswers[questionId] || { probability: null, impact: null };

      return {
        ...state,
        answers: {
          ...state.answers,
          [phase]: {
            ...phaseAnswers,
            [questionId]: {
              ...questionAnswer,
              [field]: value,
            },
          },
        },
      };
    }

    case 'SET_OPEN_QUESTION':
      return {
        ...state,
        openQuestions: {
          ...state.openQuestions,
          [action.payload.questionId]: action.payload.value,
        },
      };

    case 'SET_STEP':
      return { ...state, currentStep: action.payload };

    case 'SET_SUBMISSION_STATUS':
      return { ...state, submissionStatus: action.payload };

    case 'RESET_FORM':
      return { ...initialState, identity: { ...initialIdentity } };

    default:
      return state;
  }
}

/**
 * Maps step numbers 5–9 to their corresponding phase keys.
 */
const stepToPhaseKey: Record<number, string> = {
  5: 'inisiasi',
  6: 'perencanaan',
  7: 'perancangan',
  8: 'pelaksanaan',
  9: 'penggunaan',
};

/**
 * The radio group fields in the identity form that must have a selection.
 */
const identityRadioFields: (keyof IdentityData)[] = [
  'kelompokUmur',
  'pendidikan',
  'posisiStakeholder',
  'pengalamanKonstruksi',
  'pengalamanProyekDB',
  'fasePalingTerlibat',
  'sektorProyek',
];

/**
 * Validates a given step based on the current state.
 * Returns whether the step is valid and any error messages.
 */
export function getStepValidation(step: number, state: QuestionnaireState): StepValidation {
  const errors: string[] = [];

  switch (step) {
    case 1:
      if (state.eligibility !== 'pernah') {
        errors.push('Eligibility must be "pernah" to proceed.');
      }
      break;

    case 2:
      if (!state.consent) {
        errors.push('Consent must be given to proceed.');
      }
      break;

    case 3:
      if (!state.identity.nama.trim()) {
        errors.push('Nama is required.');
      }
      if (!state.identity.perusahaan.trim()) {
        errors.push('Perusahaan/Instansi is required.');
      }
      for (const field of identityRadioFields) {
        if (state.identity[field] === null || state.identity[field] === '') {
          errors.push(`${field} must be selected.`);
        }
      }
      break;

    case 4:
      // Assessment intro page — no validation needed, always valid
      break;

    case 5:
    case 6:
    case 7:
    case 8:
    case 9: {
      const phaseKey = stepToPhaseKey[step];
      const phaseAnswers = state.answers[phaseKey];

      if (!phaseAnswers || Object.keys(phaseAnswers).length === 0) {
        errors.push(`All questions in the ${phaseKey} phase must be rated.`);
      } else {
        for (const [questionId, answer] of Object.entries(phaseAnswers)) {
          if (answer.probability === null) {
            errors.push(`Question ${questionId} is missing a probability rating.`);
          }
          if (answer.impact === null) {
            errors.push(`Question ${questionId} is missing an impact rating.`);
          }
        }
      }
      break;
    }

    case 10:
      if (state.submissionStatus === 'error') {
        errors.push('Submission encountered an error.');
      }
      break;

    default:
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * React Context for the form state.
 */
const FormContext = createContext<FormContextValue | undefined>(undefined);

/**
 * FormProvider component wrapping children with form state context.
 */
export function FormProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const getValidation = useCallback(
    (step: number): StepValidation => getStepValidation(step, state),
    [state]
  );

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  const value: FormContextValue = {
    state,
    dispatch,
    getStepValidation: getValidation,
    resetForm,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

/**
 * Hook to access the FormContext. Throws if used outside FormProvider.
 */
export function useForm(): FormContextValue {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}

export default FormContext;
