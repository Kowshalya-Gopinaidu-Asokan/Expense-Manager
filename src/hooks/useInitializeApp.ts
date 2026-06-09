import { useEffect } from 'react';
import { useAppDispatch } from './redux';
import { loadTransactions } from '@/store/slices/transactionsSlice';

export function useInitializeApp() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(loadTransactions());
  }, [dispatch]);
}
