import {useState, type FormEvent} from 'react';
import type {
  RegisterAccountInput,
  SignInCredentials,
  SpecialtyCode,
  UserRole,
} from '../../domain/entities/UserProfile';
import {PhoneNumber} from '../../domain/valueObjects/PhoneNumber';
import {MoneyBRL} from '../../domain/valueObjects/MoneyBRL';
import {
  loginSchema,
  registerSchema,
} from '../../application/validators/authSchemas';
import {
  FORTALEZA_NEIGHBORHOODS,
  SERVICE_CATEGORIES,
} from '../../shared/constants/fortalezaNeighborhoods';
import {RoleSelector} from '../components/RoleSelector';
import {PhoneInputField} from '../components/PhoneInputField';
import {MapPin, ShieldCheck} from 'lucide-react';

export interface LoginScreenProps {
  readonly isSubmitting: boolean;
  readonly serverError: string | null;
  readonly onSignIn: (credentials: SignInCredentials) => Promise<void>;
  readonly onRegister: (input: RegisterAccountInput) => Promise<void>;
  readonly onClearServerError: () => void;
}

type AuthMode = 'login' | 'register';

interface FieldErrors {
  phone?: string;
  password?: string;
  fullName?: string;
  neighborhood?: string;
  dailyRateBrl?: string;
}

export function LoginScreen({
  isSubmitting,
  serverError,
  onSignIn,
  onRegister,
  onClearServerError,
}: LoginScreenProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>('contractor');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('(85) ');
  const [password, setPassword] = useState<string>('');
  const [neighborhood, setNeighborhood] = useState<string>('Aldeota');
  const [specialty, setSpecialty] = useState<SpecialtyCode>('faxina_completa');
  const [dailyRateBrl, setDailyRateBrl] = useState<string>('170');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [heroImageError, setHeroImageError] = useState<boolean>(false);

  function handleSwitchMode(nextMode: AuthMode): void {
    setAuthMode(nextMode);
    setFieldErrors({});
    onClearServerError();
  }

  function handleSelectRole(nextRole: UserRole): void {
    setRole(nextRole);
    setFieldErrors({});
    onClearServerError();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    onClearServerError();
    setFieldErrors({});

    if (authMode === 'login') {
      const validation = loginSchema.safeParse({role, phone, password});
      if (!validation.success) {
        const nextErrors: FieldErrors = {};
        for (const issue of validation.error.issues) {
          const key = issue.path[0] as keyof FieldErrors;
          if (!nextErrors[key]) {
            nextErrors[key] = issue.message;
          }
        }
        setFieldErrors(nextErrors);
        return;
      }

      const phoneE164 = PhoneNumber.fromRawInput(validation.data.phone).toE164();
      await onSignIn({
        role: validation.data.role,
        phoneE164,
        password: validation.data.password,
      });
      return;
    }

    const parsedRate =
      role === 'provider' ? Number(dailyRateBrl) : undefined;

    const validation = registerSchema.safeParse({
      role,
      fullName,
      phone,
      password,
      neighborhood,
      dailyRateBrl: parsedRate,
      specialty: role === 'provider' ? specialty : undefined,
    });

    if (!validation.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of validation.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      return;
    }

    const phoneE164 = PhoneNumber.fromRawInput(validation.data.phone).toE164();
    await onRegister({
      role: validation.data.role,
      fullName: validation.data.fullName,
      phoneE164,
      password: validation.data.password,
      neighborhood: validation.data.neighborhood,
      specialties:
        validation.data.role === 'provider' && validation.data.specialty
          ? [validation.data.specialty]
          : undefined,
      dailyRateCents:
        validation.data.role === 'provider' && validation.data.dailyRateBrl
          ? MoneyBRL.fromReais(validation.data.dailyRateBrl).toCents()
          : null,
    });
  }

  async function handleDemoAccess(targetRole: UserRole): Promise<void> {
    onClearServerError();
    setFieldErrors({});
    setRole(targetRole);
    if (targetRole === 'contractor') {
      await onSignIn({
        role: 'contractor',
        phoneE164: '+5585988123456',
        password: 'demo123',
      });
    } else {
      await onSignIn({
        role: 'provider',
        phoneE164: '+5585999441122',
        password: 'demo123',
      });
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6">
          <span className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            AjeitaLar Fortaleza
          </span>
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
            Fortaleza e Região Metropolitana · DDD 85
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          <section className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-6">
            <div>
              <p className="text-xs font-semibold tracking-wide text-teal-800">
                Serviços domésticos sob demanda no Ceará
              </p>
              <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Cuidado profissional para o seu lar em Fortaleza e RMF.
              </h1>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Conectamos famílias e diaristas com transparência no valor da diária, turnos definidos e atendimento por bairro — da Aldeota a Messejana, do Eusébio a Caucaia.
              </p>
            </div>

            <div className="relative mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 aspect-[16/10]">
              {!heroImageError ? (
                <img
                  src="/src/assets/images/fortaleza_home_hero_1795620029000.jpg"
                  alt="Sala de apartamento bem cuidada e iluminada em Fortaleza"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImageError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-slate-100 p-6 text-center">
                  <MapPin className="h-8 w-8 text-teal-700" aria-hidden="true" />
                  <p className="mt-2 font-display text-base font-semibold text-slate-800">
                    Fortaleza e Região Metropolitana
                  </p>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 via-slate-950/35 to-transparent p-4 text-white">
                <p className="text-xs font-medium text-white/90">
                  Aldeota · Meireles · Benfica · Parquelândia · Messejana · Eusébio · Caucaia · Maracanaú
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 text-sm">
              <div className="flex items-start gap-2.5">
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 text-teal-700 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-slate-900">Valor transparente</p>
                  <p className="text-xs text-slate-600">
                    Você define ou consulta o valor antes de confirmar.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin
                  className="mt-0.5 h-4 w-4 text-teal-700 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-slate-900">Por bairro e turno</p>
                  <p className="text-xs text-slate-600">
                    Busca prática em Fortaleza e cidades vizinhas.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-6">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {authMode === 'login' ? 'Entrar na plataforma' : 'Criar conta'}
              </h2>

              <div
                role="tablist"
                aria-label="Modo de autenticação"
                className="flex items-center gap-1 rounded-xl bg-slate-100 p-1"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={authMode === 'login'}
                  onClick={() => handleSwitchMode('login')}
                  className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    authMode === 'login'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={authMode === 'register'}
                  onClick={() => handleSwitchMode('register')}
                  className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    authMode === 'register'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cadastrar
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-slate-800">
                  1. Selecione como deseja usar o AjeitaLar
                </p>
                <RoleSelector
                  selectedRole={role}
                  onSelectRole={handleSelectRole}
                  disabled={isSubmitting}
                />
              </div>

              {authMode === 'register' && (
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="auth-fullname"
                    className="text-sm font-medium text-slate-800"
                  >
                    Nome completo
                  </label>
                  <input
                    id="auth-fullname"
                    type="text"
                    value={fullName}
                    disabled={isSubmitting}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex.: Ana Paula Ferreira"
                    className={`min-h-[44px] w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      fieldErrors.fullName
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-slate-200 focus:border-teal-700 focus:ring-teal-700/15'
                    }`}
                  />
                  {fieldErrors.fullName && (
                    <p className="text-xs font-medium text-red-700">
                      {fieldErrors.fullName}
                    </p>
                  )}
                </div>
              )}

              <PhoneInputField
                id="auth-phone"
                label="Telefone (WhatsApp DDD 85)"
                value={phone}
                onChange={setPhone}
                error={fieldErrors.phone}
                disabled={isSubmitting}
              />

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="auth-password"
                  className="text-sm font-medium text-slate-800"
                >
                  Senha
                </label>
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  disabled={isSubmitting}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className={`min-h-[44px] w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    fieldErrors.password
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-slate-200 focus:border-teal-700 focus:ring-teal-700/15'
                  }`}
                />
                {fieldErrors.password && (
                  <p className="text-xs font-medium text-red-700">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {authMode === 'register' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div
                    className={`flex flex-col gap-1.5 ${
                      role === 'contractor' ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <label
                      htmlFor="auth-neighborhood"
                      className="text-sm font-medium text-slate-800"
                    >
                      Bairro principal (Fortaleza / RMF)
                    </label>
                    <select
                      id="auth-neighborhood"
                      value={neighborhood}
                      disabled={isSubmitting}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/15"
                    >
                      {FORTALEZA_NEIGHBORHOODS.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name} — {item.zone}
                        </option>
                      ))}
                    </select>
                  </div>

                  {role === 'provider' && (
                    <>
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="auth-daily-rate"
                          className="text-sm font-medium text-slate-800"
                        >
                          Diária base (R$)
                        </label>
                        <input
                          id="auth-daily-rate"
                          type="number"
                          min={60}
                          max={1500}
                          value={dailyRateBrl}
                          disabled={isSubmitting}
                          onChange={(e) => setDailyRateBrl(e.target.value)}
                          className={`min-h-[44px] w-full rounded-xl border bg-white px-3.5 py-2.5 font-mono text-sm tabular-nums text-slate-900 focus:outline-none focus:ring-2 ${
                            fieldErrors.dailyRateBrl
                              ? 'border-red-500 focus:ring-red-200'
                              : 'border-slate-200 focus:border-teal-700 focus:ring-teal-700/15'
                          }`}
                        />
                        {fieldErrors.dailyRateBrl && (
                          <p className="text-xs font-medium text-red-700">
                            {fieldErrors.dailyRateBrl}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label
                          htmlFor="auth-specialty"
                          className="text-sm font-medium text-slate-800"
                        >
                          Especialidade principal
                        </label>
                        <select
                          id="auth-specialty"
                          value={specialty}
                          disabled={isSubmitting}
                          onChange={(e) =>
                            setSpecialty(e.target.value as SpecialtyCode)
                          }
                          className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/15"
                        >
                          {SERVICE_CATEGORIES.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              )}

              {serverError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
                >
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="min-h-[48px] w-full rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                {isSubmitting
                  ? 'Processando...'
                  : authMode === 'login'
                    ? role === 'contractor'
                      ? 'Entrar como Contratante'
                      : 'Entrar como Profissional'
                    : role === 'contractor'
                      ? 'Criar conta para Contratar'
                      : 'Criar conta para Trabalhar'}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs font-medium text-slate-500">
                Explorar agora com contas de demonstração (DDD 85):
              </p>
              <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => void handleDemoAccess('contractor')}
                  className="min-h-[44px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 whitespace-nowrap transition-colors hover:bg-slate-100"
                >
                  Demo: Contratante (Aldeota)
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => void handleDemoAccess('provider')}
                  className="min-h-[44px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 whitespace-nowrap transition-colors hover:bg-slate-100"
                >
                  Demo: Profissional (Maria)
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
