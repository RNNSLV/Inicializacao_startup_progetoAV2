import {useState} from 'react';
import type {UserProfile} from '../../domain/entities/UserProfile';
import {MoneyBRL} from '../../domain/valueObjects/MoneyBRL';
import {getCategoryLabel} from '../../shared/constants/fortalezaNeighborhoods';
import {Star, User} from 'lucide-react';

export interface ProviderCardProps {
  readonly provider: UserProfile;
  readonly isBooking?: boolean;
  readonly onRequestBooking: (provider: UserProfile) => void;
}

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

export function ProviderCard({
  provider,
  isBooking = false,
  onRequestBooking,
}: ProviderCardProps) {
  const [imageFailed, setImageFailed] = useState<boolean>(false);
  const dailyRateLabel = provider.dailyRateCents
    ? MoneyBRL.formatCents(provider.dailyRateCents)
    : 'A combinar';

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300">
      <div>
        <div className="flex items-start gap-3.5">
          {provider.avatarUrl && !imageFailed ? (
            <img
              src={provider.avatarUrl}
              alt={`Foto de ${provider.fullName}`}
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
              className="h-14 w-14 rounded-xl object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-teal-50 font-display text-sm font-bold text-teal-800 shrink-0"
            >
              {getInitials(provider.fullName) || <User className="h-5 w-5" />}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="truncate text-base font-semibold text-slate-900">
                {provider.fullName}
              </h3>
              <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold tabular-nums text-amber-700 shrink-0">
                <Star
                  className="h-3.5 w-3.5 fill-amber-500 text-amber-500"
                  aria-hidden="true"
                />
                {provider.ratingAverage.toFixed(1)}
              </span>
            </div>

            <p className="mt-0.5 text-xs text-slate-600">
              <span>{provider.neighborhood}</span>
              <span aria-hidden="true"> · </span>
              <span className="font-mono tabular-nums">
                {provider.completedServicesCount} diárias realizadas
              </span>
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          {provider.bio}
        </p>

        <p className="mt-3 text-xs font-medium text-slate-600">
          Especialidades:{' '}
          <span className="text-slate-800">
            {provider.specialties.map(getCategoryLabel).join(' · ')}
          </span>
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-500">Diária base</p>
          <p className="font-mono text-base font-semibold tabular-nums text-slate-900">
            {dailyRateLabel}
          </p>
        </div>

        <button
          type="button"
          disabled={isBooking}
          onClick={() => onRequestBooking(provider)}
          className="min-h-[44px] rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:opacity-60 whitespace-nowrap"
        >
          {isBooking ? 'Solicitando...' : 'Solicitar Diária'}
        </button>
      </div>
    </article>
  );
}
