import type {SupabaseClient} from '@supabase/supabase-js';
import type {
  CreateServiceOfferInput,
  OfferFilters,
  ServiceOffer,
} from '../../domain/entities/ServiceOffer';
import type {IOfferRepository} from '../../domain/repositories/IOfferRepository';
import type {ServiceOfferRowDTO} from '../dto/DatabaseDTOs';
import {OfferMapper} from '../mappers/OfferMapper';

export class SupabaseOfferRepository implements IOfferRepository {
  constructor(private readonly client: SupabaseClient) {}

  public async listByContractor(
    contractorId: string,
  ): Promise<readonly ServiceOffer[]> {
    const {data, error} = await this.client
      .from('service_offers')
      .select('*, contractor:profiles!service_offers_contractor_id_fkey(full_name)')
      .eq('contractor_id', contractorId)
      .order('created_at', {ascending: false})
      .returns<ServiceOfferRowDTO[]>();

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(OfferMapper.toDomain);
  }

  public async listOpenOffers(
    filters?: OfferFilters,
  ): Promise<readonly ServiceOffer[]> {
    let query = this.client
      .from('service_offers')
      .select('*, contractor:profiles!service_offers_contractor_id_fkey(full_name)')
      .eq('status', 'open')
      .order('service_date', {ascending: true});

    if (filters?.neighborhood) {
      query = query.eq('neighborhood', filters.neighborhood);
    }

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    const {data, error} = await query.returns<ServiceOfferRowDTO[]>();
    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(OfferMapper.toDomain);
  }

  public async create(input: CreateServiceOfferInput): Promise<ServiceOffer> {
    const payload = OfferMapper.toPersistence(input);
    const {data, error} = await this.client
      .from('service_offers')
      .insert(payload)
      .select('*, contractor:profiles!service_offers_contractor_id_fkey(full_name)')
      .single<ServiceOfferRowDTO>();

    if (error || !data) {
      throw new Error(error?.message ?? 'Erro ao publicar demanda.');
    }

    return OfferMapper.toDomain(data);
  }

  public async cancel(offerId: string, contractorId: string): Promise<ServiceOffer> {
    const {data, error} = await this.client
      .from('service_offers')
      .update({status: 'cancelled'})
      .eq('id', offerId)
      .eq('contractor_id', contractorId)
      .select('*, contractor:profiles!service_offers_contractor_id_fkey(full_name)')
      .single<ServiceOfferRowDTO>();

    if (error || !data) {
      throw new Error(error?.message ?? 'Erro ao cancelar demanda.');
    }

    return OfferMapper.toDomain(data);
  }

  public async markAccepted(offerId: string): Promise<ServiceOffer> {
    const {data, error} = await this.client
      .from('service_offers')
      .update({status: 'accepted'})
      .eq('id', offerId)
      .eq('status', 'open')
      .select('*, contractor:profiles!service_offers_contractor_id_fkey(full_name)')
      .single<ServiceOfferRowDTO>();

    if (error || !data) {
      throw new Error(
        error?.message ?? 'Esta demanda já foi aceita ou cancelada.',
      );
    }

    return OfferMapper.toDomain(data);
  }
}
