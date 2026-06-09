import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/shared/layout/AppLayout';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const TransactionFormPage = lazy(() => import('@/features/transactions/TransactionFormPage'));
const CalendarPage = lazy(() => import('@/features/transactions/CalendarPage'));
const ExplorerPage = lazy(() => import('@/features/transactions/ExplorerPage'));
const CalculatorPage = lazy(() => import('@/features/calculator/CalculatorPage'));
const ReportsPage = lazy(() => import('@/features/reports/ReportsPage'));

function Lazy({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Lazy><DashboardPage /></Lazy> },
      { path: 'transactions/new', element: <Lazy><TransactionFormPage /></Lazy> },
      { path: 'calendar', element: <Lazy><CalendarPage /></Lazy> },
      { path: 'explorer', element: <Lazy><ExplorerPage /></Lazy> },
      { path: 'calculator', element: <Lazy><CalculatorPage /></Lazy> },
      { path: 'reports', element: <Lazy><ReportsPage /></Lazy> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
