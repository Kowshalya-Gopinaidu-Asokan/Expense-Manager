import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { PageHeader } from '@/shared/components/PageHeader';
import { Grid } from '@/shared/components/Grid';
import { YearSelect } from '@/shared/components/YearSelect';
import { useAppSelector } from '@/hooks/redux';
import { useCurrency } from '@/hooks/useCurrency';
import { EXPENSE_CATEGORIES } from '@/shared/constants/categories';
import {
  exportTransactionsCsv,
  exportTransactionsExcel,
} from '@/services/export/reports';
import { dayjs } from '@/utils/dates';
import type { Transaction } from '@/types';

type SortKey = keyof Pick<Transaction, 'date' | 'amount' | 'category' | 'description'>;

export default function ExplorerPage() {
  const { format, currency } = useCurrency();
  const transactions = useAppSelector((s) => s.transactions.items);
  const [year, setYear] = useState(dayjs().year());
  const [month, setMonth] = useState<number | 'all'>('all');
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filtered = useMemo(() => {
    let result = transactions.filter((t) => t.year === year && !t.skipped);
    if (month !== 'all') {
      result = result.filter((t) => dayjs(t.date).month() + 1 === month);
    }
    if (category !== 'all') result = result.filter((t) => t.category === category);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.notes?.toLowerCase().includes(q) ?? false),
      );
    }
    if (minAmount) result = result.filter((t) => t.amount >= parseFloat(minAmount));
    if (maxAmount) result = result.filter((t) => t.amount <= parseFloat(maxAmount));
    if (dateFrom) result = result.filter((t) => t.date >= dateFrom);
    if (dateTo) result = result.filter((t) => t.date <= dateTo);
    return [...result].sort((a, b) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [transactions, year, month, category, search, minAmount, maxAmount, dateFrom, dateTo, sortBy, sortDir]);

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortBy(key);
      setSortDir('desc');
    }
  };

  return (
    <Box>
      <PageHeader
        title="Expense Explorer"
        subtitle="Search, filter, and export transactions"
        action={
          <Box display="flex" gap={1}>
            <Button startIcon={<DownloadIcon />} onClick={() => exportTransactionsCsv(filtered, currency)}>
              CSV
            </Button>
            <Button variant="outlined" onClick={() => exportTransactionsExcel(filtered)}>
              Excel
            </Button>
          </Box>
        }
      />

      <Card sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <YearSelect value={year} onChange={setYear} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Month</InputLabel>
              <Select label="Month" value={month} onChange={(e) => setMonth(e.target.value as number | 'all')}>
                <MenuItem value="all">All</MenuItem>
                {Array.from({ length: 12 }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {dayjs().month(i).format('MMMM')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                {EXPENSE_CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField size="small" fullWidth label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
            <TextField size="small" fullWidth label="Min" type="number" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
            <TextField size="small" fullWidth label="Max" type="number" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField size="small" fullWidth label="From" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField size="small" fullWidth label="To" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} InputLabelProps={{ shrink: true }} />
          </Grid>
        </Grid>
      </Card>

      <TableContainer component={Card}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {(['date', 'description', 'category', 'amount'] as const).map((col) => (
                <TableCell key={col}>
                  <TableSortLabel
                    active={sortBy === col}
                    direction={sortBy === col ? sortDir : 'asc'}
                    onClick={() => handleSort(col === 'description' ? 'description' : col)}
                  >
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map((t) => (
              <TableRow key={t.id} hover>
                <TableCell>{t.date}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell>{format(t.amount)}</TableCell>
                <TableCell>{t.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </Box>
  );
}
