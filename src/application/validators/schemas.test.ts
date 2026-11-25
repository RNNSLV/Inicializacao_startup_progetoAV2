import test from 'node:test';
import assert from 'node:assert/strict';
import {loginSchema, registerSchema} from './authSchemas';
import {createOfferSchema, getTodayIsoDate} from './offerSchemas';

test('registerSchema accepts valid Fortaleza contractor registration', () => {
  const result = registerSchema.safeParse({
    role: 'contractor',
    fullName: 'Camila Vasconcelos',
    phone: '(85) 98812-3456',
    password: 'segredo123',
    neighborhood: 'Aldeota',
  });
  assert.equal(result.success, true);
});

test('loginSchema rejects non-DDD-85 phone number', () => {
  const result = loginSchema.safeParse({
    role: 'provider',
    phone: '(21) 99999-1111',
    password: 'segredo123',
  });
  assert.equal(result.success, false);
});

test('createOfferSchema accepts valid offer in RMF and rejects value below R$ 60', () => {
  const valid = createOfferSchema.safeParse({
    category: 'faxina_completa',
    serviceDate: getTodayIsoDate(),
    shift: 'manha',
    offeredValueBrl: 180,
    neighborhood: 'Eusébio',
    addressReference: 'Próximo à CE-040',
    notes: 'Casa térrea',
  });
  assert.equal(valid.success, true);

  const invalidValue = createOfferSchema.safeParse({
    category: 'passadoria',
    serviceDate: getTodayIsoDate(),
    shift: 'tarde',
    offeredValueBrl: 45,
    neighborhood: 'Messejana',
    addressReference: '',
    notes: '',
  });
  assert.equal(invalidValue.success, false);
});

test('createOfferSchema rejects neighborhood outside Fortaleza/RMF list', () => {
  const invalidNeighborhood = createOfferSchema.safeParse({
    category: 'limpeza_leve',
    serviceDate: getTodayIsoDate(),
    shift: 'manha',
    offeredValueBrl: 140,
    neighborhood: 'Copacabana',
    addressReference: '',
    notes: '',
  });
  assert.equal(invalidNeighborhood.success, false);
});
