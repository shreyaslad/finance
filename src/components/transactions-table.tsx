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

export default function TransactionsTable() {
  const { data, error, isLoading } = useSWR('/api/expense', (url) =>
    fetch(url).then((res) => res.json())
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
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
              <TableRow>
                <TableCell className="font-medium">
                  {/* Our screenshots are uploaded in PST, but then they get treated as UTC by the API,
                  but then converting back to PST here results in losing days */}
                  {new Date(val.date).toUTCString()}
                </TableCell>
                <TableCell>{val.vendor}</TableCell>
                <TableCell>{val.expenseType}</TableCell>
                <TableCell>${val.price.toFixed(2)}</TableCell>
                <TableCell>{val.location}</TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}
