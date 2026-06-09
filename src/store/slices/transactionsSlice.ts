import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db } from '@/services/db';
import type { RecurringRule, Transaction } from '@/types';
import { generateId } from '@/utils/id';
import { isDuplicateTransaction } from '@/utils/finance';
import { addRecurrence } from '@/utils/dates';
import { processRecurringTransactions } from '@/utils/recurring';
import type { RootState } from '../index';

export const loadTransactions = createAsyncThunk('transactions/load', async () => {
  await processRecurringTransactions();
  return db.transactions.orderBy('date').reverse().toArray();
});

export const addTransaction = createAsyncThunk(
  'transactions/add',
  async (
    payload: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> & {
      recurrenceFrequency?: RecurringRule['frequency'];
    },
    { getState, rejectWithValue },
  ) => {
    const state = getState() as RootState;
    if (
      isDuplicateTransaction(state.transactions.items, {
        type: payload.type,
        date: payload.date,
        amount: payload.amount,
        category: payload.category,
        description: payload.description,
      })
    ) {
      return rejectWithValue('Duplicate transaction detected.');
    }

    const now = new Date().toISOString();
    const tx: Transaction = {
      ...payload,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    await db.transactions.add(tx);

    if (payload.recurring && payload.recurrenceFrequency) {
      const rule: RecurringRule = {
        id: generateId(),
        templateTransactionId: tx.id,
        frequency: payload.recurrenceFrequency,
        nextOccurrence: addRecurrence(payload.date, payload.recurrenceFrequency),
        active: true,
        skippedDates: [],
      };
      await db.recurringRules.add(rule);
      await db.transactions.update(tx.id, { recurrenceId: rule.id });
      tx.recurrenceId = rule.id;
    }

    return tx;
  },
);

interface TransactionsState {
  items: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  items: [],
  loading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load';
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.error = (action.payload as string) ?? action.error.message ?? null;
      });
  },
});

export default transactionsSlice.reducer;
