import type {ChangeEvent} from 'react';
import {PhoneNumber} from '../../domain/valueObjects/PhoneNumber';

export interface PhoneInputFieldProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (formattedValue: string) => void;
  readonly error?: string;
  readonly disabled?: boolean;
}

export function PhoneInputField({
  id,
  label,
  value,
  onChange,
  error,
  disabled = false,
}: PhoneInputFieldProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const masked = PhoneNumber.formatMask(event.target.value);
    onChange(masked);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-800">
        {label}
      </label>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        value={value}
        disabled={disabled}
        onChange={handleChange}
        placeholder="(85) 99999-9999"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : `${id}-hint`}
        className={`min-h-[44px] w-full rounded-xl border bg-white px-3.5 py-2.5 font-mono text-sm tabular-nums text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-200'
            : 'border-slate-200 focus:border-teal-700 focus:ring-teal-700/15'
        }`}
      />
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-red-700">
          {error}
        </p>
      ) : (
        <p id={`${id}-hint`} className="text-xs text-slate-500">
          Atendimento exclusivo DDD 85 — Fortaleza e Região Metropolitana.
        </p>
      )}
    </div>
  );
}
