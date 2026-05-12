import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@/contexts/FormContext';
import { useI18n } from '@/contexts/I18nContext';
import { InputField, RadioGroup, Button } from '@/components/ui';
import type { RadioOption } from '@/components/ui';
import type { IdentityData } from '@/types/questionnaire';

const ageGroupOptions: RadioOption[] = [
  { label: '21–35 tahun', value: '21–35 tahun' },
  { label: '36–50 tahun', value: '36–50 tahun' },
  { label: '>50 tahun', value: '>50 tahun' },
];

const educationOptions: RadioOption[] = [
  { label: 'Diploma/Sarjana (D3/S1)', value: 'Diploma/Sarjana (D3/S1)' },
  { label: 'Magister (S2)', value: 'Magister (S2)' },
  { label: 'Doktor (S3)', value: 'Doktor (S3)' },
];

const ownerPositionOptions: RadioOption[] = [
  { label: 'Project Manager/PM', value: 'Owner - Project Manager/PM' },
  { label: 'Quantity Surveyor/QS', value: 'Owner - Quantity Surveyor/QS' },
  { label: 'Konsultan Pengawas', value: 'Owner - Konsultan Pengawas' },
];

const kontraktorPositionOptions: RadioOption[] = [
  { label: 'Project Manager/PM', value: 'Kontraktor - Project Manager/PM' },
  { label: 'Site Manager/Engineer', value: 'Kontraktor - Site Manager/Engineer' },
  { label: 'Estimator/QS', value: 'Kontraktor - Estimator/QS' },
  { label: 'Lainnya', value: 'Kontraktor - Lainnya' },
];

const constructionExpOptions: RadioOption[] = [
  { label: '<3 tahun', value: '<3 tahun' },
  { label: '3–5 tahun', value: '3–5 tahun' },
  { label: '6–10 tahun', value: '6–10 tahun' },
  { label: '>10 tahun', value: '>10 tahun' },
];

const dbExpOptions: RadioOption[] = [
  { label: '1–2 kali', value: '1–2 kali' },
  { label: '3–5 kali', value: '3–5 kali' },
  { label: '>5 kali', value: '>5 kali' },
];

const phaseOptions: RadioOption[] = [
  { label: 'Inisiasi (Idea)', value: 'Inisiasi (Idea)' },
  { label: 'Perencanaan (Planning)', value: 'Perencanaan (Planning)' },
  { label: 'Perancangan (Design)', value: 'Perancangan (Design)' },
  { label: 'Pelaksanaan (Construction)', value: 'Pelaksanaan (Construction)' },
  { label: 'Penggunaan (O&M)', value: 'Penggunaan (O&M)' },
];

const sectorOptions: RadioOption[] = [
  { label: 'Proyek Pemerintah', value: 'Proyek Pemerintah' },
  { label: 'Proyek Swasta', value: 'Proyek Swasta' },
  { label: 'Proyek BUMN', value: 'Proyek BUMN' },
];

type ValidationErrors = Partial<Record<keyof IdentityData | 'posisiGroup', string>>;

export default function IdentityPage() {
  const { state, dispatch } = useForm();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    dispatch({ type: 'SET_STEP', payload: 3 });
  }, [dispatch]);

  const { identity } = state;

  const handleFieldChange = (field: keyof IdentityData, value: string) => {
    dispatch({ type: 'SET_IDENTITY_FIELD', payload: { field, value } });
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handlePositionChange = (value: string) => {
    dispatch({ type: 'SET_IDENTITY_FIELD', payload: { field: 'posisiStakeholder', value } });
    // Clear posisiLainnya if not "Lainnya"
    if (value !== 'Kontraktor - Lainnya') {
      dispatch({ type: 'SET_IDENTITY_FIELD', payload: { field: 'posisiLainnya', value: '' } });
    }
    // Clear error
    if (errors.posisiGroup) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.posisiGroup;
        return next;
      });
    }
  };

  const isLainnyaSelected = identity.posisiStakeholder === 'Kontraktor - Lainnya';

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!identity.nama.trim()) {
      newErrors.nama = t('error.required');
    }
    if (!identity.perusahaan.trim()) {
      newErrors.perusahaan = t('error.required');
    }
    if (!identity.kelompokUmur) {
      newErrors.kelompokUmur = t('error.required');
    }
    if (!identity.pendidikan) {
      newErrors.pendidikan = t('error.required');
    }
    if (!identity.posisiStakeholder) {
      newErrors.posisiGroup = t('error.required');
    }
    if (!identity.pengalamanKonstruksi) {
      newErrors.pengalamanKonstruksi = t('error.required');
    }
    if (!identity.pengalamanProyekDB) {
      newErrors.pengalamanProyekDB = t('error.required');
    }
    if (!identity.fasePalingTerlibat) {
      newErrors.fasePalingTerlibat = t('error.required');
    }
    if (!identity.sektorProyek) {
      newErrors.sektorProyek = t('error.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      navigate('/penilaian');
    }
  };

  const handleBack = () => {
    navigate('/persetujuan');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {t('identity.title')}
      </h1>

      {/* Text Input Fields */}
      <div className="space-y-4 mb-8">
        <InputField
          label={t('identity.name')}
          name="nama"
          required
          value={identity.nama}
          onChange={(value) => handleFieldChange('nama', value)}
          error={errors.nama}
        />
        <InputField
          label={t('identity.company')}
          name="perusahaan"
          required
          value={identity.perusahaan}
          onChange={(value) => handleFieldChange('perusahaan', value)}
          error={errors.perusahaan}
        />
        <InputField
          label={t('identity.phone')}
          name="telepon"
          type="tel"
          placeholder="08xx-xxxx-xxxx"
          value={identity.telepon}
          onChange={(value) => handleFieldChange('telepon', value)}
        />
        <InputField
          label={t('identity.email')}
          name="email"
          type="email"
          placeholder="email@domain.com"
          value={identity.email}
          onChange={(value) => handleFieldChange('email', value)}
        />
      </div>

      {/* Radio Groups */}
      <div className="space-y-6">
        {/* Kelompok Umur */}
        <RadioGroup
          name="kelompokUmur"
          label={t('identity.ageGroup')}
          options={ageGroupOptions}
          value={identity.kelompokUmur}
          onChange={(value) => handleFieldChange('kelompokUmur', value)}
          error={errors.kelompokUmur}
        />

        {/* Pendidikan */}
        <RadioGroup
          name="pendidikan"
          label={t('identity.education')}
          options={educationOptions}
          value={identity.pendidikan}
          onChange={(value) => handleFieldChange('pendidikan', value)}
          error={errors.pendidikan}
        />

        {/* Posisi Stakeholder */}
        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            {t('identity.position')}
          </legend>

          {/* Owner sub-group */}
          <div className="ml-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Owner</p>
            <RadioGroup
              name="posisiStakeholder"
              options={ownerPositionOptions}
              value={identity.posisiStakeholder}
              onChange={handlePositionChange}
            />
          </div>

          {/* Kontraktor sub-group */}
          <div className="ml-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Kontraktor</p>
            <RadioGroup
              name="posisiStakeholder"
              options={kontraktorPositionOptions}
              value={identity.posisiStakeholder}
              onChange={handlePositionChange}
            />
            {/* Lainnya text input */}
            {isLainnyaSelected && (
              <div className="mt-2 ml-6">
                <InputField
                  label={t('identity.positionOther')}
                  name="posisiLainnya"
                  value={identity.posisiLainnya}
                  onChange={(value) => handleFieldChange('posisiLainnya', value)}
                  placeholder="Masukkan posisi Anda"
                />
              </div>
            )}
          </div>

          {errors.posisiGroup && (
            <p className="text-sm text-red-500" role="alert">
              {errors.posisiGroup}
            </p>
          )}
        </fieldset>

        {/* Pengalaman Konstruksi */}
        <RadioGroup
          name="pengalamanKonstruksi"
          label={t('identity.constructionExp')}
          options={constructionExpOptions}
          value={identity.pengalamanKonstruksi}
          onChange={(value) => handleFieldChange('pengalamanKonstruksi', value)}
          error={errors.pengalamanKonstruksi}
        />

        {/* Pengalaman Proyek DB */}
        <RadioGroup
          name="pengalamanProyekDB"
          label={t('identity.dbExp')}
          options={dbExpOptions}
          value={identity.pengalamanProyekDB}
          onChange={(value) => handleFieldChange('pengalamanProyekDB', value)}
          error={errors.pengalamanProyekDB}
        />

        {/* Fase Paling Terlibat */}
        <RadioGroup
          name="fasePalingTerlibat"
          label={t('identity.mostInvolvedPhase')}
          options={phaseOptions}
          value={identity.fasePalingTerlibat}
          onChange={(value) => handleFieldChange('fasePalingTerlibat', value)}
          error={errors.fasePalingTerlibat}
        />

        {/* Sektor Proyek */}
        <RadioGroup
          name="sektorProyek"
          label={t('identity.sector')}
          options={sectorOptions}
          value={identity.sektorProyek}
          onChange={(value) => handleFieldChange('sektorProyek', value)}
          error={errors.sektorProyek}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10">
        <Button variant="secondary" onClick={handleBack}>
          {t('button.previous')}
        </Button>
        <Button variant="primary" onClick={handleContinue}>
          {t('button.next')}
        </Button>
      </div>
    </div>
  );
}
