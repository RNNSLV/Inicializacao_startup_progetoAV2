import {z} from 'zod';
import {PhoneNumber} from '../../domain/valueObjects/PhoneNumber';
import {FORTALEZA_NEIGHBORHOOD_NAMES} from '../../shared/constants/fortalezaNeighborhoods';

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (value) => PhoneNumber.tryParse(value) !== null,
    'Informe um telefone celular ou fixo válido com DDD 85 (Fortaleza e RMF).',
  );

export const userRoleSchema = z.enum(['contractor', 'provider'], {
  message: 'Selecione se você quer contratar ou trabalhar.',
});

export const loginSchema = z.object({
  role: userRoleSchema,
  phone: phoneSchema,
  password: z
    .string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

export const registerSchema = z.object({
  role: userRoleSchema,
  fullName: z
    .string()
    .trim()
    .min(3, 'Informe seu nome completo (mínimo 3 caracteres).')
    .max(80, 'O nome deve ter no máximo 80 caracteres.'),
  phone: phoneSchema,
  password: z
    .string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres.')
    .max(64, 'A senha deve ter no máximo 64 caracteres.'),
  neighborhood: z
    .string()
    .trim()
    .refine(
      (value) => FORTALEZA_NEIGHBORHOOD_NAMES.includes(value),
      'Selecione um bairro válido de Fortaleza ou Região Metropolitana.',
    ),
  dailyRateBrl: z
    .number()
    .min(60, 'O valor mínimo da diária é R$ 60,00.')
    .max(1500, 'O valor máximo sugerido é R$ 1.500,00.')
    .optional(),
  specialty: z
    .enum([
      'faxina_completa',
      'limpeza_leve',
      'passadoria',
      'cozinha_diaria',
      'pos_obra',
      'cuidados_idosos',
    ])
    .optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
