import { useMemo, useState } from 'react';
import { Box, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { PageHeader } from '@/shared/components/PageHeader';
import { Grid } from '@/shared/components/Grid';
import { YearSelect } from '@/shared/components/YearSelect';
import { useAppSelector } from '@/hooks/redux';
import { useCurrency } from '@/hooks/useCurrency';
import { filterByMonth, filterByYear, groupExpensesByCategory } from '@/utils/finance';
import { dayjs } from '@/utils/dates';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#1976d2', '#9c27b0', '#2e7d32', '#ed6c02', '#d32f2f', '#0288d1'];

export default function ReportsPage() {
  const { format } = useCurrency();
  const transactions = useAppSelector((s) => s.transactions.items);
  const [year, setYear] = useState(dayjs().year());
  const [month, setMonth] = useState<number | 'all'>('all');

  const reportData = useMemo(() => {
    const yearData = filterByYear(transactions, year).filter((t) => t.type === 'expense' && !t.skipped);
    if (month === 'all') return yearData;
    return filterByMonth(yearData, year, month).filter((t) => t.type === 'expense');
  }, [transactions, year, month]);

  const categoryData = useMemo(() => {
    const grouped = groupExpensesByCategory(reportData);
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [reportData]);

  const total = categoryData.reduce((s, c) => s + c.value, 0);

  return (
    <Box>
      <PageHeader title="Reports" subtitle="Expense breakdown by category" />

      <Card sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <YearSelect value={year} onChange={setYear} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Month</InputLabel>
              <Select label="Month" value={month} onChange={(e) => setMonth(e.target.value as number | 'all')}>
                <MenuItem value="all">All months</MenuItem>
                {Array.from({ length: 12 }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {dayjs().month(i).format('MMMM')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Category Breakdown
          </Typography>
          {categoryData.length === 0 ? (
            <Typography color="text.secondary">No expense data for this period</Typography>
          ) : (
            <>
              <Typography color="text.secondary" mb={2}>
                Total expenses: {format(total)} · {reportData.length} transactions
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={110} label>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => format(Number(v))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
