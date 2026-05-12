# 📋 Project Specification: Risk Assessment Web Questionnaire

## 1. Project Overview

This project is a web-based questionnaire application for **Risk Assessment**. The system utilizes a hierarchical structure: **Section (Project Phase)** > **Aspect (Evaluation Category)** > **Risk Indicator**.

Respondents evaluate identical risk indicators across five project phases using two primary metrics: **Probability (Likelihood)** and **Impact (Criticality)** on a scale of 0-5. The application also captures qualitative data through open-ended questions and provides a secure Admin Dashboard for managing data and viewing analytics.

---

## 2. Database Design

### A. Table: `users` (Admin Accounts)

| Column       | Type      | Constraints      | Description          |
| :----------- | :-------- | :--------------- | :------------------- |
| `id`         | BigInt    | Primary Key, AI  |                      |
| `name`       | String    | Not Null         | Admin Name           |
| `email`      | String    | Unique, Not Null | Login Email          |
| `password`   | String    | Not Null         | Hashed Password      |
| `created_at` | Timestamp |                  | Record Creation Time |

### B. Table: `question_sections` (Phases)

| Column  | Type    | Constraints     | Description                     |
| :------ | :------ | :-------------- | :------------------------------ |
| `id`    | BigInt  | Primary Key, AI |                                 |
| `name`  | String  | Not Null        | Phase name (e.g., "INITIATION") |
| `order` | Integer | Not Null        | Display order in UI (1-5)       |

### C. Table: `aspects` (Evaluation Categories)

| Column  | Type    | Constraints     | Description                      |
| :------ | :------ | :-------------- | :------------------------------- |
| `id`    | BigInt  | Primary Key, AI |                                  |
| `name`  | String  | Not Null        | e.g., "Regulasi dan Kelembagaan" |
| `order` | Integer | Not Null        | Display order in UI              |

### D. Table: `risk_indicators` (Master Questions)

| Column           | Type    | Constraints     | Description                |
| :--------------- | :------ | :-------------- | :------------------------- |
| `id`             | BigInt  | Primary Key, AI |                            |
| `aspect_id`      | BigInt  | Foreign Key     | Relation to `aspects`      |
| `indicator_text` | Text    | Not Null        | Risk indicator description |
| `order`          | Integer | Not Null        | Sequence within the Aspect |

### E. Table: `open_questions` (Qualitative Questions)

| Column          | Type    | Constraints     | Description         |
| :-------------- | :------ | :-------------- | :------------------ |
| `id`            | BigInt  | Primary Key, AI |                     |
| `question_text` | Text    | Not Null        | Open-ended question |
| `order`         | Integer | Not Null        | Sequence (1, 2, 3)  |

### F. Table: `respondents`

| Column        | Type      | Constraints     | Description              |
| :------------ | :-------- | :-------------- | :----------------------- |
| `id`          | BigInt    | Primary Key, AI | Corresponds to '#' in UI |
| `name`        | String    | Not Null        | Nama                     |
| `institution` | String    | Not Null        | Instansi                 |
| `position`    | String    | Not Null        | Posisi                   |
| `education`   | String    | Not Null        | Pendidikan               |
| `experience`  | String    | Not Null        | Pengalaman               |
| `sector`      | String    | Not Null        | Sektor                   |
| `created_at`  | Timestamp |                 | Waktu (Submission Time)  |

### G. Table: `scored_answers` (Quantitative)

| Column              | Type    | Constraints     | Description                |
| :------------------ | :------ | :-------------- | :------------------------- |
| `id`                | BigInt  | Primary Key, AI |                            |
| `respondent_id`     | BigInt  | Foreign Key     | Relation to `respondents`  |
| `section_id`        | BigInt  | Foreign Key     | Phase being evaluated      |
| `indicator_id`      | BigInt  | Foreign Key     | Risk Indicator being rated |
| `probability_score` | TinyInt | 0-5             | Likelihood value           |
| `impact_score`      | TinyInt | 0-5             | Criticality value          |

### H. Table: `open_answers` (Qualitative)

| Column             | Type   | Constraints     | Description                  |
| :----------------- | :----- | :-------------- | :--------------------------- |
| `id`               | BigInt | Primary Key, AI |                              |
| `respondent_id`    | BigInt | Foreign Key     | Relation to `respondents`    |
| `open_question_id` | BigInt | Foreign Key     | Relation to `open_questions` |
| `answer_text`      | Text   | Not Null        | Long text response           |

---

## 3. Implementation Steps

### Step 1: Foundation (Database & Models)

-   Use Laravel's default migration for the `users` table.
-   Generate migrations for the core tables defined in Section 2.
-   Define Eloquent relationships:
    -   `Section` hasMany `ScoredAnswer`
    -   `Aspect` hasMany `RiskIndicator`
    -   `RiskIndicator` hasMany `ScoredAnswer`
    -   `Respondent` hasMany `ScoredAnswer` and `OpenAnswer`
-   Ensure foreign keys include `onDelete('cascade')` for data integrity.

### Step 2: Content Initialization (Seeders)

-   **AdminSeeder:** Create a default admin user for initial login.
-   **SectionSeeder:** Populate the 5 project phases:
    1. INITIATION (IDEA)
    2. PLANNING
    3. DESIGN DEVELOPMENT
    4. EXECUTION
    5. O&M
-   **AspectSeeder:** Populate the 8 specific categories:
    1. Regulasi dan Kelembagaan
    2. Kualitas Persiapan dan Data Dasar Proyek
    3. Tender dan Kontrak
    4. Basic Design dan KAK
    5. Kompetensi
    6. Desain dan Teknologi
    7. Perubahan
    8. Finansial
-   **OpenQuestionSeeder:** Populate the 3 open-ended questions:
    1. Most significant risk in Design and Build?
    2. Suggestions for mitigation?
    3. Other risks not covered?
