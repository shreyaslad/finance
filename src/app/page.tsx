import TitleCard from '@/components/title-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Banknote,
  CreditCard,
  DollarSign,
  Landmark,
  PlusIcon,
} from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="grid grid-cols-8 gap-8 m-8">
      <div className="flex flex-row justify-between col-span-full">
        <h2 className="text-3xl font-semibold tracking-tight transition-colors scroll-m-20 first:mt-0">
          Dashboard
        </h2>

        <div className="flex flex-row justify-between gap-2">
          <Button variant={'outline'}>Export CSV</Button>
          <Button>
            <PlusIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <TitleCard title="Net Worth" value="$4321.92" Icon={DollarSign} />
      <TitleCard title="Total Spending" value="$123.20" Icon={Banknote} />
      <TitleCard title="Accounts" value="5" Icon={Landmark} />
      <TitleCard title="Transactions" value="30" Icon={CreditCard} />
    </div>
  );
}
