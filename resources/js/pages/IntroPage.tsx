import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useForm } from '@/contexts/FormContext';
import { useI18n } from '@/contexts/I18nContext';

export default function IntroPage() {
  const { state, dispatch } = useForm();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [eligibility, setEligibility] = useState<'pernah' | 'tidak_pernah' | null>(
    state.eligibility
  );

  const handleEligibilitySelect = (value: 'pernah' | 'tidak_pernah') => {
    setEligibility(value);
    dispatch({ type: 'SET_ELIGIBILITY', payload: value });
  };

  const handleStart = () => {
    dispatch({ type: 'SET_STEP', payload: 2 });
    navigate('/persetujuan');
  };

  const isEligible = eligibility === 'pernah';
  const isIneligible = eligibility === 'tidak_pernah';

  return (
    <div className="mx-auto max-w-[680px] space-y-3 py-5">

      {/* ── Card 1: Institutional Header ── */}
      <div className="overflow-hidden rounded-xl shadow-[var(--shadow-card)] bg-white">
        {/* Teal header band */}
        <div className="bg-secondary px-6 py-4 flex items-center gap-5">
          {/* ITB logo circle */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 border-2 border-white/40">
            <span className="text-sm font-bold text-white">ITB</span>
          </div>
          <div className="text-center flex-1">
            <p className="text-sm font-bold uppercase tracking-wide text-white">
              {t('intro.university')}
            </p>
            <p className="text-xs text-white/85 uppercase tracking-wide">
              {t('intro.faculty')}
            </p>
            <p className="text-xs text-white/85 uppercase tracking-wide">
              {t('intro.program')}
            </p>
            <p className="text-xs text-white/70 mt-0.5">
              Jalan Ganesha Nomor 10 Bandung, 40132
            </p>
          </div>
        </div>

        {/* Research title & researcher info */}
        <div className="px-6 py-4 bg-[#e8f4f5]">
          <h1 className="text-sm font-bold text-gray-900 leading-snug">
            Kuesioner Kajian Penerapan Metoda Penyelenggaraan Proyek Konstruksi Rancang Bangun{' '}
            <em>(Design and Build)</em> di Indonesia
          </h1>
          <div className="mt-3 border-t border-gray-200 pt-3 grid grid-cols-[80px_1fr] gap-x-3 gap-y-2 text-xs text-gray-700">
            <span className="font-bold">Peneliti:</span>
            <span>
              Della Ayu Adinanda, S.T.<br />
              Program Studi Magister Teknik Sipil<br />
              (Pengutamaan: Konstruksi dan Manajemen Infrastruktur)<br />
              Institut Teknologi Bandung
            </span>
            <span className="font-bold">Pembimbing:</span>
            <span>
              1. Dr. Krishna Mochtar, ST., MT.<br />
              2. Ir. Muhamad Abduh, M.T., Ph.D.
            </span>
          </div>
        </div>
      </div>

      {/* ── Card 2: Deskripsi Singkat ── */}
      <div className="rounded-xl shadow-[var(--shadow-card)] bg-white px-6 py-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
          <span>📋</span> {t('intro.description')}
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          Selamat datang. Pada kuesioner ini, Bapak/Ibu/Saudara/i diminta untuk memberikan
          penilaian terhadap permasalahan dan tantangan dalam penerapan metode Design and Build
          (DB) pada proyek konstruksi sektor publik.
        </p>
        <p className="mt-2 text-xs text-gray-600 leading-relaxed">
          Penilaian dilakukan berdasarkan pengalaman dan kondisi nyata di lapangan, mencakup
          aspek kekerapan kejadian dan keparahan dampak. Hasil penelitian ini akan digunakan
          sebagai dasar penyusunan rekomendasi strategi peningkatan implementasi metode Design
          and Build di Indonesia.
        </p>
      </div>

      {/* ── Card 3: Estimasi Waktu ── */}
      <div className="rounded-xl shadow-[var(--shadow-card)] bg-white px-6 py-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-1">
          <span>⏱</span> {t('intro.duration')}
        </h3>
        <p className="text-xs text-gray-600">Sekitar {t('intro.durationValue')}</p>
      </div>

      {/* ── Card 4: Alur Pengisian ── */}
      <div className="rounded-xl shadow-[var(--shadow-card)] bg-white px-6 py-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
          <span>📝</span> {t('intro.flow')}
        </h3>
        <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
          <li>Konfirmasi Partisipasi</li>
          <li>Identitas Responden</li>
          <li>
            Penilaian Kekerapan Permasalahan (Probability/Likelihood) dan Penilaian Keparahan
            Permasalahan (Impact/Criticality) pada fase:
            <ol className="mt-1 ml-4 space-y-0.5 list-[lower-alpha] list-inside">
              <li>Inisiasi (Idea)</li>
              <li>Perencanaan (Planning)</li>
              <li>Perancangan Desain (Design)</li>
              <li>Pelaksanaan (Construction)</li>
              <li>Penggunaan (Operation Maintenance)</li>
            </ol>
          </li>
          <li>Pertanyaan Terbuka</li>
        </ol>
      </div>

      {/* ── Card 5: Eligibility ── */}
      <div className="rounded-xl shadow-[var(--shadow-card)] bg-white px-6 py-5 text-center">
        <p className="text-sm font-medium text-gray-800 mb-4">
          Apakah Bapak/Ibu pernah terlibat dalam proyek konstruksi yang menerapkan metoda{' '}
          <strong>Design and Build?</strong>
        </p>

        <div className="flex justify-center gap-3">
          <Button
            variant={isEligible ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleEligibilitySelect('pernah')}
            aria-pressed={isEligible}
          >
            {t('intro.eligible')}
          </Button>
          <Button
            variant={isIneligible ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleEligibilitySelect('tidak_pernah')}
            aria-pressed={isIneligible}
          >
            {t('intro.notEligible')}
          </Button>
        </div>

        {isEligible && (
          <p className="mt-3 text-xs text-green-700 bg-green-50 rounded px-3 py-2 inline-block">
            Terima kasih! Silakan lanjutkan pengisian kuesioner.
          </p>
        )}

        {isIneligible && (
          <div
            className="mt-3 flex items-start gap-2 rounded bg-amber-50 px-3 py-2 text-xs text-amber-800 text-left"
            role="alert"
          >
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>{t('intro.notEligibleMessage')}</p>
          </div>
        )}

        <div className="mt-5">
          <Button
            variant="primary"
            size="md"
            disabled={!isEligible}
            onClick={handleStart}
            className="px-8"
          >
            {t('button.start')} →
          </Button>
        </div>
      </div>

    </div>
  );
}
