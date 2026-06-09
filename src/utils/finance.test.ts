import { describe, it, expect } from 'vitest';
import { sumByType, getBalance, isDuplicateTransaction } from './finance';
import type { Transaction } from '@/types';

const sample: Transaction[] = [
  {
    id: '1',
    type: 'income',
    year: 2025,
    date: '2025-01-15',
    amount: 1000,
    category: 'Salary',
    description: 'Paycheck',
    paymentMethod: 'Bank Transfer',
    recurring: false,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    type: 'expense',
    year: 2025,
    date: '2025-01-16',
    amount: 200,
    category: 'Food',
    description: 'Groceries',
    paymentMethod: 'Cash',
    recurring: false,
    createdAt: '',
    updatedAt: '',
  },
];

describe('finance utils', () => {
  it('sums income and expenses', () => {
    expect(sumByType(sample, 'income')).toBe(1000);
    expect(sumByType(sample, 'expense')).toBe(200);
  });

  it('calculates balance', () => {
    expect(getBalance(sample)).toBe(800);
  });

  it('detects duplicate transactions', () => {
    expect(
      isDuplicateTransaction(sample, {
        type: 'expense',
        date: '2025-01-16',
        amount: 200,
        category: 'Food',
        description: 'Groceries',
      }),
    ).toBe(true);
  });
});
