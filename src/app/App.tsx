import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { AppThemeProvider } from '@/app/theme/ThemeProvider';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { router } from '@/routes';
import { useInitializeApp } from '@/hooks/useInitializeApp';

function AppBootstrap() {
  useInitializeApp();
  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppThemeProvider>
          <AppBootstrap />
        </AppThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}
