import test from 'node:test';
import assert from 'node:assert/strict';
import {PhoneNumber} from './valueObjects/PhoneNumber';
import {MoneyBRL} from './valueObjects/MoneyBRL';

test('PhoneNumber accepts valid Fortaleza DDD 85 numbers and formats E.164', () => {
  const phone = PhoneNumber.fromRawInput('(85) 98765-4321');
  assert.equal(phone.toE164(), '+5585987654321');
  assert.equal(phone.toSyntheticEmail(), 'tel.5585987654321@ajeitalar.fortaleza.br');
});

test('PhoneNumber rejects non-85 DDD numbers for MVP guardrails', () => {
  assert.throws(
    () => PhoneNumber.fromRawInput('(11) 99999-8888'),
    /DDD 85/,
  );
  assert.equal(PhoneNumber.tryParse('(11) 99999-8888'), null);
});

test('PhoneNumber mask handles incremental typing with DDD 85', () => {
  assert.equal(PhoneNumber.formatMask('85999441122'), '(85) 99944-1122');
  assert.equal(PhoneNumber.formatDisplayFromE164('+5585988123456'), '(85) 98812-3456');
});

test('MoneyBRL converts reais to cents and enforces minimum R$ 60,00', () => {
  const money = MoneyBRL.fromReais(180);
  assert.equal(money.toCents(), 18000);
  assert.match(money.toFormatted(), /180,00/);

  assert.throws(() => MoneyBRL.fromReais(55), /60,00/);
});
