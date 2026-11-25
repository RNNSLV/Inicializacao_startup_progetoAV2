export class MoneyBRL {
  private constructor(private readonly centsValue: number) {}

  public static fromReais(reais: number): MoneyBRL {
    if (!Number.isFinite(reais) || reais < 60) {
      throw new Error('O valor mínimo da diária deve ser de R$ 60,00.');
    }
    return new MoneyBRL(Math.round(reais * 100));
  }

  public static fromCents(cents: number): MoneyBRL {
    if (!Number.isInteger(cents) || cents < 0) {
      throw new Error('Valor em centavos inválido.');
    }
    return new MoneyBRL(cents);
  }

  public static formatCents(cents: number): string {
    const reais = cents / 100;
    return reais.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  }

  public toCents(): number {
    return this.centsValue;
  }

  public toFormatted(): string {
    return MoneyBRL.formatCents(this.centsValue);
  }
}
