import type {ServiceOffer} from '../../domain/entities/ServiceOffer';
import type {IOfferRepository} from '../../domain/repositories/IOfferRepository';
import {MoneyBRL} from '../../domain/valueObjects/MoneyBRL';
import {
  createOfferSchema,
  type CreateOfferFormValues,
} from '../validators/offerSchemas';

export class PublishOfferUseCase {
  constructor(private readonly offerRepository: IOfferRepository) {}

  public async execute(
    contractorId: string,
    formValues: CreateOfferFormValues,
  ): Promise<ServiceOffer> {
    const parsed = createOfferSchema.parse(formValues);
    const offeredValueCents = MoneyBRL.fromReais(parsed.offeredValueBrl).toCents();

    return this.offerRepository.create({
      contractorId,
      category: parsed.category,
      serviceDate: parsed.serviceDate,
      shift: parsed.shift,
      offeredValueCents,
      neighborhood: parsed.neighborhood,
      addressReference: parsed.addressReference,
      notes: parsed.notes,
    });
  }
}
