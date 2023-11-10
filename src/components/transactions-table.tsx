'use client';

import useSWR from 'swr';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Skeleton } from './ui/skeleton';
import { ExpenseResponse, FormattedExpense } from '@/lib/apitypes';
import moment from 'moment-timezone';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CreditCard } from 'lucide-react';

export default function TransactionsTable() {
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
        <Table>
          <TableHeader>
            <TableRow className="border-b-muted">
              <TableHead>Date</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? null
              : (data as ExpenseResponse).transactions.map((val, _) => (
                  <TableRow className="border-b-muted">
                    <TableCell className="font-medium">
                      {/* Our screenshots are uploaded in PST, but then they get treated as UTC by the API,
                  but then converting back to PST here results in losing days */}
                      {moment(val.date).utc(false).format('MM/DD/YYYY')}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {val.vendor}
                    </TableCell>
                    <TableCell>{val.expenseType}</TableCell>
                    <TableCell>${val.price.toFixed(2)}</TableCell>
                    <TableCell>{val.location}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
