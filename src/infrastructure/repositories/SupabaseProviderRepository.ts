import type {SupabaseClient} from '@supabase/supabase-js';
import type {ProviderFilter, UserProfile} from '../../domain/entities/UserProfile';
import type {IProviderRepository} from '../../domain/repositories/IProviderRepository';
import type {ProfileRowDTO} from '../dto/DatabaseDTOs';
import {ProfileMapper} from '../mappers/ProfileMapper';

export class SupabaseProviderRepository implements IProviderRepository {
  constructor(private readonly client: SupabaseClient) {}

  public async searchAvailable(
    filter?: ProviderFilter,
  ): Promise<readonly UserProfile[]> {
    let query = this.client
      .from('profiles')
      .select('*')
      .eq('role', 'provider')
      .eq('is_available', true)
      .order('rating_average', {ascending: false});

    if (filter?.neighborhood) {
      query = query.eq('neighborhood', filter.neighborhood);
    }

    if (filter?.specialty) {
      query = query.contains('specialties', [filter.specialty]);
    }

    const {data, error} = await query.returns<ProfileRowDTO[]>();
    if (error) {
      throw new Error(error.message);
    }

    const domainProfiles = (data ?? []).map(ProfileMapper.toDomain);
    const search = filter?.searchQuery?.trim().toLowerCase();
    if (!search) {
      return domainProfiles;
    }

    return domainProfiles.filter(
      (profile) =>
        profile.fullName.toLowerCase().includes(search) ||
        profile.neighborhood.toLowerCase().includes(search) ||
        profile.bio.toLowerCase().includes(search),
    );
  }

  public async getById(providerId: string): Promise<UserProfile | null> {
    const {data, error} = await this.client
      .from('profiles')
      .select('*')
      .eq('id', providerId)
      .eq('role', 'provider')
      .maybeSingle<ProfileRowDTO>();

    if (error) {
      throw new Error(error.message);
    }

    return data ? ProfileMapper.toDomain(data) : null;
  }
}
