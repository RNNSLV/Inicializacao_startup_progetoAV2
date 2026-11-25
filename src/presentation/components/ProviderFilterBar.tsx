import type {SpecialtyCode} from '../../domain/entities/UserProfile';
import {
  FORTALEZA_NEIGHBORHOODS,
  SERVICE_CATEGORIES,
} from '../../shared/constants/fortalezaNeighborhoods';
import {Search} from 'lucide-react';

export interface ProviderFilterBarProps {
  readonly neighborhood: string;
  readonly specialty: SpecialtyCode | '';
  readonly searchQuery: string;
  readonly onChangeNeighborhood: (neighborhood: string) => void;
  readonly onChangeSpecialty: (specialty: SpecialtyCode | '') => void;
  readonly onChangeSearchQuery: (query: string) => void;
  readonly onResetFilters: () => void;
}

export function ProviderFilterBar({
  neighborhood,
  specialty,
  searchQuery,
  onChangeNeighborhood,
  onChangeSpecialty,
  onChangeSearchQuery,
  onResetFilters,
}: ProviderFilterBarProps) {
  const hasActiveFilter =
    neighborhood !== '' || specialty !== '' || searchQuery.trim() !== '';

  return (
    <section
      aria-label="Filtros de busca de profissionais"
      className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-search"
            className="text-xs font-medium text-slate-700"
          >
            Buscar por nome ou descrição
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="filter-search"
              type="search"
              value={searchQuery}
              onChange={(e) => onChangeSearchQuery(e.target.value)}
              placeholder="Ex.: Maria, pós-obra..."
              className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/15"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-neighborhood"
            className="text-xs font-medium text-slate-700"
          >
            Bairro em Fortaleza / RMF
          </label>
          <select
            id="filter-neighborhood"
            value={neighborhood}
            onChange={(e) => onChangeNeighborhood(e.target.value)}
            className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/15"
          >
            <option value="">Todos os bairros</option>
            {FORTALEZA_NEIGHBORHOODS.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name} ({item.zone})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-specialty"
            className="text-xs font-medium text-slate-700"
          >
            Especialidade
          </label>
          <select
            id="filter-specialty"
            value={specialty}
            onChange={(e) =>
              onChangeSpecialty(e.target.value as SpecialtyCode | '')
            }
            className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/15"
          >
            <option value="">Todas as especialidades</option>
            {SERVICE_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilter && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onResetFilters}
            className="min-h-[36px] text-xs font-semibold text-teal-800 hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </section>
  );
}
