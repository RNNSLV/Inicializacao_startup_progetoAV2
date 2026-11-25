import {useEffect} from 'react';
import {repositories} from './infrastructure/di/container';
import {useAuth} from './application/hooks/useAuth';
import {LoginScreen} from './presentation/screens/LoginScreen';
import {ContractorHomeScreen} from './presentation/screens/ContractorHomeScreen';
import {ProviderHomeScreen} from './presentation/screens/ProviderHomeScreen';

export default function App() {
  const {
    user,
    isLoading,
    isSubmitting,
    errorMessage,
    signIn,
    register,
    signOut,
    clearError,
  } = useAuth(repositories.authRepository);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' && !isLoading && !user) {
      void signIn({
        role: 'contractor',
        phoneE164: '+5585988123456',
        password: 'demo123',
      });
    }
  }, [isLoading, user, signIn]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF8] px-4">
        <p className="text-sm font-medium text-slate-600">
          Carregando AjeitaLar Fortaleza...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginScreen
        isSubmitting={isSubmitting}
        serverError={errorMessage}
        onSignIn={async (credentials) => {
          await signIn(credentials);
        }}
        onRegister={async (input) => {
          await register(input);
        }}
        onClearServerError={clearError}
      />
    );
  }

  if (user.role === 'contractor') {
    return (
      <ContractorHomeScreen
        user={user}
        offerRepository={repositories.offerRepository}
        providerRepository={repositories.providerRepository}
        bookingRepository={repositories.bookingRepository}
        onSignOut={signOut}
      />
    );
  }

  return (
    <ProviderHomeScreen
      user={user}
      offerRepository={repositories.offerRepository}
      bookingRepository={repositories.bookingRepository}
      onSignOut={signOut}
    />
  );
}
