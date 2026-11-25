import type {Booking} from '../../domain/entities/Booking';
import type {IBookingRepository} from '../../domain/repositories/IBookingRepository';

export class AcceptOfferUseCase {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  public async execute(offerId: string, providerId: string): Promise<Booking> {
    if (!offerId.trim() || !providerId.trim()) {
      throw new Error('Identificadores inválidos para aceitar a diária.');
    }
    return this.bookingRepository.createFromOffer(offerId, providerId);
  }
}
