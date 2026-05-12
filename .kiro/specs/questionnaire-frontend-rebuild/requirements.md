# Requirements Document

## Introduction

This document specifies the frontend requirements for rebuilding the "Kuesioner Design and Build" questionnaire website. The application is a single-page application (SPA) built with React 19, TypeScript, Tailwind CSS 4, and React Router DOM, served within a Laravel 12 shell. The frontend handles a 10-step public questionnaire flow for collecting risk assessment data on Design and Build construction projects, and an admin dashboard for viewing and managing responses. The backend API is developed separately by a teammate; this spec covers only the frontend layer.

## Glossary

- **App**: The root React SPA rendered at the `resources/js/app.tsx` entry point
- **Questionnaire_Flow**: The 10-step public-facing stepper form for respondents
- **Stepper**: The horizontal progress indicator component showing completed, active, and upcoming steps
- **Matrix_Table**: The assessment grid where respondents rate Probability (0–5) and Impact (0–5) for each risk indicator
- **Admin_Dashboard**: The protected section for viewing respondent data, risk matrices, and average scores
- **Router**: The React Router DOM instance managing client-side navigation
- **Theme_Provider**: The context provider managing dark mode and language state
- **Form_Store**: The client-side state container holding all questionnaire answers across steps
- **API_Client**: The HTTP abstraction layer for communicating with the Laravel backend
- **Respondent**: A user filling out the public questionnaire
- **Administrator**: A user with credentials to access the Admin_Dashboard
- **Phase**: One of the five project lifecycle stages assessed (Inisiasi, Perencanaan, Perancangan Desain, Pelaksanaan, Penggunaan)
- **Risk_Indicator**: A single question/statement within a Phase that the Respondent rates
- **i18n_Provider**: The internationalization context providing translated strings for ID and EN locales

## Requirements

### Requirement 1: Application Shell and Routing

**User Story:** As a developer, I want a well-structured SPA with client-side routing, so that the application navigates between questionnaire steps and admin pages without full page reloads.

#### Acceptance Criteria

1. THE App SHALL render within the Laravel Blade template using the Vite-compiled `resources/js/app.tsx` entry point
2. THE Router SHALL define routes for each of the 10 questionnaire steps, the admin dashboard, and a 404 fallback page
3. WHEN a Respondent navigates directly to a questionnaire step URL, THE Router SHALL render the corresponding step component
4. WHEN a Respondent navigates to an undefined route, THE Router SHALL render a 404 Not Found page
5. THE App SHALL use the `@` path alias resolving to `resources/js` for all internal imports

### Requirement 2: Public Layout and Header

**User Story:** As a respondent, I want a consistent header and footer across all public pages, so that I can identify the application and access global controls.

#### Acceptance Criteria

1. THE PublicHeader SHALL display the application title "Kuesioner Design and Build" with a domain icon on a teal (#1c6775) background
2. THE PublicHeader SHALL include a dark mode toggle button, a language switcher (ID/EN), and an Admin access button
3. WHEN the dark mode toggle is activated, THE Theme_Provider SHALL apply the `dark` class to the document root element
4. WHEN the language switcher is toggled, THE i18n_Provider SHALL switch all translatable UI strings between Indonesian and English
5. THE PublicFooter SHALL display copyright text "© 2025 Della Ayu Adinanda" centered at the bottom of the page
6. THE PublicHeader SHALL remain sticky at the top of the viewport during scrolling

### Requirement 3: Stepper Navigation

**User Story:** As a respondent, I want to see my progress through the questionnaire, so that I know how many steps remain.

#### Acceptance Criteria

1. THE Stepper SHALL display 10 labeled steps: Mulai, Persetujuan, Identitas, Penilaian, Idea, Planning, Design, Construction, O&M, Selesai
2. THE Stepper SHALL render completed steps with a green (#2e7d32) circle containing a check icon
3. THE Stepper SHALL render the active step with a blue (#025695) circle containing the step number and a ring indicator
4. THE Stepper SHALL render upcoming steps with a gray circle containing the step number
5. THE Stepper SHALL display "Langkah X dari 10" text below the step indicators
6. WHILE the viewport width is below 768px, THE Stepper SHALL collapse into a compact mobile representation showing only the progress bar and current step label
7. THE Stepper SHALL be visible on all questionnaire steps except Step 1 (Mulai)

### Requirement 4: Step 1 – Mulai (Introduction)

**User Story:** As a respondent, I want to understand the research context and confirm my eligibility, so that I can decide whether to participate.

#### Acceptance Criteria

1. THE App SHALL render an institutional header card displaying the ITB logo, university name, faculty, program, and address
2. THE App SHALL render the research title, researcher name, and supervisor names
3. THE App SHALL render a "Deskripsi Singkat" card explaining the questionnaire purpose
4. THE App SHALL render an "Estimasi Waktu" card indicating 10–15 minutes
5. THE App SHALL render an "Alur Pengisian" card listing the questionnaire flow steps
6. THE App SHALL render an eligibility question with "Pernah" and "Tidak Pernah" buttons
7. WHEN the Respondent selects "Pernah", THE App SHALL enable the "Mulai Kuesioner" button to proceed to Step 2
8. WHEN the Respondent selects "Tidak Pernah", THE App SHALL display a message indicating the questionnaire is intended for respondents with Design and Build experience

### Requirement 5: Step 2 – Persetujuan (Consent)

**User Story:** As a respondent, I want to understand the research terms before consenting, so that I can make an informed decision to participate.

#### Acceptance Criteria

1. THE App SHALL render information cards for: Tujuan Penelitian, Kerahasiaan Data, and Partisipasi Sukarela
2. THE App SHALL render a consent checkbox with the statement of agreement
3. WHEN the consent checkbox is unchecked, THE App SHALL disable the "Lanjutkan" (Continue) button
4. WHEN the consent checkbox is checked, THE App SHALL enable the "Lanjutkan" button to proceed to Step 3

### Requirement 6: Step 3 – Identitas (Identity Form)

**User Story:** As a respondent, I want to provide my professional identity, so that the researcher can categorize my responses.

#### Acceptance Criteria

1. THE App SHALL render text input fields for: Nama Responden (required), Nama Perusahaan/Instansi (required), No. Telepon (optional, placeholder "08xx-xxxx-xxxx"), and Email (optional, placeholder "email@domain.com")
2. THE App SHALL render radio group for Kelompok Umur with options: < 20, 21–35, 36–50, > 50
3. THE App SHALL render radio group for Tingkat Pendidikan Terakhir with options: Diploma/Sarjana (D3/S1), Pascasarjana (S2/S3)
4. THE App SHALL render radio group for Posisi Stakeholder with two labeled sub-groups: Owner (Pemilik Proyek, Pejabat Pembuat Komitmen/PPK, Unit Teknis/Satker/Balai/Direktorat, Tim Teknis/Pengelola Proyek) and Kontraktor (Project Manager/PM, Site Administrator Manager/SAM, Site Engineering Manager/SEM, Site Operational Manager/SOM, Lainnya with adjacent text input)
5. WHEN the Respondent selects "Lainnya" under Kontraktor, THE App SHALL enable a text input field adjacent to the radio option for specifying the custom position
6. THE App SHALL render radio group for Pengalaman Konstruksi with options: < 3 tahun, 3–5 tahun, 6–10 tahun, > 10 tahun
7. THE App SHALL render radio group for Pengalaman Proyek DB (berapa kali terlibat) with options: 1–2 kali, 3–4 kali, > 5 kali
8. THE App SHALL render radio group for Fase Proyek DB Paling Sering Terlibat with options: Inisiasi (Idea), Perencanaan (Planning), Perancangan Desain (Design), Pelaksanaan (Construction), Penggunaan (Operation and Maintenance)
9. THE App SHALL render radio group for Sektor Proyek with options: Proyek Pemerintah, Proyek Swasta Nasional, Proyek Kerjasama Pemerintah-Swasta (PPP/KPBU), Proyek dengan Pendanaan Internasional
10. THE Form_Store SHALL persist all identity field values across step navigation
11. IF a required field (Nama, Perusahaan/Instansi) is left empty when the Respondent attempts to proceed, THEN THE App SHALL display an inline validation error message below the field
12. THE App SHALL use beige/cream (#F3F0EA) background styling for input fields and radio option cards

### Requirement 7: Step 4 – Penilaian (Assessment Instructions)

**User Story:** As a respondent, I want to understand the rating scales before assessing, so that I can provide accurate ratings.

#### Acceptance Criteria

1. THE App SHALL render a Probability scale explanation showing values 0–5 with labels: Tidak Pernah, Jarang, Kecil Kemungkinan, Mungkin, Mungkin Besar, Hampir Pasti
2. THE App SHALL render an Impact scale explanation showing values 0–5 with labels: Tidak Ada Dampak, Tidak Parah, Kecil, Sedang, Besar, Sangat Parah
3. THE App SHALL render the scale explanations in visually distinct cards with color coding (blue tint for Probability, teal tint for Impact)

### Requirement 8: Steps 5–9 – Phase Assessment (Matrix Tables)

**User Story:** As a respondent, I want to rate each risk indicator for probability and impact, so that the researcher can analyze risk levels per phase.

#### Acceptance Criteria

1. THE Matrix_Table SHALL fetch Risk_Indicator questions from the API_Client for the current Phase
2. THE Matrix_Table SHALL render a table with columns: row number, question text, 6 Probability radio options (0–5), and 6 Impact radio options (0–5)
3. WHEN the Respondent selects a Probability value, THE Matrix_Table SHALL display a filled blue circle with the selected number in the corresponding cell
4. WHEN the Respondent selects an Impact value, THE Matrix_Table SHALL display a filled teal circle with the selected number in the corresponding cell
5. THE Matrix_Table SHALL apply alternating row backgrounds (white and beige #f3ece5) for visual tracking
6. THE Matrix_Table SHALL display a completion summary showing the count of rated items versus total items for both Probability and Impact
7. THE Form_Store SHALL store answers using the key structure `answers[phase_key][question_id][probability]` and `answers[phase_key][question_id][impact]`
8. WHILE the viewport width is below 768px, THE Matrix_Table SHALL render in a card-based vertical layout instead of a horizontal table
9. IF the API_Client fails to fetch questions, THEN THE App SHALL display an error message with a retry button

### Requirement 9: Open Question Step

**User Story:** As a respondent, I want to provide free-text feedback, so that I can share qualitative insights beyond the structured ratings.

#### Acceptance Criteria

1. THE App SHALL render one or more textarea fields for open-ended questions
2. THE Form_Store SHALL persist open question responses across step navigation
3. THE App SHALL display character count or guidance for each textarea field

### Requirement 10: Step 10 – Selesai (Completion)

**User Story:** As a respondent, I want confirmation that my submission was successful, so that I know my participation is complete.

#### Acceptance Criteria

1. WHEN the Respondent reaches the final step, THE App SHALL submit all Form_Store data to the API_Client
2. WHEN the submission succeeds, THE App SHALL display a thank-you message confirming successful submission
3. IF the submission fails, THEN THE App SHALL display an error message and provide a retry button
4. THE App SHALL disable backward navigation after successful submission

### Requirement 11: Form State Management

**User Story:** As a respondent, I want my answers preserved when navigating between steps, so that I do not lose progress.

#### Acceptance Criteria

1. THE Form_Store SHALL maintain all questionnaire answers in memory across step transitions
2. WHEN the Respondent navigates backward to a previous step, THE Form_Store SHALL restore previously entered values into the form fields
3. THE Form_Store SHALL expose a typed TypeScript interface defining the complete questionnaire data shape
4. THE Form_Store SHALL provide validation status per step to enable or disable the "Lanjutkan" button

### Requirement 12: Admin Authentication

**User Story:** As an administrator, I want to log in securely, so that I can access the dashboard.

#### Acceptance Criteria

1. WHEN the Admin button in the header is clicked, THE App SHALL display a modal dialog with username and password fields
2. WHEN valid credentials are submitted, THE API_Client SHALL send a login request and store the authentication token
3. WHEN authentication succeeds, THE Router SHALL navigate to the Admin_Dashboard route
4. IF authentication fails, THEN THE App SHALL display an error message within the modal
5. WHILE the Administrator is not authenticated, THE Router SHALL redirect admin route access to the public questionnaire with the login modal displayed

### Requirement 13: Admin Dashboard – Overview and Data Export

**User Story:** As an administrator, I want to see response statistics and export data, so that I can analyze research results.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display stat cards showing: Total Responden, and response counts per Phase (Inisiasi, Perencanaan, Perancangan Desain, Pelaksanaan, Penggunaan)
2. THE Admin_Dashboard SHALL provide "Download Data Excel" buttons for each Phase and for open questions
3. WHEN a download button is clicked, THE API_Client SHALL initiate a file download from the backend endpoint
4. THE Admin_Dashboard SHALL display a respondent list table with columns: #, Nama, Instansi, Posisi, Pendidikan, Pengalaman, Sektor, Waktu
5. THE Admin_Dashboard SHALL provide tab navigation to filter the respondent table by Phase

### Requirement 14: Admin Dashboard – Risk Matrix Visualization

**User Story:** As an administrator, I want to see risk levels visualized in a matrix, so that I can quickly identify high-risk areas.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL render a 5×6 risk matrix grid per Phase
2. THE Admin_Dashboard SHALL color-code matrix cells using: gray (No Risk, score 0), green (Low, score 1–4), yellow (Medium, score 5–9), orange (High, score 10–15), red (Very High, score 16–25)
3. THE Admin_Dashboard SHALL display the count of indicators falling into each cell of the matrix

### Requirement 15: Admin Dashboard – Average Score Table

**User Story:** As an administrator, I want to see average scores per indicator, so that I can identify the most critical risk factors.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL render a table with columns: #, Aspek, Indikator Risiko, Avg Probability, Avg Severity, Avg Score
2. THE Admin_Dashboard SHALL display a progress bar in the Avg Score column representing the score relative to the maximum (25)
3. THE Admin_Dashboard SHALL color the progress bar according to the risk level color scheme

### Requirement 16: Admin Dashboard – Data Reset

**User Story:** As an administrator, I want to reset collected data per phase, so that I can manage the research data lifecycle.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL provide a reset data section with per-Phase reset buttons
2. WHEN a reset button is clicked, THE App SHALL display a confirmation dialog warning that the action is irreversible
3. WHEN the Administrator confirms the reset, THE API_Client SHALL send a delete request to the backend for the specified Phase

### Requirement 17: Responsive Design

**User Story:** As a respondent using a mobile device, I want the questionnaire to be usable on any screen size, so that I can participate from any device.

#### Acceptance Criteria

1. THE App SHALL implement a mobile-first responsive layout with breakpoints at 768px (tablet) and 1200px (desktop)
2. WHILE the viewport width is below 768px, THE App SHALL use 16px outer margins and a 4-column grid
3. WHILE the viewport width is between 768px and 1199px, THE App SHALL use 24px outer margins and an 8-column grid
4. WHILE the viewport width is 1200px or above, THE App SHALL use 40px outer margins and a 12-column grid with a maximum container width of 1200px
5. THE App SHALL ensure all interactive elements have a minimum touch target size of 44×44px on mobile viewports

### Requirement 18: Dark Mode Support

**User Story:** As a respondent, I want to switch to a dark color scheme, so that I can reduce eye strain in low-light environments.

#### Acceptance Criteria

1. THE Theme_Provider SHALL toggle dark mode by adding or removing the `dark` class on the HTML root element
2. WHEN dark mode is active, THE App SHALL apply inverse color tokens (inverse-surface, inverse-on-surface) to backgrounds and text
3. THE Theme_Provider SHALL persist the dark mode preference in localStorage
4. WHEN the App loads, THE Theme_Provider SHALL restore the previously saved dark mode preference

### Requirement 19: Internationalization Structure

**User Story:** As a respondent, I want to switch between Indonesian and English, so that I can use the questionnaire in my preferred language.

#### Acceptance Criteria

1. THE i18n_Provider SHALL maintain translation dictionaries for Indonesian (ID) and English (EN) locales
2. THE i18n_Provider SHALL expose a hook or function for components to retrieve translated strings by key
3. WHEN the language is switched, THE App SHALL re-render all translatable text without a page reload
4. THE i18n_Provider SHALL persist the language preference in localStorage
5. THE i18n_Provider SHALL default to Indonesian (ID) when no preference is stored

### Requirement 20: API Integration Layer

**User Story:** As a developer, I want a typed API abstraction, so that frontend components can communicate with the backend through well-defined interfaces.

#### Acceptance Criteria

1. THE API_Client SHALL define TypeScript interfaces for all request and response payloads
2. THE API_Client SHALL provide functions for: fetching questionnaire questions per Phase, submitting questionnaire answers, authenticating administrators, fetching dashboard statistics, fetching respondent lists, downloading Excel exports, and resetting Phase data
3. IF an API request returns a network error, THEN THE API_Client SHALL throw a typed error that components can handle
4. IF an API request returns a 401 Unauthorized response, THEN THE API_Client SHALL clear the stored authentication token and redirect to the login modal
5. THE API_Client SHALL attach the authentication token to all admin-scoped requests via an Authorization header

### Requirement 21: Design System Compliance

**User Story:** As a developer, I want components to follow the established design system, so that the UI is visually consistent with the reference baseline.

#### Acceptance Criteria

1. THE App SHALL use Playfair Display font for all headings (display-xl, headline-lg, headline-md) and Public Sans for all body text and UI labels
2. THE App SHALL apply 8px border radius to inputs and buttons, and 12px border radius to cards and modals
3. THE App SHALL use the primary color (#025695) for primary actions and active states, and secondary color (#1c6775) for the header background
4. THE App SHALL apply a soft shadow (0px 4px 20px rgba(0,0,0,0.05)) to card components
5. THE App SHALL use an 8px base spacing unit for consistent padding and margin values
