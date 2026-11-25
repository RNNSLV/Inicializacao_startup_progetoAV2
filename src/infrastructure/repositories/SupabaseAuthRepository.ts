import type {SupabaseClient} from '@supabase/supabase-js';
import type {
  RegisterAccountInput,
  SignInCredentials,
  UserProfile,
} from '../../domain/entities/UserProfile';
import type {IAuthRepository} from '../../domain/repositories/IAuthRepository';
import {PhoneNumber} from '../../domain/valueObjects/PhoneNumber';
import type {ProfileRowDTO} from '../dto/DatabaseDTOs';
import {ProfileMapper} from '../mappers/ProfileMapper';

export class SupabaseAuthRepository implements IAuthRepository {
  constructor(private readonly client: SupabaseClient) {}

  public async getCurrentUser(): Promise<UserProfile | null> {
    const {data: sessionData, error: sessionError} = await this.client.auth.getSession();
    if (sessionError) {
      throw new Error(sessionError.message);
    }
    const userId = sessionData.session?.user.id;
    if (!userId) {
      return null;
    }

    const {data, error} = await this.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single<ProfileRowDTO>();

    if (error || !data) {
      return null;
    }
    return ProfileMapper.toDomain(data);
  }

  public async signIn(credentials: SignInCredentials): Promise<UserProfile> {
    const phone = PhoneNumber.fromRawInput(credentials.phoneE164);
    const {data: authData, error: authError} =
      await this.client.auth.signInWithPassword({
        email: phone.toSyntheticEmail(),
        password: credentials.password,
      });

    if (authError || !authData.user) {
      throw new Error('Telefone ou senha inválidos. Verifique os dados informados.');
    }

    const {data: profileData, error: profileError} = await this.client
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single<ProfileRowDTO>();

    if (profileError || !profileData) {
      throw new Error('Perfil não encontrado para esta conta.');
    }

    if (profileData.role !== credentials.role) {
      await this.client.auth.signOut();
      const expectedLabel =
        profileData.role === 'contractor' ? 'Quero Contratar' : 'Quero Trabalhar';
      throw new Error(
        `Este telefone está cadastrado no perfil "${expectedLabel}". Selecione a opção correta acima.`,
      );
    }

    return ProfileMapper.toDomain(profileData);
  }

  public async register(input: RegisterAccountInput): Promise<UserProfile> {
    const phone = PhoneNumber.fromRawInput(input.phoneE164);

    const {data: authData, error: signUpError} = await this.client.auth.signUp({
      email: phone.toSyntheticEmail(),
      password: input.password,
    });

    if (signUpError || !authData.user) {
      throw new Error(
        signUpError?.message ?? 'Não foi possível criar sua conta no momento.',
      );
    }

    const payload = ProfileMapper.toPersistence(authData.user.id, {
      ...input,
      phoneE164: phone.toE164(),
    });

    const {data: insertedProfile, error: profileError} = await this.client
      .from('profiles')
      .insert(payload)
      .select('*')
      .single<ProfileRowDTO>();

    if (profileError || !insertedProfile) {
      throw new Error(
        profileError?.message ?? 'Erro ao salvar perfil do usuário.',
      );
    }

    return ProfileMapper.toDomain(insertedProfile);
  }

  public async signOut(): Promise<void> {
    const {error} = await this.client.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }
}
