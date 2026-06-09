import { formatMoney } from '@/utils/currency';

const CURRENCY = 'USD';

export function useCurrency() {
  return {
    currency: CURRENCY,
    symbol: '$',
    format: (amount: number) => formatMoney(amount, CURRENCY),
  };
}
