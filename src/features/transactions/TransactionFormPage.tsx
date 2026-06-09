import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
} from '@mui/material';
import { Grid } from '@/shared/components/Grid';
import { PageHeader } from '@/shared/components/PageHeader';
import { YearSelect } from '@/shared/components/YearSelect';
import { useAppDispatch } from '@/hooks/redux';
import { addTransaction } from '@/store/slices/transactionsSlice';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
} from '@/shared/constants/categories';
import type {
  Category,
  ExpenseCategory,
  IncomeCategory,
  PaymentMethod,
  RecurrenceFrequency,
  TransactionType,
} from '@/types';
import { dayjs } from '@/utils/dates';

export default function TransactionFormPage() {
  const dispatch = useAppDispatch();
  const [type, setType] = useState<TransactionType>('expense');
  const [year, setYear] = useState(dayjs().year());
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [notes, setNotes] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [frequency, setFrequency] = useState<RecurrenceFrequency>('monthly');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }

    const dateStr = date;
    const result = await dispatch(
      addTransaction({
        type,
        year,
        date: dateStr,
        amount: parsedAmount,
        category: category as ExpenseCategory & IncomeCategory,
        description: description.trim(),
        paymentMethod,
        notes: notes.trim() || undefined,
        recurring,
        recurrenceFrequency: recurring ? frequency : undefined,
      }),
    );

    if (addTransaction.rejected.match(result)) {
      setError((result.payload as string) ?? 'Failed to save transaction.');
      return;
    }

    setSuccess(true);
    setAmount('');
    setDescription('');
    setNotes('');
    setRecurring(false);
  };

  return (
      <Box>
        <PageHeader title="Add Transaction" subtitle="Record income or expense" />
        <Card sx={{ maxWidth: 720, mx: 'auto' }}>
          <CardContent>
            <form onSubmit={(e) => void handleSubmit(e)}>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <ToggleButtonGroup
                    exclusive
                    fullWidth
                    value={type}
                    onChange={(_, v) => {
                      if (v) {
                        setType(v as TransactionType);
                        setCategory(v === 'expense' ? 'Food' : 'Salary');
                      }
                    }}
                  >
                    <ToggleButton value="expense" color="error">
                      Expense
                    </ToggleButton>
                    <ToggleButton value="income" color="success">
                      Income
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <YearSelect value={year} onChange={setYear} fullWidth size="medium" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Date"
                    type="date"
                    fullWidth
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Amount"
                    type="number"
                    fullWidth
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputProps={{ min: 0.01, step: 0.01 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      label="Category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                    >
                      {categories.map((c) => (
                        <MenuItem key={c} value={c}>
                          {c}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={12}>
                  <TextField
                    label="Description"
                    fullWidth
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      label="Payment Method"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    >
                      {PAYMENT_METHODS.map((m) => (
                        <MenuItem key={m} value={m}>
                          {m}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Notes"
                    fullWidth
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Grid>
                <Grid size={12}>
                  <FormControlLabel
                    control={<Switch checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />}
                    label="Recurring Transaction"
                  />
                </Grid>
                {recurring && (
                  <Grid size={12}>
                    <FormControl fullWidth>
                      <InputLabel>Frequency</InputLabel>
                      <Select
                        label="Frequency"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value as RecurrenceFrequency)}
                      >
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                        <MenuItem value="yearly">Yearly</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {error && (
                  <Grid size={12}>
                    <Alert severity="error">{error}</Alert>
                  </Grid>
                )}
                {success && (
                  <Grid size={12}>
                    <Alert severity="success">Transaction saved successfully!</Alert>
                  </Grid>
                )}
                <Grid size={12}>
                  <Button type="submit" variant="contained" size="large" fullWidth>
                    Save Transaction
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
  );
}
