/**
 * Form reducer action types.
 * Defines all possible actions dispatched to the FormContext reducer.
 */

import type { IdentityData, PhaseKey, QuestionnaireState } from './questionnaire';

export type FormAction =
  | { type: 'SET_ELIGIBILITY'; payload: 'pernah' | 'tidak_pernah' }
  | { type: 'SET_CONSENT'; payload: boolean }
  | { type: 'SET_IDENTITY_FIELD'; payload: { field: keyof IdentityData; value: string } }
  | { type: 'SET_ANSWER'; payload: { phase: PhaseKey; questionId: string; field: 'probability' | 'impact'; value: number } }
  | { type: 'SET_OPEN_QUESTION'; payload: { questionId: string; value: string } }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_SUBMISSION_STATUS'; payload: QuestionnaireState['submissionStatus'] }
  | { type: 'RESET_FORM' };
