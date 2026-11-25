import type {FormEvent} from 'react';
import type {ServiceCategory, WorkShift} from '../../domain/entities/ServiceOffer';
import {
  FORTALEZA_NEIGHBORHOODS,
  SERVICE_CATEGORIES,
  WORK_SHIFTS,
} from '../../shared/constants/fortalezaNeighborhoods';

export interface OfferFormValuesState {
  readonly category: ServiceCategory;
  readonly serviceDate: string;
  readonly shift: WorkShift;
  readonly offeredValueBrl: string;
  readonly neighborhood: string;
  readonly addressReference: string;
  readonly notes: string;
}

export type OfferFormErrors = Partial<Record<keyof OfferFormValuesState, string>>;

export interface OfferFormProps {
  readonly values: OfferFormValuesState;
  readonly errors: OfferFormErrors;
  readonly isSubmitting: boolean;
  readonly onChangeField: <K extends keyof OfferFormValuesState>(
    field: K,
    value: OfferFormValuesState[K],
  ) => void;
  readonly onSubmit: () => void;
}

export function OfferForm({
  values,
  errors,
  isSubmitting,
  onChangeField,
  onSubmit,
}: OfferFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Publicar demanda de serviço
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Informe o bairro em Fortaleza ou RMF, turno e valor oferecido para receber confirmação rápida.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label
            htmlFor="offer-category"
            className="text-sm font-medium text-slate-800"
          >
            Tipo de serviço
          </label>
          <select
            id="offer-category"
            value={values.category}
            disabled={isSubmitting}
            onChange={(e) =>
              onChangeField('category', e.target.value as ServiceCategory)
            }
            className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/15"
          >
            {SERVICE_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label} (sugestão a partir de R$ {category.suggestedMinBrl})
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs font-medium text-red-700">{errors.category}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="offer-neighborhood"
            className="text-sm font-medium text-slate-800"
          >
            Bairro (Fortaleza / RMF)
          </label>
          <select
            id="offer-neighborhood"
            value={values.neighborhood}
            disabled={isSubmitting}
            onChange={(e) => onChangeField('neighborhood', e.target.value)}
            className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/15"
          >
            {FORTALEZA_NEIGHBORHOODS.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name} — {item.zone}
              </option>
            ))}
          </select>
          {errors.neighborhood && (
            <p className="text-xs font-medium text-red-700">
              {errors.neighborhood}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="offer-date"
            className="text-sm font-medium text-slate-800"
          >
            Data da diária
          </label>
          <input
            id="offer-date"
            type="date"
            value={values.serviceDate}
            disabled={isSubmitting}
            onChange={(e) => onChangeField('serviceDate', e.target.value)}
            className={`min-h-[44px] w-full rounded-xl border bg-white px-3.5 py-2.5 font-mono text-sm tabular-nums text-slate-900 focus:outline-none focus:ring-2 ${
              errors.serviceDate
                ? 'border-red-500 focus:ring-red-200'
                : 'border-slate-200 focus:border-teal-700 focus:ring-teal-700/15'
            }`}
          />
          {errors.serviceDate && (
            <p className="text-xs font-medium text-red-700">
              {errors.serviceDate}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="offer-shift"
            className="text-sm font-medium text-slate-800"
          >
            Turno
          </label>
          <select
            id="offer-shift"
            value={values.shift}
            disabled={isSubmitting}
            onChange={(e) => onChangeField('shift', e.target.value as WorkShift)}
            className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/15"
          >
            {WORK_SHIFTS.map((shift) => (
              <option key={shift.id} value={shift.id}>
                {shift.label} ({shift.hoursLabel})
              </option>
            ))}
          </select>
          {errors.shift && (
            <p className="text-xs font-medium text-red-700">{errors.shift}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="offer-value"
            className="text-sm font-medium text-slate-800"
          >
            Valor oferecido (R$)
          </label>
          <input
            id="offer-value"
            type="number"
            min={60}
            max={2000}
            step={5}
            inputMode="decimal"
            value={values.offeredValueBrl}
            disabled={isSubmitting}
            onChange={(e) => onChangeField('offeredValueBrl', e.target.value)}
            placeholder="180"
            className={`min-h-[44px] w-full rounded-xl border bg-white px-3.5 py-2.5 font-mono text-sm tabular-nums text-slate-900 focus:outline-none focus:ring-2 ${
              errors.offeredValueBrl
                ? 'border-red-500 focus:ring-red-200'
                : 'border-slate-200 focus:border-teal-700 focus:ring-teal-700/15'
            }`}
          />
          {errors.offeredValueBrl && (
            <p className="text-xs font-medium text-red-700">
              {errors.offeredValueBrl}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label
            htmlFor="offer-reference"
            className="text-sm font-medium text-slate-800"
          >
            Ponto de referência no bairro (opcional)
          </label>
          <input
            id="offer-reference"
            type="text"
            value={values.addressReference}
            disabled={isSubmitting}
            onChange={(e) => onChangeField('addressReference', e.target.value)}
            placeholder="Ex.: Próximo à Av. Dom Luís ou Praça Portugal"
            className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/15"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label
            htmlFor="offer-notes"
            className="text-sm font-medium text-slate-800"
          >
            Detalhes para a profissional (opcional)
          </label>
          <textarea
            id="offer-notes"
            rows={2}
            value={values.notes}
            disabled={isSubmitting}
            onChange={(e) => onChangeField('notes', e.target.value)}
            placeholder="Ex.: Apartamento 2 quartos, produtos de limpeza disponíveis no local."
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/15"
          />
          {errors.notes && (
            <p className="text-xs font-medium text-red-700">{errors.notes}</p>
          )}
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-[44px] w-full sm:w-auto rounded-xl bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          {isSubmitting ? 'Publicando demanda...' : 'Publicar Demanda'}
        </button>
      </div>
    </form>
  );
}
