import type {
  CreateServiceOfferInput,
  OfferFilters,
  ServiceOffer,
} from '../entities/ServiceOffer';

export interface IOfferRepository {
  listByContractor(contractorId: string): Promise<readonly ServiceOffer[]>;
  listOpenOffers(filters?: OfferFilters): Promise<readonly ServiceOffer[]>;
  create(input: CreateServiceOfferInput): Promise<ServiceOffer>;
  cancel(offerId: string, contractorId: string): Promise<ServiceOffer>;
  markAccepted(offerId: string): Promise<ServiceOffer>;
}
