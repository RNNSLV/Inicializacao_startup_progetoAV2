import type {OfferStatus, ServiceOffer} from '../../domain/entities/ServiceOffer';
import {MoneyBRL} from '../../domain/valueObjects/MoneyBRL';
import {
  getCategoryLabel,
  getShiftLabel,
} from '../../shared/constants/fortalezaNeighborhoods';

export interface OfferCardProps {
  readonly offer: ServiceOffer;
  readonly viewerRole: 'contractor' | 'provider';
  readonly isBusy?: boolean;
  readonly onCancelOffer?: (offerId: string) => void;
  readonly onAcceptOffer?: (offerId: string) => void;
}

const STATUS_LABELS: Record<OfferStatus, string> = {
  open: 'Aberta para candidaturas',
  accepted: 'Diária confirmada',
  cancelled: 'Cancelada',
  completed: 'Concluída',
};

const STATUS_TEXT_CLASS: Record<OfferStatus, string> = {
  open: 'text-teal-800',
  accepted: 'text-emerald-800',
  cancelled: 'text-slate-500',
  completed: 'text-slate-700',
};

function formatDatePtBr(isoDate: string): string {
  const parts = isoDate.split('-');
  if (parts.length !== 3) {
    return isoDate;
  }
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function OfferCard({
  offer,
  viewerRole,
  isBusy = false,
  onCancelOffer,
  onAcceptOffer,
}: OfferCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-semibold ${STATUS_TEXT_CLASS[offer.status]}`}>
            {STATUS_LABELS[offer.status]}
          </p>
          <h3 className="mt-1 text-base font-semibold text-slate-900">
            {getCategoryLabel(offer.category)}
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            <span>{offer.neighborhood}</span>
            <span aria-hidden="true"> · </span>
            <span className="font-mono tabular-nums">
              {formatDatePtBr(offer.serviceDate)}
            </span>
            <span aria-hidden="true"> · </span>
            <span>{getShiftLabel(offer.shift)}</span>
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="font-mono text-lg font-semibold tabular-nums text-slate-900">
            {MoneyBRL.formatCents(offer.offeredValueCents)}
          </p>
          <p className="text-xs text-slate-500">Valor ofertado</p>
        </div>
      </div>

      {(offer.addressReference || offer.notes || offer.contractorName) && (
        <div className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-600 space-y-1">
          {viewerRole === 'provider' && offer.contractorName && (
            <p className="text-xs text-slate-500">
              Solicitado por <strong className="font-medium text-slate-700">{offer.contractorName}</strong>
            </p>
          )}
          {offer.addressReference && (
            <p className="text-xs text-slate-500">
              Referência: {offer.addressReference}
            </p>
          )}
          {offer.notes && <p className="text-sm text-slate-700">{offer.notes}</p>}
        </div>
      )}

      {viewerRole === 'contractor' && offer.status === 'open' && onCancelOffer && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => onCancelOffer(offer.id)}
            className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
          >
            Cancelar demanda
          </button>
        </div>
      )}

      {viewerRole === 'provider' && offer.status === 'open' && onAcceptOffer && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => onAcceptOffer(offer.id)}
            className="min-h-[44px] w-full sm:w-auto rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:opacity-60"
          >
            {isBusy ? 'Confirmando...' : 'Aceitar Diária'}
          </button>
        </div>
      )}
    </article>
  );
}
