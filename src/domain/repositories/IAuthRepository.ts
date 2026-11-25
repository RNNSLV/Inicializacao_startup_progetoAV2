import type {
  RegisterAccountInput,
  SignInCredentials,
  UserProfile,
} from '../entities/UserProfile';

export interface IAuthRepository {
  getCurrentUser(): Promise<UserProfile | null>;
  signIn(credentials: SignInCredentials): Promise<UserProfile>;
  register(input: RegisterAccountInput): Promise<UserProfile>;
  signOut(): Promise<void>;
}
