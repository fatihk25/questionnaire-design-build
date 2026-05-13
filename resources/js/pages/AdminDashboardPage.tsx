import { useCallback, useEffect, useState } from 'react';
import { Users, Download, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { fetchDashboardStats, downloadExcel } from '@/services/api';
import { RespondentTable } from '@/components/admin/RespondentTable';
import { RiskMatrix } from '@/components/admin/RiskMatrix';
import { AverageScoreTable } from '@/components/admin/AverageScoreTable';
import { ResetDataSection } from '@/components/admin/ResetDataSection';
import type { DashboardStats } from '@/types/api';
import type { PhaseKey } from '@/types/questionnaire';

const PHASES: PhaseKey[] = [
  'inisiasi',
  'perencanaan',
  'perancangan',
  'pelaksanaan',
  'penggunaan',
];

const PHASE_LABELS: Record<PhaseKey, string> = {
  inisiasi: 'Inisiasi',
  perencanaan: 'Perencanaan',
  perancangan: 'Perancangan',
  pelaksanaan: 'Pelaksanaan',
  penggunaan: 'Penggunaan',
};

type TabKey = 'all' | PhaseKey;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('inisiasi');
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardStats();
      setStats({
        totalRespondents: data?.totalRespondents ?? 0,
        perPhase: data?.perPhase ?? {} as Record<PhaseKey, number>,
      });
    } catch {
      // API not available yet — show mock data
      setStats({
        totalRespondents: 30,
        perPhase: {
          inisiasi: 6,
          perencanaan: 6,
          perancangan: 8,
          pelaksanaan: 6,
          penggunaan: 6,
        },
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleDownload = async (phase: PhaseKey | 'open') => {
    try {
      await downloadExcel(phase);
    } catch (error) {
      console.error('Gagal ekspor data:', error);
      alert('Terjadi kesalahan saat mengunduh data. Pastikan Anda sudah login.');
    }
  };

  const activePhase: PhaseKey = activeTab === 'all' ? 'inisiasi' : activeTab;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <BarChart3 size={20} className="text-primary" />
          Dashboard Hasil Kuesioner
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Total responden yang telah mengisi: <strong>{stats?.totalRespondents ?? 0}</strong> orang
        </p>
      </div>

      {/* Stat Cards Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {/* Total */}
          <Card className="p-3 text-center border border-gray-200">
            <p className="text-2xl font-bold text-gray-900">{stats.totalRespondents}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">Total</p>
          </Card>
          {/* Per phase */}
          {PHASES.map((phase) => (
            <Card key={phase} className="p-3 text-center border border-gray-200">
              <p className="text-2xl font-bold text-gray-900">
                {(stats.perPhase ?? {})[phase] ?? 0}
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">
                {PHASE_LABELS[phase]}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Download Section */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <Download size={14} /> Download Data Excel
        </h3>
        <div className="flex flex-wrap gap-2">
          {PHASES.map((phase) => (
            <button
              key={phase}
              onClick={() => handleDownload(phase)}
              className="rounded-full bg-secondary px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-secondary/90"
            >
              {PHASE_LABELS[phase]}
            </button>
          ))}
          <button
            onClick={() => handleDownload('open')}
            className="rounded-full bg-gray-600 px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-gray-700"
          >
            Pertanyaan Terbuka
          </button>
        </div>
      </div>

      {/* ═══ Section: Daftar Responden ═══ */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Users size={14} /> Daftar Responden
          </h3>
          {/* Phase tabs */}
          <div className="flex gap-1">
            {PHASES.map((phase) => (
              <button
                key={phase}
                onClick={() => setActiveTab(phase)}
                className={`rounded px-2.5 py-1 text-[10px] font-medium transition-colors ${
                  activeTab === phase
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {PHASE_LABELS[phase]}
              </button>
            ))}
          </div>
        </div>
        <RespondentTable phase={activePhase} />
      </section>

      {/* ═══ Section: Risk Matrix ═══ */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">
            📊 Matriks Risiko per Fase
          </h3>
          <div className="flex gap-1">
            {PHASES.map((phase) => (
              <button
                key={phase}
                onClick={() => setActiveTab(phase)}
                className={`rounded px-2.5 py-1 text-[10px] font-medium transition-colors ${
                  activeTab === phase
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {PHASE_LABELS[phase]}
              </button>
            ))}
          </div>
        </div>
        <Card className="p-4 border border-gray-200">
          <RiskMatrix phase={activePhase} />
        </Card>
        {/* Legend */}
        <div className="mt-2 flex flex-wrap gap-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-[#4caf50]" /> Rendah (1-4)</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-[#ffeb3b]" /> Sedang (5-9)</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-[#ff9800]" /> Tinggi (10-15)</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-[#f44336]" /> Sangat Tinggi (16-25)</span>
        </div>
      </section>

      {/* ═══ Section: Average Scores ═══ */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">
            📈 Rata-rata Skor per Indikator
          </h3>
          <div className="flex gap-1">
            {PHASES.map((phase) => (
              <button
                key={phase}
                onClick={() => setActiveTab(phase)}
                className={`rounded px-2.5 py-1 text-[10px] font-medium transition-colors ${
                  activeTab === phase
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {PHASE_LABELS[phase]}
              </button>
            ))}
          </div>
        </div>
        <AverageScoreTable phase={activePhase} />
      </section>

      {/* ═══ Section: Reset Data ═══ */}
      <section className="border-t border-gray-200 pt-6">
        <ResetDataSection />
      </section>
    </div>
  );
}
