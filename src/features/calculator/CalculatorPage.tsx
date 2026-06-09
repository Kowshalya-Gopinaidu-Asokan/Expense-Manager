import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Tab,
  Tabs,
  TextField,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import { PageHeader } from '@/shared/components/PageHeader';
import { Grid } from '@/shared/components/Grid';
import { useCurrency } from '@/hooks/useCurrency';

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  if (value !== index) return null;
  return <Box pt={2}>{children}</Box>;
}

export default function CalculatorPage() {
  const { format } = useCurrency();
  const [tab, setTab] = useState(0);

  const [splitTotal, setSplitTotal] = useState('');
  const [splitPeople, setSplitPeople] = useState('2');
  const [splitTip, setSplitTip] = useState('0');

  const [saveGoal, setSaveGoal] = useState('');
  const [saveMonthly, setSaveMonthly] = useState('');
  const [saveCurrent, setSaveCurrent] = useState('0');

  const [budgetIncome, setBudgetIncome] = useState('');
  const [budgetNeeds, setBudgetNeeds] = useState('50');
  const [budgetWants, setBudgetWants] = useState('30');
  const [budgetSavings, setBudgetSavings] = useState('20');

  const total = parseFloat(splitTotal) || 0;
  const people = parseInt(splitPeople, 10) || 1;
  const tip = parseFloat(splitTip) || 0;
  const perPerson = people > 0 ? (total + tip) / people : 0;

  const goal = parseFloat(saveGoal) || 0;
  const monthly = parseFloat(saveMonthly) || 0;
  const current = parseFloat(saveCurrent) || 0;
  const monthsToGoal = monthly > 0 ? Math.ceil((goal - current) / monthly) : 0;

  const income = parseFloat(budgetIncome) || 0;

  return (
    <Box>
      <PageHeader title="Calculators" subtitle="Simple expense and budget tools" />
      <Card>
        <Tabs value={tab} onChange={(_, v: number) => setTab(v)}>
          <Tab label="Expense Split" />
          <Tab label="Savings" />
          <Tab label="Budget Planner" />
        </Tabs>
        <CardContent>
          <TabPanel value={tab} index={0}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="Total Bill" type="number" value={splitTotal} onChange={(e) => setSplitTotal(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="People" type="number" value={splitPeople} onChange={(e) => setSplitPeople(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="Tip" type="number" value={splitTip} onChange={(e) => setSplitTip(e.target.value)} />
              </Grid>
            </Grid>
            <Typography mt={2} variant="h6">
              Per person: {format(perPerson)}
            </Typography>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="Goal Amount" type="number" value={saveGoal} onChange={(e) => setSaveGoal(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="Current Savings" type="number" value={saveCurrent} onChange={(e) => setSaveCurrent(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="Monthly Savings" type="number" value={saveMonthly} onChange={(e) => setSaveMonthly(e.target.value)} />
              </Grid>
            </Grid>
            <Typography mt={2}>Months to reach goal: {monthsToGoal || '—'}</Typography>
          </TabPanel>

          <TabPanel value={tab} index={2}>
            <TextField fullWidth label="Monthly Income" type="number" value={budgetIncome} onChange={(e) => setBudgetIncome(e.target.value)} sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid size={4}>
                <TextField fullWidth label="Needs %" value={budgetNeeds} onChange={(e) => setBudgetNeeds(e.target.value)} />
              </Grid>
              <Grid size={4}>
                <TextField fullWidth label="Wants %" value={budgetWants} onChange={(e) => setBudgetWants(e.target.value)} />
              </Grid>
              <Grid size={4}>
                <TextField fullWidth label="Savings %" value={budgetSavings} onChange={(e) => setBudgetSavings(e.target.value)} />
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography>Needs: {format(income * (parseFloat(budgetNeeds) / 100))}</Typography>
            <Typography>Wants: {format(income * (parseFloat(budgetWants) / 100))}</Typography>
            <Typography>Savings: {format(income * (parseFloat(budgetSavings) / 100))}</Typography>
            <Button sx={{ mt: 2 }} onClick={() => { setBudgetNeeds('50'); setBudgetWants('30'); setBudgetSavings('20'); }}>
              Reset to 50/30/20
            </Button>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
}
