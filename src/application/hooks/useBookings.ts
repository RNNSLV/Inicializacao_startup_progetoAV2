import {useCallback, useEffect, useMemo, useState} from 'react';
import type {Booking, CreateDirectBookingInput} from '../../domain/entities/Booking';
import type {IBookingRepository} from '../../domain/repositories/IBookingRepository';
import {AcceptOfferUseCase} from '../useCases/AcceptOfferUseCase';

export interface UseBookingsState {
  readonly bookings: readonly Booking[];
  readonly isLoading: boolean;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly refresh: () => Promise<void>;
  readonly acceptOffer: (offerId: string, providerId: string) => Promise<Booking | null>;
  readonly bookProviderDirectly: (input: CreateDirectBookingInput) => Promise<Booking | null>;
  readonly cancelBooking: (bookingId: string, actorId: string) => Promise<void>;
}

export function useBookings(
  bookingRepository: IBookingRepository,
  userId: string | null,
): UseBookingsState {
  const [bookings, setBookings] = useState<readonly Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const acceptOfferUseCase = useMemo(
    () => new AcceptOfferUseCase(bookingRepository),
    [bookingRepository],
  );

  const refresh = useCallback(async (): Promise<void> => {
    if (!userId) {
      setBookings([]);
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const items = await bookingRepository.listForUser(userId);
      setBookings(items);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Erro ao carregar agendamentos.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [bookingRepository, userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const acceptOffer = useCallback(
    async (offerId: string, providerId: string): Promise<Booking | null> => {
      setIsSubmitting(true);
      setErrorMessage(null);
      try {
        const booking = await acceptOfferUseCase.execute(offerId, providerId);
        setBookings((prev) => [booking, ...prev]);
        return booking;
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Não foi possível aceitar a diária.',
        );
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [acceptOfferUseCase],
  );

  const bookProviderDirectly = useCallback(
    async (input: CreateDirectBookingInput): Promise<Booking | null> => {
      setIsSubmitting(true);
      setErrorMessage(null);
      try {
        const booking = await bookingRepository.createDirectBooking(input);
        setBookings((prev) => [booking, ...prev]);
        return booking;
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Não foi possível solicitar a diária.',
        );
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [bookingRepository],
  );

  const cancelBooking = useCallback(
    async (bookingId: string, actorId: string): Promise<void> => {
      setIsSubmitting(true);
      setErrorMessage(null);
      try {
        const updated = await bookingRepository.cancelBooking(bookingId, actorId);
        setBookings((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item)),
        );
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Erro ao cancelar agendamento.',
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [bookingRepository],
  );

  return {
    bookings,
    isLoading,
    isSubmitting,
    errorMessage,
    refresh,
    acceptOffer,
    bookProviderDirectly,
    cancelBooking,
  };
}
