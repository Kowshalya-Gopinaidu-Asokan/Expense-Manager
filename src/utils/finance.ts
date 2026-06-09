import type { Transaction } from '@/types';
import { dayjs } from './dates';

export function sumByType(transactions: Transaction[], type: 'income' | 'expense'): number {
  return transactions
    .filter((t) => t.type === type && !t.skipped)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getBalance(transactions: Transaction[]): number {
  return sumByType(transactions, 'income') - sumByType(transactions, 'expense');
}

export function filterByMonth(transactions: Transaction[], year: number, month: number): Transaction[] {
  return transactions.filter((t) => {
    const d = dayjs(t.date);
    return d.year() === year && d.month() + 1 === month && !t.skipped;
  });
}

export function filterByYear(transactions: Transaction[], year: number): Transaction[] {
  return transactions.filter((t) => t.year === year && !t.skipped);
}

export function groupExpensesByCategory(transactions: Transaction[]): Record<string, number> {
  return transactions
    .filter((t) => t.type === 'expense' && !t.skipped)
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount;
      return acc;
    }, {});
}

export function isDuplicateTransaction(
  transactions: Transaction[],
  candidate: Pick<Transaction, 'type' | 'date' | 'amount' | 'category' | 'description'>,
  excludeId?: string,
): boolean {
  return transactions.some(
    (t) =>
      t.id !== excludeId &&
      t.type === candidate.type &&
      t.date === candidate.date &&
      t.amount === candidate.amount &&
      t.category === candidate.category &&
      t.description.trim().toLowerCase() === candidate.description.trim().toLowerCase(),
  );
}
