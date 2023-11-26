'use client';

import { CreditCard } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import DataTable from './data-table';
import useSWR from 'swr';
import { transactionsColumns } from './columns';
import { ExpenseGETResponse } from '@/lib/api';

export default function TableCard() {
  const { data, error, isLoading } = useSWR('/api/expense', (url) =>
    fetch(url).then((res) => res.json())
  );

  return (
    <Card className="border-muted">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-3xl font-bold">All Transactions</CardTitle>
          <CardDescription>
            See your recent transactions for this time period.
          </CardDescription>
        </div>
        <CreditCard className="text-foreground" />
      </CardHeader>

      <CardContent>
        {isLoading ? null : (
          <DataTable
            columns={transactionsColumns}
            data={(data as ExpenseGETResponse).transactions}
          ></DataTable>
        )}
      </CardContent>
    </Card>
  );
}
