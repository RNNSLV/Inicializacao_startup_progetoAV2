import type {IAuthRepository} from '../../domain/repositories/IAuthRepository';
import type {IBookingRepository} from '../../domain/repositories/IBookingRepository';
import type {IOfferRepository} from '../../domain/repositories/IOfferRepository';
import type {IProviderRepository} from '../../domain/repositories/IProviderRepository';
import {LocalMarketplaceStore} from '../repositories/LocalMarketplaceStore';
import {SupabaseAuthRepository} from '../repositories/SupabaseAuthRepository';
import {SupabaseBookingRepository} from '../repositories/SupabaseBookingRepository';
import {SupabaseOfferRepository} from '../repositories/SupabaseOfferRepository';
import {SupabaseProviderRepository} from '../repositories/SupabaseProviderRepository';
import {getSupabaseClient, isSupabaseConfigured} from '../supabase/supabaseClient';

export interface MarketplaceRepositories {
  readonly authRepository: IAuthRepository;
  readonly offerRepository: IOfferRepository;
  readonly providerRepository: IProviderRepository;
  readonly bookingRepository: IBookingRepository;
}

function createRepositories(): MarketplaceRepositories {
  if (isSupabaseConfigured()) {
    const client = getSupabaseClient();
    return {
      authRepository: new SupabaseAuthRepository(client),
      offerRepository: new SupabaseOfferRepository(client),
      providerRepository: new SupabaseProviderRepository(client),
      bookingRepository: new SupabaseBookingRepository(client),
    };
  }

  const localStore = new LocalMarketplaceStore();
  return {
    authRepository: localStore,
    offerRepository: localStore,
    providerRepository: localStore,
    bookingRepository: localStore,
  };
}

export const repositories: MarketplaceRepositories = createRepositories();
