import { clsx } from 'clsx';

export interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
  layout?: 'vertical' | 'horizontal';
  error?: string;
  className?: string;
}

export function RadioGroup({
  name,
  label,
  options,
  value,
  onChange,
  layout = 'vertical',
  error,
  className,
}: RadioGroupProps) {
  const groupId = `radio-group-${name}`;

  return (
    <fieldset className={clsx('flex flex-col gap-2', className)} aria-describedby={error ? `${groupId}-error` : undefined}>
      {label && (
        <legend className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label}
        </legend>
      )}
      <div
        className={clsx(
          'flex gap-2',
          layout === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
        )}
        role="radiogroup"
        aria-labelledby={label ? undefined : groupId}
      >
        {options.map((option) => {
          const optionId = `${name}-${option.value}`;
          const isSelected = value === option.value;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={clsx(
                'flex items-center gap-2 px-3 py-2 min-h-11 rounded-[var(--radius-sm)] cursor-pointer',
                'border transition-colors duration-150',
                isSelected
                  ? 'bg-[var(--color-surface-beige)] border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]'
                  : 'bg-[var(--color-surface-beige)] border-gray-200 dark:border-gray-600 hover:border-gray-300'
              )}
            >
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span className="text-sm text-gray-700 dark:text-gray-200">
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={`${groupId}-error`} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
