import Image from 'next/image';
import InfoCard from '@/components/info-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Banknote,
  CalendarDays,
  CreditCard,
  DollarSign,
  Landmark,
  PlusIcon,
} from 'lucide-react';
import DailySpending from '@/components/daily-spending';
import AddButton from '@/components/add-button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="grid grid-cols-8 gap-8 m-8">
      <div className="flex flex-row justify-between col-span-full">
        <h2 className="text-3xl font-semibold tracking-tight transition-colors scroll-m-20 first:mt-0">
          Dashboard
        </h2>

        <div className="flex flex-row justify-between gap-2">
          <Button variant={'outline'} className="text-sm">
            <CalendarDays className="w-8 h-8 pr-3 stroke-1" /> Jan 20, 2023 -
            Feb 09, 2023
          </Button>
          <Button variant={'outline'}>Export CSV</Button>
          <AddButton />
        </div>
      </div>

      <InfoCard title="Total Spending" value="$123.20" Icon={Banknote} />
      <InfoCard title="Transactions" value="30" Icon={CreditCard} />
      <InfoCard title="Net Worth" value="$4321.92" Icon={DollarSign} />
      <InfoCard title="Accounts" value="5" Icon={Landmark} />

      <DailySpending />
    </div>
  );
}
