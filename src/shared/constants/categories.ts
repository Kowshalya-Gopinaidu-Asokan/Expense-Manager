import type { ExpenseCategory, IncomeCategory } from '@/types';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Rent',
  'Utilities',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Medical',
  'Education',
  'Travel',
  'Investments',
  'Other',
];

export const INCOME_CATEGORIES: IncomeCategory[] = [
  'Salary',
  'Freelancing',
  'Bonus',
  'Rental Income',
  'Investment Returns',
  'Other',
];

export const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'UPI',
  'Wallet',
  'Other',
] as const;

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

export const APP_NAME = 'Expense Manager';
export const DB_NAME = 'SmartExpenseDB';
