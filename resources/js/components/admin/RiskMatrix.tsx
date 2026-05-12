import { Fragment, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { fetchRiskMatrix } from '@/services/api';
import type { RiskMatrixCell } from '@/types/api';
import type { PhaseKey } from '@/types/questionnaire';

export interface RiskMatrixProps {
  phase: PhaseKey;
}

/**
 * Returns the background color for a risk matrix cell based on the score
 * (probability × impact).
 *
 * Color mapping:
 * - 0: gray (No Risk)
 * - 1–4: green (Low)
 * - 5–9: yellow (Medium)
 * - 10–15: orange (High)
 * - 16–25: red (Very High)
 */
export function getRiskColor(score: number): string {
  if (score === 0) return 'var(--color-risk-none)';
  if (score <= 4) return 'var(--color-risk-low)';
  if (score <= 9) return 'var(--color-risk-medium)';
  if (score <= 15) return 'var(--color-risk-high)';
  return 'var(--color-risk-very-high)';
}

/**
 * Returns a text color that contrasts well with the cell background.
 */
function getCellTextColor(score: number): string {
  if (score === 0) return '#ffffff';
  if (score <= 4) return '#ffffff';
  if (score <= 9) return '#333333';
  if (score <= 15) return '#ffffff';
  return '#ffffff';
}

/**
 * RiskMatrix — 5×5 color-coded risk matrix visualization.
 *
 * Renders a grid with Probability (1–5) on the x-axis and Impact (1–5) on the y-axis.
 * Each cell is colored based on the risk score (probability × impact) and displays
 * the count of indicators that fall in that combination.
 *
 * Validates: Requirements 14.1, 14.2, 14.3
 */
export function RiskMatrix({ phase }: RiskMatrixProps) {
  const [data, setData] = useState<RiskMatrixCell[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchRiskMatrix(phase);
        if (!cancelled) {
          setData(Array.isArray(result) ? result : []);
        }
      } catch (err) {
        if (!cancelled) {
          setData([]);
          setError(
            err instanceof Error ? err.message : 'Gagal memuat data risk matrix'
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [phase]);

  /**
   * Get the indicator count for a specific probability/impact combination.
   */
  function getCellCount(probability: number, impact: number): number {
    const cell = data.find(
      (c) => c.probability === probability && c.impact === impact
    );
    return cell?.count ?? 0;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
        <p className="text-gray-500 dark:text-gray-400">Memuat risk matrix...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <p className="text-red-600 dark:text-red-400 font-medium" role="alert">
          {error}
        </p>
      </div>
    );
  }

  // Impact rows from 5 (top) to 1 (bottom)
  const impactValues = [5, 4, 3, 2, 1];
  // Probability columns from 1 (left) to 5 (right)
  const probabilityValues = [1, 2, 3, 4, 5];

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-stretch min-w-[320px]">
        {/* Y-axis label */}
        <div className="flex items-center justify-center pr-2">
          <span
            className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Impact
          </span>
        </div>

        <div className="flex-1">
          {/* Grid */}
          <div className="grid grid-cols-[auto_repeat(5,1fr)] gap-0">
            {/* Header row — empty corner + probability values */}
            <div className="w-8" />
            {probabilityValues.map((p) => (
              <div
                key={`header-${p}`}
                className="flex items-center justify-center h-8 text-xs font-bold text-gray-600 dark:text-gray-300"
              >
                {p}
              </div>
            ))}

            {/* Matrix rows — impact label + cells */}
            {impactValues.map((impact) => (
              <Fragment key={`row-${impact}`}>
                {/* Impact row label */}
                <div className="flex items-center justify-center w-8 text-xs font-bold text-gray-600 dark:text-gray-300">
                  {impact}
                </div>

                {/* Cells for this impact row */}
                {probabilityValues.map((probability) => {
                  const score = probability * impact;
                  const count = getCellCount(probability, impact);
                  const bgColor = getRiskColor(score);
                  const textColor = getCellTextColor(score);

                  return (
                    <div
                      key={`cell-${probability}-${impact}`}
                      className="flex items-center justify-center aspect-square border border-white/30 rounded-sm text-sm font-bold min-h-[40px]"
                      style={{ backgroundColor: bgColor, color: textColor }}
                      title={`P${probability} × I${impact} = ${score} | ${count} indicator(s)`}
                      aria-label={`Probability ${probability}, Impact ${impact}, Score ${score}, ${count} indicators`}
                    >
                      {count > 0 ? count : ''}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>

          {/* X-axis label */}
          <div className="flex justify-center mt-2">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Probability
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskMatrix;
