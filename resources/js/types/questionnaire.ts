/**
 * Core questionnaire state types.
 * Defines the shape of the form state managed by FormContext.
 */

export type PhaseKey = 'inisiasi' | 'perencanaan' | 'perancangan' | 'pelaksanaan' | 'penggunaan';

export interface IdentityData {
  nama: string;
  perusahaan: string;
  telepon: string;
  email: string;
  kelompokUmur: string | null;
  pendidikan: string | null;
  posisiStakeholder: string | null;
  posisiLainnya: string;
  pengalamanKonstruksi: string | null;
  pengalamanProyekDB: string | null;
  fasePalingTerlibat: string | null;
  sektorProyek: string | null;
}

export interface PhaseAnswers {
  [phaseKey: string]: {
    [questionId: string]: {
      probability: number | null;
      impact: number | null;
    };
  };
}

export interface OpenQuestionData {
  [questionId: string]: string;
}

export interface QuestionnaireState {
  currentStep: number;
  eligibility: 'pernah' | 'tidak_pernah' | null;
  consent: boolean;
  identity: IdentityData;
  answers: PhaseAnswers;
  openQuestions: OpenQuestionData;
  submissionStatus: 'idle' | 'submitting' | 'success' | 'error';
}
