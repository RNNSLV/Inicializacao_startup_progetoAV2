import type {ProviderFilter, UserProfile} from '../../domain/entities/UserProfile';
import type {IProviderRepository} from '../../domain/repositories/IProviderRepository';

export class SearchProvidersUseCase {
  constructor(private readonly providerRepository: IProviderRepository) {}

  public async execute(filter?: ProviderFilter): Promise<readonly UserProfile[]> {
    const providers = await this.providerRepository.searchAvailable(filter);
    return [...providers].sort((a, b) => b.ratingAverage - a.ratingAverage);
  }
}
