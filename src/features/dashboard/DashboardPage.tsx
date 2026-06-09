import { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { PageHeader } from '@/shared/components/PageHeader';
import { Grid } from '@/shared/components/Grid';
import { StatCard } from '@/shared/components/StatCard';
import { useAppSelector } from '@/hooks/redux';
import { useCurrency } from '@/hooks/useCurrency';
import { filterByYear, getBalance, groupExpensesByCategory, sumByType } from '@/utils/finance';
import { dayjs } from '@/utils/dates';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CHART_COLORS = ['#1976d2', '#9c27b0', '#2e7d32', '#ed6c02', '#d32f2f', '#0288d1', '#7b1fa2', '#c2185b'];

export default function DashboardPage() {
  const { format } = useCurrency();
  const transactions = useAppSelector((s) => s.transactions.items);
  const year = dayjs().year();

  const yearTx = useMemo(() => filterByYear(transactions, year), [transactions, year]);

  const totalIncome = sumByType(yearTx, 'income');
  const totalExpenses = sumByType(yearTx, 'expense');
  const balance = getBalance(yearTx);

  const categoryData = useMemo(() => {
    const grouped = groupExpensesByCategory(yearTx);
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [yearTx]);

  const recent = transactions.slice(0, 8);

  return (
    <Box>
      <PageHeader title="Dashboard" subtitle={`Financial overview for ${year}`} />

      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="Total Income" value={format(totalIncome)} icon={<TrendingUpIcon color="success" />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="Total Expenses" value={format(totalExpenses)} icon={<TrendingDownIcon color="error" />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="Balance" value={format(balance)} icon={<AccountBalanceIcon color="primary" />} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Expense by Category
              </Typography>
              {categoryData.length === 0 ? (
                <Typography color="text.secondary">No expenses recorded yet</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => format(Number(v))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              <List dense>
                {recent.length === 0 ? (
                  <Typography color="text.secondary">No transactions yet</Typography>
                ) : (
                  recent.map((t) => (
                    <ListItem key={t.id} disableGutters>
                      <ListItemText primary={t.description} secondary={`${t.date} · ${t.category}`} />
                      <Typography color={t.type === 'income' ? 'success.main' : 'error.main'}>
                        {t.type === 'income' ? '+' : '-'}
                        {format(t.amount)}
                      </Typography>
                    </ListItem>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
