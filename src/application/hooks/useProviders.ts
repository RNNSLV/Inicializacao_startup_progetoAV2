import {useCallback, useEffect, useMemo, useState} from 'react';
import type {ProviderFilter, UserProfile} from '../../domain/entities/UserProfile';
import type {IProviderRepository} from '../../domain/repositories/IProviderRepository';
import {SearchProvidersUseCase} from '../useCases/SearchProvidersUseCase';

export interface UseProvidersState {
  readonly providers: readonly UserProfile[];
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly refresh: () => Promise<void>;
}

export function useProviders(
  providerRepository: IProviderRepository,
  filter: ProviderFilter,
): UseProvidersState {
  const [providers, setProviders] = useState<readonly UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const searchProvidersUseCase = useMemo(
    () => new SearchProvidersUseCase(providerRepository),
    [providerRepository],
  );

  const refresh = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const results = await searchProvidersUseCase.execute(filter);
      setProviders(results);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Erro ao buscar profissionais.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    searchProvidersUseCase,
    filter.neighborhood,
    filter.specialty,
    filter.searchQuery,
  ]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    providers,
    isLoading,
    errorMessage,
    refresh,
  };
}
