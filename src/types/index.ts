export type TransactionType = 'expense' | 'income';

export type ExpenseCategory =
  | 'Food'
  | 'Rent'
  | 'Utilities'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Medical'
  | 'Education'
  | 'Travel'
  | 'Investments'
  | 'Other';

export type IncomeCategory =
  | 'Salary'
  | 'Freelancing'
  | 'Bonus'
  | 'Rental Income'
  | 'Investment Returns'
  | 'Other';

export type Category = ExpenseCategory | IncomeCategory;

export type PaymentMethod =
  | 'Cash'
  | 'Credit Card'
  | 'Debit Card'
  | 'Bank Transfer'
  | 'UPI'
  | 'Wallet'
  | 'Other';

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Transaction {
  id: string;
  type: TransactionType;
  year: number;
  date: string;
  amount: number;
  category: Category;
  description: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  recurring: boolean;
  recurrenceId?: string;
  skipped?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringRule {
  id: string;
  templateTransactionId: string;
  frequency: RecurrenceFrequency;
  nextOccurrence: string;
  endDate?: string;
  active: boolean;
  skippedDates: string[];
}
