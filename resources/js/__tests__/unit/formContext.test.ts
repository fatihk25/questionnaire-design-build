import { describe, it, expect } from 'vitest';
import { formReducer, initialState, getStepValidation } from '@/contexts/FormContext';
import type { QuestionnaireState } from '@/types/questionnaire';
import type { FormAction } from '@/types/formActions';

describe('formReducer', () => {
  it('should return initial state for unknown action', () => {
    const result = formReducer(initialState, { type: 'UNKNOWN' } as unknown as FormAction);
    expect(result).toEqual(initialState);
  });

  it('SET_ELIGIBILITY sets eligibility value', () => {
    const result = formReducer(initialState, { type: 'SET_ELIGIBILITY', payload: 'pernah' });
    expect(result.eligibility).toBe('pernah');
  });

  it('SET_CONSENT sets consent value', () => {
    const result = formReducer(initialState, { type: 'SET_CONSENT', payload: true });
    expect(result.consent).toBe(true);
  });

  it('SET_IDENTITY_FIELD updates a specific identity field', () => {
    const result = formReducer(initialState, {
      type: 'SET_IDENTITY_FIELD',
      payload: { field: 'nama', value: 'John Doe' },
    });
    expect(result.identity.nama).toBe('John Doe');
    // Other fields remain unchanged
    expect(result.identity.perusahaan).toBe('');
  });

  it('SET_ANSWER sets probability for a question in a phase', () => {
    const result = formReducer(initialState, {
      type: 'SET_ANSWER',
      payload: { phase: 'inisiasi', questionId: 'q1', field: 'probability', value: 3 },
    });
    expect(result.answers.inisiasi.q1.probability).toBe(3);
    expect(result.answers.inisiasi.q1.impact).toBeNull();
  });

  it('SET_ANSWER sets impact without overwriting probability', () => {
    const stateWithProb = formReducer(initialState, {
      type: 'SET_ANSWER',
      payload: { phase: 'inisiasi', questionId: 'q1', field: 'probability', value: 4 },
    });
    const result = formReducer(stateWithProb, {
      type: 'SET_ANSWER',
      payload: { phase: 'inisiasi', questionId: 'q1', field: 'impact', value: 2 },
    });
    expect(result.answers.inisiasi.q1.probability).toBe(4);
    expect(result.answers.inisiasi.q1.impact).toBe(2);
  });

  it('SET_OPEN_QUESTION stores open question text', () => {
    const result = formReducer(initialState, {
      type: 'SET_OPEN_QUESTION',
      payload: { questionId: 'open1', value: 'Some feedback' },
    });
    expect(result.openQuestions.open1).toBe('Some feedback');
  });

  it('SET_STEP updates currentStep', () => {
    const result = formReducer(initialState, { type: 'SET_STEP', payload: 5 });
    expect(result.currentStep).toBe(5);
  });

  it('SET_SUBMISSION_STATUS updates submissionStatus', () => {
    const result = formReducer(initialState, { type: 'SET_SUBMISSION_STATUS', payload: 'submitting' });
    expect(result.submissionStatus).toBe('submitting');
  });

  it('RESET_FORM returns to initial state', () => {
    const modifiedState: QuestionnaireState = {
      currentStep: 7,
      eligibility: 'pernah',
      consent: true,
      identity: { ...initialState.identity, nama: 'Test' },
      answers: { inisiasi: { q1: { probability: 3, impact: 2 } } },
      openQuestions: { open1: 'text' },
      submissionStatus: 'success',
    };
    const result = formReducer(modifiedState, { type: 'RESET_FORM' });
    expect(result).toEqual(initialState);
  });

  it('maintains immutability - does not mutate original state', () => {
    const original = { ...initialState };
    formReducer(initialState, { type: 'SET_ELIGIBILITY', payload: 'pernah' });
    expect(initialState).toEqual(original);
  });
});

describe('getStepValidation', () => {
  describe('Step 1 - Eligibility', () => {
    it('is invalid when eligibility is null', () => {
      const result = getStepValidation(1, initialState);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('is invalid when eligibility is tidak_pernah', () => {
      const state = { ...initialState, eligibility: 'tidak_pernah' as const };
      const result = getStepValidation(1, state);
      expect(result.isValid).toBe(false);
    });

    it('is valid when eligibility is pernah', () => {
      const state = { ...initialState, eligibility: 'pernah' as const };
      const result = getStepValidation(1, state);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Step 2 - Consent', () => {
    it('is invalid when consent is false', () => {
      const result = getStepValidation(2, initialState);
      expect(result.isValid).toBe(false);
    });

    it('is valid when consent is true', () => {
      const state = { ...initialState, consent: true };
      const result = getStepValidation(2, state);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Step 3 - Identity', () => {
    it('is invalid when nama is empty', () => {
      const state = {
        ...initialState,
        identity: { ...initialState.identity, perusahaan: 'Company' },
      };
      const result = getStepValidation(3, state);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nama is required.');
    });

    it('is invalid when perusahaan is empty', () => {
      const state = {
        ...initialState,
        identity: { ...initialState.identity, nama: 'John' },
      };
      const result = getStepValidation(3, state);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Perusahaan/Instansi is required.');
    });

    it('is invalid when radio groups are not selected', () => {
      const state = {
        ...initialState,
        identity: { ...initialState.identity, nama: 'John', perusahaan: 'Company' },
      };
      const result = getStepValidation(3, state);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('is valid when all required fields are filled', () => {
      const state: QuestionnaireState = {
        ...initialState,
        identity: {
          nama: 'John',
          perusahaan: 'Company',
          telepon: '',
          email: '',
          kelompokUmur: '21–35',
          pendidikan: 'Diploma/Sarjana (D3/S1)',
          posisiStakeholder: 'Project Manager/PM',
          posisiLainnya: '',
          pengalamanKonstruksi: '3–5 tahun',
          pengalamanProyekDB: '1–2 kali',
          fasePalingTerlibat: 'Inisiasi (Idea)',
          sektorProyek: 'Proyek Pemerintah',
        },
      };
      const result = getStepValidation(3, state);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Step 4 - Assessment Intro', () => {
    it('is always valid (no validation needed)', () => {
      const result = getStepValidation(4, initialState);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Steps 5-9 - Phase Assessment', () => {
    it('is invalid when phase has no answers', () => {
      const result = getStepValidation(5, initialState);
      expect(result.isValid).toBe(false);
    });

    it('is invalid when a question is missing probability', () => {
      const state: QuestionnaireState = {
        ...initialState,
        answers: {
          inisiasi: {
            q1: { probability: null, impact: 3 },
          },
        },
      };
      const result = getStepValidation(5, state);
      expect(result.isValid).toBe(false);
    });

    it('is invalid when a question is missing impact', () => {
      const state: QuestionnaireState = {
        ...initialState,
        answers: {
          inisiasi: {
            q1: { probability: 3, impact: null },
          },
        },
      };
      const result = getStepValidation(5, state);
      expect(result.isValid).toBe(false);
    });

    it('is valid when all questions have both probability and impact', () => {
      const state: QuestionnaireState = {
        ...initialState,
        answers: {
          inisiasi: {
            q1: { probability: 3, impact: 2 },
            q2: { probability: 4, impact: 5 },
          },
        },
      };
      const result = getStepValidation(5, state);
      expect(result.isValid).toBe(true);
    });

    it('validates correct phase for each step (step 6 = perencanaan)', () => {
      const state: QuestionnaireState = {
        ...initialState,
        answers: {
          perencanaan: {
            q1: { probability: 2, impact: 3 },
          },
        },
      };
      const result = getStepValidation(6, state);
      expect(result.isValid).toBe(true);
    });

    it('validates correct phase for step 9 = penggunaan', () => {
      const state: QuestionnaireState = {
        ...initialState,
        answers: {
          penggunaan: {
            q1: { probability: 1, impact: 1 },
          },
        },
      };
      const result = getStepValidation(9, state);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Step 10 - Completion', () => {
    it('is invalid when submissionStatus is error', () => {
      const state: QuestionnaireState = { ...initialState, submissionStatus: 'error' };
      const result = getStepValidation(10, state);
      expect(result.isValid).toBe(false);
    });

    it('is valid when submissionStatus is idle', () => {
      const result = getStepValidation(10, initialState);
      expect(result.isValid).toBe(true);
    });

    it('is valid when submissionStatus is success', () => {
      const state: QuestionnaireState = { ...initialState, submissionStatus: 'success' };
      const result = getStepValidation(10, state);
      expect(result.isValid).toBe(true);
    });

    it('is valid when submissionStatus is submitting', () => {
      const state: QuestionnaireState = { ...initialState, submissionStatus: 'submitting' };
      const result = getStepValidation(10, state);
      expect(result.isValid).toBe(true);
    });
  });
});
