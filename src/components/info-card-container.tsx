'use client';

import { ExpenseResponse } from '@/lib/apitypes';
import InfoCard from './info-card';
import { Skeleton } from './ui/skeleton';
import { Banknote, CreditCard, DollarSign, Hash, Landmark } from 'lucide-react';

import useSWR from 'swr';

export default function InfoCardContainer() {
  const { data, error, isLoading } = useSWR('/api/expense', (url) =>
    fetch(url).then((res) => res.json())
  );

  return (
    <>
      <InfoCard
        title="Total Spending"
        value={
          isLoading ? (
            <Skeleton className="w-full h-4" />
          ) : (
            '$' + (data as ExpenseResponse).spending
          )
        }
        Icon={Banknote}
      />
      <InfoCard
        title="Transactions"
        value={
          isLoading ? (
            <Skeleton className="w-full h-4" />
          ) : (
            (data as ExpenseResponse).transactions.length
          )
        }
        Icon={Hash}
      />
      <InfoCard title="Net Worth" value="$4321.92" Icon={DollarSign} />
      <InfoCard title="Accounts" value="5" Icon={Landmark} />
    </>
  );
}
