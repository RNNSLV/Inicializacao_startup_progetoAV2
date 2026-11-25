import type {
  CreateServiceOfferInput,
  ServiceOffer,
} from '../../domain/entities/ServiceOffer';
import type {ServiceOfferInsertDTO, ServiceOfferRowDTO} from '../dto/DatabaseDTOs';

export const OfferMapper = {
  toDomain(dto: ServiceOfferRowDTO): ServiceOffer {
    return {
      id: dto.id,
      contractorId: dto.contractor_id,
      contractorName: dto.contractor?.full_name,
      category: dto.category,
      serviceDate: dto.service_date,
      shift: dto.shift,
      offeredValueCents: dto.offered_value_cents,
      neighborhood: dto.neighborhood,
      addressReference: dto.address_reference,
      notes: dto.notes,
      status: dto.status,
      createdAt: dto.created_at,
    };
  },

  toPersistence(input: CreateServiceOfferInput): ServiceOfferInsertDTO {
    return {
      contractor_id: input.contractorId,
      category: input.category,
      service_date: input.serviceDate,
      shift: input.shift,
      offered_value_cents: input.offeredValueCents,
      neighborhood: input.neighborhood,
      address_reference: input.addressReference.trim(),
      notes: input.notes.trim(),
      status: 'open',
    };
  },
};
