import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import type { Transaction } from '@/types';

export function exportTransactionsCsv(transactions: Transaction[], _currency: string): void {
  const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Payment Method'];
  const rows = transactions.map((t) => [
    t.date,
    t.type,
    t.category,
    t.description,
    t.amount,
    t.paymentMethod,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `transactions-${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportTransactionsExcel(transactions: Transaction[]): void {
  const data = transactions.map((t) => ({
    Date: t.date,
    Type: t.type,
    Category: t.category,
    Description: t.description,
    Amount: t.amount,
    'Payment Method': t.paymentMethod,
    Notes: t.notes ?? '',
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
  XLSX.writeFile(wb, `transactions-${new Date().toISOString().slice(0, 10)}.xlsx`);
}
