import type {SupabaseClient} from '@supabase/supabase-js';
import type {Booking, CreateDirectBookingInput} from '../../domain/entities/Booking';
import type {IBookingRepository} from '../../domain/repositories/IBookingRepository';
import type {BookingRowDTO, ServiceOfferRowDTO} from '../dto/DatabaseDTOs';
import {BookingMapper} from '../mappers/BookingMapper';

export class SupabaseBookingRepository implements IBookingRepository {
  constructor(private readonly client: SupabaseClient) {}

  public async listForUser(userId: string): Promise<readonly Booking[]> {
    const {data, error} = await this.client
      .from('bookings')
      .select(
        '*, contractor:profiles!bookings_contractor_id_fkey(full_name), provider:profiles!bookings_provider_id_fkey(full_name)',
      )
      .or(`contractor_id.eq.${userId},provider_id.eq.${userId}`)
      .order('service_date', {ascending: true})
      .returns<BookingRowDTO[]>();

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(BookingMapper.toDomain);
  }

  public async createFromOffer(
    offerId: string,
    providerId: string,
  ): Promise<Booking> {
    const {data: offer, error: offerError} = await this.client
      .from('service_offers')
      .update({status: 'accepted'})
      .eq('id', offerId)
      .eq('status', 'open')
      .select('*')
      .single<ServiceOfferRowDTO>();

    if (offerError || !offer) {
      throw new Error('Esta diária já não está mais disponível.');
    }

    const {data: booking, error: bookingError} = await this.client
      .from('bookings')
      .insert({
        offer_id: offer.id,
        contractor_id: offer.contractor_id,
        provider_id: providerId,
        category: offer.category,
        service_date: offer.service_date,
        shift: offer.shift,
        neighborhood: offer.neighborhood,
        agreed_value_cents: offer.offered_value_cents,
        status: 'confirmed',
      })
      .select(
        '*, contractor:profiles!bookings_contractor_id_fkey(full_name), provider:profiles!bookings_provider_id_fkey(full_name)',
      )
      .single<BookingRowDTO>();

    if (bookingError || !booking) {
      throw new Error(bookingError?.message ?? 'Erro ao confirmar agendamento.');
    }

    return BookingMapper.toDomain(booking);
  }

  public async createDirectBooking(
    input: CreateDirectBookingInput,
  ): Promise<Booking> {
    const {data: booking, error} = await this.client
      .from('bookings')
      .insert({
        offer_id: null,
        contractor_id: input.contractorId,
        provider_id: input.providerId,
        category: input.category,
        service_date: input.serviceDate,
        shift: input.shift,
        neighborhood: input.neighborhood,
        agreed_value_cents: input.agreedValueCents,
        status: 'confirmed',
      })
      .select(
        '*, contractor:profiles!bookings_contractor_id_fkey(full_name), provider:profiles!bookings_provider_id_fkey(full_name)',
      )
      .single<BookingRowDTO>();

    if (error || !booking) {
      throw new Error(error?.message ?? 'Erro ao solicitar diária.');
    }

    return BookingMapper.toDomain(booking);
  }

  public async cancelBooking(
    bookingId: string,
    actorId: string,
  ): Promise<Booking> {
    const {data, error} = await this.client
      .from('bookings')
      .update({status: 'cancelled'})
      .eq('id', bookingId)
      .or(`contractor_id.eq.${actorId},provider_id.eq.${actorId}`)
      .select(
        '*, contractor:profiles!bookings_contractor_id_fkey(full_name), provider:profiles!bookings_provider_id_fkey(full_name)',
      )
      .single<BookingRowDTO>();

    if (error || !data) {
      throw new Error(error?.message ?? 'Erro ao cancelar agendamento.');
    }

    return BookingMapper.toDomain(data);
  }
}
