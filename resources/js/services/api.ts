import axios from 'axios';
import type { AxiosError } from 'axios';
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
 * Typed API error class for consistent error handling.
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
 * Read the CSRF token from the <meta name="csrf-token"> tag in the HTML.
 */
function getCsrfToken(): string {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
  return meta?.content ?? '';
}

/**
 * Axios instance configured for the Laravel session-based backend API.
 * - Base URL from VITE_API_BASE_URL env variable, falling back to '/api'
 * - withCredentials: true — sends cookies for session auth
 * - X-CSRF-TOKEN header attached to unsafe methods (POST, PUT, PATCH, DELETE)
 * - Response interceptor: on 401, clears local auth state; transforms errors to ApiError
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Attach CSRF token to every request (Laravel session guard requires it for POST/PUT/PATCH/DELETE)
apiClient.interceptors.request.use((config) => {
  const token = getCsrfToken();
  if (token) {
    config.headers.set('X-CSRF-TOKEN', token);
  }
  return config;
});

// Handle 401 and normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: string; errors?: Record<string, string[]> }>) => {
    const status = error.response?.status ?? 0;
    const code = error.response?.data?.code ?? error.code ?? 'NETWORK_ERROR';
    let message =
      error.response?.data?.message ?? error.message ?? 'An unexpected error occurred';

    // Laravel validation errors (422): collect the first error from each field
    const validationErrors = error.response?.data?.errors;
    if (status === 422 && validationErrors) {
      const firstErrors = Object.values(validationErrors)
        .flat()
        .slice(0, 3);
      if (firstErrors.length > 0) {
        message = firstErrors.join(' ');
      }
    }

    if (status === 401) {
      const clearFn = getAuthClearFn();
      if (clearFn) clearFn();
    }

    return Promise.reject(new ApiError(status, code, message));
  }
);

// ─── API Service Functions ───────────────────────────────────────────────────

export async function fetchQuestions(phase: PhaseKey): Promise<QuestionsResponse> {
  const response = await apiClient.get<QuestionsResponse>(`/questions/${phase}`);
  return response.data;
}

export async function submitQuestionnaire(payload: SubmissionPayload): Promise<SubmissionResponse> {
  const response = await apiClient.post<SubmissionResponse>('/questionnaire/submit', payload);
  return response.data;
}

/**
 * Admin login. Backend treats `username` field as email.
 * Returns session user info (no token — session is stored in cookie).
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<{
    message: string;
    user: { name: string; email: string };
  }>('/admin/login', { username, password });

  // Adapt backend response shape to frontend LoginResponse contract
  return {
    token: 'session', // placeholder — real auth lives in httpOnly cookie
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2h
    user: response.data.user,
  };
}

/**
 * Admin logout — invalidates the server-side session.
 */
export async function logout(): Promise<void> {
  await apiClient.post('/admin/logout');
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient.get<DashboardStats>('/admin/dashboard/stats');
  return response.data;
}

export async function fetchRespondents(phase?: PhaseKey): Promise<RespondentRow[]> {
  const params = phase ? { phase } : undefined;
  const response = await apiClient.get<RespondentRow[]>('/admin/respondents', { params });
  return response.data;
}

export function downloadExcel(phase: PhaseKey | 'open'): void {
  const baseURL = apiClient.defaults.baseURL || '/api';
  const url = `${baseURL}/admin/export/${phase}`;
  window.open(url, '_blank');
}

export async function resetPhaseData(phase: PhaseKey): Promise<void> {
  await apiClient.delete(`/admin/data/${phase}`);
}

export async function fetchRiskMatrix(phase: PhaseKey): Promise<RiskMatrixCell[]> {
  const response = await apiClient.get<RiskMatrixCell[]>(`/admin/risk-matrix/${phase}`);
  return response.data;
}

export async function fetchAverageScores(phase: PhaseKey): Promise<IndicatorScore[]> {
  const response = await apiClient.get<IndicatorScore[]>(`/admin/average-scores/${phase}`);
  return response.data;
}
