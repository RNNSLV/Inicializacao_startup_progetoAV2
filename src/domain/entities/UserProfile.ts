export type UserRole = 'contractor' | 'provider';

export type SpecialtyCode =
  | 'faxina_completa'
  | 'limpeza_leve'
  | 'passadoria'
  | 'cozinha_diaria'
  | 'pos_obra'
  | 'cuidados_idosos';

export interface UserProfile {
  readonly id: string;
  readonly role: UserRole;
  readonly fullName: string;
  readonly phoneE164: string;
  readonly neighborhood: string;
  readonly bio: string;
  readonly specialties: readonly SpecialtyCode[];
  readonly dailyRateCents: number | null;
  readonly isAvailable: boolean;
  readonly completedServicesCount: number;
  readonly ratingAverage: number;
  readonly avatarUrl: string | null;
  readonly createdAt: string;
}

export interface ProviderFilter {
  readonly neighborhood?: string;
  readonly specialty?: SpecialtyCode;
  readonly searchQuery?: string;
}

export interface SignInCredentials {
  readonly phoneE164: string;
  readonly password: string;
  readonly role: UserRole;
}

export interface RegisterAccountInput {
  readonly role: UserRole;
  readonly fullName: string;
  readonly phoneE164: string;
  readonly password: string;
  readonly neighborhood: string;
  readonly bio?: string;
  readonly specialties?: readonly SpecialtyCode[];
  readonly dailyRateCents?: number | null;
}
