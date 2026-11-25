import type {ServiceCategory, WorkShift} from './ServiceOffer';

export type BookingStatus = 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  readonly id: string;
  readonly offerId: string | null;
  readonly contractorId: string;
  readonly providerId: string;
  readonly contractorName: string;
  readonly providerName: string;
  readonly category: ServiceCategory;
  readonly serviceDate: string;
  readonly shift: WorkShift;
  readonly neighborhood: string;
  readonly agreedValueCents: number;
  readonly status: BookingStatus;
  readonly createdAt: string;
}

export interface CreateDirectBookingInput {
  readonly contractorId: string;
  readonly providerId: string;
  readonly category: ServiceCategory;
  readonly serviceDate: string;
  readonly shift: WorkShift;
  readonly neighborhood: string;
  readonly agreedValueCents: number;
}
