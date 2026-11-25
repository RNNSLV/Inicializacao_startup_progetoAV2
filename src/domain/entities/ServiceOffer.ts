import type {SpecialtyCode} from './UserProfile';

export type ServiceCategory = SpecialtyCode;

export type WorkShift = 'manha' | 'tarde' | 'integral';

export type OfferStatus = 'open' | 'accepted' | 'cancelled' | 'completed';

export interface ServiceOffer {
  readonly id: string;
  readonly contractorId: string;
  readonly contractorName?: string;
  readonly category: ServiceCategory;
  readonly serviceDate: string;
  readonly shift: WorkShift;
  readonly offeredValueCents: number;
  readonly neighborhood: string;
  readonly addressReference: string;
  readonly notes: string;
  readonly status: OfferStatus;
  readonly createdAt: string;
}

export interface CreateServiceOfferInput {
  readonly contractorId: string;
  readonly category: ServiceCategory;
  readonly serviceDate: string;
  readonly shift: WorkShift;
  readonly offeredValueCents: number;
  readonly neighborhood: string;
  readonly addressReference: string;
  readonly notes: string;
}

export interface OfferFilters {
  readonly neighborhood?: string;
  readonly category?: ServiceCategory;
  readonly onlyOpen?: boolean;
}
