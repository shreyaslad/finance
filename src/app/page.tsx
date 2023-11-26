import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import WeeklySpending from '@/components/weekly-spending';
import InfoCardContainer from '@/components/info-card-container';
import TableCard from '@/components/transactions-table/table-card';
import DatePicker from '@/components/date-picker';

import { PlusIcon } from 'lucide-react';

export default async function Home() {
  return (
    <div className="grid grid-cols-8 gap-8 m-8">
      <div className="flex flex-row justify-between col-span-full">
        <h2 className="text-3xl font-semibold tracking-tight transition-colors scroll-m-20 first:mt-0">
          Dashboard
        </h2>

        <div className="flex flex-row justify-between gap-2">
          <DatePicker />
          <Button variant={'outline'}>Export CSV</Button>
          <Link href={'/scan'}>
            <Button>
              <PlusIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <InfoCardContainer />

      <div className="col-span-3">
        <WeeklySpending />
      </div>
      <div className="col-span-5">
        <TableCard />
      </div>
    </div>
  );
}
