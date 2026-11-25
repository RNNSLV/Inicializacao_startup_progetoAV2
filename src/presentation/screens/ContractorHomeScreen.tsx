import {useState} from 'react';
import type {SpecialtyCode, UserProfile} from '../../domain/entities/UserProfile';
import type {IOfferRepository} from '../../domain/repositories/IOfferRepository';
import type {IProviderRepository} from '../../domain/repositories/IProviderRepository';
import type {IBookingRepository} from '../../domain/repositories/IBookingRepository';
import {useOffers} from '../../application/hooks/useOffers';
import {useProviders} from '../../application/hooks/useProviders';
import {useBookings} from '../../application/hooks/useBookings';
import {
  createOfferSchema,
  getTodayIsoDate,
} from '../../application/validators/offerSchemas';
import {PhoneNumber} from '../../domain/valueObjects/PhoneNumber';
import {TopNavBar} from '../components/TopNavBar';
import {MobileBottomNav} from '../components/MobileBottomNav';
import {
  OfferForm,
  type OfferFormErrors,
  type OfferFormValuesState,
} from '../components/OfferForm';
import {OfferCard} from '../components/OfferCard';
import {ProviderFilterBar} from '../components/ProviderFilterBar';
import {ProviderCard} from '../components/ProviderCard';
import {BookingCard} from '../components/BookingCard';
import {CalendarCheck, PlusCircle, Search} from 'lucide-react';

export interface ContractorHomeScreenProps {
  readonly user: UserProfile;
  readonly offerRepository: IOfferRepository;
  readonly providerRepository: IProviderRepository;
  readonly bookingRepository: IBookingRepository;
  readonly onSignOut: () => Promise<void>;
}

type ContractorTab = 'publish' | 'search' | 'bookings';

export function ContractorHomeScreen({
  user,
  offerRepository,
  providerRepository,
  bookingRepository,
  onSignOut,
}: ContractorHomeScreenProps) {
  const [activeTab, setActiveTab] = useState<ContractorTab>('publish');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const [formValues, setFormValues] = useState<OfferFormValuesState>({
    category: 'faxina_completa',
    serviceDate: getTodayIsoDate(),
    shift: 'manha',
    offeredValueBrl: '180',
    neighborhood: user.neighborhood || 'Aldeota',
    addressReference: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<OfferFormErrors>({});

  const [filterNeighborhood, setFilterNeighborhood] = useState<string>('');
  const [filterSpecialty, setFilterSpecialty] = useState<SpecialtyCode | ''>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {
    offers,
    isLoading: offersLoading,
    isSubmitting: offerSubmitting,
    errorMessage: offersError,
    publishOffer,
    cancelOffer,
  } = useOffers(offerRepository, {
    mode: 'contractor',
    contractorId: user.id,
  });

  const {
    providers,
    isLoading: providersLoading,
    errorMessage: providersError,
  } = useProviders(providerRepository, {
    neighborhood: filterNeighborhood || undefined,
    specialty: filterSpecialty || undefined,
    searchQuery: searchQuery || undefined,
  });

  const {
    bookings,
    isLoading: bookingsLoading,
    isSubmitting: bookingSubmitting,
    errorMessage: bookingsError,
    bookProviderDirectly,
    cancelBooking,
  } = useBookings(bookingRepository, user.id);

  function handleChangeOfferField<K extends keyof OfferFormValuesState>(
    field: K,
    value: OfferFormValuesState[K],
  ): void {
    setFormValues((prev) => ({...prev, [field]: value}));
    if (formErrors[field]) {
      setFormErrors((prev) => ({...prev, [field]: undefined}));
    }
  }

  async function handlePublishOffer(): Promise<void> {
    setFeedbackMessage(null);
    setFormErrors({});

    const validation = createOfferSchema.safeParse({
      category: formValues.category,
      serviceDate: formValues.serviceDate,
      shift: formValues.shift,
      offeredValueBrl: Number(formValues.offeredValueBrl),
      neighborhood: formValues.neighborhood,
      addressReference: formValues.addressReference,
      notes: formValues.notes,
    });

    if (!validation.success) {
      const nextErrors: OfferFormErrors = {};
      for (const issue of validation.error.issues) {
        const key = issue.path[0] as keyof OfferFormValuesState;
        if (!nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      setFormErrors(nextErrors);
      return;
    }

    const created = await publishOffer(user.id, validation.data);
    if (created) {
      setFormValues((prev) => ({
        ...prev,
        addressReference: '',
        notes: '',
      }));
      setFeedbackMessage(
        `Demanda em ${created.neighborhood} publicada com sucesso.`,
      );
    }
  }

  async function handleRequestProviderBooking(provider: UserProfile): Promise<void> {
    setFeedbackMessage(null);
    const primaryCategory = provider.specialties[0] ?? 'faxina_completa';
    const created = await bookProviderDirectly({
      contractorId: user.id,
      providerId: provider.id,
      category: primaryCategory,
      serviceDate: getTodayIsoDate(),
      shift: 'integral',
      neighborhood: user.neighborhood,
      agreedValueCents: provider.dailyRateCents ?? 16000,
    });

    if (created) {
      setFeedbackMessage(
        `Diária solicitada com ${provider.fullName}. Veja os detalhes em Agendamentos.`,
      );
    }
  }

  const navLinks = [
    {id: 'publish', label: 'Publicar Demanda'},
    {id: 'search', label: 'Buscar Profissionais'},
    {id: 'bookings', label: `Agendamentos (${bookings.length})`},
  ] as const;

  const mobileTabs = [
    {
      id: 'publish',
      label: 'Publicar',
      icon: <PlusCircle className="h-5 w-5" />,
    },
    {
      id: 'search',
      label: 'Profissionais',
      icon: <Search className="h-5 w-5" />,
    },
    {
      id: 'bookings',
      label: `Agenda (${bookings.length})`,
      icon: <CalendarCheck className="h-5 w-5" />,
    },
  ] as const;

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24 md:pb-12">
      <TopNavBar
        brandTitle="AjeitaLar Fortaleza"
        links={navLinks}
        activeLinkId={activeTab}
        onSelectLink={(id) => {
          setFeedbackMessage(null);
          setActiveTab(id as ContractorTab);
        }}
        primaryActionLabel="Sair da conta"
        onPrimaryAction={() => void onSignOut()}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <section className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold text-teal-800">
              Área do Contratante · {user.neighborhood}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Olá, {user.fullName}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              <span>{PhoneNumber.formatDisplayFromE164(user.phoneE164)}</span>
              <span aria-hidden="true"> · </span>
              <span>Escolha publicar uma demanda ou buscar profissionais por bairro.</span>
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Ações principais do contratante"
            className="grid w-full grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 sm:inline-flex sm:w-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'publish'}
              onClick={() => setActiveTab('publish')}
              className={`min-h-[42px] rounded-lg px-3 py-2 text-xs font-semibold whitespace-nowrap truncate transition-colors ${
                activeTab === 'publish'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              A · Publicar Demanda
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'search'}
              onClick={() => setActiveTab('search')}
              className={`min-h-[42px] rounded-lg px-3 py-2 text-xs font-semibold whitespace-nowrap truncate transition-colors ${
                activeTab === 'search'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              B · Profissionais
            </button>
          </div>
        </section>

        {feedbackMessage && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-900"
          >
            {feedbackMessage}
          </div>
        )}

        {(offersError || providersError || bookingsError) && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          >
            {offersError ?? providersError ?? bookingsError}
          </div>
        )}

        {activeTab === 'publish' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <OfferForm
                values={formValues}
                errors={formErrors}
                isSubmitting={offerSubmitting}
                onChangeField={handleChangeOfferField}
                onSubmit={() => void handlePublishOffer()}
              />
            </div>

            <section
              aria-label="Minhas demandas publicadas"
              className="lg:col-span-6"
            >
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Minhas demandas publicadas
                </h2>
                <span className="font-mono text-xs tabular-nums text-slate-500">
                  {offers.length} {offers.length === 1 ? 'registro' : 'registros'}
                </span>
              </div>

              {offersLoading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                  Carregando suas demandas...
                </div>
              ) : offers.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                  Você ainda não publicou nenhuma demanda. Preencha o formulário ao lado para receber candidaturas.
                </div>
              ) : (
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      viewerRole="contractor"
                      isBusy={offerSubmitting}
                      onCancelOffer={(offerId) =>
                        void cancelOffer(offerId, user.id)
                      }
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-6">
            <ProviderFilterBar
              neighborhood={filterNeighborhood}
              specialty={filterSpecialty}
              searchQuery={searchQuery}
              onChangeNeighborhood={setFilterNeighborhood}
              onChangeSpecialty={setFilterSpecialty}
              onChangeSearchQuery={setSearchQuery}
              onResetFilters={() => {
                setFilterNeighborhood('');
                setFilterSpecialty('');
                setSearchQuery('');
              }}
            />

            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Profissionais disponíveis em Fortaleza e RMF
              </h2>
              <span className="font-mono text-xs tabular-nums text-slate-500">
                {providers.length}{' '}
                {providers.length === 1 ? 'encontrada' : 'encontradas'}
              </span>
            </div>

            {providersLoading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                Buscando profissionais disponíveis...
              </div>
            ) : providers.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <p className="text-base font-semibold text-slate-900">
                  Nenhuma profissional encontrada para este filtro.
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Tente selecionar outro bairro próximo ou publique uma demanda aberta no Caminho A.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {providers.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    isBooking={bookingSubmitting}
                    onRequestBooking={(selected) =>
                      void handleRequestProviderBooking(selected)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <section aria-label="Meus agendamentos" className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Diárias agendadas
              </h2>
              <span className="font-mono text-xs tabular-nums text-slate-500">
                {bookings.length}{' '}
                {bookings.length === 1 ? 'agendamento' : 'agendamentos'}
              </span>
            </div>

            {bookingsLoading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                Carregando agendamentos...
              </div>
            ) : bookings.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <p className="text-base font-semibold text-slate-900">
                  Nenhum agendamento confirmado ainda.
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Publique uma demanda ou solicite uma diária diretamente na busca de profissionais.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    viewerRole="contractor"
                    isBusy={bookingSubmitting}
                    onCancelBooking={(bookingId) =>
                      void cancelBooking(bookingId, user.id)
                    }
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <MobileBottomNav
        tabs={mobileTabs}
        activeTabId={activeTab}
        onSelectTab={(id) => {
          setFeedbackMessage(null);
          setActiveTab(id as ContractorTab);
        }}
      />
    </div>
  );
}
