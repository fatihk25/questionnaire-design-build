import { clsx } from 'clsx';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export function SelectField({
  label,
  name,
  options,
  value,
  onChange,
  placeholder = 'Pilih...',
  required = false,
  error,
  className,
}: SelectFieldProps) {
  const id = `field-${name}`;

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={clsx(
          'w-full px-3 py-2 min-h-11 rounded-[var(--radius-sm)] bg-[var(--color-surface-beige)]',
          'border border-gray-200 dark:border-gray-600',
          'text-gray-900 dark:text-gray-100',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
          'transition-colors duration-150 appearance-none',
          !value && 'text-gray-400',
          error && 'border-red-500 focus:ring-red-500'
        )}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
