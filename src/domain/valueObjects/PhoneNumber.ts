const DEFAULT_DDD = '85';

export class PhoneNumber {
  private constructor(private readonly e164Value: string) {}

  public static fromRawInput(rawInput: string): PhoneNumber {
    const digits = rawInput.replace(/\D/g, '');
    const withoutCountry = digits.startsWith('55') && digits.length >= 12
      ? digits.slice(2)
      : digits;

    if (withoutCountry.length < 10 || withoutCountry.length > 11) {
      throw new Error('Informe um telefone válido com DDD 85 e 8 ou 9 dígitos.');
    }

    const ddd = withoutCountry.slice(0, 2);
    if (ddd !== DEFAULT_DDD) {
      throw new Error('No MVP atendemos exclusivamente o DDD 85 (Fortaleza e RMF).');
    }

    return new PhoneNumber(`+55${withoutCountry}`);
  }

  public static tryParse(rawInput: string): PhoneNumber | null {
    try {
      return PhoneNumber.fromRawInput(rawInput);
    } catch {
      return null;
    }
  }

  public static formatMask(rawInput: string): string {
    const digits = rawInput.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) {
      return '(85) ';
    }
    if (digits.length <= 2) {
      return `(${digits}`;
    }
    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }

  public static formatDisplayFromE164(e164: string): string {
    const local = e164.replace(/^\+55/, '');
    return PhoneNumber.formatMask(local);
  }

  public toE164(): string {
    return this.e164Value;
  }

  public toSyntheticEmail(): string {
    const digits = this.e164Value.replace(/\D/g, '');
    return `tel.${digits}@ajeitalar.fortaleza.br`;
  }
}
