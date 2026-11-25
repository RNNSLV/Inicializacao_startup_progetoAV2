import {z} from 'zod';
import {FORTALEZA_NEIGHBORHOOD_NAMES} from '../../shared/constants/fortalezaNeighborhoods';

export const serviceCategorySchema = z.enum([
  'faxina_completa',
  'limpeza_leve',
  'passadoria',
  'cozinha_diaria',
  'pos_obra',
  'cuidados_idosos',
]);

export const workShiftSchema = z.enum(['manha', 'tarde', 'integral']);

export function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const createOfferSchema = z.object({
  category: serviceCategorySchema,
  serviceDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Informe uma data válida no formato AAAA-MM-DD.')
    .refine(
      (value) => value >= getTodayIsoDate(),
      'A data do serviço não pode ser anterior a hoje.',
    ),
  shift: workShiftSchema,
  offeredValueBrl: z
    .number({message: 'Informe um valor numérico em reais.'})
    .min(60, 'O valor mínimo oferecido deve ser R$ 60,00.')
    .max(2000, 'O valor máximo por diária no MVP é R$ 2.000,00.'),
  neighborhood: z
    .string()
    .trim()
    .refine(
      (value) => FORTALEZA_NEIGHBORHOOD_NAMES.includes(value),
      'Selecione um bairro de Fortaleza ou Região Metropolitana.',
    ),
  addressReference: z
    .string()
    .trim()
    .max(120, 'A referência deve ter no máximo 120 caracteres.')
    .default(''),
  notes: z
    .string()
    .trim()
    .max(300, 'As observações devem ter no máximo 300 caracteres.')
    .default(''),
});

export type CreateOfferFormValues = z.infer<typeof createOfferSchema>;
