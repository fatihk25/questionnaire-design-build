# Implementation Plan: Questionnaire Frontend Rebuild

## Overview

This plan implements the "Kuesioner Design and Build" React 19 + TypeScript SPA within the existing Laravel 12 shell. The implementation proceeds from foundational setup (Vite, routing, providers) through shared UI components, public questionnaire pages, form state management, API integration, and finally the admin dashboard. Each task builds incrementally on previous work, ensuring no orphaned code.

## Tasks

- [x] 1. Set up project foundation and tooling
  - [x] 1.1 Configure Vite, TypeScript, and Tailwind CSS 4
    - Update `vite.config.js` to support React with TypeScript (add `@vitejs/plugin-react`)
    - Create `tsconfig.json` with `@` path alias resolving to `resources/js`
    - Configure Tailwind CSS 4 via Vite plugin with `@theme` directives for design tokens (colors, fonts, spacing, radii)
    - Create `resources/js/app.tsx` entry point that mounts `<App />` to `#app`
    - Create `resources/views/app.blade.php` with Vite directives and catch-all Laravel route
    - Install dependencies: react, react-dom, react-router-dom, axios, lucide-react
    - _Requirements: 1.1, 1.5, 21.1, 21.2, 21.3, 21.4, 21.5_

  - [x] 1.2 Set up testing framework
    - Install vitest, @testing-library/react, @testing-library/jest-dom, fast-check, msw
    - Create `vitest.config.ts` with jsdom environment and path aliases
    - Create test setup file with Testing Library matchers
    - Create directory structure: `resources/js/__tests__/{properties,unit,integration}`
    - _Requirements: (testing infrastructure)_

  - [x] 1.3 Define TypeScript types and interfaces
    - Create `resources/js/types/questionnaire.ts` with `QuestionnaireState`, `IdentityData`, `PhaseKey`, `PhaseAnswers`, `OpenQuestionData`
    - Create `resources/js/types/api.ts` with `RiskIndicator`, `QuestionsResponse`, `SubmissionPayload`, `SubmissionResponse`, `LoginResponse`, `DashboardStats`, `RespondentRow`, `RiskMatrixCell`, `IndicatorScore`
    - Create `resources/js/types/formActions.ts` with `FormAction` union type
    - _Requirements: 11.3, 20.1_

- [x] 2. Implement context providers
  - [x] 2.1 Implement ThemeContext provider
    - Create `resources/js/contexts/ThemeContext.tsx` with `isDark` state and `toggleDark` function
    - Persist dark mode preference to localStorage
    - Restore preference on app load
    - Add/remove `dark` class on document root element
    - _Requirements: 2.3, 18.1, 18.2, 18.3, 18.4_

  - [ ]* 2.2 Write property test for dark mode persistence (Property 12)
    - **Property 12: Dark Mode Persistence Round-Trip**
    - **Validates: Requirements 18.3, 18.4**

  - [x] 2.3 Implement I18nContext provider
    - Create `resources/js/contexts/I18nContext.tsx` with `locale` state, `setLocale`, and `t(key)` function
    - Create `resources/js/i18n/id.ts` and `resources/js/i18n/en.ts` translation dictionaries
    - Default to Indonesian (ID) when no preference stored
    - Persist language preference to localStorage and restore on load
    - Re-render all translatable text on locale switch without page reload
    - _Requirements: 2.4, 19.1, 19.2, 19.3, 19.4, 19.5_

  - [ ]* 2.4 Write property test for internationalization switching (Property 11)
    - **Property 11: Internationalization Switching**
    - **Validates: Requirements 2.4, 19.3, 19.4**

  - [x] 2.5 Implement AuthContext provider
    - Create `resources/js/contexts/AuthContext.tsx` with `token`, `isAuthenticated`, `login`, `logout`
    - Store token in memory and localStorage
    - Clear token on logout or 401 response
    - _Requirements: 12.2, 12.3, 12.5_

  - [x] 2.6 Implement FormContext provider with reducer
    - Create `resources/js/contexts/FormContext.tsx` with `useReducer` for `QuestionnaireState`
    - Implement all `FormAction` cases: SET_ELIGIBILITY, SET_CONSENT, SET_IDENTITY_FIELD, SET_ANSWER, SET_OPEN_QUESTION, SET_STEP, SET_SUBMISSION_STATUS, RESET_FORM
    - Implement `getStepValidation(step)` function checking required fields per step
    - Maintain state across step transitions
    - _Requirements: 6.10, 8.7, 9.2, 11.1, 11.2, 11.3, 11.4_

  - [ ]* 2.7 Write property test for form state persistence (Property 3)
    - **Property 3: Form State Persistence Across Navigation**
    - **Validates: Requirements 6.10, 9.2, 11.1, 11.2**

  - [ ]* 2.8 Write property test for step validation gate (Property 4)
    - **Property 4: Step Validation Gate**
    - **Validates: Requirements 6.11, 11.4**

- [x] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement shared UI components
  - [x] 4.1 Create Button component
    - Create `resources/js/components/ui/Button.tsx` with variants: primary, secondary, ghost
    - Apply 8px border radius, primary color (#025695) for primary variant
    - Support `disabled` state, `size` prop, and minimum 44×44px touch target on mobile
    - _Requirements: 21.2, 21.3, 17.5_

  - [x] 4.2 Create Card component
    - Create `resources/js/components/ui/Card.tsx` with variants: default, info, beige
    - Apply 12px border radius and soft shadow (0px 4px 20px rgba(0,0,0,0.05))
    - _Requirements: 21.2, 21.4_

  - [x] 4.3 Create form input components
    - Create `resources/js/components/ui/InputField.tsx` with label, validation error display, beige (#F3F0EA) background
    - Create `resources/js/components/ui/RadioGroup.tsx` with vertical/horizontal layout support
    - Create `resources/js/components/ui/SelectField.tsx` for dropdown selects
    - Create `resources/js/components/ui/TextareaField.tsx` with character counter
    - _Requirements: 6.1, 6.12, 9.3, 21.2_

  - [ ]* 4.4 Write unit tests for shared UI components
    - Test Button renders all variants and disabled state
    - Test Card renders with correct styling per variant
    - Test InputField shows validation errors
    - Test RadioGroup selection behavior
    - Test TextareaField character count display
    - _Requirements: 21.2, 21.3, 21.4_

- [x] 5. Implement routing and layouts
  - [x] 5.1 Create React Router configuration
    - Create `resources/js/router.tsx` with all routes per the routing table
    - Implement catch-all `*` route rendering NotFoundPage
    - Wrap routes with PublicLayout and AdminLayout as appropriate
    - Implement admin route protection (redirect to public + login modal if unauthenticated)
    - _Requirements: 1.2, 1.3, 1.4, 12.5_

  - [ ]* 5.2 Write property test for route-to-component mapping (Property 1)
    - **Property 1: Route-to-Component Mapping**
    - **Validates: Requirements 1.3, 1.4**

  - [ ]* 5.3 Write property test for admin route protection (Property 14)
    - **Property 14: Admin Route Protection**
    - **Validates: Requirements 12.5**

  - [x] 5.4 Create PublicLayout with header and footer
    - Create `resources/js/layouts/PublicLayout.tsx` with header, stepper, page outlet, footer
    - Create `resources/js/components/PublicHeader.tsx` with teal (#1c6775) background, app title, dark mode toggle, language switcher, admin button; sticky positioning
    - Create `resources/js/components/PublicFooter.tsx` with centered copyright text
    - _Requirements: 2.1, 2.2, 2.5, 2.6_

  - [x] 5.5 Create Stepper component
    - Create `resources/js/components/Stepper.tsx` with 10 labeled steps
    - Render completed steps (green #2e7d32 + check icon), active step (blue #025695 + number + ring), upcoming steps (gray + number)
    - Display "Langkah X dari 10" text
    - Collapse to compact mobile view below 768px
    - Hide stepper on Step 1
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ]* 5.6 Write property test for stepper visual state (Property 2)
    - **Property 2: Stepper Visual State Consistency**
    - **Validates: Requirements 3.2, 3.3, 3.4, 3.5, 3.7**

  - [x] 5.7 Create AdminLayout
    - Create `resources/js/layouts/AdminLayout.tsx` with admin-specific header and content area
    - _Requirements: 12.3_

  - [x] 5.8 Create NotFoundPage
    - Create `resources/js/pages/NotFoundPage.tsx` with 404 message and navigation back link
    - _Requirements: 1.4_

- [x] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement public questionnaire pages (Steps 1–4)
  - [x] 7.1 Implement IntroPage (Step 1 – Mulai)
    - Create `resources/js/pages/IntroPage.tsx`
    - Render institutional header card (ITB logo, university, faculty, program, address)
    - Render research title, researcher name, supervisor names
    - Render "Deskripsi Singkat", "Estimasi Waktu", "Alur Pengisian" cards
    - Render eligibility question with "Pernah"/"Tidak Pernah" buttons
    - Enable "Mulai Kuesioner" button only when "Pernah" selected
    - Show ineligibility message when "Tidak Pernah" selected
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

  - [x] 7.2 Implement ConsentPage (Step 2 – Persetujuan)
    - Create `resources/js/pages/ConsentPage.tsx`
    - Render information cards: Tujuan Penelitian, Kerahasiaan Data, Partisipasi Sukarela
    - Render consent checkbox with agreement statement
    - Disable "Lanjutkan" button when checkbox unchecked; enable when checked
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 7.3 Implement IdentityPage (Step 3 – Identitas)
    - Create `resources/js/pages/IdentityPage.tsx`
    - Render text inputs: Nama (required), Perusahaan/Instansi (required), No. Telepon (optional), Email (optional)
    - Render radio groups: Kelompok Umur, Pendidikan, Posisi Stakeholder (with Owner/Kontraktor sub-groups), Pengalaman Konstruksi, Pengalaman Proyek DB, Fase Paling Terlibat, Sektor Proyek
    - Enable "Lainnya" text input when selected under Kontraktor
    - Show inline validation errors for required fields on proceed attempt
    - Use beige/cream (#F3F0EA) background for inputs and radio cards
    - Wire all fields to FormContext dispatch
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 6.11, 6.12_

  - [x] 7.4 Implement AssessmentIntroPage (Step 4 – Penilaian)
    - Create `resources/js/pages/AssessmentIntroPage.tsx`
    - Render Probability scale card (0–5 with labels) with blue tint
    - Render Impact scale card (0–5 with labels) with teal tint
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 7.5 Write unit tests for Steps 1–4
    - Test IntroPage eligibility flow (button enable/disable)
    - Test ConsentPage checkbox enables continue
    - Test IdentityPage validation errors
    - Test AssessmentIntroPage renders scale cards
    - _Requirements: 4.7, 4.8, 5.3, 5.4, 6.11_

- [x] 8. Implement API service layer
  - [x] 8.1 Create API client with axios
    - Create `resources/js/services/api.ts` with axios instance
    - Configure base URL from environment variable
    - Implement request interceptor to attach auth token to admin-scoped requests
    - Implement response interceptor for 401 handling (clear token, trigger login modal)
    - Define `ApiError` class with status, code, and message
    - _Requirements: 20.1, 20.3, 20.4, 20.5_

  - [x] 8.2 Implement API service functions
    - `fetchQuestions(phase: PhaseKey): Promise<QuestionsResponse>` — fetch risk indicators per phase
    - `submitQuestionnaire(payload: SubmissionPayload): Promise<SubmissionResponse>` — submit all answers
    - `login(username: string, password: string): Promise<LoginResponse>` — admin authentication
    - `fetchDashboardStats(): Promise<DashboardStats>` — dashboard statistics
    - `fetchRespondents(phase?: PhaseKey): Promise<RespondentRow[]>` — respondent list
    - `downloadExcel(phase: PhaseKey | 'open'): void` — trigger file download
    - `resetPhaseData(phase: PhaseKey): Promise<void>` — delete phase data
    - `fetchRiskMatrix(phase: PhaseKey): Promise<RiskMatrixCell[]>` — risk matrix data
    - `fetchAverageScores(phase: PhaseKey): Promise<IndicatorScore[]>` — average scores
    - _Requirements: 20.2_

  - [ ]* 8.3 Write property test for API error propagation (Property 13)
    - **Property 13: API Error Propagation**
    - **Validates: Requirements 20.3, 20.4**

  - [ ]* 8.4 Write property test for auth token attachment (Property 15)
    - **Property 15: Auth Token Attachment**
    - **Validates: Requirements 20.5**

- [x] 9. Implement phase assessment pages (Steps 5–9)
  - [x] 9.1 Create MatrixTable component
    - Create `resources/js/components/MatrixTable.tsx`
    - Render table with columns: row number, question text, 6 probability radios (0–5), 6 impact radios (0–5)
    - Display filled blue circle for selected probability, filled teal circle for selected impact
    - Apply alternating row backgrounds (white / beige #f3ece5)
    - Display completion summary (rated count / total for probability and impact)
    - Implement card-based vertical layout for viewports below 768px
    - Show error message with retry button on question fetch failure
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.8, 8.9_

  - [ ]* 9.2 Write property test for matrix table structure (Property 5)
    - **Property 5: Matrix Table Structure Invariant**
    - **Validates: Requirements 8.2, 8.5**

  - [ ]* 9.3 Write property test for matrix selection visual feedback (Property 6)
    - **Property 6: Matrix Selection Visual Feedback**
    - **Validates: Requirements 8.3, 8.4**

  - [ ]* 9.4 Write property test for matrix completion tracking (Property 7)
    - **Property 7: Matrix Completion Tracking**
    - **Validates: Requirements 8.6, 8.7**

  - [x] 9.5 Create PhasePage component
    - Create `resources/js/pages/PhasePage.tsx`
    - Extract `phaseKey` from route params
    - Fetch questions from API on mount
    - Pass questions and answers to MatrixTable
    - Wire answer selections to FormContext dispatch (SET_ANSWER)
    - Handle loading and error states
    - _Requirements: 8.1, 8.7_

  - [x] 9.6 Implement OpenQuestionPage
    - Create `resources/js/pages/OpenQuestionPage.tsx`
    - Render textarea fields for open-ended questions
    - Display character count guidance
    - Wire to FormContext (SET_OPEN_QUESTION)
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 9.7 Implement CompletionPage (Step 10 – Selesai)
    - Create `resources/js/pages/CompletionPage.tsx`
    - Submit all Form_Store data to API on reaching this step
    - Display thank-you message on success
    - Display error message with retry button on failure
    - Disable backward navigation after successful submission
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Implement admin dashboard
  - [x] 11.1 Create AdminLoginModal component
    - Create `resources/js/components/AdminLoginModal.tsx`
    - Render modal with username and password fields
    - Call AuthContext login on submit
    - Display error message on authentication failure
    - Navigate to admin dashboard on success
    - Trigger modal from Admin button in PublicHeader
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [x] 11.2 Implement AdminDashboardPage with stat cards and tabs
    - Create `resources/js/pages/AdminDashboardPage.tsx`
    - Fetch and display stat cards: Total Responden, per-Phase counts
    - Implement tab navigation to filter by Phase
    - Render "Download Data Excel" buttons per Phase and for open questions
    - _Requirements: 13.1, 13.2, 13.3, 13.5_

  - [x] 11.3 Create RespondentTable component
    - Create `resources/js/components/admin/RespondentTable.tsx`
    - Render table with columns: #, Nama, Instansi, Posisi, Pendidikan, Pengalaman, Sektor, Waktu
    - Fetch respondent data filtered by active tab/phase
    - _Requirements: 13.4_

  - [x] 11.4 Create RiskMatrix visualization component
    - Create `resources/js/components/admin/RiskMatrix.tsx`
    - Render 5×6 grid per Phase
    - Color-code cells: gray (0), green (1–4), yellow (5–9), orange (10–15), red (16–25)
    - Display indicator count in each cell
    - _Requirements: 14.1, 14.2, 14.3_

  - [ ]* 11.5 Write property test for risk level color mapping (Property 8)
    - **Property 8: Risk Level Color Mapping**
    - **Validates: Requirements 14.2, 15.3**

  - [ ]* 11.6 Write property test for risk matrix cell distribution (Property 9)
    - **Property 9: Risk Matrix Cell Distribution**
    - **Validates: Requirements 14.3**

  - [x] 11.7 Create AverageScoreTable component
    - Create `resources/js/components/admin/AverageScoreTable.tsx`
    - Render table with columns: #, Aspek, Indikator Risiko, Avg Probability, Avg Severity, Avg Score
    - Render progress bar in Avg Score column (width = score/25 × 100%)
    - Color progress bar per risk level color scheme
    - _Requirements: 15.1, 15.2, 15.3_

  - [ ]* 11.8 Write property test for progress bar score representation (Property 10)
    - **Property 10: Progress Bar Score Representation**
    - **Validates: Requirements 15.2**

  - [x] 11.9 Create ResetDataSection component
    - Create `resources/js/components/admin/ResetDataSection.tsx`
    - Render per-Phase reset buttons
    - Show confirmation dialog warning irreversibility
    - Call API delete on confirmation
    - _Requirements: 16.1, 16.2, 16.3_

- [x] 12. Implement responsive design and final polish
  - [x] 12.1 Apply responsive breakpoints and grid system
    - Configure Tailwind breakpoints: 768px (tablet), 1200px (desktop)
    - Apply mobile-first layout: 16px margins / 4-col (mobile), 24px / 8-col (tablet), 40px / 12-col / max-w-1200px (desktop)
    - Ensure all interactive elements have 44×44px minimum touch targets on mobile
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

  - [x] 12.2 Wire App component with all providers and router
    - Create final `resources/js/App.tsx` composing ThemeProvider → I18nProvider → AuthProvider → FormProvider → RouterProvider
    - Ensure provider nesting order matches design hierarchy
    - Add ErrorBoundary wrapper at top level
    - _Requirements: 1.1, 18.1, 19.1_

  - [ ]* 12.3 Write integration tests for questionnaire flow
    - Test full flow from Step 1 to Step 10 with MSW-mocked API
    - Test backward navigation preserves form state
    - Test submission success and error scenarios
    - _Requirements: 10.1, 10.2, 10.3, 11.1, 11.2_

  - [ ]* 12.4 Write integration tests for admin dashboard
    - Test login flow and dashboard data loading
    - Test Excel download triggering
    - Test data reset with confirmation
    - _Requirements: 12.1, 12.2, 13.1, 16.1_

- [x] 13. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The API service layer uses MSW for testing; actual backend endpoints are developed by a teammate
- All components use Tailwind CSS 4 utility classes with design tokens defined in `@theme`
- Translation dictionaries can start with key UI strings and be expanded incrementally

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3"] },
    { "id": 2, "tasks": ["2.1", "2.3", "2.5", "2.6"] },
    { "id": 3, "tasks": ["2.2", "2.4", "2.7", "2.8", "4.1", "4.2", "4.3"] },
    { "id": 4, "tasks": ["4.4", "5.1", "5.4", "5.5", "5.7", "5.8"] },
    { "id": 5, "tasks": ["5.2", "5.3", "5.6", "8.1"] },
    { "id": 6, "tasks": ["7.1", "7.2", "7.3", "7.4", "8.2"] },
    { "id": 7, "tasks": ["7.5", "8.3", "8.4", "9.1"] },
    { "id": 8, "tasks": ["9.2", "9.3", "9.4", "9.5", "9.6", "9.7"] },
    { "id": 9, "tasks": ["11.1", "11.2", "11.3", "11.4", "11.7", "11.9"] },
    { "id": 10, "tasks": ["11.5", "11.6", "11.8", "12.1", "12.2"] },
    { "id": 11, "tasks": ["12.3", "12.4"] }
  ]
}
```
