import { useEffect, useState } from 'react';
import { fetchRespondents } from '@/services/api';
import type { RespondentRow } from '@/types/api';
import type { PhaseKey } from '@/types/questionnaire';

interface RespondentTableProps {
  phase?: PhaseKey;
}

/**
 * Renders a table of respondents filtered by the active phase tab.
 * Fetches data on mount and when the phase prop changes.
 */
export function RespondentTable({ phase }: RespondentTableProps) {
  const [respondents, setRespondents] = useState<RespondentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRespondents(phase);
        if (!cancelled) {
          setRespondents(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setRespondents([]);
          setError(err instanceof Error ? err.message : 'Gagal memuat data responden');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [phase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
        <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">Memuat data responden...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-sm text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (respondents.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
        Belum ada data responden.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">Instansi</th>
            <th className="px-4 py-3">Posisi</th>
            <th className="px-4 py-3">Pendidikan</th>
            <th className="px-4 py-3">Pengalaman</th>
            <th className="px-4 py-3">Sektor</th>
            <th className="px-4 py-3">Waktu</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {respondents.map((row, index) => (
            <tr
              key={row.id}
              className="bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                {index + 1}
              </td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.nama}</td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.instansi}</td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.posisi}</td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.pendidikan}</td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.pengalaman}</td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.sektor}</td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                {formatDate(row.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Formats an ISO date string into a human-readable format (e.g. "12 Mei 2025, 14:30").
 */
function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}
