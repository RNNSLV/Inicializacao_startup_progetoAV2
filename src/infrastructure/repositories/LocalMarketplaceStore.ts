import type {Booking, CreateDirectBookingInput} from '../../domain/entities/Booking';
import type {
  CreateServiceOfferInput,
  OfferFilters,
  ServiceOffer,
} from '../../domain/entities/ServiceOffer';
import type {
  ProviderFilter,
  RegisterAccountInput,
  SignInCredentials,
  UserProfile,
} from '../../domain/entities/UserProfile';
import type {IAuthRepository} from '../../domain/repositories/IAuthRepository';
import type {IBookingRepository} from '../../domain/repositories/IBookingRepository';
import type {IOfferRepository} from '../../domain/repositories/IOfferRepository';
import type {IProviderRepository} from '../../domain/repositories/IProviderRepository';
import {PhoneNumber} from '../../domain/valueObjects/PhoneNumber';

interface StoredAccount {
  readonly profile: UserProfile;
  readonly password: string;
}

interface PersistedMarketplaceState {
  readonly currentUserId: string | null;
  readonly accounts: readonly StoredAccount[];
  readonly offers: readonly ServiceOffer[];
  readonly bookings: readonly Booking[];
}

const STORAGE_KEY = 'ajeitalar_fortaleza_mvp_v1';

function buildFutureDate(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function createInitialSeedState(): PersistedMarketplaceState {
  const nowIso = new Date().toISOString();

  const contractorDemo: UserProfile = {
    id: 'user-contractor-demo',
    role: 'contractor',
    fullName: 'Camila Vasconcelos',
    phoneE164: '+5585988123456',
    neighborhood: 'Aldeota',
    bio: 'Apartamento residencial com 3 quartos próximo à Praça Portugal.',
    specialties: [],
    dailyRateCents: null,
    isAvailable: false,
    completedServicesCount: 6,
    ratingAverage: 5.0,
    avatarUrl: null,
    createdAt: nowIso,
  };

  const providers: readonly UserProfile[] = [
    {
      id: 'provider-maria-socorro',
      role: 'provider',
      fullName: 'Maria do Socorro Lima',
      phoneE164: '+5585999441122',
      neighborhood: 'Aldeota',
      bio: '8 anos de experiência em apartamentos na Aldeota, Meireles e Cocó. Referências verificadas.',
      specialties: ['faxina_completa', 'limpeza_leve', 'passadoria'],
      dailyRateCents: 17000,
      isAvailable: true,
      completedServicesCount: 142,
      ratingAverage: 4.96,
      avatarUrl: '/src/assets/images/provider_avatar_maria_1795620029620.jpg',
      createdAt: nowIso,
    },
    {
      id: 'provider-antonio-carlos',
      role: 'provider',
      fullName: 'Antônio Carlos Ferreira',
      phoneE164: '+5585997118833',
      neighborhood: 'Benfica',
      bio: 'Especialista em limpeza pós-obra, vidros, varandas e organização pesada em Fortaleza.',
      specialties: ['pos_obra', 'faxina_completa'],
      dailyRateCents: 21000,
      isAvailable: true,
      completedServicesCount: 89,
      ratingAverage: 4.91,
      avatarUrl: '/src/assets/images/provider_avatar_antonio_1795620029133.jpg',
      createdAt: nowIso,
    },
    {
      id: 'provider-francisca-alves',
      role: 'provider',
      fullName: 'Francisca Alves Nogueira',
      phoneE164: '+5585987650099',
      neighborhood: 'Messejana',
      bio: 'Atendimento pontual em Messejana, Cambeba e Eusébio. Cozinha caseira cearense e faxina.',
      specialties: ['cozinha_diaria', 'faxina_completa', 'limpeza_leve'],
      dailyRateCents: 16000,
      isAvailable: true,
      completedServicesCount: 118,
      ratingAverage: 4.94,
      avatarUrl: null,
      createdAt: nowIso,
    },
    {
      id: 'provider-raimunda-sousa',
      role: 'provider',
      fullName: 'Raimunda Sousa Pinheiro',
      phoneE164: '+5585986227744',
      neighborhood: 'Parquelândia',
      bio: 'Passadoria caprichosa, organização de guarda-roupas e apoio doméstico para famílias.',
      specialties: ['passadoria', 'limpeza_leve', 'cuidados_idosos'],
      dailyRateCents: 14500,
      isAvailable: true,
      completedServicesCount: 74,
      ratingAverage: 4.88,
      avatarUrl: null,
      createdAt: nowIso,
    },
    {
      id: 'provider-luciana-mendes',
      role: 'provider',
      fullName: 'Luciana Mendes Bezerra',
      phoneE164: '+5585991334455',
      neighborhood: 'Eusébio',
      bio: 'Atuação focada em casas e condomínios no Eusébio, Cidade dos Funcionários e Aquiraz.',
      specialties: ['faxina_completa', 'pos_obra', 'cozinha_diaria'],
      dailyRateCents: 19000,
      isAvailable: true,
      completedServicesCount: 63,
      ratingAverage: 4.92,
      avatarUrl: null,
      createdAt: nowIso,
    },
    {
      id: 'provider-joana-darc',
      role: 'provider',
      fullName: 'Joana Darc Cavalcante',
      phoneE164: '+5585985449911',
      neighborhood: 'Caucaia',
      bio: 'Cuidado atencioso com idosos e manutenção leve do lar em Caucaia, Benfica e Montese.',
      specialties: ['cuidados_idosos', 'limpeza_leve'],
      dailyRateCents: 16500,
      isAvailable: true,
      completedServicesCount: 51,
      ratingAverage: 4.89,
      avatarUrl: null,
      createdAt: nowIso,
    },
  ];

  const offers: readonly ServiceOffer[] = [
    {
      id: 'offer-seed-1',
      contractorId: 'user-contractor-demo',
      contractorName: 'Camila Vasconcelos',
      category: 'faxina_completa',
      serviceDate: buildFutureDate(1),
      shift: 'integral',
      offeredValueCents: 18000,
      neighborhood: 'Aldeota',
      addressReference: 'Próximo à Av. Santos Dumont',
      notes: 'Apartamento 3 quartos, produtos de limpeza já disponíveis no local.',
      status: 'open',
      createdAt: nowIso,
    },
    {
      id: 'offer-seed-2',
      contractorId: 'contractor-seed-2',
      contractorName: 'Rodrigo Holanda',
      category: 'passadoria',
      serviceDate: buildFutureDate(2),
      shift: 'manha',
      offeredValueCents: 12000,
      neighborhood: 'Meireles',
      addressReference: 'Próximo à Av. Beira Mar',
      notes: 'Cerca de 25 peças sociais e roupas de cama.',
      status: 'open',
      createdAt: nowIso,
    },
    {
      id: 'offer-seed-3',
      contractorId: 'contractor-seed-3',
      contractorName: 'Helena Araújo',
      category: 'cozinha_diaria',
      serviceDate: buildFutureDate(3),
      shift: 'tarde',
      offeredValueCents: 15500,
      neighborhood: 'Messejana',
      addressReference: 'Próximo à Lagoa de Messejana',
      notes: 'Preparo de marmitas da semana e organização da bancada.',
      status: 'open',
      createdAt: nowIso,
    },
    {
      id: 'offer-seed-4',
      contractorId: 'contractor-seed-4',
      contractorName: 'Marcelo Parente',
      category: 'pos_obra',
      serviceDate: buildFutureDate(4),
      shift: 'integral',
      offeredValueCents: 24000,
      neighborhood: 'Eusébio',
      addressReference: 'Condomínio próximo à CE-040',
      notes: 'Limpeza final de varanda gourmet e vidros após pintura.',
      status: 'open',
      createdAt: nowIso,
    },
  ];

  return {
    currentUserId: null,
    accounts: [
      {profile: contractorDemo, password: 'demo123'},
      ...providers.map((profile) => ({profile, password: 'demo123'})),
    ],
    offers,
    bookings: [],
  };
}

export class LocalMarketplaceStore
  implements
    IAuthRepository,
    IOfferRepository,
    IProviderRepository,
    IBookingRepository
{
  private readState(): PersistedMarketplaceState {
    if (typeof window === 'undefined' || !window.localStorage) {
      return createInitialSeedState();
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = createInitialSeedState();
      this.writeState(seed);
      return seed;
    }

    try {
      return JSON.parse(raw) as PersistedMarketplaceState;
    } catch {
      const seed = createInitialSeedState();
      this.writeState(seed);
      return seed;
    }
  }

  private writeState(state: PersistedMarketplaceState): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }

  public async getCurrentUser(): Promise<UserProfile | null> {
    const state = this.readState();
    if (!state.currentUserId) {
      return null;
    }
    return (
      state.accounts.find((acc) => acc.profile.id === state.currentUserId)?.profile ??
      null
    );
  }

  public async signIn(credentials: SignInCredentials): Promise<UserProfile> {
    const phone = PhoneNumber.fromRawInput(credentials.phoneE164).toE164();
    const state = this.readState();
    const account = state.accounts.find((item) => item.profile.phoneE164 === phone);

    if (!account || account.password !== credentials.password) {
      throw new Error('Telefone ou senha inválidos. Verifique os dados informados.');
    }

    if (account.profile.role !== credentials.role) {
      const expected =
        account.profile.role === 'contractor' ? 'Quero Contratar' : 'Quero Trabalhar';
      throw new Error(
        `Este número pertence ao perfil "${expected}". Altere o seletor acima para entrar.`,
      );
    }

    this.writeState({
      ...state,
      currentUserId: account.profile.id,
    });

    return account.profile;
  }

  public async register(input: RegisterAccountInput): Promise<UserProfile> {
    const phone = PhoneNumber.fromRawInput(input.phoneE164).toE164();
    const state = this.readState();

    const exists = state.accounts.some((acc) => acc.profile.phoneE164 === phone);
    if (exists) {
      throw new Error('Já existe uma conta cadastrada com este telefone (DDD 85).');
    }

    const newProfile: UserProfile = {
      id: `user-${crypto.randomUUID()}`,
      role: input.role,
      fullName: input.fullName.trim(),
      phoneE164: phone,
      neighborhood: input.neighborhood,
      bio:
        input.bio?.trim() ||
        (input.role === 'provider'
          ? `Profissional disponível para atendimentos em ${input.neighborhood} e região.`
          : `Residência em ${input.neighborhood}.`),
      specialties:
        input.specialties && input.specialties.length > 0
          ? input.specialties
          : input.role === 'provider'
            ? ['faxina_completa']
            : [],
      dailyRateCents:
        input.role === 'provider' ? (input.dailyRateCents ?? 16000) : null,
      isAvailable: input.role === 'provider',
      completedServicesCount: 0,
      ratingAverage: 5.0,
      avatarUrl: null,
      createdAt: new Date().toISOString(),
    };

    this.writeState({
      ...state,
      currentUserId: newProfile.id,
      accounts: [...state.accounts, {profile: newProfile, password: input.password}],
    });

    return newProfile;
  }

  public async signOut(): Promise<void> {
    const state = this.readState();
    this.writeState({
      ...state,
      currentUserId: null,
    });
  }

  public async listByContractor(
    contractorId: string,
  ): Promise<readonly ServiceOffer[]> {
    const state = this.readState();
    return state.offers.filter((offer) => offer.contractorId === contractorId);
  }

  public async listOpenOffers(
    filters?: OfferFilters,
  ): Promise<readonly ServiceOffer[]> {
    const state = this.readState();
    return state.offers.filter((offer) => {
      if (offer.status !== 'open') {
        return false;
      }
      if (filters?.neighborhood && offer.neighborhood !== filters.neighborhood) {
        return false;
      }
      if (filters?.category && offer.category !== filters.category) {
        return false;
      }
      return true;
    });
  }

  public async create(input: CreateServiceOfferInput): Promise<ServiceOffer> {
    const state = this.readState();
    const contractor = state.accounts.find(
      (acc) => acc.profile.id === input.contractorId,
    )?.profile;

    const newOffer: ServiceOffer = {
      id: `offer-${crypto.randomUUID()}`,
      contractorId: input.contractorId,
      contractorName: contractor?.fullName ?? 'Família Contratante',
      category: input.category,
      serviceDate: input.serviceDate,
      shift: input.shift,
      offeredValueCents: input.offeredValueCents,
      neighborhood: input.neighborhood,
      addressReference: input.addressReference.trim(),
      notes: input.notes.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    this.writeState({
      ...state,
      offers: [newOffer, ...state.offers],
    });

    return newOffer;
  }

  public async cancel(offerId: string, contractorId: string): Promise<ServiceOffer> {
    const state = this.readState();
    const target = state.offers.find(
      (item) => item.id === offerId && item.contractorId === contractorId,
    );
    if (!target) {
      throw new Error('Demanda não encontrada.');
    }

    const updated: ServiceOffer = {...target, status: 'cancelled'};
    this.writeState({
      ...state,
      offers: state.offers.map((item) => (item.id === offerId ? updated : item)),
    });
    return updated;
  }

  public async markAccepted(offerId: string): Promise<ServiceOffer> {
    const state = this.readState();
    const target = state.offers.find(
      (item) => item.id === offerId && item.status === 'open',
    );
    if (!target) {
      throw new Error('Demanda não está mais aberta.');
    }

    const updated: ServiceOffer = {...target, status: 'accepted'};
    this.writeState({
      ...state,
      offers: state.offers.map((item) => (item.id === offerId ? updated : item)),
    });
    return updated;
  }

  public async searchAvailable(
    filter?: ProviderFilter,
  ): Promise<readonly UserProfile[]> {
    const state = this.readState();
    const search = filter?.searchQuery?.trim().toLowerCase();

    return state.accounts
      .map((acc) => acc.profile)
      .filter((profile) => {
        if (profile.role !== 'provider' || !profile.isAvailable) {
          return false;
        }
        if (filter?.neighborhood && profile.neighborhood !== filter.neighborhood) {
          return false;
        }
        if (
          filter?.specialty &&
          !profile.specialties.includes(filter.specialty)
        ) {
          return false;
        }
        if (
          search &&
          !profile.fullName.toLowerCase().includes(search) &&
          !profile.neighborhood.toLowerCase().includes(search) &&
          !profile.bio.toLowerCase().includes(search)
        ) {
          return false;
        }
        return true;
      });
  }

  public async getById(providerId: string): Promise<UserProfile | null> {
    const state = this.readState();
    return (
      state.accounts.find(
        (acc) =>
          acc.profile.id === providerId && acc.profile.role === 'provider',
      )?.profile ?? null
    );
  }

  public async listForUser(userId: string): Promise<readonly Booking[]> {
    const state = this.readState();
    return state.bookings.filter(
      (booking) =>
        booking.contractorId === userId || booking.providerId === userId,
    );
  }

  public async createFromOffer(
    offerId: string,
    providerId: string,
  ): Promise<Booking> {
    const state = this.readState();
    const offer = state.offers.find(
      (item) => item.id === offerId && item.status === 'open',
    );
    if (!offer) {
      throw new Error('Esta diária já não está mais disponível.');
    }

    const provider = state.accounts.find(
      (acc) => acc.profile.id === providerId,
    )?.profile;
    if (!provider) {
      throw new Error('Perfil da profissional não encontrado.');
    }

    const booking: Booking = {
      id: `booking-${crypto.randomUUID()}`,
      offerId: offer.id,
      contractorId: offer.contractorId,
      providerId,
      contractorName: offer.contractorName ?? 'Contratante',
      providerName: provider.fullName,
      category: offer.category,
      serviceDate: offer.serviceDate,
      shift: offer.shift,
      neighborhood: offer.neighborhood,
      agreedValueCents: offer.offeredValueCents,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    const updatedOffer: ServiceOffer = {...offer, status: 'accepted'};

    this.writeState({
      ...state,
      offers: state.offers.map((item) => (item.id === offer.id ? updatedOffer : item)),
      bookings: [booking, ...state.bookings],
    });

    return booking;
  }

  public async createDirectBooking(
    input: CreateDirectBookingInput,
  ): Promise<Booking> {
    const state = this.readState();
    const contractor = state.accounts.find(
      (acc) => acc.profile.id === input.contractorId,
    )?.profile;
    const provider = state.accounts.find(
      (acc) => acc.profile.id === input.providerId,
    )?.profile;

    if (!contractor || !provider) {
      throw new Error('Participantes não encontrados para o agendamento.');
    }

    const booking: Booking = {
      id: `booking-${crypto.randomUUID()}`,
      offerId: null,
      contractorId: input.contractorId,
      providerId: input.providerId,
      contractorName: contractor.fullName,
      providerName: provider.fullName,
      category: input.category,
      serviceDate: input.serviceDate,
      shift: input.shift,
      neighborhood: input.neighborhood,
      agreedValueCents: input.agreedValueCents,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    this.writeState({
      ...state,
      bookings: [booking, ...state.bookings],
    });

    return booking;
  }

  public async cancelBooking(
    bookingId: string,
    actorId: string,
  ): Promise<Booking> {
    const state = this.readState();
    const target = state.bookings.find(
      (item) =>
        item.id === bookingId &&
        (item.contractorId === actorId || item.providerId === actorId),
    );
    if (!target) {
      throw new Error('Agendamento não encontrado.');
    }

    const updated: Booking = {...target, status: 'cancelled'};
    this.writeState({
      ...state,
      bookings: state.bookings.map((item) =>
        item.id === bookingId ? updated : item,
      ),
    });

    return updated;
  }
}
