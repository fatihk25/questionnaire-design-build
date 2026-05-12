import { clsx } from 'clsx';

interface InputFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function InputField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  error,
  value,
  onChange,
  className,
}: InputFieldProps) {
  const id = `field-${name}`;

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(
          'w-full px-3 py-2 min-h-11 rounded-[var(--radius-sm)] bg-[var(--color-surface-beige)]',
          'border border-gray-200 dark:border-gray-600',
          'text-gray-900 dark:text-gray-100 placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
          'transition-colors duration-150',
          error && 'border-red-500 focus:ring-red-500'
        )}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
