'use client';

import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import DataTable from './data-table';
import useSWR from 'swr';
import { transactionsColumns } from './columns';
import { ExpenseGETResponse } from '@/lib/apitypes';

export default function TableCard() {
  const { data, error, isLoading } = useSWR('/api/expense', (url) =>
    fetch(url).then((res) => res.json())
  );

  return (
    <Card className="border-muted">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-4xl font-bold">All Transactions</CardTitle>
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
