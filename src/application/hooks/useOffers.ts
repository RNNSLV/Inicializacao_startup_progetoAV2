import {useCallback, useEffect, useMemo, useState} from 'react';
import type {OfferFilters, ServiceOffer} from '../../domain/entities/ServiceOffer';
import type {IOfferRepository} from '../../domain/repositories/IOfferRepository';
import {PublishOfferUseCase} from '../useCases/PublishOfferUseCase';
import type {CreateOfferFormValues} from '../validators/offerSchemas';

export interface UseOffersOptions {
  readonly mode: 'contractor' | 'open';
  readonly contractorId?: string;
  readonly filters?: OfferFilters;
}

export interface UseOffersState {
  readonly offers: readonly ServiceOffer[];
  readonly isLoading: boolean;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly refresh: () => Promise<void>;
  readonly publishOffer: (
    contractorId: string,
    values: CreateOfferFormValues,
  ) => Promise<ServiceOffer | null>;
  readonly cancelOffer: (offerId: string, contractorId: string) => Promise<void>;
}

export function useOffers(
  offerRepository: IOfferRepository,
  options: UseOffersOptions,
): UseOffersState {
  const [offers, setOffers] = useState<readonly ServiceOffer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const publishOfferUseCase = useMemo(
    () => new PublishOfferUseCase(offerRepository),
    [offerRepository],
  );

  const refresh = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result =
        options.mode === 'contractor' && options.contractorId
          ? await offerRepository.listByContractor(options.contractorId)
          : await offerRepository.listOpenOffers(options.filters);
      setOffers(result);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Erro ao carregar demandas.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    offerRepository,
    options.mode,
    options.contractorId,
    options.filters?.neighborhood,
    options.filters?.category,
    options.filters?.onlyOpen,
  ]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const publishOffer = useCallback(
    async (
      contractorId: string,
      values: CreateOfferFormValues,
    ): Promise<ServiceOffer | null> => {
      setIsSubmitting(true);
      setErrorMessage(null);
      try {
        const created = await publishOfferUseCase.execute(contractorId, values);
        setOffers((prev) => [created, ...prev]);
        return created;
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Não foi possível publicar a demanda.',
        );
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [publishOfferUseCase],
  );

  const cancelOffer = useCallback(
    async (offerId: string, contractorId: string): Promise<void> => {
      setIsSubmitting(true);
      setErrorMessage(null);
      try {
        const updated = await offerRepository.cancel(offerId, contractorId);
        setOffers((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item)),
        );
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Erro ao cancelar demanda.',
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [offerRepository],
  );

  return {
    offers,
    isLoading,
    isSubmitting,
    errorMessage,
    refresh,
    publishOffer,
    cancelOffer,
  };
}
