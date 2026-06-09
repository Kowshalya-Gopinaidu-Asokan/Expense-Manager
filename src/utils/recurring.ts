import type { Transaction } from '@/types';
import { db } from '@/services/db';
import { addRecurrence, dayjs } from './dates';
import { generateId } from './id';

export async function processRecurringTransactions(): Promise<Transaction[]> {
  const rules = await db.recurringRules.filter((r) => r.active).toArray();
  const created: Transaction[] = [];
  const today = dayjs().format('YYYY-MM-DD');

  for (const rule of rules) {
    let next = rule.nextOccurrence;
    while (next <= today) {
      if (rule.endDate && next > rule.endDate) break;
      if (rule.skippedDates.includes(next)) {
        next = addRecurrence(next, rule.frequency);
        continue;
      }

      const template = await db.transactions.get(rule.templateTransactionId);
      if (!template) break;

      const existing = await db.transactions
        .filter((t) => t.recurrenceId === rule.id && t.date === next)
        .first();
      if (!existing) {
        const tx: Transaction = {
          ...template,
          id: generateId(),
          date: next,
          year: dayjs(next).year(),
          recurrenceId: rule.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await db.transactions.add(tx);
        created.push(tx);
      }

      next = addRecurrence(next, rule.frequency);
    }

    await db.recurringRules.update(rule.id, { nextOccurrence: next });
  }

  return created;
}
