import type {Booking, BookingStatus} from '../../domain/entities/Booking';
import {MoneyBRL} from '../../domain/valueObjects/MoneyBRL';
import {
  getCategoryLabel,
  getShiftLabel,
} from '../../shared/constants/fortalezaNeighborhoods';

export interface BookingCardProps {
  readonly booking: Booking;
  readonly viewerRole: 'contractor' | 'provider';
  readonly isBusy?: boolean;
  readonly onCancelBooking: (bookingId: string) => void;
}

const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  confirmed: 'Agendamento confirmado',
  in_progress: 'Em andamento',
  completed: 'Serviço concluído',
  cancelled: 'Cancelado',
};

const BOOKING_STATUS_CLASS: Record<BookingStatus, string> = {
  confirmed: 'text-emerald-800',
  in_progress: 'text-teal-800',
  completed: 'text-slate-700',
  cancelled: 'text-slate-500',
};

function formatDatePtBr(isoDate: string): string {
  const parts = isoDate.split('-');
  if (parts.length !== 3) {
    return isoDate;
  }
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function BookingCard({
  booking,
  viewerRole,
  isBusy = false,
  onCancelBooking,
}: BookingCardProps) {
  const counterpartLabel =
    viewerRole === 'contractor'
      ? `Profissional: ${booking.providerName}`
      : `Contratante: ${booking.contractorName}`;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p
            className={`text-xs font-semibold ${BOOKING_STATUS_CLASS[booking.status]}`}
          >
            {BOOKING_STATUS_LABEL[booking.status]}
          </p>
          <h3 className="mt-1 text-base font-semibold text-slate-900">
            {getCategoryLabel(booking.category)}
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            <span>{booking.neighborhood}</span>
            <span aria-hidden="true"> · </span>
            <span className="font-mono tabular-nums">
              {formatDatePtBr(booking.serviceDate)}
            </span>
            <span aria-hidden="true"> · </span>
            <span>{getShiftLabel(booking.shift)}</span>
          </p>
          <p className="mt-2 text-sm font-medium text-slate-800">
            {counterpartLabel}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="font-mono text-lg font-semibold tabular-nums text-slate-900">
            {MoneyBRL.formatCents(booking.agreedValueCents)}
          </p>
          <p className="text-xs text-slate-500">Valor combinado</p>
        </div>
      </div>

      {booking.status === 'confirmed' && (
        <div className="mt-4 flex justify-end border-t border-slate-100 pt-3">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => onCancelBooking(booking.id)}
            className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
          >
            Cancelar agendamento
          </button>
        </div>
      )}
    </article>
  );
}
