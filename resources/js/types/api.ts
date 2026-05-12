/**
 * API request and response types.
 * Defines the contract between the frontend and the Laravel backend.
 */

import type { IdentityData, OpenQuestionData, PhaseAnswers, PhaseKey } from './questionnaire';

export interface RiskIndicator {
  id: number;
  phase: PhaseKey;
  aspect: string;
  indicator: string;
  order: number;
}

export interface QuestionsResponse {
  phase: PhaseKey;
  questions: RiskIndicator[];
}

export interface SubmissionPayload {
  identity: IdentityData;
  answers: PhaseAnswers;
  openQuestions: OpenQuestionData;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  respondentId: number;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface DashboardStats {
  totalRespondents: number;
  perPhase: Record<PhaseKey, number>;
}

export interface RespondentRow {
  id: number;
  nama: string;
  instansi: string;
  posisi: string;
  pendidikan: string;
  pengalaman: string;
  sektor: string;
  createdAt: string;
}

export interface RiskMatrixCell {
  probability: number;
  impact: number;
  count: number;
  score: number;
}

export interface IndicatorScore {
  id: number;
  aspect: string;
  indicator: string;
  avgProbability: number;
  avgImpact: number;
  avgScore: number;
}
