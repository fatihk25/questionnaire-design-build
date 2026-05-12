/**
 * English (EN) translation dictionary.
 */
import type { TranslationKeys } from './keys';

export const en: TranslationKeys = {
  // Navigation & Header
  'app.title': 'Design and Build Questionnaire',
  'header.darkMode': 'Dark Mode',
  'header.lightMode': 'Light Mode',
  'header.language': 'Language',
  'header.admin': 'Admin',

  // Stepper
  'stepper.step': 'Step',
  'stepper.of': 'of',
  'stepper.stepOf': 'Step {current} of {total}',
  'step.1': 'Start',
  'step.2': 'Consent',
  'step.3': 'Identity',
  'step.4': 'Assessment',
  'step.5': 'Idea',
  'step.6': 'Planning',
  'step.7': 'Design',
  'step.8': 'Construction',
  'step.9': 'O&M',
  'step.10': 'Finish',

  // Buttons
  'button.next': 'Continue',
  'button.previous': 'Back',
  'button.submit': 'Submit',
  'button.retry': 'Retry',
  'button.start': 'Start Questionnaire',
  'button.download': 'Download Excel Data',
  'button.reset': 'Reset Data',
  'button.login': 'Login',
  'button.logout': 'Logout',
  'button.close': 'Close',
  'button.confirm': 'Confirm',
  'button.cancel': 'Cancel',

  // Step 1 - Intro
  'intro.university': 'Institut Teknologi Bandung',
  'intro.faculty': 'Faculty of Civil and Environmental Engineering',
  'intro.program': 'Master of Civil Engineering Program',
  'intro.description': 'Brief Description',
  'intro.duration': 'Estimated Time',
  'intro.durationValue': '10–15 minutes',
  'intro.flow': 'Questionnaire Flow',
  'intro.eligibility': 'Have you been involved in a Design and Build project?',
  'intro.eligible': 'Yes',
  'intro.notEligible': 'No',
  'intro.notEligibleMessage': 'This questionnaire is intended for respondents with Design and Build project experience.',

  // Step 2 - Consent
  'consent.title': 'Consent',
  'consent.purpose': 'Research Purpose',
  'consent.privacy': 'Data Confidentiality',
  'consent.voluntary': 'Voluntary Participation',
  'consent.agree': 'I agree to participate in this research',

  // Step 3 - Identity
  'identity.title': 'Respondent Identity',
  'identity.name': 'Respondent Name',
  'identity.company': 'Company/Institution Name',
  'identity.phone': 'Phone Number',
  'identity.email': 'Email',
  'identity.ageGroup': 'Age Group',
  'identity.education': 'Highest Education Level',
  'identity.position': 'Stakeholder Position',
  'identity.positionOther': 'Other',
  'identity.constructionExp': 'Construction Experience',
  'identity.dbExp': 'Design & Build Project Experience (times involved)',
  'identity.mostInvolvedPhase': 'Most Frequently Involved DB Project Phase',
  'identity.sector': 'Project Sector',

  // Step 4 - Assessment
  'assessment.title': 'Assessment',
  'assessment.probability': 'Probability',
  'assessment.impact': 'Impact',
  'assessment.scale': 'Rating Scale',

  // Matrix Table
  'matrix.no': 'No.',
  'matrix.question': 'Question',
  'matrix.probability': 'Probability (0–5)',
  'matrix.impact': 'Impact (0–5)',
  'matrix.completion': '{answered} of {total} answered',

  // Step 10 - Completion
  'completion.title': 'Thank You!',
  'completion.success': 'Your responses have been submitted successfully.',
  'completion.error': 'An error occurred while submitting your responses.',

  // Errors
  'error.required': 'This field is required',
  'error.network': 'A network error occurred. Please try again.',
  'error.fetchQuestions': 'Failed to load questions.',
  'error.submission': 'Failed to submit responses.',
  'error.login': 'Invalid username or password.',
  'error.notFound': 'Page not found',

  // Admin
  'admin.dashboard': 'Admin Dashboard',
  'admin.totalRespondents': 'Total Respondents',
  'admin.loginTitle': 'Admin Login',
  'admin.username': 'Username',
  'admin.password': 'Password',
  'admin.resetConfirm': 'Are you sure you want to reset the data? This action cannot be undone.',
  'admin.resetTitle': 'Reset Data',
  'admin.resetSuccess': 'Data has been reset successfully.',
  'admin.resetError': 'Failed to reset data. Please try again.',
  'admin.respondentTable': 'Respondent List',
  'admin.tab.all': 'All',
  'admin.phase.inisiasi': 'Initiation',
  'admin.phase.perencanaan': 'Planning',
  'admin.phase.perancangan': 'Design',
  'admin.phase.pelaksanaan': 'Construction',
  'admin.phase.penggunaan': 'Operation & Maintenance',
  'admin.downloadOpen': 'Download Open Questions',

  // Footer
  'footer.copyright': '© 2025 Della Ayu Adinanda',

  // Open Questions
  'openQuestion.title': 'Open Questions',
  'openQuestion.subtitle': 'Please provide your answers to the following questions (max. 500 characters).',
  'openQuestion.placeholder': 'Write your answer here...',

  // 404
  'notFound.title': '404 - Page Not Found',
  'notFound.message': 'The page you are looking for is not available.',
  'notFound.backHome': 'Back to Home',
};
