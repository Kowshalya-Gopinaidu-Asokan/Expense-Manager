import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

interface YearSelectProps {
  value: number;
  onChange: (year: number) => void;
  years?: number[];
  label?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

export function YearSelect({
  value,
  onChange,
  years,
  label = 'Year',
  size = 'small',
  fullWidth,
}: YearSelectProps) {
  const current = new Date().getFullYear();
  const options =
    years ?? Array.from({ length: 10 }, (_, i) => current - 5 + i).filter((y) => y >= 2000);

  return (
    <FormControl size={size} fullWidth={fullWidth} sx={{ minWidth: 120 }}>
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {options.map((y) => (
          <MenuItem key={y} value={y}>
            {y}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
