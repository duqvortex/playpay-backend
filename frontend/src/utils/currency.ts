export const rates: Record<string, number> = {
  BRL: 1,
  USD: 0.20,
  EUR: 0.18,
  GBP: 0.15,
  JPY: 30,
  AUD: 0.30,
  CAD: 0.27,
  CHF: 0.17,
  CNY: 1.40,
  HKD: 1.55,
  NZD: 0.32,
};

export const symbols: Record<string, string> = {
  BRL: 'R$',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  CNY: '¥',
  HKD: 'HK$',
  NZD: 'NZ$',
};

export function getCurrency(): string {
  return localStorage.getItem('currency') || 'BRL';
}

export function convertFromBRL(amount: number): number {
  const currency = getCurrency();
  const rate = rates[currency] || 1;
  return amount * rate;
}

export function formatCurrency(amount: number): string {
  const currency = getCurrency();
  const symbol = symbols[currency] || 'R$';
  const converted = convertFromBRL(amount);

  return `${symbol} ${converted.toFixed(2)}`;
}
