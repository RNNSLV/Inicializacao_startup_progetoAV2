import {useState} from 'react';
import type {ServiceCategory} from '../../domain/entities/ServiceOffer';
import type {UserProfile} from '../../domain/entities/UserProfile';
import type {IOfferRepository} from '../../domain/repositories/IOfferRepository';
import type {IBookingRepository} from '../../domain/repositories/IBookingRepository';
import {useOffers} from '../../application/hooks/useOffers';
import {useBookings} from '../../application/hooks/useBookings';
import {PhoneNumber} from '../../domain/valueObjects/PhoneNumber';
import {
  FORTALEZA_NEIGHBORHOODS,
  SERVICE_CATEGORIES,
} from '../../shared/constants/fortalezaNeighborhoods';
import {TopNavBar} from '../components/TopNavBar';
import {MobileBottomNav} from '../components/MobileBottomNav';
import {OfferCard} from '../components/OfferCard';
import {BookingCard} from '../components/BookingCard';
import {Briefcase, CalendarCheck} from 'lucide-react';

export interface ProviderHomeScreenProps {
  readonly user: UserProfile;
  readonly offerRepository: IOfferRepository;
  readonly bookingRepository: IBookingRepository;
  readonly onSignOut: () => Promise<void>;
}

type ProviderTab = 'offers' | 'bookings';

export function ProviderHomeScreen({
  user,
  offerRepository,
  bookingRepository,
  onSignOut,
}: ProviderHomeScreenProps) {
  const [activeTab, setActiveTab] = useState<ProviderTab>('offers');
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | ''>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const {
    offers,
    isLoading: offersLoading,
    errorMessage: offersError,
    refresh: refreshOffers,
  } = useOffers(offerRepository, {
    mode: 'open',
    filters: {
      neighborhood: neighborhoodFilter || undefined,
      category: categoryFilter || undefined,
      onlyOpen: true,
    },
  });

  const {
    bookings,
    isLoading: bookingsLoading,
    isSubmitting: bookingSubmitting,
    errorMessage: bookingsError,
    acceptOffer,
    cancelBooking,
  } = useBookings(bookingRepository, user.id);

  async function handleAcceptOffer(offerId: string): Promise<void> {
    setFeedbackMessage(null);
    const created = await acceptOffer(offerId, user.id);
    if (created) {
      await refreshOffers();
      setFeedbackMessage(
        `Diária confirmada em ${created.neighborhood}! Veja os detalhes em Meus Agendamentos.`,
      );
    }
  }

  const navLinks = [
    {id: 'offers', label: 'Demandas Abertas'},
    {id: 'bookings', label: `Meus Agendamentos (${bookings.length})`},
  ] as const;

  const mobileTabs = [
    {
      id: 'offers',
      label: 'Demandas',
      icon: <Briefcase className="h-5 w-5" />,
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
          setActiveTab(id as ProviderTab);
        }}
        primaryActionLabel="Sair da conta"
        onPrimaryAction={() => void onSignOut()}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <section className="mb-6 border-b border-slate-200 pb-6">
          <p className="text-xs font-semibold text-teal-800">
            Área da Profissional · {user.neighborhood}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Olá, {user.fullName}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            <span>{PhoneNumber.formatDisplayFromE164(user.phoneE164)}</span>
            <span aria-hidden="true"> · </span>
            <span>Confira diárias abertas em Fortaleza e Região Metropolitana.</span>
          </p>
        </section>

        {feedbackMessage && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-900"
          >
            {feedbackMessage}
          </div>
        )}

        {(offersError || bookingsError) && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          >
            {offersError ?? bookingsError}
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="space-y-6">
            <section
              aria-label="Filtrar demandas abertas"
              className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 sm:p-5"
            >
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="provider-filter-neighborhood"
                  className="text-xs font-medium text-slate-700"
                >
                  Filtrar por bairro (Fortaleza / RMF)
                </label>
                <select
                  id="provider-filter-neighborhood"
                  value={neighborhoodFilter}
                  onChange={(e) => setNeighborhoodFilter(e.target.value)}
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
                  htmlFor="provider-filter-category"
                  className="text-xs font-medium text-slate-700"
                >
                  Filtrar por categoria
                </label>
                <select
                  id="provider-filter-category"
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value as ServiceCategory | '')
                  }
                  className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/15"
                >
                  <option value="">Todas as categorias</option>
                  {SERVICE_CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Demandas abertas perto de você
              </h2>
              <span className="font-mono text-xs tabular-nums text-slate-500">
                {offers.length} {offers.length === 1 ? 'vaga' : 'vagas'}
              </span>
            </div>

            {offersLoading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                Buscando diárias disponíveis...
              </div>
            ) : offers.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <p className="text-base font-semibold text-slate-900">
                  Nenhuma demanda aberta para este filtro no momento.
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Remova os filtros de bairro ou categoria para ver todas as oportunidades.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {offers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    viewerRole="provider"
                    isBusy={bookingSubmitting}
                    onAcceptOffer={(id) => void handleAcceptOffer(id)}
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
                Meus agendamentos confirmados
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
                  Você ainda não aceitou nenhuma diária.
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Acesse "Demandas Abertas" para aceitar serviços no seu bairro.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    viewerRole="provider"
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
          setActiveTab(id as ProviderTab);
        }}
      />
    </div>
  );
}
