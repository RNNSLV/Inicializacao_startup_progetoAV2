import {useCallback, useEffect, useState} from 'react';
import type {
  RegisterAccountInput,
  SignInCredentials,
  UserProfile,
} from '../../domain/entities/UserProfile';
import type {IAuthRepository} from '../../domain/repositories/IAuthRepository';

export interface UseAuthState {
  readonly user: UserProfile | null;
  readonly isLoading: boolean;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly signIn: (credentials: SignInCredentials) => Promise<UserProfile | null>;
  readonly register: (input: RegisterAccountInput) => Promise<UserProfile | null>;
  readonly signOut: () => Promise<void>;
  readonly clearError: () => void;
}

export function useAuth(authRepository: IAuthRepository): UseAuthState {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    authRepository
      .getCurrentUser()
      .then((current) => {
        if (isMounted) {
          setUser(current);
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Erro ao carregar sessão.',
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [authRepository]);

  const signIn = useCallback(
    async (credentials: SignInCredentials): Promise<UserProfile | null> => {
      setIsSubmitting(true);
      setErrorMessage(null);
      try {
        const loggedUser = await authRepository.signIn(credentials);
        setUser(loggedUser);
        return loggedUser;
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Não foi possível entrar.',
        );
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [authRepository],
  );

  const register = useCallback(
    async (input: RegisterAccountInput): Promise<UserProfile | null> => {
      setIsSubmitting(true);
      setErrorMessage(null);
      try {
        const createdUser = await authRepository.register(input);
        setUser(createdUser);
        return createdUser;
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Não foi possível criar a conta.',
        );
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [authRepository],
  );

  const signOut = useCallback(async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      await authRepository.signOut();
      setUser(null);
      setErrorMessage(null);
    } finally {
      setIsSubmitting(false);
    }
  }, [authRepository]);

  const clearError = useCallback((): void => {
    setErrorMessage(null);
  }, []);

  return {
    user,
    isLoading,
    isSubmitting,
    errorMessage,
    signIn,
    register,
    signOut,
    clearError,
  };
}
