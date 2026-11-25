import type {RegisterAccountInput, UserProfile} from '../../domain/entities/UserProfile';
import type {ProfileInsertDTO, ProfileRowDTO} from '../dto/DatabaseDTOs';

export const ProfileMapper = {
  toDomain(dto: ProfileRowDTO): UserProfile {
    return {
      id: dto.id,
      role: dto.role,
      fullName: dto.full_name,
      phoneE164: dto.phone_e164,
      neighborhood: dto.neighborhood,
      bio: dto.bio,
      specialties: dto.specialties,
      dailyRateCents: dto.daily_rate_cents,
      isAvailable: dto.is_available,
      completedServicesCount: dto.completed_services_count,
      ratingAverage: Number(dto.rating_average),
      avatarUrl: dto.avatar_url,
      createdAt: dto.created_at,
    };
  },

  toPersistence(userId: string, input: RegisterAccountInput): ProfileInsertDTO {
    return {
      id: userId,
      role: input.role,
      full_name: input.fullName.trim(),
      phone_e164: input.phoneE164,
      neighborhood: input.neighborhood,
      bio: input.bio ?? '',
      specialties:
        input.specialties && input.specialties.length > 0
          ? input.specialties
          : ['faxina_completa'],
      daily_rate_cents: input.role === 'provider' ? (input.dailyRateCents ?? 16000) : null,
      is_available: input.role === 'provider',
    };
  },
};
