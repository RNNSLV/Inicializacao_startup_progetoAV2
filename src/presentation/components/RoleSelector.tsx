import type {UserRole} from '../../domain/entities/UserProfile';
import {Briefcase, Home} from 'lucide-react';

export interface RoleSelectorProps {
  readonly selectedRole: UserRole;
  readonly onSelectRole: (role: UserRole) => void;
  readonly disabled?: boolean;
}

export function RoleSelector({
  selectedRole,
  onSelectRole,
  disabled = false,
}: RoleSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Escolha seu perfil de acesso"
      className="grid grid-cols-2 gap-3"
    >
      <button
        type="button"
        role="radio"
        aria-checked={selectedRole === 'contractor'}
        disabled={disabled}
        onClick={() => onSelectRole('contractor')}
        className={`min-h-[68px] flex flex-col items-start justify-center gap-1 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
          selectedRole === 'contractor'
            ? 'border-teal-700 bg-teal-50/70 text-teal-950'
            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-teal-700 shrink-0" aria-hidden="true" />
          <span className="text-sm font-semibold whitespace-nowrap">
            Quero Contratar
          </span>
        </div>
        <span className="text-xs text-slate-600">
          Para sua casa ou família
        </span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={selectedRole === 'provider'}
        disabled={disabled}
        onClick={() => onSelectRole('provider')}
        className={`min-h-[68px] flex flex-col items-start justify-center gap-1 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
          selectedRole === 'provider'
            ? 'border-teal-700 bg-teal-50/70 text-teal-950'
            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <Briefcase
            className="h-4 w-4 text-teal-700 shrink-0"
            aria-hidden="true"
          />
          <span className="text-sm font-semibold whitespace-nowrap">
            Quero Trabalhar
          </span>
        </div>
        <span className="text-xs text-slate-600">
          Diaristas e profissionais
        </span>
      </button>
    </div>
  );
}
