'use client';

import InfoCard from './info-card';
import { Banknote, CreditCard, DollarSign, Landmark } from 'lucide-react';

import useSWR from 'swr';

export default function InfoCardContainer() {
  const { data, error, isLoading } = useSWR('/api/expense', (url) =>
    fetch(url).then((res) => res.json())
  );

  return (
    <>
      <InfoCard
        title="Total Spending"
        value={isLoading ? 'Loading...' : '$' + data.spending}
        isLoading={isLoading}
        Icon={Banknote}
      />
      <InfoCard
        title="Transactions"
        value="30"
        isLoading={true}
        Icon={CreditCard}
      />
      <InfoCard
        title="Net Worth"
        value="$4321.92"
        isLoading={true}
        Icon={DollarSign}
      />
      <InfoCard title="Accounts" value="5" isLoading={true} Icon={Landmark} />
    </>
  );
}
