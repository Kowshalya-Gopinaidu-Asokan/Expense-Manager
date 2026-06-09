import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
} from '@mui/material';
import { Grid } from '@/shared/components/Grid';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { PageHeader } from '@/shared/components/PageHeader';
import { YearSelect } from '@/shared/components/YearSelect';
import { useAppSelector } from '@/hooks/redux';
import { useCurrency } from '@/hooks/useCurrency';
import { dayjs } from '@/utils/dates';
import { sumByType } from '@/utils/finance';
import type { Transaction } from '@/types';

type DayStatus = 'income' | 'expense' | 'mixed' | 'none';

function getDayStatus(transactions: Transaction[], dateStr: string): DayStatus {
  const dayTx = transactions.filter((t) => t.date === dateStr && !t.skipped);
  const hasIncome = dayTx.some((t) => t.type === 'income');
  const hasExpense = dayTx.some((t) => t.type === 'expense');
  if (hasIncome && hasExpense) return 'mixed';
  if (hasIncome) return 'income';
  if (hasExpense) return 'expense';
  return 'none';
}

const statusColors: Record<DayStatus, string> = {
  income: '#2e7d32',
  expense: '#d32f2f',
  mixed: '#ed6c02',
  none: 'transparent',
};

export default function CalendarPage() {
  const { format } = useCurrency();
  const transactions = useAppSelector((s) => s.transactions.items);
  const [year, setYear] = useState(dayjs().year());
  const [month, setMonth] = useState(dayjs().month());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const yearTx = useMemo(
    () => transactions.filter((t) => t.year === year && !t.skipped),
    [transactions, year],
  );

  const monthStart = dayjs().year(year).month(month).startOf('month');
  const daysInMonth = monthStart.daysInMonth();
  const startWeekday = monthStart.day();

  const days = useMemo(() => {
    const cells: (number | null)[] = Array(startWeekday).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [startWeekday, daysInMonth]);

  const selectedTx = selectedDate
    ? yearTx.filter((t) => t.date === selectedDate)
    : [];

  const dailyIncome = selectedDate
    ? sumByType(selectedTx, 'income')
    : 0;
  const dailyExpense = selectedDate
    ? sumByType(selectedTx, 'expense')
    : 0;

  return (
    <Box>
      <PageHeader
        title="Calendar View"
        subtitle="Daily income & expense summary"
        action={<YearSelect value={year} onChange={setYear} />}
      />

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <IconButton
              onClick={() => {
                const prev = monthStart.subtract(1, 'month');
                setMonth(prev.month());
                setYear(prev.year());
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h6">{monthStart.format('MMMM YYYY')}</Typography>
            <IconButton
              onClick={() => {
                const next = monthStart.add(1, 'month');
                setMonth(next.month());
                setYear(next.year());
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>

          <Grid container columns={7} spacing={0.5}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <Grid key={d} size={1}>
                <Typography align="center" variant="caption" fontWeight={600}>
                  {d}
                </Typography>
              </Grid>
            ))}
            {days.map((day, idx) => {
              if (day === null) return <Grid key={`e-${idx}`} size={1} />;
              const dateStr = monthStart.date(day).format('YYYY-MM-DD');
              const status = getDayStatus(yearTx, dateStr);
              return (
                <Grid key={dateStr} size={1}>
                  <Box
                    onClick={() => setSelectedDate(dateStr)}
                    sx={{
                      aspectRatio: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                      cursor: 'pointer',
                      bgcolor: status !== 'none' ? `${statusColors[status]}22` : 'action.hover',
                      border: 2,
                      borderColor: statusColors[status],
                      '&:hover': { opacity: 0.85 },
                    }}
                  >
                    <Typography variant="body2" fontWeight={selectedDate === dateStr ? 700 : 400}>
                      {day}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          <Box display="flex" gap={2} mt={2} flexWrap="wrap">
            <Typography variant="caption">🟢 Income</Typography>
            <Typography variant="caption">🔴 Expense</Typography>
            <Typography variant="caption">🟡 Mixed</Typography>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={!!selectedDate} onClose={() => setSelectedDate(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedDate && dayjs(selectedDate).format('MMMM D, YYYY')}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="success.main" gutterBottom>
            Income: {format(dailyIncome)}
          </Typography>
          <Typography variant="body2" color="error.main" gutterBottom>
            Expenses: {format(dailyExpense)}
          </Typography>
          <List dense>
            {selectedTx.map((t) => (
              <ListItem key={t.id}>
                <ListItemText primary={t.description} secondary={t.category} />
                <Typography color={t.type === 'income' ? 'success.main' : 'error.main'}>
                  {format(t.amount)}
                </Typography>
              </ListItem>
            ))}
            {selectedTx.length === 0 && (
              <Typography color="text.secondary">No transactions on this day</Typography>
            )}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
