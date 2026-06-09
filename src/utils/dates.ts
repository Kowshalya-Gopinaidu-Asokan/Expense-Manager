import dayjs from 'dayjs';

export { dayjs };

export function addRecurrence(date: string, frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'): string {
  const d = dayjs(date);
  switch (frequency) {
    case 'daily':
      return d.add(1, 'day').format('YYYY-MM-DD');
    case 'weekly':
      return d.add(1, 'week').format('YYYY-MM-DD');
    case 'monthly':
      return d.add(1, 'month').format('YYYY-MM-DD');
    case 'yearly':
      return d.add(1, 'year').format('YYYY-MM-DD');
  }
}
