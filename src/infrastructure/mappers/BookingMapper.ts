import type {Booking} from '../../domain/entities/Booking';
import type {BookingRowDTO} from '../dto/DatabaseDTOs';

export const BookingMapper = {
  toDomain(dto: BookingRowDTO): Booking {
    return {
      id: dto.id,
      offerId: dto.offer_id,
      contractorId: dto.contractor_id,
      providerId: dto.provider_id,
      contractorName: dto.contractor?.full_name ?? 'Contratante',
      providerName: dto.provider?.full_name ?? 'Profissional',
      category: dto.category,
      serviceDate: dto.service_date,
      shift: dto.shift,
      neighborhood: dto.neighborhood,
      agreedValueCents: dto.agreed_value_cents,
      status: dto.status,
      createdAt: dto.created_at,
    };
  },
};
