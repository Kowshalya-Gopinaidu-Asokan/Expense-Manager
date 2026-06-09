import { Box, CircularProgress, Typography } from '@mui/material';
import { APP_NAME } from '@/shared/constants/categories';

export function LoadingScreen() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress />
      <Typography color="text.secondary">Loading {APP_NAME}…</Typography>
    </Box>
  );
}
