import type {BookingStatus} from '../../domain/entities/Booking';
import type {OfferStatus, ServiceCategory, WorkShift} from '../../domain/entities/ServiceOffer';
import type {SpecialtyCode, UserRole} from '../../domain/entities/UserProfile';

export interface ProfileRowDTO {
  readonly id: string;
  readonly role: UserRole;
  readonly full_name: string;
  readonly phone_e164: string;
  readonly neighborhood: string;
  readonly bio: string;
  readonly specialties: readonly SpecialtyCode[];
  readonly daily_rate_cents: number | null;
  readonly is_available: boolean;
  readonly completed_services_count: number;
  readonly rating_average: number;
  readonly avatar_url: string | null;
  readonly created_at: string;
}

export interface ProfileInsertDTO {
  readonly id: string;
  readonly role: UserRole;
  readonly full_name: string;
  readonly phone_e164: string;
  readonly neighborhood: string;
  readonly bio: string;
  readonly specialties: readonly SpecialtyCode[];
  readonly daily_rate_cents: number | null;
  readonly is_available: boolean;
}

export interface ServiceOfferRowDTO {
  readonly id: string;
  readonly contractor_id: string;
  readonly category: ServiceCategory;
  readonly service_date: string;
  readonly shift: WorkShift;
  readonly offered_value_cents: number;
  readonly neighborhood: string;
  readonly address_reference: string;
  readonly notes: string;
  readonly status: OfferStatus;
  readonly created_at: string;
  readonly contractor?: {readonly full_name: string} | null;
}

export interface ServiceOfferInsertDTO {
  readonly contractor_id: string;
  readonly category: ServiceCategory;
  readonly service_date: string;
  readonly shift: WorkShift;
  readonly offered_value_cents: number;
  readonly neighborhood: string;
  readonly address_reference: string;
  readonly notes: string;
  readonly status: OfferStatus;
}

export interface BookingRowDTO {
  readonly id: string;
  readonly offer_id: string | null;
  readonly contractor_id: string;
  readonly provider_id: string;
  readonly category: ServiceCategory;
  readonly service_date: string;
  readonly shift: WorkShift;
  readonly neighborhood: string;
  readonly agreed_value_cents: number;
  readonly status: BookingStatus;
  readonly created_at: string;
  readonly contractor?: {readonly full_name: string} | null;
  readonly provider?: {readonly full_name: string} | null;
}
