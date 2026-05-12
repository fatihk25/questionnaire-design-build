import { clsx } from 'clsx';

interface TextareaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  required?: boolean;
  error?: string;
  rows?: number;
  className?: string;
}

export function TextareaField({
  label,
  name,
  value,
  onChange,
  maxLength,
  placeholder,
  required = false,
  error,
  rows = 4,
  className,
}: TextareaFieldProps) {
  const id = `field-${name}`;
  const charCount = value.length;

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={clsx(
          'w-full px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--color-surface-beige)]',
          'border border-gray-200 dark:border-gray-600',
          'text-gray-900 dark:text-gray-100 placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
          'transition-colors duration-150 resize-y',
          error && 'border-red-500 focus:ring-red-500'
        )}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : `${id}-count`}
      />
      <div className="flex justify-between items-center">
        {error ? (
          <p id={`${id}-error`} className="text-sm text-red-500" role="alert">
            {error}
          </p>
        ) : (
          <span />
        )}
        {maxLength && (
          <span
            id={`${id}-count`}
            className={clsx(
              'text-xs',
              charCount >= maxLength ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
            )}
            aria-live="polite"
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
