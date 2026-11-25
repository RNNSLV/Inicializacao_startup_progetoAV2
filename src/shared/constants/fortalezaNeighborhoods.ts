export interface NeighborhoodOption {
  readonly id: string;
  readonly name: string;
  readonly zone: 'Fortaleza' | 'Região Metropolitana';
}

export const FORTALEZA_NEIGHBORHOODS: readonly NeighborhoodOption[] = [
  {id: 'aldeota', name: 'Aldeota', zone: 'Fortaleza'},
  {id: 'meireles', name: 'Meireles', zone: 'Fortaleza'},
  {id: 'coco', name: 'Cocó', zone: 'Fortaleza'},
  {id: 'dionisio-torres', name: 'Dionísio Torres', zone: 'Fortaleza'},
  {id: 'papicu', name: 'Papicu', zone: 'Fortaleza'},
  {id: 'varjota', name: 'Varjota', zone: 'Fortaleza'},
  {id: 'mucuripe', name: 'Mucuripe', zone: 'Fortaleza'},
  {id: 'benfica', name: 'Benfica', zone: 'Fortaleza'},
  {id: 'parquelandia', name: 'Parquelândia', zone: 'Fortaleza'},
  {id: 'fatima', name: 'Fátima', zone: 'Fortaleza'},
  {id: 'messejana', name: 'Messejana', zone: 'Fortaleza'},
  {id: 'cambeba', name: 'Cambeba', zone: 'Fortaleza'},
  {id: 'cidade-funcionarios', name: 'Cidade dos Funcionários', zone: 'Fortaleza'},
  {id: 'montese', name: 'Montese', zone: 'Fortaleza'},
  {id: 'eusebio', name: 'Eusébio', zone: 'Região Metropolitana'},
  {id: 'caucaia', name: 'Caucaia', zone: 'Região Metropolitana'},
  {id: 'maracanau', name: 'Maracanaú', zone: 'Região Metropolitana'},
  {id: 'aquiraz', name: 'Aquiraz', zone: 'Região Metropolitana'},
] as const;

export const FORTALEZA_NEIGHBORHOOD_NAMES: readonly string[] =
  FORTALEZA_NEIGHBORHOODS.map((item) => item.name);

export const DEFAULT_CEARA_DDD = '85';

export interface ServiceCategoryMeta {
  readonly id:
    | 'faxina_completa'
    | 'limpeza_leve'
    | 'passadoria'
    | 'cozinha_diaria'
    | 'pos_obra'
    | 'cuidados_idosos';
  readonly label: string;
  readonly description: string;
  readonly suggestedMinBrl: number;
}

export const SERVICE_CATEGORIES: readonly ServiceCategoryMeta[] = [
  {
    id: 'faxina_completa',
    label: 'Faxina Completa',
    description: 'Limpeza pesada de quartos, banheiros, cozinha e áreas comuns.',
    suggestedMinBrl: 160,
  },
  {
    id: 'limpeza_leve',
    label: 'Limpeza de Manutenção',
    description: 'Organização diária, varrição, pano úmido e higienização básica.',
    suggestedMinBrl: 120,
  },
  {
    id: 'passadoria',
    label: 'Passadoria',
    description: 'Passar e dobrar roupas da família por turno ou diária.',
    suggestedMinBrl: 110,
  },
  {
    id: 'cozinha_diaria',
    label: 'Cozinha do Dia a Dia',
    description: 'Preparo de refeições caseiras e organização da cozinha.',
    suggestedMinBrl: 150,
  },
  {
    id: 'pos_obra',
    label: 'Limpeza Pós-Obra',
    description: 'Remoção de poeira fina, resíduos de reforma e vidros.',
    suggestedMinBrl: 220,
  },
  {
    id: 'cuidados_idosos',
    label: 'Apoio Doméstico e Idosos',
    description: 'Acompanhamento domiciliar leve e organização do ambiente.',
    suggestedMinBrl: 170,
  },
] as const;

export interface WorkShiftMeta {
  readonly id: 'manha' | 'tarde' | 'integral';
  readonly label: string;
  readonly hoursLabel: string;
}

export const WORK_SHIFTS: readonly WorkShiftMeta[] = [
  {id: 'manha', label: 'Manhã', hoursLabel: '08:00 às 12:00'},
  {id: 'tarde', label: 'Tarde', hoursLabel: '13:30 às 17:30'},
  {id: 'integral', label: 'Diária Integral', hoursLabel: '08:00 às 17:00'},
] as const;

export function getCategoryLabel(categoryId: ServiceCategoryMeta['id']): string {
  return (
    SERVICE_CATEGORIES.find((item) => item.id === categoryId)?.label ?? categoryId
  );
}

export function getShiftLabel(shiftId: WorkShiftMeta['id']): string {
  const found = WORK_SHIFTS.find((item) => item.id === shiftId);
  return found ? `${found.label} (${found.hoursLabel})` : shiftId;
}
