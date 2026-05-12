import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAuthClearFn } from '@/contexts/AuthContext';
import type {
  DashboardStats,
  IndicatorScore,
  LoginResponse,
  QuestionsResponse,
  RespondentRow,
  RiskMatrixCell,
  SubmissionPayload,
  SubmissionResponse,
} from '@/types/api';
import type { PhaseKey } from '@/types/questionnaire';

/**
 * Typed API error class for consistent error handling across the application.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Axios instance configured for the Laravel backend API.
 * - Base URL from VITE_API_BASE_URL env variable, falling back to '/api'
 * - Request interceptor attaches Bearer token to admin-scoped requests
 * - Response interceptor handles 401 (clears token) and transforms errors to ApiError
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request interceptor: attach auth token to admin-scoped requests.
 * Only URLs containing '/admin' receive the Authorization header.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const url = config.url || '';
    if (url.includes('/admin')) {
      try {
        const token = localStorage.getItem('auth-token');
        if (token) {
          config.headers.set('Authorization', `Bearer ${token}`);
        }
      } catch {
        // localStorage unavailable — skip token attachment
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor:
 * - On 401: clear stored auth token via AuthContext's external clear function
 * - Transform all axios errors into typed ApiError instances
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: string }>) => {
    const status = error.response?.status ?? 0;
    const code = error.response?.data?.code ?? error.code ?? 'NETWORK_ERROR';
    const message =
      error.response?.data?.message ?? error.message ?? 'An unexpected error occurred';

    // Handle 401 Unauthorized: clear token and trigger login modal
    if (status === 401) {
      const clearFn = getAuthClearFn();
      if (clearFn) {
        clearFn();
      }
    }

    return Promise.reject(new ApiError(status, code, message));
  }
);


// ─── API Service Functions ───────────────────────────────────────────────────

/**
 * Fetch risk indicator questions for a given project phase.
 */
export async function fetchQuestions(phase: PhaseKey): Promise<QuestionsResponse> {
  const response = await apiClient.get<QuestionsResponse>(`/questions/${phase}`);
  return response.data;
}

/**
 * Submit the complete questionnaire (identity, phase answers, open questions).
 */
export async function submitQuestionnaire(payload: SubmissionPayload): Promise<SubmissionResponse> {
  const response = await apiClient.post<SubmissionResponse>('/questionnaire/submit', payload);
  return response.data;
}

/**
 * Authenticate an administrator and receive a session token.
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/admin/login', { username, password });
  return response.data;
}

/**
 * Fetch dashboard statistics (total respondents and per-phase counts).
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient.get<DashboardStats>('/admin/dashboard/stats');
  return response.data;
}

/**
 * Fetch the list of respondents, optionally filtered by phase.
 */
export async function fetchRespondents(phase?: PhaseKey): Promise<RespondentRow[]> {
  const params = phase ? { phase } : undefined;
  const response = await apiClient.get<RespondentRow[]>('/admin/respondents', { params });
  return response.data;
}

/**
 * Trigger an Excel file download for the specified phase or open questions.
 * Opens the export URL in a new tab to initiate the browser download.
 */
export function downloadExcel(phase: PhaseKey | 'open'): void {
  const baseURL = apiClient.defaults.baseURL || '/api';
  const url = `${baseURL}/admin/export/${phase}`;
  window.open(url, '_blank');
}

/**
 * Delete all collected data for a specific phase (irreversible).
 */
export async function resetPhaseData(phase: PhaseKey): Promise<void> {
  await apiClient.delete(`/admin/data/${phase}`);
}

/**
 * Fetch risk matrix data (probability × impact cell counts) for a phase.
 */
export async function fetchRiskMatrix(phase: PhaseKey): Promise<RiskMatrixCell[]> {
  const response = await apiClient.get<RiskMatrixCell[]>(`/admin/risk-matrix/${phase}`);
  return response.data;
}

/**
 * Fetch average probability, impact, and score per indicator for a phase.
 */
export async function fetchAverageScores(phase: PhaseKey): Promise<IndicatorScore[]> {
  const response = await apiClient.get<IndicatorScore[]>(`/admin/average-scores/${phase}`);
  return response.data;
}
