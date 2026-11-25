import type {ProviderFilter, UserProfile} from '../entities/UserProfile';

export interface IProviderRepository {
  searchAvailable(filter?: ProviderFilter): Promise<readonly UserProfile[]>;
  getById(providerId: string): Promise<UserProfile | null>;
}
