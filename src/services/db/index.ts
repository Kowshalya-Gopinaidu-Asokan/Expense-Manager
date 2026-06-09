import Dexie, { type Table } from 'dexie';
import { DB_NAME } from '@/shared/constants/categories';
import { DB_SCHEMA_VERSION } from './schema';
import type { RecurringRule, Transaction } from '@/types';

export class SmartExpenseDatabase extends Dexie {
  transactions!: Table<Transaction, string>;
  recurringRules!: Table<RecurringRule, string>;

  constructor() {
    super(DB_NAME);
    this.version(1).stores({
      transactions:
        'id, type, year, date, category, amount, recurring, recurrenceId, [year+date], [type+year]',
      budgets: 'id, year, month, period, scope, category',
      plans: 'id, deadline, name',
      savingsAccounts: 'id, type, goalId',
      subscriptions: 'id, nextPaymentDate, active',
      bills: 'id, dueDate, paid',
      investments: 'id, type',
      recurringRules: 'id, active, nextOccurrence',
      settings: 'id',
      meta: 'id',
    });
    this.version(DB_SCHEMA_VERSION).stores({
      transactions:
        'id, type, year, date, category, amount, recurring, recurrenceId, [year+date], [type+year]',
      recurringRules: 'id, active, nextOccurrence',
    });
  }
}

export const db = new SmartExpenseDatabase();
