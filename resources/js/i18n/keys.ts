/**
 * Type-safe translation key definitions.
 * All translation dictionaries must implement this interface.
 */

export type TranslationKey =
  // Navigation & Header
  | 'app.title'
  | 'header.darkMode'
  | 'header.lightMode'
  | 'header.language'
  | 'header.admin'

  // Stepper
  | 'stepper.step'
  | 'stepper.of'
  | 'stepper.stepOf'
  | 'step.1'
  | 'step.2'
  | 'step.3'
  | 'step.4'
  | 'step.5'
  | 'step.6'
  | 'step.7'
  | 'step.8'
  | 'step.9'
  | 'step.10'

  // Buttons
  | 'button.next'
  | 'button.previous'
  | 'button.submit'
  | 'button.retry'
  | 'button.start'
  | 'button.download'
  | 'button.reset'
  | 'button.login'
  | 'button.logout'
  | 'button.close'
  | 'button.confirm'
  | 'button.cancel'

  // Step 1 - Intro
  | 'intro.university'
  | 'intro.faculty'
  | 'intro.program'
  | 'intro.description'
  | 'intro.duration'
  | 'intro.durationValue'
  | 'intro.flow'
  | 'intro.eligibility'
  | 'intro.eligible'
  | 'intro.notEligible'
  | 'intro.notEligibleMessage'

  // Step 2 - Consent
  | 'consent.title'
  | 'consent.purpose'
  | 'consent.privacy'
  | 'consent.voluntary'
  | 'consent.agree'

  // Step 3 - Identity
  | 'identity.title'
  | 'identity.name'
  | 'identity.company'
  | 'identity.phone'
  | 'identity.email'
  | 'identity.ageGroup'
  | 'identity.education'
  | 'identity.position'
  | 'identity.positionOther'
  | 'identity.constructionExp'
  | 'identity.dbExp'
  | 'identity.mostInvolvedPhase'
  | 'identity.sector'

  // Step 4 - Assessment
  | 'assessment.title'
  | 'assessment.probability'
  | 'assessment.impact'
  | 'assessment.scale'

  // Matrix Table
  | 'matrix.no'
  | 'matrix.question'
  | 'matrix.probability'
  | 'matrix.impact'
  | 'matrix.completion'

  // Step 10 - Completion
  | 'completion.title'
  | 'completion.success'
  | 'completion.error'

  // Errors
  | 'error.required'
  | 'error.network'
  | 'error.fetchQuestions'
  | 'error.submission'
  | 'error.login'
  | 'error.notFound'

  // Admin
  | 'admin.dashboard'
  | 'admin.totalRespondents'
  | 'admin.loginTitle'
  | 'admin.username'
  | 'admin.password'
  | 'admin.resetConfirm'
  | 'admin.resetTitle'
  | 'admin.resetSuccess'
  | 'admin.resetError'
  | 'admin.respondentTable'
  | 'admin.tab.all'
  | 'admin.phase.inisiasi'
  | 'admin.phase.perencanaan'
  | 'admin.phase.perancangan'
  | 'admin.phase.pelaksanaan'
  | 'admin.phase.penggunaan'
  | 'admin.downloadOpen'

  // Footer
  | 'footer.copyright'

  // Open Questions
  | 'openQuestion.title'
  | 'openQuestion.subtitle'
  | 'openQuestion.placeholder'

  // 404
  | 'notFound.title'
  | 'notFound.message'
  | 'notFound.backHome';

/**
 * Translation dictionary type — maps every key to a string value.
 */
export type TranslationKeys = Record<TranslationKey, string>;
