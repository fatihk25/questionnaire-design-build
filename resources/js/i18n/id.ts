/**
 * Indonesian (ID) translation dictionary.
 * Default locale for the application.
 */
import type { TranslationKeys } from './keys';

export const id: TranslationKeys = {
  // Navigation & Header
  'app.title': 'Kuesioner Design and Build',
  'header.darkMode': 'Mode Gelap',
  'header.lightMode': 'Mode Terang',
  'header.language': 'Bahasa',
  'header.admin': 'Admin',

  // Stepper
  'stepper.step': 'Langkah',
  'stepper.of': 'dari',
  'stepper.stepOf': 'Langkah {current} dari {total}',
  'step.1': 'Mulai',
  'step.2': 'Persetujuan',
  'step.3': 'Identitas',
  'step.4': 'Penilaian',
  'step.5': 'Idea',
  'step.6': 'Planning',
  'step.7': 'Design',
  'step.8': 'Construction',
  'step.9': 'O&M',
  'step.10': 'Selesai',

  // Buttons
  'button.next': 'Lanjutkan',
  'button.previous': 'Kembali',
  'button.submit': 'Kirim',
  'button.retry': 'Coba Lagi',
  'button.start': 'Mulai Kuesioner',
  'button.download': 'Download Data Excel',
  'button.reset': 'Reset Data',
  'button.login': 'Masuk',
  'button.logout': 'Keluar',
  'button.close': 'Tutup',
  'button.confirm': 'Konfirmasi',
  'button.cancel': 'Batal',

  // Step 1 - Intro
  'intro.university': 'Institut Teknologi Bandung',
  'intro.faculty': 'Fakultas Teknik Sipil dan Lingkungan',
  'intro.program': 'Program Studi Magister Teknik Sipil',
  'intro.description': 'Deskripsi Singkat',
  'intro.duration': 'Estimasi Waktu',
  'intro.durationValue': '10–15 menit',
  'intro.flow': 'Alur Pengisian',
  'intro.eligibility': 'Apakah Anda pernah terlibat dalam proyek Design and Build?',
  'intro.eligible': 'Pernah',
  'intro.notEligible': 'Tidak Pernah',
  'intro.notEligibleMessage': 'Kuesioner ini ditujukan untuk responden yang memiliki pengalaman dalam proyek Design and Build.',

  // Step 2 - Consent
  'consent.title': 'Persetujuan',
  'consent.purpose': 'Tujuan Penelitian',
  'consent.privacy': 'Kerahasiaan Data',
  'consent.voluntary': 'Partisipasi Sukarela',
  'consent.agree': 'Saya menyetujui untuk berpartisipasi dalam penelitian ini',

  // Step 3 - Identity
  'identity.title': 'Identitas Responden',
  'identity.name': 'Nama Responden',
  'identity.company': 'Nama Perusahaan/Instansi',
  'identity.phone': 'No. Telepon',
  'identity.email': 'Email',
  'identity.ageGroup': 'Kelompok Umur',
  'identity.education': 'Tingkat Pendidikan Terakhir',
  'identity.position': 'Posisi Stakeholder',
  'identity.positionOther': 'Lainnya',
  'identity.constructionExp': 'Pengalaman Konstruksi',
  'identity.dbExp': 'Pengalaman Proyek DB (berapa kali terlibat)',
  'identity.mostInvolvedPhase': 'Fase Proyek DB Paling Sering Terlibat',
  'identity.sector': 'Sektor Proyek',

  // Step 4 - Assessment
  'assessment.title': 'Penilaian',
  'assessment.probability': 'Probabilitas',
  'assessment.impact': 'Dampak',
  'assessment.scale': 'Skala Penilaian',

  // Matrix Table
  'matrix.no': 'No.',
  'matrix.question': 'Pertanyaan',
  'matrix.probability': 'Probabilitas (0–5)',
  'matrix.impact': 'Dampak (0–5)',
  'matrix.completion': '{answered} dari {total} terjawab',

  // Step 10 - Completion
  'completion.title': 'Terima Kasih!',
  'completion.success': 'Jawaban Anda telah berhasil dikirim.',
  'completion.error': 'Terjadi kesalahan saat mengirim jawaban.',

  // Errors
  'error.required': 'Kolom ini wajib diisi',
  'error.network': 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  'error.fetchQuestions': 'Gagal memuat pertanyaan.',
  'error.submission': 'Gagal mengirim jawaban.',
  'error.login': 'Username atau password salah.',
  'error.notFound': 'Halaman tidak ditemukan',

  // Admin
  'admin.dashboard': 'Dashboard Admin',
  'admin.totalRespondents': 'Total Responden',
  'admin.loginTitle': 'Login Admin',
  'admin.username': 'Username',
  'admin.password': 'Password',
  'admin.resetConfirm': 'Apakah Anda yakin ingin mereset data? Tindakan ini tidak dapat dibatalkan.',
  'admin.resetTitle': 'Reset Data',
  'admin.resetSuccess': 'Data berhasil direset.',
  'admin.resetError': 'Gagal mereset data. Silakan coba lagi.',
  'admin.respondentTable': 'Daftar Responden',
  'admin.tab.all': 'Semua',
  'admin.phase.inisiasi': 'Inisiasi',
  'admin.phase.perencanaan': 'Perencanaan',
  'admin.phase.perancangan': 'Perancangan',
  'admin.phase.pelaksanaan': 'Pelaksanaan',
  'admin.phase.penggunaan': 'Penggunaan',
  'admin.downloadOpen': 'Download Pertanyaan Terbuka',

  // Footer
  'footer.copyright': '© 2025 Della Ayu Adinanda',

  // Open Questions
  'openQuestion.title': 'Pertanyaan Terbuka',
  'openQuestion.subtitle': 'Silakan berikan jawaban Anda pada pertanyaan berikut (maks. 500 karakter).',
  'openQuestion.placeholder': 'Tulis jawaban Anda di sini...',

  // 404
  'notFound.title': '404 - Halaman Tidak Ditemukan',
  'notFound.message': 'Halaman yang Anda cari tidak tersedia.',
  'notFound.backHome': 'Kembali ke Beranda',
};
