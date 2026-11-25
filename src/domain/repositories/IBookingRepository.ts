import type {Booking, CreateDirectBookingInput} from '../entities/Booking';

export interface IBookingRepository {
  listForUser(userId: string): Promise<readonly Booking[]>;
  createFromOffer(offerId: string, providerId: string): Promise<Booking>;
  createDirectBooking(input: CreateDirectBookingInput): Promise<Booking>;
  cancelBooking(bookingId: string, actorId: string): Promise<Booking>;
}
